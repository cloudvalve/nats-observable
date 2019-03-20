import { createConsumer } from "./lib/client";

const app = async () => {
  const consume = createConsumer();

  consume("consumer", "bar", message => {
    const sequence = message.getSequence();
    const data = message.getData();

    console.log(`${sequence}: ${data}`);
  });
};

app().catch(err => {
  process.exitCode = 1;

  console.error(err.message);
});
