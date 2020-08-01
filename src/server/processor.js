import { getLogger } from "log4js";

import { Client } from "./client";
import { Service } from "./service";
import { commands } from "../shared/command";
import { config } from "./config";
import { OrderRequest } from "../shared/order-request";
import { ShareRequest } from "../shared/share-request";
import { OrderQueue } from "./order-queue";
import { Order } from "../shared/order";

export class Processor {
  // Set default request options
  _defaultRequestOptions = {
    timeout: 10000,
  };
  started = false;

  constructor() {
    this._logger = getLogger("Processor");
    this._orderQueue = new OrderQueue();
  }
  start() {
    if (this.started) {
      throw new Error("Processor already started!");
    }
    this._service = Service.service;

    Client.createPeer();

    this._peer = Client.peer;

    this._service.on("request", (rid, key, payload, handler) => this.onRequest(rid, key, payload, handler));
  }

  onRequest(rid, key, payload, handler) {
    if (payload === undefined) {
      this._logger.debug("Received an empty payload, discarded.");
      return;
    }

    this._logger.debug(`Command "${payload._command}" received! `);

    switch (payload._command) {
      case commands.DISPATCH_ORDER:
        const order = this.createOrderFromPayload(payload);
        const orderRequest = new OrderRequest(payload._orderId, order);

        this.processNewOrder(orderRequest.order);
        this.shareOrderWithPeers(orderRequest);
        break;

      case commands.SHARE_ORDER:
        // Only add shared orders that don't originate from me!
        if (payload._owner !== config.serverId) {
          const sharedOrder = this.createOrderFromPayload(payload);
          this.processNewOrder(sharedOrder);
        }
        break;

      default:
        this._logger.warn(`Received the following command "${payload._command}", which is NOT supported!`);
        break;
    }
    // console.log(payload, "ff"); //  { msg: 'hello' }
    // handler.reply(null, { msg: "world" });
  }

  processNewOrder(order) {
    this._orderQueue.add(order);
  }

  shareOrderWithPeers(orderRequest) {
    const shareOrder = new ShareRequest(config.serverId, orderRequest.orderId, orderRequest.order);

    this._peer.map(config.serviceName, shareOrder, { ...this._defaultRequestOptions }, (err, data) => {
      if (err) {
        this._logger.error(`There has been an error sharing order id ${orderRequest.orderId}`, err);
      }
      this._logger.info(`New order with id ${orderRequest.orderId} shared amongst peers `, data);
    });
  }

  createOrderFromPayload(payload) {
    return new Order(
      payload._orderId,
      payload._sourceMarket,
      payload._destinationMarket,
      payload._sourcePrice,
      payload._destinationPrice
    );
  }
}
