import { Router } from "express";
import artistService from "../services/artistService";
import errors from "../helpers/errors";

const route = Router();

route.post("/create", async (req, res) => {
  try {
    const { name, surname } = req.body;
    const result = await artistService.createArtist(name, surname);
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
    const { name, surname } = req.body;
    const result = await artistService.login(name, surname);
    if (!result.artist || result.error) {
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
    const result = await artistService.getAllArtists();
    if (!result.artists || result.error) {
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
    const result = await artistService.getArtist(id);
    if (!result.artists || result.error) {
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
