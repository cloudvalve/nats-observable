import * as VError from "verror";
import { Observable } from "rxjs";

import { createClient } from "./createClient";

interface IProducerOptions {
  broker: string;
  name?: string;
}

// !TODO: Create proper interface for the ProducerAPI
const createProducer = (options: IProducerOptions) => {
  const toChannel = (name: string) => (message: any): Promise<string> =>
    new Promise<string>(async (resolve, reject) => {
      const client = await createClient({
        clusterId: options.broker,
        clientId:
          // TODO: This could colidate if one creates a lot of producers at the same time
          options.name || `nats-observable-producer-${Date.now().toString()}`
      });

      client.once("connect", () =>
        // !TODO: Promisify
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
