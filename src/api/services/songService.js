import db from "../../database";

const createSong = async (title, albumID) => {
  console.log("** CREATE SONG **");
  const queryText =
    "INSERT INTO song(title,albumID,likes)" + " VALUES($1,$2,$3);";
  const result = await db.queryP(queryText, [title, albumID, 0]);

  return {
    message: result.response ? "Song created." : "Song cannot be created",
    error: result.error ? result.error.stack : undefined,
  };
};

const getSong = async (id) => {
  console.log("** GET SONG **");
  const queryText = "SELECT * FROM song" + " WHERE id = $1";
  const result = await db.queryP(queryText, [id]);
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

const updateSong = async (id, title) => {
  console.log("** UPDATE SONG **");
  const queryText = "UPDATE song" + " SET title = $2" + " WHERE id = $1";
  const result = await db.queryP(queryText, [id, title]);

  return {
    message: result.response ? "Song updated." : "Song cannot be updated",
    error: result.error ? result.error.stack : undefined,
  };
};

const deleteSong = async (id) => {
  console.log("** DELETE SONG **");
  const queryText = "DELETE from song" + " WHERE id = $1";
  const result = await db.queryP(queryText, [id]);

  return {
    message: result.response ? "Song deleted." : "Song cannot be deleted.",
    error: result.error ? result.error.stack : undefined,
  };
};

export default {
  createSong,
  getSong,
  getAllSongs,
  updateSong,
  deleteSong,
};
