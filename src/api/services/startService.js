import db from "../../database";

const createListenerTable = async () => {
  console.log("** CREATE LISTENER TABLE **");
  const queryText =
    "CREATE TABLE listener(" +
    "id serial PRIMARY KEY," +
    "username VARCHAR(128) UNIQUE NOT NULL," +
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
    "id serial PRIMARY KEY," +
    "name VARCHAR(128) NOT NULL," +
    "surname VARCHAR(128) NOT NULL," +
    "UNIQUE (name,surname)" +
    ");";
  const result = await db.queryP(queryText);
  return {
    message: result.response
      ? "Artist table created."
      : "Artist table cannot be created. ( Check error logs )",
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
    "artistID integer NOT NULL REFERENCES artist (id)" +
    ");";
  const result = await db.queryP(queryText);
  return {
    message: result.response
      ? "Album table created."
      : "Album table cannot be created. ( Check error logs )",
    error: result.error ? result.error.stack : undefined,
  };
};

const createSongTable = async () => {
  console.log("** CREATE SONG TABLE **");
  const queryText =
    "CREATE TABLE song(" +
    "ID serial PRIMARY KEY," +
    "title VARCHAR(128) NOT NULL," +
    "likes integer NOT NULL," +
    "albumID integer NOT NULL REFERENCES album (id) ON DELETE CASCADE" +
    ");";
  const result = await db.queryP(queryText);
  return {
    message: result.response
      ? "Song table created."
      : "Song table cannot be created. ( Check error logs )",
    error: result.error ? result.error.stack : undefined,
  };
};

export default {
  createListenerTable,
  createArtistTable,
  createAlbumTable,
  createSongTable,
};
