import db from "../../database";

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

export default {
  createListener,
  getListener,
  getAllListeners,
};
