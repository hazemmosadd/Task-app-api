const express = require("express");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const Task = require("./models/task");
const User = require("./models/user");
require("./db/mongoose");

/////////////////////////
const app = express();
const Port = process.env.PORT || 3000
// convert data from JSON to objects
app.use(express.json());
///////////////////////
app.use(userRouter);
app.use(taskRouter);

app.listen(Port, () => {
  console.log("Server is up on port " +   Port);
});
