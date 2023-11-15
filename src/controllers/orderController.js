// orders controller

import { HttpStatus, Response } from "../helpers/Response.js";
import { bakeryItems, bakeryItemsWithPrices } from "../helpers/constants.js";
import bakeryItemModel from "../models/bakeryItemModel.js";
import orderModel from "../models/orderModel.js";

export const getOrders = async (req, res) => {
  try {
    const startTime = new Date(req.query.startTime);
    const endTime = new Date(req.query.endTime);

    if (isNaN(startTime) || isNaN(endTime)) {
      return res.status(HttpStatus.BAD_REQUEST.code).json({
        message: "Invalid date format for startTime or endTime.",
      });
    }

    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 items per page

    // Calculate the number of documents to skip based on the page and pageSize
    const skip = (page - 1) * pageSize;

    // Create an index on the last_update_time field
    await orderModel.createIndexes({ last_update_time: 1 });

    const orders = await orderModel
      .find({
        last_update_time: { $gte: startTime, $lt: endTime },
      })
      .skip(skip)
      .limit(pageSize)
      .lean();

    // Log the number of orders
    console.log("Number of orders:", orders.length);

    return res.status(HttpStatus.OK.code).json({
      message: HttpStatus.OK.message,
      orders,
    });
  } catch (error) {
    console.error("Error in getOrders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrderCountsAndSalesByItems = async (req, res) => {
  try {
    const bakeryItems = [
      { name: "Cake", price: 500 },
      { name: "Cookies", price: 50 },
      { name: "Muffins", price: 100 },
    ];

    const { startTime, endTime } = req.query;
    await orderModel.createIndexes({ item: 1 });
    const result = await orderModel
      .aggregate([
        {
          $match: {
            item_type: { $in: bakeryItems.map((item) => item.name) },
            last_update_time: {
              $gte: new Date(startTime),
              $lte: new Date(endTime),
            },
          },
        },
        {
          $group: {
            _id: "$item_type",
            orderCount: { $sum: 1 },
            salesAmount: { $sum: "$item_type.price" },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            orderCount: 1,
            salesAmount: 1,
          },
        },
      ])
      .exec();

    const mergedResult = bakeryItems.map((item) => {
      const matchingResult = result.find(
        (resultItem) => resultItem.name === item.name
      );

      return matchingResult
        ? {
            ...matchingResult,
            salesAmount: item.price * matchingResult.orderCount,
          }
        : { ...item, orderCount: 0, salesAmount: 0 };
    });

    return res
      .status(HttpStatus.OK.code)
      .json(
        new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          HttpStatus.OK.message,
          mergedResult
        )
      );
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTopBranches = async (req, res) => {
  try {
    const startTime = new Date(req.query.startTime);
    const endTime = new Date(req.query.endTime);

    if (isNaN(startTime) || isNaN(endTime)) {
      return res.status(HttpStatus.BAD_REQUEST.code).json({
        message: "Invalid date format for startTime or endTime.",
      });
    }

    // Create an index on the last_update_time field in both collections
    await orderModel.createIndexes({ last_update_time: 1 });
    await bakeryItemModel.createIndexes({});

    const result = await orderModel
      .aggregate([
        {
          $match: {
            last_update_time: { $gte: startTime, $lt: endTime },
            //      item_type: { $in: req.query.item_type || [] },
          },
        },
        {
          $group: {
            _id: "$branch_id",
            totalOrders: { $sum: 1 },
            totalPrice: { $sum: { $multiply: ["$orderCount", 1] } }, // Assuming 1 as the default price if not in bakeryitems
          },
        },
        {
          $lookup: {
            from: "bakeryitems",
            localField: "name",
            foreignField: "item_type",
            as: "bakeryItem",
          },
        },
        {
          $unwind: "$bakeryItem",
        },
        {
          $group: {
            _id: "$_id",
            totalOrders: { $first: "$totalOrders" },
            totalSalesAmount: {
              $sum: { $multiply: ["$totalPrice", "$bakeryItem.price"] },
            },
            branchDetails: { $first: "$branch_id" }, // Assuming branch_id in orderModel
          },
        },
        {
          $lookup: {
            from: "branch", // Assuming the branch collection name is "branch"
            localField: "branchDetails",
            foreignField: "_id",
            as: "branchDetails",
          },
        },
        {
          $unwind: "$branchDetails",
        },
        {
          $sort: { totalOrders: -1, totalSalesAmount: -1 },
        },
        {
          $limit: 3,
        },
        {
          $project: {
            _id: 0,
            branchDetails: 1,
            totalOrders: 1,
            totalSalesAmount: 1,
          },
        },
      ])
      .exec();

    return res.status(HttpStatus.OK.code).json({
      message: HttpStatus.OK.message,
      topBranches: result,
    });
  } catch (error) {
    console.error("Error in getTopBranches:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
