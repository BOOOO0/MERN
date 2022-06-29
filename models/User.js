const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
//salt를 생성한 다음 그것을 이용해서 비밀번호 암호화
//saltRounds 는 salt가 몇글자인지를 정하는것
const saltRounds = 10;
const jwt = require("jsonwebtoken");

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
  password: {
    type: String,
    minlength: 5,
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
userSchema.pre("save", function (next) {
  //비밀번호를 암호화 시킨다
  var user = this;
  // password가 바뀔때만 암호화가 일어나게 만든다 이것을 하지 않으면
  // email이나 다른 것을 바꿀 때도 암호화가 또 일어난다
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword 1234567       암호화된 비밀번호 (복호화를 할 수 없으니 plainPassword를 암호화해서 비교)
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
userSchema.methods.generateToken = function (cb) {
  var user = this;
  //jsonwebtoken을 이용해서 token을 생성하기
  //user._id가 plainobject가 아니였기 때문에 toHexString()을 사용
  var token = jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};
const User = mongoose.model("User", userSchema);

module.exports = { User };
