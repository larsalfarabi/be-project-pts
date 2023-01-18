const console1 = (req, res, next) => {
  console.log("console pertama");
  next();
};

module.exports = console1;
