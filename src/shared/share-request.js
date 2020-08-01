import { commands } from "./command";

export class ShareRequest {
  get owner() {
    return this._owner;
  }
  get orderId() {
    return this._orderId;
  }
  get order() {
    return this._order;
  }
  get command() {
    return this._command;
  }

  constructor(owner, orderId, order) {
    this._orderId = orderId;
    this._order = order;
    this._owner = owner;

    this._command = commands.SHARE_ORDER;
  }
}
