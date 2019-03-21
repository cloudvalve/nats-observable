import * as nats from "node-nats-streaming";

interface IOptions {
  clusterId: string;
  clientId: string;
}

const createClient = ({ clusterId, clientId }: IOptions) =>
  new Promise<nats.Stan>(resolve => {
    const stan = nats.connect(clusterId, clientId);

    stan.on("connect", () => resolve(stan));
  });

export { createClient };
