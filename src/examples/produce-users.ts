/*
 * @cloudvalve/nats-observable
 *
 * MIT Licensed
 *
 */

/**
 * @author André König <hey@andrekoenig.dev>
 * @author Tyll Weiß <info@craft-interactive.de>
 *
 */

import * as faker from "faker";

import { createProducer } from "..";

const app = async () => {
  const { toChannel } = createProducer({
    name: "user-producer",
    broker: {
      name: "test-cluster",
      url: "nats://localhost:4222"
    }
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
