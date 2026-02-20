const jwt = require("jsonwebtoken");
const { getParam } = require("../Utils/Token");

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = (req,res,next)=>{
  try {
     const {token} = req.params; 
  if(getParam(token)==process.env.SYSTEM_ADMIN_USERNAME){
    next();
  }
  } catch (error) {
    return res.json({success : false , message : error.message});
  }
 
}

module.exports = { protect , isAdmin };
