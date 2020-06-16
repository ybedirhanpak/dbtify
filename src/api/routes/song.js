import { Router } from "express";
import songService from "../services/songService";
import errors from "../helpers/errors";

const route = Router();

route.post("/create", async (req, res) => {
  try {
    const { title, albumID, producerIDs } = req.body;
    const result = await songService.createSong(title, albumID, producerIDs);
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
    const result = await songService.getSong(id);
    if (!result.song || result.error) {
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
    const result = await songService.getAllSongs();
    if (!result.songs || result.error) {
      res.status(400).send(result);
    } else {
      res.send(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(errors.InternalServerError(error));
  }
});

route.get("/getAll/genre/:genre", async (req, res) => {
  try {
    const { genre } = req.params;
    const result = await songService.getSongsOfGenre(genre);
    if (!result.songs || result.error) {
      res.status(400).send(result);
    } else {
      res.send(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(errors.InternalServerError(error));
  }
});

route.post("/search/", async (req, res) => {
  try {
    const { keyword } = req.body;
    const result = await songService.searchSongs(keyword);
    if (!result.songs || result.error) {
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
    const { title } = req.body;
    const { id } = req.params;
    const result = await songService.updateSong(id, title);
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
    const result = await songService.deleteSong(id);
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
