const auth = (req, res, next) => {
  console.log("headers -> ", req.headers);
  try {
    next();
  } catch (error) {
    next();
  }
};
module.exports = auth;
