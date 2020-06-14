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
    "likes int NOT NULL," +
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

const createListenerSongLikeTable = async () => {
  console.log("** CREATE LISTENER_SONG_LIKE TABLE **");
  const queryText =
    'CREATE TABLE "listener-song-like"(' +
    "ID serial PRIMARY KEY," +
    "listenerID integer NOT NULL REFERENCES listener (id) ON DELETE CASCADE," +
    "songID integer NOT NULL REFERENCES song (id) ON DELETE CASCADE," +
    "UNIQUE (listenerID,songID)" +
    ");";
  const result = await db.queryP(queryText);
  return {
    message: result.response
      ? "Listener-Song-Like table created."
      : "Listener-Song-Like table cannot be created. ( Check error logs )",
    error: result.error ? result.error.stack : undefined,
  };
};

const createListenerAlbumLikeTable = async () => {
  console.log("** CREATE LISTENER_ALBUM_LIKE TABLE **");
  const queryText =
    'CREATE TABLE "listener-album-like"(' +
    "ID serial PRIMARY KEY," +
    "listenerID integer NOT NULL REFERENCES listener (id) ON DELETE CASCADE," +
    "albumID integer NOT NULL REFERENCES album (id) ON DELETE CASCADE," +
    "UNIQUE (listenerID,albumID)" +
    ");";
  const result = await db.queryP(queryText);
  return {
    message: result.response
      ? "Listener-Album-Like table created."
      : "Listener-Album-Like table cannot be created. ( Check error logs )",
    error: result.error ? result.error.stack : undefined,
  };
};

const createArtistSongProduceTable = async () => {
  console.log("** CREATE ARTIST_SONG_PRODUCE TABLE **");
  const queryText =
    'CREATE TABLE "artist-song-produce"(' +
    "ID serial PRIMARY KEY," +
    "artistID integer NOT NULL REFERENCES artist (id) ON DELETE CASCADE," +
    "songID integer NOT NULL REFERENCES song (id) ON DELETE CASCADE," +
    "UNIQUE (artistID,songID)" +
    ");";
  const result = await db.queryP(queryText);
  return {
    message: result.response
      ? "Artist-Song-Produce table created."
      : "Artist-Song-Produce table cannot be created. ( Check error logs )",
    error: result.error ? result.error.stack : undefined,
  };
};

export default {
  createListenerTable,
  createArtistTable,
  createAlbumTable,
  createSongTable,
  createListenerSongLikeTable,
  createListenerAlbumLikeTable,
  createArtistSongProduceTable,
};
