const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

router.post("/tasks", auth, async (req, res) => {
  //const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    const x = await task.save();
    console.log(x);
    res.send(task);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
  // task
  //   .save()
  //   .then((task) => {
  //     res.send(task);
  //   })
  //   .catch((error) => {
  //     res.status(400);
  //     res.send(error);
  //   });
});

// Get tasks/?completed = true
// Get tasks/?limit=10&skip=1
// Get tasks/?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
  const query = {};
  const sorts = {}
  const pageOptions = {
    skip: parseInt(req.query.skip) || 0,
    limit: parseInt(req.query.limit) || 10,
  };

  if (req.query.completed) {
    query.completed = req.query.completed === "true";
  }


  if (req.query.sortBy)
  {
    const parts = req.query.sortBy.split(':')
    sorts[parts[0]] =  parts[1]==='desc' ? -1:1;  
  }


  // كل ده هو عمله بطريقه تانيه انا مش فاهمها بس ارجعلها sec 13 4 
  try {
    const tasks = await Task.find({
      owner: req.user._id,
      ...query,
    })
      .skip(pageOptions.skip)
      .limit(pageOptions.limit)
      .sort(sorts)
    // await req.user.populate('tasks').execPopulate()
    console.log(tasks.length);
    res.send(tasks);
  } catch (error) {
    res.status(500);
    res.send(error);
  }
});

// Task.find({})
//   .then((tasks) => {
//     res.send(tasks);
//   })
//   .catch((error) => {
//     res.status(500);
//     res.send(error);
//   });
//});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
  // User.findById(_id)
  //   .then((task) => {
  //     if (!task) return res.status(400).send();
  //     res.send(task);
  //   })
  //   .catch((error) => {
  //     res.send(error);
  //   });
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    res.status(400).send({ error: "invalid updates" });
  }

  const _id = req.params.id;
  try {
    // const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true, });
    const task = await Task.findOne({ _id, owner: req.user._id });
    console.log("aaaaaaaaaaa");
    console.log(task);
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) return res.status(404).send();

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
