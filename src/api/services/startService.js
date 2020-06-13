import db from "../../database";

const createListenerTable = async () => {
  console.log("** CREATE LISTENER TABLE **");
  const queryText =
    "CREATE TABLE listener(" +
    "username VARCHAR(128) PRIMARY KEY," +
    '"e-mail" VARCHAR(128) UNIQUE NOT NULL' +
    ");";
  const result = await db.queryP(queryText);
  return {
    message: result.response
      ? "Listener table created."
      : "Listener table cannot be created. ( Check error logs )",
    error: result.error ? result.error.stack : undefined,
  };
};

const createArtistTable = async () => {
  console.log("** CREATE ARTIST TABLE **");
  const queryText =
    "CREATE TABLE artist(" +
    "name VARCHAR(128) NOT NULL," +
    "surname VARCHAR(128) NOT NULL," +
    "PRIMARY KEY (name,surname)" +
    ");";
  const result = db.queryP(queryText);
  return {
    message: result.response
      ? "Listener table created."
      : "Listener table cannot be created. ( Check error logs )",
    error: result.error ? result.error.stack : undefined,
  };
};

const createSongTable = async () => {
  console.log("** CREATE SONG TABLE **");
  const queryText =
    "CREATE TABLE song(" +
    "ID serial PRIMARY KEY," +
    "title VARCHAR(128) NOT NULL," +
    "albumID integer NOT NULL," +
    "likes integer NOT NULL" +
    ");";
  const result = db.queryP(queryText);
  return {
    message: result.response
      ? "Listener table created."
      : "Listener table cannot be created. ( Check error logs )",
    error: result.error ? result.error.stack : undefined,
  };
};

const createAlbumTable = async () => {
  console.log("** CREATE ALBUM TABLE **");
  const queryText =
    "CREATE TABLE album(" +
    "ID serial PRIMARY KEY," +
    "title VARCHAR(128) NOT NULL," +
    "genre VARCHAR(128) NOT NULL," +
    "artistID integer NOT NULL" +
    ");";
  const result = db.queryP(queryText);
  return {
    message: result.response
      ? "Listener table created."
      : "Listener table cannot be created. ( Check error logs )",
    error: result.error ? result.error.stack : undefined,
  };
};

export default {
  createListenerTable,
  createArtistTable,
  createSongTable,
  createAlbumTable,
};
