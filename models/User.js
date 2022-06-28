const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
//salt를 생성한 다음 그것을 이용해서 비밀번호 암호화
//saltRounds 는 salt가 몇글자인지를 정하는것
const saltRounds = 10;
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    //trim 공백 없애줌
    trim: true,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});
// pre()는 mongoose에서 가져온 메소드
// userSchema.pre("save", function (next) {
//   //비밀번호를 암호화 시킨다
//   var user = this;
//   if (user.isModified("password")) {
//     bcrypt.genSalt(saltRounds, function (err, salt) {
//       if (err) return next(err);
//       bcrypt.hash(user.password, salt, function (err, hash) {
//         if (err) return next(err);
//         user.password = hash;
//         next();
//       });
//     });
//   }
// });
const User = mongoose.model("User", userSchema);

module.exports = { User };
