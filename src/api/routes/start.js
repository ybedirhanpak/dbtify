import { Router } from "express";
import startService from "../services/startService";

const route = Router();

route.get("/", async (req, res) => {
  try {
    const listener = await startService.createListenerTable();
    const artist = await startService.createArtistTable();
    const song = await startService.createSongTable();
    const album = await startService.createAlbumTable();
    res.send({
      listener,
      artist,
      song,
      album,
    });
  } catch (error) {
    res.status(500).send(errors.InternalServerError(error));
  }
});

export default route;
