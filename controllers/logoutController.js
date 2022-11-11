const User = require("../model/User");
//removing refresh token and access token when user logout

const handleLogout = async (req, res) => {
  //On client can also delete the access token

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    //optional chaining operator
    return res.sendStatus(204);
    // 204 means Success but No content to send back
  }
  const refreshToken = cookies.jwt;

  //is refresh token in database?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    //erase the cookie that we have sent
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None" }); // secure: true, - only use this with https/ chrome/ production purposes only not while testing with thunder client
    return res.sendStatus(204);
  }

  //delete the refresh token from the database
  foundUser.refreshToken = ""; //found user is document now
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None" }); // secure: true, - only use this with https/ chrome/ production purposes only not while testing with thunder client
  //we can also sent a maxAge option
  //maxAge: 24*60*60*1000
  res.sendStatus(204);
};

module.exports = {
  handleLogout,
};
