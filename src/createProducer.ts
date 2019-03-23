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

import * as VError from "verror";
import * as cuid from "cuid";

import { createClient } from "./createClient";

interface IProducerOptions {
  broker: string;
  name: string;
}

type GUID = string;
type MessageContents = string | Buffer | Uint8Array;

interface IProducer {
  toChannel: (name: string) => (message: MessageContents) => Promise<GUID>;
}

// !TODO: Create proper interface for the ProducerAPI
const createProducer = (options: IProducerOptions): IProducer => {
  const toChannel = (name: string) => (
    message: MessageContents
  ): Promise<string> =>
    new Promise<string>(async (resolve, reject) => {
      const client = createClient({
        clusterId: options.broker,
        // ! Append a random id to the clientId to prevent collisions
        clientId: `${options.name}-${cuid()}`
      });

      client.once("connect", () =>
        client.publish(name, message, (err: Error, guid: string) => {
          client.close();

          if (err) {
            return reject(
              new VError(err, `failed to publish message to channel "${name}"`)
            );
          }

          resolve(guid);
        })
      );
    });

  return { toChannel };
};

export { createProducer };
