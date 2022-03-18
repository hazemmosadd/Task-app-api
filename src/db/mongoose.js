const mongoose = require("mongoose");

const connectionURL = 'mongodb+srv://taskapp:6422058a@cluster0.1osfj.mongodb.net/task-manager-api?retryWrites=true'
mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
});



// const Task = mongoose.model("Task", {
//   description: {
//     type: String,
//     required :true , 
//     trim : true 
//   },
//   completed: {
//     type: Boolean,
//     default:false 
//   },
// });

// //////////////////////

// const task = new Task({
//   description: "helloo        a     ", 
  
// });


// task
//   .save()
//   .then((task) => {
//     console.log(task);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
