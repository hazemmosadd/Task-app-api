const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// middeleware is way to customize mongoose model
// نقدر نعمل بيها فنكشن تشتغل قبل م اي ايفنت يحصل
// first take the object of user to schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(email) {
        if (!validator.isEmail(email)) throw new Error("not valid email");
      },
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 0) throw new Error("age must be positive ");
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(password) {
        if (password.includes("password"))
          throw new Error("could not contain password");
      },
    },
    avatar : {
      type : Buffer , 
    } , 
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

//1 -  what happens before save
//Hash plain text before saving
userSchema.pre("save", async function (next) {
  // this refers to the document that we gonna save
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  // next tells us that we are end here
  next();
});

//will be method on the model (statics)
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    throw new Error("unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("unable to login");

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'bigsecret');
  user.tokens.push({ token });
  await user.save();
  return token;
};

// 11 AUTH , ده هيخلي اليوزر يتبعت في الريسبونس من غير ال باسورد و التوكين
// ارجع للفيديو في وقت تاني
// الفنكشن بتتنادى لوحدها
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  // delete userObject.password;
  // delete userObject.tokens;
  return userObject;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
