import db from "../../database";

const createListener = async (username, email) => {
  console.log("** CREATE LISTENER **");
  const queryText =
    'INSERT INTO listener(username,"e-mail")' + `VALUES($1,$2);`;
  const result = await db.queryP(queryText, [username, email]);

  return {
    message: result.response
      ? "Listener created."
      : "Listened cannot be created",
    error: result.error ? result.error.stack : undefined,
  };
};

export default {
  createListener,
};
