// orders controller

import { HttpStatus, Response } from "../helpers/Response.js";
import { bakeryItems } from "../helpers/constants.js";
import orderModel from "../models/orderModel.js";

export const getOrders = async (req, res) => {
  try {
    if (!req.query.startTime || !req.query.endTime) {
      return res
        .status(HttpStatus.BAD_REQUEST.code)
        .json(
          new Response(
            HttpStatus.BAD_REQUEST.code,
            HttpStatus.BAD_REQUEST.status,
            HttpStatus.BAD_REQUEST.message
          )
        );
    }

    const startTime = req.query.startTime;
    const endTime = req.query.endTime;

    // Create an index on the last_update_time field
    await orderModel.createIndexes({ last_update_time: 1 });

    // Retrieve only necessary fields
    const orders = await orderModel.find({
      last_update_time: { $gte: startTime, $lt: endTime },
    });
    //  .select("field1 field2 field3"); // Add the fields you need

    // Log the number of orders
    console.log("Number of orders:", orders.length);

    return res
      .status(HttpStatus.OK.code)
      .json(
        new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          HttpStatus.OK.message,
          orders
        )
      );
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getOrderCountsAndSalesByItems = async (req, res) => {
  try {
    const bakeryItems = [
      { name: "Cake", price: 500 },
      { name: "Cookies", price: 50 },
      { name: "Muffins", price: 100 },
    ]; // Create indexes on the item field to improve performance

    await orderModel.createIndexes({ item: 1 }); // Aggregate the order data to get the order count and sales amount by item

    // bakeryitems

    const result = await orderModel
      .aggregate([
        {
          $match: { item_type: { $in: bakeryItems.map((item) => item.name) } },
        },
        {
          $group: {
            _id: "$item_type",
            orderCount: { $sum: 1 },
            salesAmount: {
              $sum: {
                $cond: [
                  {
                    $in: ["$item_type", bakeryItems.map((item) => item.name)],
                  },
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: bakeryItems,
                          as: "item",
                          cond: { $eq: ["$$item.name", "$item_type"] },
                        },
                      },
                      {},
                    ].price,
                  },
                  0,
                ],
              },
            },
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

    console.log("rrrrrrrrrrr", result);

    const mergedResult = bakeryItems.map((item) => {
      const matchingResult = result.find(
        (resultItem) => resultItem.name === item.name
      );
      return matchingResult ?? { ...item, orderCount: 0, salesAmount: 0 };
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
