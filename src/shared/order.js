export class Order {
  constructor(orderId, sourceMarket, destinationMarket, sourcePrice, destinationPrice) {
    this._orderId = orderId;
    this._sourcePrice = sourcePrice;
    this._destinationPrice = destinationPrice;
    this._sourceMarket = sourceMarket;
    this._destinationMarket = destinationMarket;

    // Add creation time (current date/time) in UTC format
    this._orderCreationTime = new Date().toISOString();
  }

  get orderId() {
    return this._orderId;
  }

  get sourcePrice() {
    return this._sourcePrice;
  }

  get destinationPrice() {
    return this._destinationPrice;
  }

  get sourceMarket() {
    return this._sourceMarket;
  }

  get destinationMarket() {
    return this._destinationMarket;
  }

  get orderCreationTime() {
    return this._orderCreationTime;
  }
}
