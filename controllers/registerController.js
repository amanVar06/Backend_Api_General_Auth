const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res.status(400).json({
      message: "Username and Password are required",
    });
  }

  //check for duplicate username in the database
  const duplicate = await User.findOne({ username: user }).exec();
  // you need to put exec when you use async await pattern

  if (duplicate) {
    return res.sendStatus(409); //Conflict
  }

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //create and store the new user all at once with mongoose
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });

    // another way to do the same thing
    // const newUser = new User({
    //   username: user,
    //   password: hashedPwd,
    // });
    // or const newUser = new User()
    // newUser.username = "..."
    //then
    // const result = await newUser.save();
    //__v is always added to document in mongoDB automatically
    // v refers to version key
    console.log(result);

    //status 201 new user has been created
    res.status(201).json({
      success: `New user ${user} created!`,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = { handleNewUser };
