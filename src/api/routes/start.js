import { Router } from "express";
import startService from "../services/startService";

const route = Router();

route.get("/", async (req, res) => {
  try {
    const listener = await startService.createListenerTable();
    const artist = await startService.createArtistTable();
    const album = await startService.createAlbumTable();
    const song = await startService.createSongTable();
    res.send({
      listener,
      artist,
      album,
      song,
    });
  } catch (error) {
    res.status(500).send(errors.InternalServerError(error));
  }
});

export default route;
