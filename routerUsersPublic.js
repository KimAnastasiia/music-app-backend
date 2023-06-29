const express = require('express');
const crypto = require('crypto');
const routerUsersPublic = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
const database= require("./database")
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");


routerUsersPublic.post("/verification", async(req,res)=>{

    let password = req.body.password
    let uniqueName =  req.body.uniqueName
    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');

    database.connect()

    try{
        const user= await database.query("SELECT * FROM users where uniqueName=? and password=?", [uniqueName, passwordEncript])   
        if(user.length>=1){
            let apiKey = jwt.sign(
                { 
                    name: uniqueName,
                    userId: user[0].id

                },
                "secret");

            objectOfApiKey.push(apiKey)
            database.disConnect()
            return res.send(
            {
                apiKey: apiKey,
                name: user[0].uniqueName, 
                userId: user[0].id
            })
                
        }else if(user.length==0){
            database.disConnect()
            return res.send(
            {
                messege:"Incorrect password or uniqueName"
            })
        }
    }catch(error){
        database.disConnect()
        return res.send({error:error})
    }

})


routerUsersPublic.post("/",async(req,res)=>{

    let password = req.body.password
    let uniqueName =  req.body.uniqueName
    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
    
    database.connect()

    try{
        await database.query("INSERT INTO users (uniqueName, password) VALUES  (?, ?) ", [uniqueName,  passwordEncript])
        const user= await database.query("SELECT * FROM users where uniqueName=? and password=?", [uniqueName, passwordEncript])   
        if(user.length>=1){
        
            let apiKey = jwt.sign(
                { 
                    name: uniqueName,
                    userId: user[0].id

                },
                "secret");

            objectOfApiKey.push(apiKey)
            database.disConnect()
            return res.send(
            {
                apiKey: apiKey,
                name: user[0].uniqueName, 
                userId: user[0].id
            })
                
        }  
        database.disConnect()
        return res.send({messege:"done"}) 
    }catch(error){
        database.disConnect()
        return res.send({error:error})
    }
    
     
})

module.exports=routerUsersPublic
