const Room = require('../models/room-model')
const mongoose = require("mongoose");
const seatController = require("./seat-controller")

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
        req.body.createBy = req.user.id;
        const newRoom = new Room(req.body);
        try{
            const saveRoom = await newRoom.save();
            const seats = await seatController.create(
                newRoom._id,
                newRoom.rowAmount,
                newRoom.columnAmount,
                req.user.id
              )
            res.status(200).json({
                message:"Success",
                data: {
                    saveRoom:saveRoom,
                    seats:seats
                }
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
                await seatController.delete(req.params.id)                
                await room.delete();
                res.status(200).json({
                    message:"Success! Room has been deleted"                        
                })
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