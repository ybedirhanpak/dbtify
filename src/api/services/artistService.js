import db from "../../database";

const createArtist = async (name, surname) => {
  console.log("** CREATE ARTIST **");
  const queryText = "INSERT INTO artist(name,surname)" + " VALUES($1,$2);";
  const result = await db.queryP(queryText, [name, surname]);

  return {
    message: result.response ? "Artist created." : "Artist cannot be created",
    error: result.error ? result.error.stack : undefined,
  };
};

const getArtist = async (name, surname) => {
  console.log("** GET ARTIST **");
  const queryText =
    "SELECT * FROM artist" + " WHERE name = $1 AND surname = $2;";
  const result = await db.queryP(queryText, [name, surname]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Artist cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows[0] ? "Artist returned." : "Artist not found";
  return {
    artist: response.rows[0],
    message,
  };
};
export default {
  createArtist,
  getArtist,
};
