import { map, concatMap, tap } from "rxjs/operators";

import { createConsumer, createProducer } from "..";

interface IUser {
  firstName: string;
  lastName: string;
}

const app = async () => {
  const { fromChannel } = createConsumer({
    name: "input-extract-first-names-instance-00",
    broker: "test-cluster"
  });

  const { toChannel } = createProducer({
    name: "output-extract-first-names-instance-00",
    broker: "test-cluster"
  });

  await fromChannel("v1-user")
    .pipe(
      map(message => message.getData()),
      map((user: string) => JSON.parse(user)),
      map((user: IUser) => user.firstName),
      tap(firstName => console.log(`Extracted first name: ${firstName}`)),
      concatMap(toChannel("v1-user-first-names"))
    )
    .toPromise();
};

app().catch((err: Error) => {
  process.exitCode = 1;

  console.error(err.message);
});
