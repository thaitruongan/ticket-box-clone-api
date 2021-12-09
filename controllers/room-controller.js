const Room = require('../models/room-model')
const mongoose = require("mongoose");

const roomController = {
    list:async(req,res) =>{
        try{
            
            const rooms = await Room.find()
            res.status(200).json({
                message:"Success",
                data: rooms
            })
        }catch(err){
            res.status(400).json(err)
        }
    },
    getById:async(req,res) =>{
        try{
            const room = await Room.findById(req.params.id);
            if(!room){
                return res.status(404).json({
                    message:"Room Not Found!"
                });
            }
            return res.status(200).json({
                message:"Success",
                data: room
            });
            
        }catch(err){
            console.log(err)
            res.status(400).json(err)
        }
    },
    create:async(req,res) =>{
        const newRoom = new Room(req.body);
        newRoom.createdBy = mongoose.Types.ObjectId(req.body.createdBy)
        try{
            const saveRoom = await newRoom.save();
            res.status(200).json({
                message:"Success",
                data: saveRoom
            });
        }catch(err){
            res.status(400).json({
                message:"Failed",
                error:err
            })
        }
    },
    update:async(req,res)=>{
        try{
            const room = await Room.findById(req.params.id);
            if(!room){
                return res.status(404).send({
                    message:"Room Not Found!"
                }); 
            }else{
                const updateRoom = await Room.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set:req.body
                    },
                    {new:true}
                );
                res.status(200).json({
                    message:"Success",
                    data:updateRoom
                })
            }
        }catch(err){
            res.status(400).json({
                message:"Failed",
                error:err
            })
        }
    },
    delete:async(req,res)=>{
        try{
            const room = await Room.findById(req.params.id);
            if(!room){
                return res.status(404).send({
                    message:"Room Not Found!"
                }); 
            }else{
                try{
                    await room.delete();
                    res.status(200).json({
                        message:"Success! Room has been deleted"                        
                    })
                }catch(err){
                    res.status(500).json({
                        message:"Failed",
                        error:err
                    })
                }
            }
        }catch(err){
            res.status(400).json({
                message:"Failed",
                error:err
            })
        }
    }    
}

module.exports = roomController