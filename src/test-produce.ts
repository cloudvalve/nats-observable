import { createProducer } from "./lib/createProducer";

import * as faker from "faker";

const app = async () => {
  let id = 0;

  while (true) {
    const user = {
      type: "UserCreated",
      payload: {
        id,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        age: faker.random.number()
      }
    };

    const { toChannel } = createProducer({
      broker: "test-cluster",
      name: `the-producer-${id}`
    });

    await toChannel("user-v2")(JSON.stringify(user));
    console.log(
      `Produced ${id}, firstName: ${user.payload.firstName}, ${
        user.payload.age
      }`
    );

    await new Promise(resolve => setTimeout(resolve, 5));

    id++;
  }
};

app().catch(err => {
  process.exitCode = 1;

  console.error(err.message);
});
