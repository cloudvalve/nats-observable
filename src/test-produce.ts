import { createProducer } from "./lib/createProducer";

import * as faker from "faker";

const app = async () => {
  const { toChannel } = createProducer({
    broker: "test-cluster"
  });

  let id = 0;

  while (true) {
    const user = {
      type: "UserCreated",
      payload: {
        id,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      }
    };

    await toChannel("user-v1")(JSON.stringify(user));
    console.log(`Produced ${id}, firstName: ${user.payload.firstName}`);

    await new Promise(resolve => setTimeout(resolve, 1000));

    id++;
  }
};

app().catch(err => {
  process.exitCode = 1;

  console.error(err.message);
});
