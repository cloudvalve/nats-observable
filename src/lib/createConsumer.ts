import * as VError from "verror";
import { Observable } from "rxjs";

import { createClient } from "./createClient";
import { Subscription } from "node-nats-streaming";

interface IConsumerOptions {
  broker: string;
  name: string;
}

// !TODO: Create proper interface for the ConsumerAPI

const createConsumer = (options: IConsumerOptions) => {
  const fromChannel = (name: string): Observable<any> =>
    new Observable(stream => {
      const client = createClient({
        clusterId: options.broker,
        clientId: options.name
      });

      client.once("error", err =>
        stream.error(
          new VError(err, `failed to consume message from channel "${name}"`)
        )
      );

      client.once("disconnect", () => {
        // We have to call `close` because of internal cleanup routines in the NATS client
        client.close();
        stream.error(
          new VError(
            `Broker connection has been terminated. Is the broker offline?`
          )
        );
      });

      client.once("connect", () => {
        const subscription = client.subscribe(
          name,
          client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setDurableName(options.name)
        );

        subscription.on("message", message => stream.next(message));
      });
    });

  return { fromChannel };
};

export { createConsumer };
