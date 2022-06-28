const express = require("express");
const app = express();
const port = 5000;

const config = require("./config/key");

const bodyParser = require("body-parser");
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//application/json
app.use(bodyParser.json());

const { User } = require("./models/User");

const mongoose = require("mongoose");

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
  res.send("Hello World!asdjalkjsdlksa");
});

app.post("/register", (req, res) => {
  //회원 가입 할때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터베이스에 넣어준다
  const user = new User(req.body);
  // save() 는 mongoDB에서 오는 메소드
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    //status200은 성공했다는 뜻
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
