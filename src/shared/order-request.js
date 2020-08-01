import { commands } from "./command";

export class OrderRequest {
  get orderId() {
    return this._orderId;
  }
  get order() {
    return this._order;
  }
  get command() {
    return this._command;
  }

  constructor(orderId, order) {
    this._orderId = orderId;
    this._order = order;

    this._command = commands.DISPATCH_ORDER;
  }
}
