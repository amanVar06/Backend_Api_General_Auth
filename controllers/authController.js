const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res.status(400).json({
      message: "Username and Password are required",
    });
  }

  const foundUser = await User.findOne({ username: user }).exec();

  if (!foundUser) {
    return res.sendStatus(401); //Unauthorized
  }

  //evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);

  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean);
    //create JWTs
    //changing payload of our JWTs because we want to send the information
    //of roles in the access Token
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "75s" }
      //time in s(seconds), days(d) or hours(h)
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    //Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None", //see video for its explanation 57:00:00
      //cookie is always sent with every request
      //not available to javascript with httpOnly
      //much more secure than storing your refresh token in the local storage or another cookie that is available to javascript
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true, - only use this with https/ chrome/ production purposes only not while testing with thunder client
      // dont use for testing purpose in thunder client cookies not working with secure: true in thunder client
      //also check in logoutController.js
    });

    res.json({
      roles,
      accessToken,
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  handleLogin,
};
