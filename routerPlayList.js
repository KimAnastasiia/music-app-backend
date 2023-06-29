const express = require('express');
const routerPlayList = express.Router();
const database= require("./database")


routerPlayList.get("/",async(req,res)=>{

    database.connect()

    try{
        const playList = await database.query("SELECT * FROM playlist WHERE userId=? ", [ req.infoInToken.userId])
        database.disConnect()
        return res.send(playList) 
    }catch(error){
        database.disConnect()
        return res.send({error:error})
    }

})



routerPlayList.post("/",async(req,res)=>{

    const song=req.body.song
    const urlImg=req.body.urlImg
    const price=req.body.price
    const releaseDate=req.body.releaseDate
    database.connect()

    try{
        await database.query("INSERT INTO playlist (song, userId, urlImg, price,  releaseDate) VALUES  (?, ?, ?, ?, ?) ", [song,  req.infoInToken.userId, urlImg, price, releaseDate])
        database.disConnect()
        return res.send({messege:"done"}) 
    }catch(error){
        database.disConnect()
        return res.send({error:error})
    }

})


routerPlayList.delete("/",async(req,res)=>{

    const songId=req.query.songId

    database.connect()

    try{
        await database.query("delete from playlist where id = ?", [songId])
        database.disConnect()
        return res.send({messege:"done"}) 
    }catch(error){
        database.disConnect()
        return res.send({error:error})
    }

})

module.exports=routerPlayList

