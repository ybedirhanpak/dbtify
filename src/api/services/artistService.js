import db from "../../database";
import albumService from "./albumService";
import songService from "./songService";

const createArtist = async (name, surname) => {
  console.log("** CREATE ARTIST **");
  const queryText = "INSERT INTO artist(name,surname)" + " VALUES($1,$2);";
  const result = await db.queryP(queryText, [name, surname]);

  return {
    message: result.response ? "Artist created." : "Artist cannot be created",
    error: result.error ? result.error.stack : undefined,
  };
};

const login = async (name, surname) => {
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
  const artist = response.rows[0];
  const message = artist ? "Artist returned." : "Artist not found";

  if (artist) {
    const albumResult = await albumService.getAlbumsOfArtist(artist.id);
    if (!albumResult.error) {
      artist.albums = albumResult.albums;
    } else {
      console.log(albumResult.error);
    }

    const songResult = await songService.getSongsOfArtist(artist.id);
    if (!songResult.error) {
      artist.songs = songResult.songs;
    } else {
      console.log(songResult.error);
    }
  }

  return {
    artist,
    message,
  };
};

const getAllArtists = async () => {
  console.log("** GET ALL ARTISTS **");
  const queryText =
    "SELECT a.id, a.name, a.surname," +
    " COALESCE(SUM(s.likes),0) as likes, (a.name || ' ' || a.surname) as title " +
    " FROM artist AS a" +
    ' LEFT JOIN "artist-song-produce" AS asp on a.id = asp.artistid' +
    " LEFT JOIN song AS s on asp.songid = s.id" +
    " GROUP BY a.id" +
    " ORDER BY likes DESC;";

  const result = await db.queryP(queryText);
  const { response, error } = result;
  if (error) {
    return {
      message: "Artists cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Artists returned." : "Artists not found";
  return {
    artists: response.rows,
    message,
  };
};

const getArtist = async (id) => {
  console.log("** GET ARTIST **");
  const queryText =
    "SELECT a.id, a.name, a.surname," +
    " COALESCE(SUM(s.likes),0) as likes, (a.name || ' ' || a.surname) as title " +
    " FROM artist AS a" +
    ' LEFT JOIN "artist-song-produce" AS asp on a.id = asp.artistid' +
    " LEFT JOIN song AS s on asp.songid = s.id" +
    " WHERE a.id = $1" +
    " GROUP BY a.id;";
  const result = await db.queryP(queryText, [id]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Artist cannot be returned",
      error: error.stack,
    };
  }
  const artist = response.rows[0];
  const message = artist ? "Artist returned." : "Artist not found";

  const albumResult = await albumService.getAlbumsOfArtist(id);
  if (!albumResult.error && artist) {
    artist.albums = albumResult.albums;
  } else {
    console.log(albumResult.error);
  }

  const songResult = await songService.getSongsOfArtist(id);
  if (!songResult.error && artist) {
    artist.songs = songResult.songs;
  } else {
    console.log(songResult.error);
  }

  return {
    artist,
    message,
  };
};

const getArtistsOfSong = async (id) => {
  console.log("** GET ARTISTS OF SONG **");
  const queryText =
    "SELECT artistid" + ' FROM "artist-song-produce"' + "WHERE songid = $1;";
  const result = await db.queryP(queryText, [id]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Artists cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Artists returned." : "Artists not found";
  return {
    artists: response.rows,
    message,
  };
};

const getArtistsWorkedTogether = async (name, surname) => {
  console.log("** GET ARTISTS WORKED TOGETHER **");
  const queryText =
    "SELECT a.id, a.name, a.surname" +
    " FROM artist as a" +
    ' INNER JOIN "artist-song-produce" as asp on asp.artistid = a.id' +
    " WHERE (a.name <> $1 OR a.surname <> $2) AND songid IN (" +
    "	SELECT songid" +
    "	FROM artist as a" +
    ' INNER JOIN "artist-song-produce" as asp on asp.artistid = a.id' +
    "	WHERE a.name = $1 AND a.surname = $2" +
    " );";
  const result = await db.queryP(queryText, [name, surname]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Artists cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Artists returned." : "Artists not found";
  return {
    artists: response.rows,
    message,
  };
};

export default {
  createArtist,
  login,
  getAllArtists,
  getArtist,
  getArtistsOfSong,
  getArtistsWorkedTogether,
};
