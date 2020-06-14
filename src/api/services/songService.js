import db from "../../database";

const createSong = async (title, albumID, producerIDs) => {
  console.log("** CREATE SONG **");
  const queryText =
    "INSERT INTO song(title,albumID,likes)" +
    " VALUES($1,$2,$3)" +
    " RETURNING id,title,albumID,likes;";
  const result = await db.queryP(queryText, [title, albumID, 0]);
  const { response, error } = result;
  let errorArtistSongProduce;
  if (response && response.rows) {
    const song = result.response.rows[0];
    const queryText =
      'INSERT INTO "artist-song-produce"(artistID,songID)' + " VALUES($1,$2);";
    const promises = producerIDs.map((producerID) => {
      return db.queryP(queryText, [producerID, song.id]);
    });

    const results = await Promise.all(promises);
    console.log(results);
    results.forEach((result) => {
      if (result.error) {
        errorArtistSongProduce = result.error;
      }
    });
  }
  if (errorArtistSongProduce) {
    return {
      message: "Song cannot be created",
      error: errorArtistSongProduce.stack,
    };
  }
  return {
    message: response ? "Song created." : "Song cannot be created",
    error: error ? error.stack : undefined,
  };
};

const getSong = async (songID) => {
  console.log("** GET SONG **");
  const queryText = "SELECT * FROM song" + " WHERE id = $1";
  const result = await db.queryP(queryText, [songID]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Song cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows[0] ? "Song returned." : "Song not found";
  return {
    song: response.rows[0],
    message,
  };
};

const getAllSongs = async () => {
  console.log("** GET ALL SONGS **");
  const queryText = "SELECT * FROM song";
  const result = await db.queryP(queryText);
  const { response, error } = result;
  if (error) {
    return {
      message: "Songs cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Songs returned." : "Songs not found";
  return {
    songs: response.rows,
    message,
  };
};

const updateSong = async (songID, title) => {
  console.log("** UPDATE SONG **");
  const queryText = "UPDATE song" + " SET title = $2" + " WHERE id = $1";
  const result = await db.queryP(queryText, [songID, title]);

  return {
    message: result.response ? "Song updated." : "Song cannot be updated",
    error: result.error ? result.error.stack : undefined,
  };
};

const deleteSong = async (songID) => {
  console.log("** DELETE SONG **");
  const queryText = "DELETE from song" + " WHERE id = $1";
  const result = await db.queryP(queryText, [songID]);

  return {
    message: result.response ? "Song deleted." : "Song cannot be deleted.",
    error: result.error ? result.error.stack : undefined,
  };
};

const getSongsOfArtist = async (artistID) => {
  console.log("** GET ALL SONGS OF ARTIST **");
  const queryText =
    "SELECT song.id, title, likes, albumid" +
    ' FROM "artist-song-produce"' +
    " INNER JOIN song ON song.id = songid" +
    " WHERE artistid = $1;";
  const result = await db.queryP(queryText, [artistID]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Songs cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Songs returned." : "Songs not found";
  return {
    songs: response.rows,
    message,
  };
};

const getSongsOfAlbum = async (albumID) => {
  console.log("** GET ALL SONGS OF ALBUM **");
  const queryText = "SELECT * FROM song" + " WHERE albumid = $1";
  const result = await db.queryP(queryText, [albumID]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Songs cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Songs returned." : "Songs not found";
  return {
    songs: response.rows,
    message,
  };
};

const incrementLike = async (songID, listenerID) => {
  console.log("** ADD LIKE SONG**");
  const queryText =
    "UPDATE song" +
    " SET likes = likes + 1 " +
    " WHERE id = $1 AND id NOT IN (" +
    " SELECT songid" +
    ' FROM "listener-song-like"' +
    " WHERE listenerid = $2" +
    ");";
  const result = await db.queryP(queryText, [songID, listenerID]);

  return {
    message: result.response ? "Song updated." : "Song cannot be updated",
    error: result.error ? result.error.stack : undefined,
  };
};

const incrementLikeInAlbum = async (albumID, listenerID) => {
  console.log("** ADD LIKE SONGS IN ALBUM **");
  const queryText =
    "UPDATE song" +
    " SET likes = likes + 1" +
    " WHERE albumid = $1 AND id NOT IN (" +
    " SELECT songid" +
    ' FROM "listener-song-like"' +
    " WHERE listenerid = $2" +
    ");";
  const result = await db.queryP(queryText, [albumID, listenerID]);

  return {
    message: result.response
      ? "Songs Liked."
      : "Songs cannot be liked. (check error logs)",
    error: result.error ? result.error.stack : undefined,
  };
};

const getLikedSongsOfListener = async (listenerID) => {
  console.log("** GET ALL SONGS OF LISTENER LIKE **");
  const queryText =
    "SELECT s.id, s.title, s.likes, s.albumid" +
    ' FROM "listener-song-like" AS lsl' +
    " INNER JOIN song AS s ON s.id = lsl.songid" +
    " WHERE listenerid = $1;";
  const result = await db.queryP(queryText, [listenerID]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Songs cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Songs returned." : "Songs not found";
  return {
    songs: response.rows,
    message,
  };
};

export default {
  createSong,
  getSong,
  getAllSongs,
  updateSong,
  deleteSong,
  getSongsOfArtist,
  getSongsOfAlbum,
  incrementLike,
  incrementLikeInAlbum,
  getLikedSongsOfListener,
};
