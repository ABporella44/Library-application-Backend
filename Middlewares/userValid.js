const jwt = require("jsonwebtoken")

module.exports = {
    validateLogin:(req,res,next)=>{
      if(!req.body.username || req.body.username.length < 3){
        return res.status(400).send({
            msg:"Please enter a valid user name"
        })
      }

      if(!req.body.password || req.body.username.password < 3){
        return res.status(400).send({
            msg:"Please enter a valid password"
        })
      }
      next();
    }   
};