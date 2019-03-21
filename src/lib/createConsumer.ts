import { Observable } from "rxjs";
import * as VError from "verror";

import { createClient } from "./createClient";

interface IConsumerOptions {
  broker: string;
  name: string;
}

// !TODO: Create proper interface for the ConsumerAPI

const createConsumer = async (options: IConsumerOptions) => {
  const client = await createClient({
    clusterId: options.broker,
    clientId: options.name
  });

  const fromChannel = (name: string): Observable<any> => {
    const observable = new Observable(subscriber => {
      const subscription = client.subscribe(
        name,
        client
          .subscriptionOptions()
          .setDeliverAllAvailable()
          .setDurableName(options.name)
      );

      subscription.on("message", message => subscriber.next(message));

      // !TODO: Handle errors properly
      // !TODO: Configure manual acks; maybe possible to add another subscription?
    });

    return observable;
  };

  return { fromChannel };
};

export { createConsumer };
