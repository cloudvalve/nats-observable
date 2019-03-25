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
import { Observable } from "rxjs";

import { createClient } from "./createClient";
import { Message } from "node-nats-streaming";

interface IConsumerOptions {
  name: string;
  broker: {
    name: string;
    url: string;
  };
}

interface IConsumer {
  fromChannel: (name: string) => Observable<Message>;
}

const createConsumer = (options: IConsumerOptions): IConsumer => {
  const fromChannel = (name: string): Observable<Message> =>
    new Observable(stream => {
      const client = createClient({
        clusterId: options.broker.name,
        clientId: options.name,
        url: options.broker.url
      });

      client.once("error", err =>
        stream.error(
          new VError(err, `failed to consume message from channel "${name}"`)
        )
      );

      client.once("disconnect", () =>
        stream.error(
          new VError(
            `Broker connection has been terminated. Is the broker offline?`
          )
        )
      );

      client.once("connect", () => {
        const subscriptionOpts = client
          .subscriptionOptions()
          .setDeliverAllAvailable()
          .setDurableName(options.name);

        const subscription = client.subscribe(name, subscriptionOpts);

        subscription.on("message", message => stream.next(message));
      });
    });

  return { fromChannel };
};

export { createConsumer };
