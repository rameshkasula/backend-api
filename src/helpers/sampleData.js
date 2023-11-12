// generating sample data

import { faker } from "@faker-js/faker";
import {
  randomBakeryItem,
  randomBranchId,
  randomOrderStatus,
} from "./constants.js";

const generateLastUpdateTime = () => {
  const startDate = faker.date.past({ days: 100 });
  const endDate = faker.date.recent({ days: 100 });
  const lastUpdateTime = faker.date.recent({ days: 100 });
  return lastUpdateTime;
};
const generateOrder = () => {
  const order = {
    order_id: faker.number.int({ min: 1, max: 100000 }),
    item_type: randomBakeryItem(),
    order_state: randomOrderStatus(),
    last_update_time: generateLastUpdateTime(),
    branch_id: faker.number.int({ min: 1, max: 1000 }),
    customer_id: faker.number.int({ min: 1, max: 5000 }),
  };

  return order;
};

export const generateOrders = (count) => {
  const orders = [];

  for (let i = 0; i < count; i++) {
    const order = generateOrder();
    console.log("oooooooooooooo", order);
    orders.push(order);
  }

  return orders;
};

// const orders = generateOrders(100000);

const generateBranch = () => {
  const branch = {
    branch_id: faker.number.int({ min: 1, max: 1000 }),
    branch_name: faker.company.name(),
    branch_location:
      faker.location.city() +
      ", " +
      faker.location.country() +
      ", " +
      faker.location.zipCode(),
    branch_phone: faker.phone.number(),
    branch_address: faker.location.streetAddress(),
  };

  return branch;
};

export const generateBranches = (count) => {
  const branches = [];

  for (let i = 0; i < count; i++) {
    branches.push(generateBranch());
  }

  return branches;
};

// Insert the branches into the MongoDB collection
