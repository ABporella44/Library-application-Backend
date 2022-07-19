const express = require('express')
const router = express.Router();

const bcrypt = require('bcryptjs')
//const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const db = require('../index.js')
const userMiddleware = require('../Middlewares/users.js');
const userLoginMiddleware = require('../Middlewares/userValid.js');
const { ResultWithContext } = require('express-validator/src/chain/context-runner-impl.js');
const e = require('cors');

router.post('/sign-up', userMiddleware.validateRegister,(req,res,next)=>{
   db.query(`SELECT * FROM users WHERE LOWER(name) = LOWER(${db.escape(
    req.body.username
  )});`,(err,result)=>{
    if(result.length){
        return res.status(409).send({
            msg:'This username already in use'
        });
    }else{
      bcrypt.hash(req.body.password,10,(error,hash)=>{
        if(error){
            res.status(500).send({
                msg:error
            })
        }else{
            db.query(`insert into users(id,name,email,password) values('${req.body.id}','${req.body.username}','${req.body.email}','${hash}')`,(error,result)=>{
                  if(error){
                    return res.status(400).send({
                        msg:error
                    })
                  }else{
                     res.status(200).send({
                        msg:'Registered'
                     })   
                }
            });}
      })    
    }
  }) 
})

router.post('/login',userLoginMiddleware.validateLogin,(req,res,next)=>{
    db.query(`select * from users where name = '${req.body.username}'`,(error,result)=>{
        if(error){
            return res.status(400).send({
                msg:error
            })
        }
        if(!result.length){
            return res.status(400).send({
                msg:"User is not Registered!! Register before Login"
            })
        }
            bcrypt.compare(req.body.password,result[0]['password'],(pwdError,result)=>{
                
                if(pwdError){
                    return res.status(400).send({
                        msg:"username or password is incorrect First"
                    })
                }
                if(result){
                   const token = jwt.sign({
                    username:req.body.username,
                    userId:req.body.id
                   },
                   'SECRETKEY',
                   {
                    expiresIn:'5m'
                   });
                   return res.status(200).send({
                      msg:"LoggedIn",
                      token,
                      user:req.body.username
                   })
                }
                return res.status(400).send({
                    msg:"Please enter a valid UserName and Password"
                })
            })
    })
})

router.get('/secret-route',userMiddleware.isLoggedIn,(req, res, next) => {
    res.send('This is the secret content. Only logged in users can see that!');
  });

  router.post('/Orders',userMiddleware.isLoggedIn,(req, res, next) => {
    const elements = req.body
    const repeatedBooks = []
const findData = `select * from Orders WHERE (user,isbn) IN(${elements.map((item)=>`('${item.user}',${item.isbn})`)})`
db.query(findData,(error,data)=>{
   if(error){
    res.status(400).send(error)
   }
   for(let i=0;i<elements.length;i++){
       let bookInOrders = data.find((book)=>{return elements[i].isbn == book.isbn }) 
       if(bookInOrders){
        repeatedBooks.push(bookInOrders) 
       }
   }
if(repeatedBooks.length){
    res.status(400).json({
       message:"Books already placed for the above user!!!",
       repetedOrderedBooks:repeatedBooks
    })
  }else{
    console.log(elements)
   const statement = `insert into Orders (user,authors,isbn,categories,status,title) VALUES${elements.map((item)=>`('${item.user}',
   '${JSON.stringify(item.authors)}','${item.isbn}','${JSON.stringify(item.categories)}','${item.status}','${item.title}')`)}`
       db.query(statement, (error, data)=>{
           res.json({message:'success'})
       })
  }  
})

  });
  module.exports = router;