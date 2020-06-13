import { Router } from "express";
import songService from "../services/songService";
import errors from "../helpers/errors";

const route = Router();

route.post("/create", async (req, res) => {
  try {
    const { title, albumID } = req.body;
    const result = await songService.createSong(title, albumID);
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

route.post("/get", async (req, res) => {
  try {
    const { id } = req.body;
    const result = await songService.getSong(id);
    if (!result.song || result.error) {
      res.status(404).send(result);
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
    const result = await songService.getAllSongs();
    if (!result.songs || result.error) {
      res.status(404).send(result);
    } else {
      res.send(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(errors.InternalServerError(error));
  }
});

export default route;
