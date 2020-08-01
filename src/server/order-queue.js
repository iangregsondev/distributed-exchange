import { getLogger } from "log4js";

const orders = [];

export class OrderQueue {
  constructor() {
    this._logger = getLogger("OrderQueue");
  }
  add(order) {
    orders.push(order);
    this._logger.debug(`Order id ${order.orderId} has been added to the queue`);
    this._logger.debug(`There is a total of ${orders.length} orders in the queue now`);
  }

  update() {
    // TODO
  }

  copy() {
    return [...orders];
  }

  total() {
    return orders.length;
  }
}
