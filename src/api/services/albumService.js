import db from "../../database";

const createAlbum = async (title, genre, artistID) => {
  console.log("** CREATE ALBUM **");
  const queryText =
    "INSERT INTO album(title,genre,artistID,likes)" + " VALUES($1,$2,$3,$4);";
  const result = await db.queryP(queryText, [title, genre, artistID, 0]);

  return {
    message: result.response ? "Album created." : "Album cannot be created",
    error: result.error ? result.error.stack : undefined,
  };
};

const getAlbum = async (id) => {
  console.log("** GET ALBUM **");
  const queryText = "SELECT * FROM album" + " WHERE id = $1";
  const result = await db.queryP(queryText, [id]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Album cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows[0] ? "Album returned." : "Album not found";
  return {
    album: response.rows[0],
    message,
  };
};

const getAllAlbums = async () => {
  console.log("** GET ALL ALBUMS **");
  const queryText = "SELECT * FROM album";
  const result = await db.queryP(queryText);
  const { response, error } = result;
  if (error) {
    return {
      message: "Albums cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Albums returned." : "Albums not found";
  return {
    albums: response.rows,
    message,
  };
};

const updateAlbum = async (id, genre, title) => {
  console.log("** UPDATE ALBUM **");
  const queryText =
    "UPDATE album" + " SET genre = $2, title = $3 " + " WHERE id = $1";
  const result = await db.queryP(queryText, [id, genre, title]);

  return {
    message: result.response ? "Album updated." : "Album cannot be updated",
    error: result.error ? result.error.stack : undefined,
  };
};

const deleteAlbum = async (id) => {
  console.log("** DELETE ALBUM **");
  const queryText = "DELETE from album" + " WHERE id = $1";
  const result = await db.queryP(queryText, [id]);

  return {
    message: result.response ? "Album deleted." : "Album cannot be deleted.",
    error: result.error ? result.error.stack : undefined,
  };
};

const getAlbumsOfArtist = async (id) => {
  console.log("** GET ALL ALBUMS OF ARTIST **");
  const queryText = "SELECT * FROM album" + " WHERE artistid = $1";
  const result = await db.queryP(queryText, [id]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Albums cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Albums returned." : "Albums not found";
  return {
    albums: response.rows,
    message,
  };
};

const incrementLike = async (albumID, listenerID) => {
  console.log("** INCREMENT LIKE ALBUM**");
  const queryText =
    "UPDATE album" +
    " SET likes = likes + 1 " +
    " WHERE id = $1 AND id NOT IN (" +
    " SELECT albumid" +
    ' FROM "listener-album-like"' +
    " WHERE listenerid = $2" +
    ");";
  const result = await db.queryP(queryText, [albumID, listenerID]);

  return {
    message: result.response ? "Song updated." : "Song cannot be updated",
    error: result.error ? result.error.stack : undefined,
  };
};

export default {
  createAlbum,
  getAlbum,
  getAllAlbums,
  updateAlbum,
  deleteAlbum,
  getAlbumsOfArtist,
  incrementLike,
};
