import { configure, getLogger } from "log4js";
import faker from "faker";
import { Client } from "./client";
import { market } from "../shared/market";
import { Order } from "../shared/order";
import { sharedConfig } from "../shared/shared-config";
import { OrderRequest } from "../shared/order-request";

// Set order interval
const orderInterval = 5000;

// Set default request options
const defaultRequestOptions = {
  timeout: 10000,
  limit: 1000,
};

try {
  // Setup logging, this can come from a JSON file but lack of time
  // I have gone with the standard static configure
  configure({
    appenders: { out: { type: "stdout" } },
    categories: { default: { appenders: ["out"], level: "debug" } },
  });
} catch (err) {
  console.error("Can't bootstrap logger", err);
  process.exit(-1);
}

const logger = getLogger("main");

logger.info("Create and get constructed peer");

Client.createPeer();
const peer = Client.peer;

logger.info(`Setting orders to fire every ${orderInterval} ms`);

setInterval(() => {
  // Get markets for order
  let keys = Object.keys(market);
  const sourceMarket = keys[Math.floor(Math.random() * keys.length)];

  let destinationMarket;

  /*
   Ensure destinationMarket isn't the same as sourceMarket
   Makes no sense in exchanging the same market :-)
  */
  do {
    destinationMarket = keys[Math.floor(Math.random() * keys.length)];
  } while (sourceMarket === destinationMarket);

  /*
   Yes this exchange is only for the rich !
   Because of time allowed, i decided to dispatch orders with price
   between 1 and 5, this will allow me to at least get a match sooner
   rather than later
  */
  const sourcePrice = faker.random.number({ min: 1, max: 5 });
  const destinationPrice = faker.random.number({ min: 1, max: 5 });

  const order = new Order(faker.random.uuid(), sourceMarket, destinationMarket, sourcePrice, destinationPrice);

  logger.info(`Order Id ${order.orderId} has been created`, {
    orderId: order.orderId,
    orderCreationTime: order.orderCreationTime,
    sourcePrice: order.sourcePrice,
    destinationPrice: order.destinationPrice,
    sourceMarket: order.sourceMarket,
    destinationMarket: order.destinationMarket,
  });

  logger.info(`Dispatching order id ${order.orderId}`);

  const orderRequest = new OrderRequest(order.orderId, order);

  peer.request(sharedConfig.serviceName, orderRequest, defaultRequestOptions, (err, data) => {
    if (err) {
      logger.error(`There has been an error dispatching order id ${order.orderId}`, err);
    }
    logger.info(`New order with id ${order.orderId} dispatched `, data);
  });
}, orderInterval);
