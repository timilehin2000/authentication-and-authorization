const jwt = require("jsonwebtoken");
const User = require("../model/user");

//const auth = async (req, res, next) => {
//   if (req.headers["x-access-token"] || req.headers.authorization) {
//     const token =
//       (await req.headers["x-access-token"]) ||
//       (await req.headers.authorization.replace("Bearer ", ""));

//     console.log(token);

//     try {
//       const data = await jwt.verify(token, process.env.TOKEN);
//       // const user = await User.findOne({ token: token });

//       console.log(data);
//       if (!user()) {
//         throw new Error();
//       }

//       req.user = user;
//       req.token = token;
//       next();
//     } catch (err) {
//       res.status(401).send("Not authorized to access this route");
//     }
//   } else {
//     return res.status(403).send("FORBIDDEN");
//   }
// };

const auth = async (req, res, next) => {
  const token = await req.header("auth-token");
  if (!token) res.status(403).send("Access denied");

  try {
    const verifiedUser = jwt.verify(token, process.env.TOKEN);
    // console.log(verifiedUser);
    req.user = verifiedUser;

    next();
  } catch (err) {
    console.log(err);
  }
};
module.exports = auth;
