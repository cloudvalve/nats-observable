import { createProducer } from "./lib/client";

const app = async () => {
  const produce = createProducer();

  let i = 0;

  while (true) {
    console.log(`Produced ${i}`);
    await produce("producer", "bar", `test ${i}`);

    await new Promise(resolve => setTimeout(resolve, 1000));

    i++;
  }
};

app().catch(err => {
  process.exitCode = 1;

  console.error(err.message);
});
