const express = require('express')
const app = express()
const port = 4000
app.use(express.static('public'));
app.use(express.json())
var cors = require('cors')
app.use(cors())
const routerUsers = require('./routerUsers');
const objectOfApiKey = require('./objectApiKey');
const jwt = require("jsonwebtoken");
const routerPlayList = require('./routerPlayList');

// IMPORTANT for UPLOAD pictures
var fileUpload = require('express-fileupload');
const routerUsersPublic = require('./routerUsersPublic');
app.use(fileUpload());

app.use(["/playList", "/users"] ,async(req,res,next)=>{

    let apiKey = req.query.apiKey

    let obj = objectOfApiKey.find((obj)=>
      obj===apiKey
    )

    if(!obj){
        res.send({error:"error"})
        return
    }

    let infoInToken = jwt.verify(apiKey, "secret");
    req.infoInToken = infoInToken;

    next()
})

app.use("/users", routerUsers)
app.use("/playList", routerPlayList)
app.use("/public/users", routerUsersPublic)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})