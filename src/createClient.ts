/*
 * @cloudvalve/nats-observable
 *
 * MIT Licensed
 *
 */

/**
 * @author André König <hey@andrekoenig.dev>
 * @author Tyll Weiß <info@craft-interactive.de>
 *
 */

import * as nats from "nats";
import { connect as connectStreamingServer } from "node-nats-streaming";

// import * as nats from "node-nats-streaming";

interface IOptions {
  clusterId: string;
  clientId: string;
  url: string;
}

const createClient = (options: IOptions) => {
  let wasConnected = false;

  const nc = nats.connect({
    url: options.url,
    reconnect: false,
    encoding: "binary"
  });

  const sc = connectStreamingServer(options.clusterId, options.clientId, {
    nc
  });

  nc.once("connect", () => {
    wasConnected = true;
  });

  nc.once("disconnect", () => {
    // We have to call `close` because of internal cleanup routines in the NATS client
    if (wasConnected) {
      nc.close();
    }
  });

  return sc;
};

export { createClient };
