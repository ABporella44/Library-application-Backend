
const mysql = require("mysql")

var connection = mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'Anil@6202',
   database:'nodeApplication'
})

connection.connect((error)=>{
     if(error){
       console.log("Error while connection to DB")
     }else{
      console.log("Successfully connected to the Database")
     }
})

module.exports = connection;