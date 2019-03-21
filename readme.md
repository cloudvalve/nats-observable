# nats-observable

## Usage

```js
import { createConsumer, createProducer } from "nats-observable";

const app = async () => {
  const { fromChannel } = await createConsumer({
    broker: "test-cluster",
    name: "uppercase-first-name-consumer"
  });

  const { toChannel } = createProducer({
    broker: "test-cluster",
    name: "uppercase-first-name-producer"‚
  });

  fromChannel("user-v1")
    .map()
    .filter()
    .concatMap(message => toChannel("user-first-name-uppercased"))
}
```
