import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const port = parseInt(process.env.PORT ?? '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      if (!req.url) {
        return;
      }
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl).catch((error) => {
        const message =
          error instanceof Error ? error.message : (error as string);

        throw new Error(message);
      });
    }).listen(port);

    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? 'development' : process.env.NODE_ENV
      }`
    );
  })
  .catch(console.error);
