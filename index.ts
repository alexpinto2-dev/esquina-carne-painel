import "dotenv/config";
import { createApp } from "./server/app";

const app = createApp();

if (process.env.VERCEL !== "1") {
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
}

export default app;
