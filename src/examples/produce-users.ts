import * as faker from "faker";

import { createProducer } from "../lib";

const app = async () => {
  const { toChannel } = createProducer({
    name: "user-producer",
    broker: "test-cluster"
  });

  while (true) {
    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName()
    };

    await toChannel("v1-user")(JSON.stringify(user));

    console.log(
      `Produced user – firstName: ${user.firstName}, lastName: ${user.lastName}`
    );

    await new Promise(resolve => setTimeout(resolve, 50));
  }
};

app().catch((err: Error) => {
  process.exitCode = 1;

  console.error(err.message);
});
