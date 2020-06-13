const InternalServerError = (error) => {
  return {
    message: "Internal Server Error.",
    error,
  };
};

export default {
  InternalServerError,
};
