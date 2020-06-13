import { Router } from "express";
import db from "../../database";

const route = Router();

route.get("/", async (req, res) => {
  const queryText =
    "INSERT INTO recipe(name,ingredients)" +
    "VALUES('deneme2', 'ingredients2');";

  db.query(queryText, null, (err, result) => {
    console.log(err, result);
  });

  res.send("Test OK !");
});

export default route;
