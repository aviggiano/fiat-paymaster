import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.disable("x-powered-by");

app.get("/health", (req, res) => {
	console.log("health check");
  res.send({ status: "ok" });
});

const port = 3002;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
