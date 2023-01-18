const console2 = (req, res, next) => {
  console.log("Console kedua");
  next();
};

module.exports = console2;
