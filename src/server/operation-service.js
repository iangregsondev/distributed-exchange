import { getLogger } from "log4js";

import { OrderQueue } from "./order-queue";
import { Client } from "./client";
import { config } from "./config";
import { LockOrderRequest } from "../shared/lock-order-request";

export class OperationService {
  // Set default request options
  _defaultRequestOptions = {
    timeout: 10000,
  };

  constructor() {
    this._logger = getLogger("OperationService");
    this._loopInterval = 2000;
    this._orderQueue = new OrderQueue();
    this._peer = Client.peer;
  }

  start() {
    this.processOperations();
  }

  processOperations() {
    this._loop = setInterval(async () => {
      clearInterval(this._loop);
      const ordersToProcess = this._orderQueue.copy();
      this._logger.debug(`Processing a total of ${ordersToProcess.length} orders in the queue`);

      for (const order in ordersToProcess) {
        const result = this.hasMatchingOrder(order);
        if (result.matches) {
          // Needd to locck the record!, so nobody else can touch it !

          await this.lockOrder(order.orderId);
        }
      }

      this.processOperations();
    }, this._loopInterval);
  }

  hasMatchingOrder(order, ordersSnapShot) {
    // Need to see if anything is a match!

    // TOOD

    /*
    const matchingOrders = ordersSnapShot.filter((item) => {
      return (order.sourceMarket === item.destinationMarket && order.destinationMarke === item.sourceMarket)
    }).filter((price) => {
      // TODO - check teh prices!
    })*/

    return {
      matches: true,
      //   matchingOrders,
    };
  }

  async lockOrder(orderId) {
    const lockOrderRequest = new LockOrderRequest(config.serverId, orderId);
    return new Promise((resolve, reject) => {
      this._peer.map(config.serviceName, lockOrderRequest, { ...this._defaultRequestOptions }, (err, data) => {
        if (err) {
          this._logger.error(`There has been an error locking order id ${orderId}`, err);
          reject();
        }

        // Check data to see if lock was successful! either reject or resolve!!!
        // TODOD!!!!
      });
    });
  }
}
