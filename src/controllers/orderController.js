// orders controller

import { HttpStatus, Response } from "../helpers/Response.js";
import { orderStatus } from "../helpers/constants.js";
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
    const totalRecords = await orderModel.countDocuments({
      last_update_time: { $gte: startTime, $lt: endTime },
    });

    const totalPages = Math.ceil(totalRecords / pageSize);

    const orders = await orderModel
      .find({
        last_update_time: { $gte: startTime, $lt: endTime },
      })
      .skip(skip)
      .limit(pageSize)
      .lean();
    const results = {
      totalPages,
      page,
      pageSize,
      orders,
    };
    return res
      .status(HttpStatus.OK.code)
      .json(
        new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          HttpStatus.OK.message,
          results
        )
      );
  } catch (error) {
    console.error("Error in getOrders:", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .json(
        new Response(
          HttpStatus.INTERNAL_SERVER_ERROR.code,
          HttpStatus.INTERNAL_SERVER_ERROR.status,
          HttpStatus.INTERNAL_SERVER_ERROR.message,
          error
        )
      );
  }
};

export const getOrderCountsAndSalesByItems = async (req, res) => {
  try {
    const startTime = new Date(req.query.startTime);
    const endTime = new Date(req.query.endTime);

    if (isNaN(startTime) || isNaN(endTime)) {
      return res.status(HttpStatus.BAD_REQUEST.code).json({
        message: "Invalid date format for startTime or endTime.",
      });
    }

    const dateDifference = (startTime, endTime) => {
      const diffMilliseconds = Math.abs(
        new Date(endTime) - new Date(startTime)
      );
      const oneDayMilliseconds = 24 * 60 * 60 * 1000;
      const oneMonthMilliseconds = 30 * oneDayMilliseconds;
      const oneYearMilliseconds = 365 * oneDayMilliseconds;

      if (diffMilliseconds > oneYearMilliseconds) {
        return "yearly";
      } else if (diffMilliseconds > oneMonthMilliseconds) {
        return "monthly";
      } else {
        return "daily";
      }
    };

    const timeRange = dateDifference(startTime, endTime);

    let pipeline;

    switch (timeRange) {
      case "yearly":
        pipeline = [
          {
            $match: {
              last_update_time: {
                $gte: new Date(startTime),
                $lte: new Date(endTime),
              },
            },
          },
          {
            $group: {
              _id: { $year: "$last_update_time" },
              totalOrders: { $sum: 1 },
              totalSales: { $sum: "$price" },
            },
          },
          {
            $sort: { _id: 1 },
          },
        ];
        break;
      case "monthly":
        pipeline = [
          {
            $match: {
              last_update_time: {
                $gte: new Date(startTime),
                $lte: new Date(endTime),
              },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$last_update_time" },
                month: { $month: "$last_update_time" },
              },
              totalOrders: { $sum: 1 },
              totalSales: { $sum: "$price" },
            },
          },
          {
            $sort: { "_id.year": 1, "_id.month": 1 },
          },
        ];
        break;
      case "daily":
      default:
        pipeline = [
          {
            $match: {
              last_update_time: {
                $gte: new Date(startTime),
                $lte: new Date(endTime),
              },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$last_update_time" },
                month: { $month: "$last_update_time" },
                day: { $dayOfMonth: "$last_update_time" },
              },
              totalOrders: { $sum: 1 },
              totalSales: { $sum: "$price" },
            },
          },
          {
            $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
          },
        ];
        break;
    }

    const result = await orderModel.aggregate(pipeline);

    // Result will be grouped by year, month, and day for the same month

    return res
      .status(HttpStatus.OK.code)
      .json(
        new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          HttpStatus.OK.message,
          result
        )
      );
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .json(
        new Response(
          HttpStatus.INTERNAL_SERVER_ERROR.code,
          HttpStatus.INTERNAL_SERVER_ERROR.status,
          HttpStatus.INTERNAL_SERVER_ERROR.message,
          error
        )
      );
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

    await orderModel.createIndexes({ last_update_time: 1 });
    await bakeryItemModel.createIndexes({});

    const result = await orderModel
      .aggregate([
        {
          $match: {
            last_update_time: { $gte: startTime, $lt: endTime },
          },
        },
        {
          $group: {
            _id: "$branch_id",
            totalOrders: { $sum: 1 },
            totalAmount: { $sum: "$price" }, // Assuming there's a "price" field in your order documents
          },
        },
        {
          $sort: { totalOrders: -1 },
        },
        {
          $limit: 3,
        },
        {
          $lookup: {
            from: "branches",
            localField: "_id",
            foreignField: "_id",
            as: "branchDetails",
          },
        },
        {
          $unwind: "$branchDetails",
        },
        {
          $project: {
            _id: 0,
            branchDetails: 1,
            totalOrders: 1,
            totalAmount: 1,
          },
        },
      ])
      .exec();

    return res
      .status(HttpStatus.OK.code)
      .json(
        new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          HttpStatus.OK.message,
          result
        )
      );
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .json(
        new Response(
          HttpStatus.INTERNAL_SERVER_ERROR.code,
          HttpStatus.INTERNAL_SERVER_ERROR.status,
          HttpStatus.INTERNAL_SERVER_ERROR.message,
          error
        )
      );
  }
};

export const getAllItemsOrderCount = async (req, res) => {
  try {
    console.log("req.query", req.query);
    const startTime = new Date(req.query.startTime);
    const endTime = new Date(req.query.endTime);
    const orderStatusFilter = JSON.parse(req.query.orderStatus) || orderStatus;

    if (isNaN(startTime) || isNaN(endTime)) {
      return res.status(HttpStatus.BAD_REQUEST.code).json({
        message: "Invalid date format for startTime or endTime.",
      });
    }

    await orderModel.createIndexes({ last_update_time: 1 });

    const pipeline = [
      {
        $match: {
          last_update_time: {
            $gte: startTime,
            $lte: endTime,
          },
          order_status: { $in: orderStatusFilter },
        },
      },
      {
        $group: {
          _id: { $toLower: "$item_name" }, // Convert to lowercase for case-insensitive grouping
          orderCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          itemName: "$_id",
          orderCount: 1,
        },
      },
    ];

    const result = await orderModel.aggregate(pipeline).exec();

    return res
      .status(HttpStatus.OK.code)
      .json(
        new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          HttpStatus.OK.message,
          result
        )
      );
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .json(
        new Response(
          HttpStatus.INTERNAL_SERVER_ERROR.code,
          HttpStatus.INTERNAL_SERVER_ERROR.status,
          HttpStatus.INTERNAL_SERVER_ERROR.message,
          error?.message
        )
      );
  }
};
