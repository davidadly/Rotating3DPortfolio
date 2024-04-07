const jwt = require("jsonwebtoken");
const config = require("../config/config.js");

const isAuth = (req, res, next) => {
  const { token } = req.headers;
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    next();
  });
};

const login = async (req, res) => {
  const { password } = req.body;
  if (!password)
    return res.status(400).json({ msg: "password can't be empty" });
  if (password.length < 8)
    return res
      .status(400)
      .json({ msg: "password can't be less than 8 characters" });

  if (password === config.password) {
    const token = jwt.sign({ admin: true }, config.secret, {
      expiresIn: 60 * 60 * 24 * 30,
    });
    return res.status(200).json({ msg: "successfully logged in", token });
  } else {
    return res.status(401).json({ msg: "incorrect password" });
  }
};

module.exports = { isAuth, login };
