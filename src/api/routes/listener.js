import { Router } from "express";
import listenerService from "../services/listenerService";
import errors from "../helpers/errors";

const route = Router();

route.post("/register", async (req, res) => {
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
    const result = await listenerService.login(username, email);
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

route.get("/get/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await listenerService.getListener(id);
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

route.get("/getAll", async (req, res) => {
  try {
    const result = await listenerService.getAllListeners();
    if (!result.listeners || result.error) {
      res.status(400).send(result);
    } else {
      res.send(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(errors.InternalServerError(error));
  }
});

route.post("/likeSong", async (req, res) => {
  try {
    const { listenerID, songID } = req.body;
    const result = await listenerService.likeSong(listenerID, songID);
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

route.post("/likeAlbum", async (req, res) => {
  try {
    const { listenerID, albumID } = req.body;
    const result = await listenerService.likeAlbum(listenerID, albumID);
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

export default route;
