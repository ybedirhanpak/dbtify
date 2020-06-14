import db from "../../database";
import songService from "./songService";
import albumService from "./albumService";

const createListener = async (username, email) => {
  console.log("** CREATE LISTENER **");
  const queryText =
    'INSERT INTO listener(username,"e-mail")' + " VALUES($1,$2);";
  const result = await db.queryP(queryText, [username, email]);

  return {
    message: result.response
      ? "Listener created."
      : "Listener cannot be created",
    error: result.error ? result.error.stack : undefined,
  };
};

const getListener = async (username, email) => {
  console.log("** GET LISTENER **");
  const queryText =
    "SELECT * FROM listener" + ' WHERE username = $1 AND "e-mail" = $2;';
  const result = await db.queryP(queryText, [username, email]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Listener cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows[0] ? "Listener returned." : "Listener not found";
  return {
    listener: response.rows[0],
    message,
  };
};

const getAllListeners = async () => {
  console.log("** GET ALL LISTENERS **");
  const queryText = "SELECT * FROM listener";
  const result = await db.queryP(queryText);
  const { response, error } = result;
  if (error) {
    return {
      message: "Listeners cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Listeners returned." : "Listeners not found";
  return {
    listeners: response.rows,
    message,
  };
};

const createListenerSongLike = async (listenerID, songID) => {
  const queryText =
    'INSERT INTO "listener-song-like"(listenerid,songid)' + " VALUES($1,$2);";

  const result = await db.queryP(queryText, [listenerID, songID]);
  return {
    message: result.response
      ? "Listener liked song(s)."
      : "Listener cannot like song(s) (check error stack)",
    error: result.error ? result.error.stack : undefined,
  };
};

const likeSong = async (listenerID, songID) => {
  console.log("** LISTENER LIKE SONG **");

  const songLikeResult = await songService.incrementLike(songID, listenerID);
  if (songLikeResult.error) {
    console.log(songLikeResult.error);
    return {
      message: "Song cannot be liked.",
      error: songLikeResult.error,
    };
  }

  const result = await createListenerSongLike(listenerID, songID);

  return {
    message: result.message,
    error: result.error,
  };
};

const createListenerSongLikeForAlbum = async (listenerID, albumID) => {
  const queryText =
    'INSERT INTO "listener-song-like"(listenerid,songid)' +
    " SELECT $1, s.id" +
    " FROM song AS s" +
    " WHERE s.albumID = $2 AND s.id NOT IN (" +
    " SELECT songid" +
    ' FROM "listener-song-like"' +
    " WHERE listenerid = $1" +
    ");";

  const result = await db.queryP(queryText, [listenerID, albumID]);

  return {
    message: result.response
      ? "Listener liked song(s)."
      : "Listener cannot like song(s) (check error stack)",
    error: result.error ? result.error.stack : undefined,
  };
};

const createListenerAlbumLike = async (listenerID, albumID) => {
  const queryText =
    'INSERT INTO "listener-album-like"(listenerid,albumid)' + " VALUES($1,$2);";

  const result = await db.queryP(queryText, [listenerID, albumID]);
  return {
    message: result.response
      ? "Listener liked album."
      : "Listener cannot like album. (check error stack)",
    error: result.error ? result.error.stack : undefined,
  };
};

const likeAlbum = async (listenerID, albumID) => {
  console.log("** LISTENER LIKE ALBUM **");

  // Increment likes of album
  const albumLikeResult = await albumService.incrementLike(albumID, listenerID);
  if (albumLikeResult.error) {
    return {
      message: albumLikeResult.message,
      error: albumLikeResult.error,
    };
  }
  console.log(albumLikeResult);
  // Incremenet likes of songs
  const songLikeResult = await songService.incrementLikeInAlbum(
    albumID,
    listenerID
  );
  if (songLikeResult.error) {
    return {
      message: songLikeResult.message,
      error: songLikeResult.error,
    };
  }
  console.log(songLikeResult);

  // insert into listener-song-like
  const listenerSongLikeResult = await createListenerSongLikeForAlbum(
    listenerID,
    albumID
  );
  if (listenerSongLikeResult.error) {
    return {
      message: listenerSongLikeResult.message,
      error: listenerSongLikeResult.error,
    };
  }
  console.log(result);

  // insert into listener-album-like
  const result = await createListenerAlbumLike(listenerID, albumID);

  console.log(result);
  return {
    message: result.message,
    error: result.error,
  };
};

export default {
  createListener,
  getListener,
  getAllListeners,
  likeSong,
  likeAlbum,
};
