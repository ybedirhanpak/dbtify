import db from "../../database";

const createListener = async (username, email) => {
  console.log("** CREATE LISTENER **");
  const queryText =
    'INSERT INTO listener(username,"e-mail")' + " VALUES($1,$2);";
  const result = await db.queryP(queryText, [username, email]);

  return {
    message: result.response
      ? "Listener created."
      : "Listened cannot be created",
    error: result.error ? result.error.stack : undefined,
  };
};

const getListener = async (username, email) => {
  console.log("** CREATE LISTENER **");
  const queryText =
    "SELECT * FROM listener" + ' WHERE username = $1 AND "e-mail" = $2;';
  const result = await db.queryP(queryText, [username, email]);

  return {
    listener: result.response ? result.response.rows[0] : undefined,
    message: result.response
      ? "Listener returned."
      : "Listened cannot be returned",
    error: result.error ? result.error.stack : undefined,
  };
};
export default {
  createListener,
  getListener,
};
