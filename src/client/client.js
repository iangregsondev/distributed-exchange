import { PeerRPCClient } from "grenache-nodejs-http";
import Link from "grenache-nodejs-link";
import { getLogger } from "log4js";

const logger = getLogger("Client");

export class Client {
  static _peer;

  static createPeer() {
    if (this._peer !== undefined) {
      throw new Error("Peer already created!");
    }

    const port = process.env.PORT ?? 30001;
    const host = process.env.HOST ?? "127.0.0.1";

    const grape = `http://${host}:${port}`;
    logger.debug(`Grape connection string : ${grape}`);

    const link = new Link({
      grape,
    });
    link.start();

    const peer = new PeerRPCClient(link, {});
    peer.init();

    this._peer = peer;
  }

  static get peer() {
    if (this._peer === undefined) {
      throw new Error("Peer has not been created!");
    }

    return this._peer;
  }
}
