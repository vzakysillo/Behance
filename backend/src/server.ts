import "dotenv/config";
import app from "./app.js";

const PORT = Number(process.env.PORT) || 5000;
const APP_URL = String(process.env.APP_URL);

app.listen(PORT, () => {
  console.log(`Server running at ${APP_URL}`);
});
