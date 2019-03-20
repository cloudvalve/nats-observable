import * as VError from "verror";

import { createClient } from "./createClient";

type Producer = (channel: string, message: any) => Promise<string>;

const createProducer = () => (id: string, channel: string, message: any) =>
  new Promise<string>(async (resolve, reject) => {
    const client = await createClient({ clientId: id });

    client.publish(channel, message, (err: Error, guid: string) => {
      client.close();

      if (err) {
        return reject(new VError(err, `failed to publish message`));
      }

      resolve(guid);
    });
  });

export { createProducer };
