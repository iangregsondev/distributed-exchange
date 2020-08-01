import { PeerRPCServer } from "grenache-nodejs-http";
import Link from "grenache-nodejs-link";
import { getLogger } from "log4js";
import { config } from "./config";

const logger = getLogger("Service");

export class Service {
  static _service;
  static _peer;

  static createService() {
    if (this._service !== undefined) {
      throw new Error("Service already created!");
    }

    // Set default server options
    const defaultServerOptions = {
      timeout: 300000,
    };

    const port = process.env.PORT ?? 30001;
    const host = process.env.HOST ?? "127.0.0.1";

    const grape = `http://${host}:${port}`;
    logger.debug(`Grape connection string : ${grape}`);

    this._link = new Link({
      grape,
    });

    this._link.start();

    const peer = new PeerRPCServer(this._link, {
      ...defaultServerOptions,
    });

    peer.init();

    const listeningPort = 1024 + Math.floor(Math.random() * 1000);

    logger.debug(`Service listening port : ${listeningPort}`);

    const service = peer.transport("server");
    service.listen(listeningPort);

    this._service = service;
    this._peer = peer;

    this.startAnnouncement();
  }

  static get service() {
    if (this._service === undefined) {
      throw new Error("Service has not been created!");
    }

    return this._service;
  }

  static get peer() {
    if (this._peer === undefined) {
      throw new Error("Peer is not available, Create a Service first!");
    }

    return this._peer;
  }

  static startAnnouncement() {
    setInterval(() => {
      logger.trace(`Announcing service "${config.serviceName}" on port ${this._service.port}`);
      this._link.announce(config.serviceName, this._service.port, {});
    }, 1000);
  }
}
