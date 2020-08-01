import { configure, getLogger } from "log4js";

import { Service } from "./service";
import { Processor } from "./processor";
import { config } from "./config";
import { OperationService } from "./operation-service";

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

const logger = getLogger("Main");

logger.info(`Server unique identification: ${config.serverId}`);

logger.info("Creating Service");
Service.createService();

logger.info("Service created");

logger.info("Creating and starting Processor");
const processor = new Processor();
processor.start();
logger.info("Processor started!");

logger.info("Creating and starting Operation Service");
const operationService = new OperationService();
operationService.start();
