# nats-observable

**WIP**

## Usage

```js
const app = async () => {
  const { fromChannel } = createConsumer({
    name: "input-extract-first-names-instance-00",
    broker: {
      name: "test-cluster",
      url: "nats://localhost:4222"
    }
  });

  const { toChannel } = createProducer({
    name: "output-extract-first-names-instance-00",
    broker: {
      name: "test-cluster",
      url: "nats://localhost:4222"
    }
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
```

## License

MIT
