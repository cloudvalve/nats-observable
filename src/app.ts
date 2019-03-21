import { createConsumer } from "./lib/createConsumer";

import * as operators from "rxjs/operators";
import { createProducer } from "./lib/createProducer";

const app = async () => {
  const { fromChannel } = createConsumer({
    broker: "test-cluster",
    name: "uppercase-first-name-03"
  });

  const { toChannel } = createProducer({
    broker: "test-cluster"
  });

  await fromChannel("user-v2")
    .pipe(
      operators.map(message => message.getData()),
      operators.map(event => JSON.parse(event)),
      operators.map(event => event.payload),
      operators.map(payload => ({
        firstName: payload.firstName,
        age: payload.age
      })),
      operators.filter(
        payload =>
          payload.firstName.charAt(0).toUpperCase() === "A" &&
          payload.age > 80000
      ),
      operators.map(payload => JSON.stringify(payload))
      // operators.concatMap(toChannel("user-v2-first-names-starting-with-a"))
    )
    .toPromise();
};

app().catch(err => {
  process.exitCode = 1;

  console.error("ERRRRRRROOOOOOOOOOOR");
  console.log(err.message);
});
