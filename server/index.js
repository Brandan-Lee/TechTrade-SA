import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`TechTrade server listening on port ${port}`);
});
