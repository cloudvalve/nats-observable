/*
 * nats-observable
 *
 * MIT Licensed
 *
 */

/**
 * @author André König <hey@andrekoenig.dev>
 *
 */

import * as nats from "node-nats-streaming";

interface IOptions {
  clusterId: string;
  clientId: string;
}

const createClient = (options: IOptions) => {
  let wasConnected = false;

  // The client shouldn't try to reconnect, but just fail fast instead
  const stan = nats.connect(options.clusterId, options.clientId, {
    reconnect: false
    // !TODO: The `any` typing is because of https://github.com/nats-io/node-nats-streaming/issues/98
  } as any);

  stan.once("connect", () => {
    wasConnected = true;
  });

  stan.once("disconnect", () => {
    // We have to call `close` because of internal cleanup routines in the NATS client
    if (wasConnected) {
      stan.close();
    }
  });

  return stan;
};

export { createClient };
