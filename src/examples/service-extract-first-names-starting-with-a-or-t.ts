import { map, concatMap, tap, filter } from "rxjs/operators";

import { createConsumer, createProducer } from "..";

interface IUser {
  firstName: string;
  lastName: string;
}

const app = async () => {
  const { fromChannel } = createConsumer({
    name: "input-extract-first-names-starting-with-a-or-t-instance-00",
    broker: "test-cluster"
  });

  const { toChannel } = createProducer({
    name: "output-extract-first-names-starting-with-a-or-t-instance-00",
    broker: "test-cluster"
  });

  await fromChannel("v1-user-first-names")
    .pipe(
      map(message => message.getData()),
      filter(
        (firstName: string) =>
          firstName.charAt(0).toUpperCase() === "A" ||
          firstName.charAt(0).toUpperCase() === "T"
      ),
      tap(firstName =>
        console.log(
          `Extracted first name that starts with 'A' or 'T': ${firstName}`
        )
      ),
      concatMap(toChannel("v1-user-first-names-starting-with-a-or-t"))
    )
    .toPromise();
};

app().catch((err: Error) => {
  process.exitCode = 1;

  console.error(err.message);
});
