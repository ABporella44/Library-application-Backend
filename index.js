
const mysql = require("mysql")

var connection = mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'Anil@6202',
   database:'nodeApplication'
})

connection.connect((error)=>{
     if(error){
       console.log("Hai I am in Dallas")
     }else{
      console.log("Successfully 45678")
     }
})

module.exports = connection;