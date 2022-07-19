const jwt = require("jsonwebtoken")

module.exports = {

    validateRegister:(req,res,next)=>{
      if(!req.body.username || req.body.username.length < 3){
        return res.status(400).send({
            msg:"please Enter a userName with min.3 Characters"
        });
      }
      if(!req.body.password || req.body.password.length < 6){
         return res.status(400).send({
            msg:"please enter a password with min of 6t characters"
         })
      }
      if (!req.body.password_repeat ||req.body.password != req.body.password_repeat) {
        return res.status(400).send({msg: 'Both passwords must match'});
    }
     next();
    },

    isLoggedIn:(req,res,next)=>{
      try{
        const token = req.headers.token;
        const decoded =jwt.verify(token,"SECRETKEY");
      if(req.userData = decoded){

      };
        next();
      }catch(err){
        return res.status(401).send({
          msg:"Your session is expired and Invalid Login"
        });
      }
    }
}