import { Router } from "express";
import listenerService from "../services/listenerService";
import errors from "../helpers/errors";

const route = Router();

route.post("/create", async (req, res) => {
  try {
    const { username, email } = req.body;
    const result = await listenerService.createListener(username, email);
    if (result.error) {
      res.status(400).send(result);
    } else {
      res.send(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(errors.InternalServerError(error));
  }
});

route.post("/login", async (req, res) => {
  try {
    const { username, email } = req.body;
    const result = await listenerService.getListener(username, email);
    if (!result.listener || result.error) {
      res.status(400).send(result);
    } else {
      res.send(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(errors.InternalServerError(error));
  }
});

export default route;
