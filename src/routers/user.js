const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
//const multer = require('multer')

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) return res.status(400).send();
    res.send(user);
  } catch (error) {
    res.send(error);
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid updates" });
  }

  // const _id = req.params.id;
  try {
    // const user = await User.findById(_id);
    // if (!user) {
    //   return res.status(404).send();
    // }
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  // const _id = req.params.id;
  try {
    // const user = await User.findByIdAndDelete(_id);
    // if (!user) res.status(404).send();
    await req.user.remove();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(404).send(error)
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll/", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});


// const uploadImage = multer({
//   // المكان اللي كان هيحط في الصور بس احنا حاليا هنحط الصوره في ال db 
//   //dest:'avatars' , 
//   limits : {
//     fileSize : 1000000 //1mb 
//   } ,  
//   fileFilter(req , file , cb ) {

//     //ends with jpg regex
//     if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
//     {
//       return cb(new Error ('please upload image') )
//     }
//     cb(undefined , true);
//   }
// })


// // const middelewareError =  (req , res , next)=> {
// //   throw new Error ("aaaaaaaaaa") ;
// // }

// router.post('/users/me/avatar/' ,auth ,  uploadImage.single('avatar') , async (req, res)=> {
//   req.user.avatar =  req.file.buffer 
//   await req.user.save()
//   res.send() ;
// }, (error , req , res , next) =>{
// // لما يحصل ايرور هيعمل دي 
//   res.status(400).send({error: error.message})
// })


// router.delete('/users/me/avatar/' ,auth  , async (req, res)=> {
//   req.user.avatar =  undefined
//   await req.user.save()
//   res.send() ;
// }, (error , req , res , next) =>{
// // لما يحصل ايرور هيعمل دي 
//   res.status(400).send({error: error.message})
// })


// router.get('/users/:id/avatar' , async(req,res) => {

//   const user = await User.findById(req.params.id) 
//   try {
//   if (!user || user.avatar === undefined)
//   {
//     throw new Error 
//   }
//   res.set('content-Type' , 'image/jpg')
//   res.send(user.avatar) 
//   }catch(e)
//   {
//     res.status(404).send() ; 
//   }
// })

module.exports = router;
