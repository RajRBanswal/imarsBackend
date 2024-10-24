const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT;

require("./db/conn");

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.static('public'));

app.use(require("./routes/routes"));

// app.listen();
app.listen(PORT, function () {
  console.log(`Connected ${PORT}`);
});
