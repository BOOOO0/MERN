const express = require("express");
const app = express();
const port = 5000;

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://boo0:rhqjajsxm0@boilerplate.trlqrf4.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      UseUnifiedTopology: true,
      //  mongoDB 6버전 이상부터는 쓰지 않아도 됨
      //   useCreateIndex: true,
      //   useFindAndModify: false,
    }
  )
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
