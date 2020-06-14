import { Router } from "express";
import albumService from "../services/albumService";
import errors from "../helpers/errors";

const route = Router();

route.post("/create", async (req, res) => {
  try {
    const { title, genre, artistID } = req.body;
    const result = await albumService.createAlbum(title, genre, artistID);
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

route.get("/get/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await albumService.getAlbum(id);
    if (!result.album || result.error) {
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
    const result = await albumService.getAllAlbums();
    if (!result.albums || result.error) {
      res.status(400).send(result);
    } else {
      res.send(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(errors.InternalServerError(error));
  }
});

route.post("/update/:id", async (req, res) => {
  try {
    const { genre, title } = req.body;
    const { id } = req.params;
    const result = await albumService.updateAlbum(id, genre, title);
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

route.post("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await albumService.deleteAlbum(id);
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
