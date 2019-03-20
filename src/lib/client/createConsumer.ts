import * as VError from "verror";

import { createClient } from "./createClient";

type Consumer = (channel: string) => Promise<any>;

const createConsumer = () => (
  id: string,
  channel: string,
  handler: (message: any) => void
) =>
  new Promise<string>(async (resolve, reject) => {
    const client = await createClient({ clientId: id });

    const opts = client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setDurableName("fooooobar");

    const sub = client.subscribe(channel, opts);

    sub.on("message", message => {
      handler(message);
    });
  });

export { createConsumer };
