const express = require('express');
const routerUsers = express.Router();
const database= require("./database")
const sharp = require('sharp');


routerUsers.get("/", async(req,res)=>{

    database.connect()

    try{
        const user= await database.query("SELECT * FROM users where id=?", [req.infoInToken.userId])  
        database.disConnect()
        return res.send(user)

    }catch(error){
        database.disConnect()
        return res.send({error:error})
    }

})

routerUsers.put("/photo",(req,res)=>{

    let img = req.files.myImage

    if (img != null) {
        img.mv('public/images/' + req.infoInToken.userId.toString()+'.png', 
            function(err) {

                if (err) {
                    res.send("Error in upload picture");
                } else{
                    sharp('public/images/' + req.infoInToken.userId.toString()  +'.png')
                    .resize(309,309)
                    .toFile('public/images/' + req.infoInToken.userId.toString() +'avatar.png', (errMini, infoMini) => {
                        if (errMini) {
                            console.error(errMini);
                            res.send("Error in resize picture");
                        } else {
                            res.send({message:"done"});
                        }
                    })
                    
                }
            }
        )
    }
})

module.exports=routerUsers
