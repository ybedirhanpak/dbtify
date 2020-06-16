import { Router } from "express";
import startService from "../services/startService";

const route = Router();

route.get("/", async (req, res) => {
  try {
    const listener = await startService.createListenerTable();
    const artist = await startService.createArtistTable();
    const album = await startService.createAlbumTable();
    const song = await startService.createSongTable();
    const listener_song_like = await startService.createListenerSongLikeTable();
    const listener_album_like = await startService.createListenerAlbumLikeTable();
    const artist_song_produce = await startService.createArtistSongProduceTable();
    const get_worked_together_func = await startService.createGetWorkedTogetherFunc();
    res.send({
      listener,
      artist,
      album,
      song,
      listener_song_like,
      listener_album_like,
      artist_song_produce,
      get_worked_together_func,
    });
  } catch (error) {
    res.status(500).send(errors.InternalServerError(error));
  }
});

export default route;
