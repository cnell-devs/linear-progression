const bcrypt = require("bcryptjs");

exports.encryptPW = async (password, saltRounds = 10) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

exports.compare = async (password, hash) => {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch
};

// exports.encryptPW = (password, salt = 10) => {
//   bcrypt.genSalt(10, function (err, salt) {
//     bcrypt.hash(password, salt, function (err, hash) {
//       return hash;
//     });
//   });
// };