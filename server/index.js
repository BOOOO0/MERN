const express = require("express");
const app = express();
const port = 5000;
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

// 계속 proxy 문제로 안되다가 백에서 cors로 해결하고 나니까
// 대체 왜 proxy로도 되는걸까?
// const cors = require("cors");

// const cors_origin = ["http://localhost:3000"];
// app.use(
//   cors({
//     origin: cors_origin,
//     credentials: true,
//   })
// );
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
const { json } = require("body-parser");

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    UseUnifiedTopology: true,
    //  mongoDB 6버전 이상부터는 쓰지 않아도 됨
    //   useCreateIndex: true,
    //   useFindAndModify: false,
  })
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hellofsdfcxkzlvjczxlkjvlkzxcvxzjuviowejoivjwosa");
});

app.get("/api/hello", (req, res) => {
  res.send("안녕하세요 ~ ");
});

app.post("/api/users/register", (req, res) => {
  //회원 가입 할때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터베이스에 넣어준다

  const user = new User(req.body);
  // save() 는 mongoDB에서 오는 메소드
  // 여기가 password 암호화의 next()
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    //status200은 성공했다는 뜻
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  //첫번째, 요청된 이메일을 데이터베이스에 있는지 찾는다
  //findOne은 mongoDB 메소드
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당되는 유저가 없습니다.",
      });
    }
    //두번째 요청된 이메일이 데이터베이스에 있다면 비밀번호 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      //비밀번호까지 맞다면 토큰을 생성하기
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        //토큰을 저장한다 쿠키 or 로컬스토리지
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  //여기까지 미들웨어를 통과해서 왔다는 것은 Authentication이 True라는 뜻
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});
app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
