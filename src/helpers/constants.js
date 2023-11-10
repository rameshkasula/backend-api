export const bakeryItems = ["Cake", "Cookies", "Muffins"];

export const orderStatus = ["Created", "Shipped", "Delivered", "Canceled"];

export const randomBakeryItem = () => {
  return bakeryItems[Math.floor(Math.random() * bakeryItems.length)];
};

export const randomOrderStatus = () => {
  return orderStatus[Math.floor(Math.random() * orderStatus.length)];
};

// generate random branch id
export const randomBranchId = () => {
  return Math.floor(Math.random() * 1000);
};
