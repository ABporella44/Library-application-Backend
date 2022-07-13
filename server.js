const fs = require("fs")
const http = require("http")
const url = require("url")
const express = require("express")
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express()

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

const router = require("./routes/router")
app.use('/api',router)

app.get("/",(req,res)=>{
   res.end("Welcome to the world my server")
})

app.listen(3002,()=>{
    console.log("Server is running on 3000")
})