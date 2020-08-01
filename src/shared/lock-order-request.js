import { commands } from "./command";

export class LockOrderRequest {
  get serverId() {
    return this._serverId;
  }
  get orderId() {
    return this._orderId;
  }

  get command() {
    return this._command;
  }

  constructor(serverId, orderId) {
    this._serverId = serverId;
    this._orderId = orderId;

    this._command = commands.LOCK_ORDER;
  }
}
