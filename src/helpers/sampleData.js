// generating sample data

import { faker } from "@faker-js/faker";

const generateLastUpdateTime = () => {
  const startDate = faker.date.past(6);
  const endDate = faker.date.recent();

  return faker.date.between(startDate, endDate);
};
const generateOrder = () => {
  const order = {
    order_id: faker.random.uuid(),
    item_type: faker.random.arrayElement(["Cake", "Cookies", "Muffins"]),
    order_state: faker.random.arrayElement([
      "Created",
      "Shipped",
      "Delivered",
      "Canceled",
    ]),
    last_update_time: generateLastUpdateTime(),
    branch_id: faker.random.number({ min: 1, max: 1000 }),
    customer_id: faker.random.number({ min: 1, max: 10000 }),
  };

  return order;
};

export const generateOrders = (count) => {
  const orders = [];

  for (let i = 0; i < count; i++) {
    orders.push(generateOrder());
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
