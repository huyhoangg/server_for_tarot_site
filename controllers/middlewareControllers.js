const jwt = require("jsonwebtoken");

const middlewareControllers = {
  verifyToken: (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json("you are not authenticated");
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, user) => {
      if (error) {
        return res.status(403).json("token not valid");
      }
      req.user = user;
      next();
    });
  },

  verifyAdminToken: (req, res, next) => {
    middlewareControllers.verifyToken(req, res, ()=>{
      if (req.user.admin) {
        next();
      }
      else {
        res.status(403).json("you are not admin !")
      }
    })
  },
};

module.exports = middlewareControllers;
