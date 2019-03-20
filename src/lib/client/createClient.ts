import * as VError from "verror";
import * as nats from "node-nats-streaming";

interface IOptions {
  clientId: string;
}

const createClient = ({ clientId }: IOptions) =>
  new Promise<nats.Stan>(resolve => {
    const stan = nats.connect("test-cluster", clientId);

    stan.on("connect", () => resolve(stan));
  });

export { createClient };
