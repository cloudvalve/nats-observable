import * as nats from "node-nats-streaming";

interface IOptions {
  clusterId: string;
  clientId: string;
}

// !TODO: The `any` typing is because of https://github.com/nats-io/node-nats-streaming/issues/98
const createClient = ({ clusterId, clientId }: IOptions) =>
  nats.connect(clusterId, clientId, { reconnect: false } as any);

export { createClient };
