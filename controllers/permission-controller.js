const Permission = require('../models/permission-model')
const mongoose = require("mongoose");

const permissionController = {
    list:async(req,res) =>{
        try{
            
            const permissions = await Permission.find()
            if(!permissions){
                res.status(200).json({
                    message:"Success",
                    data: permissions
                })
            }else{
                res.status(200).json("No permissions have been created yet")
            }
        }catch(err){
            res.status(400).json(err)
        }
    },
    getById:async(req,res) =>{
        try{
            const permission = await Permission.findById(req.params.id)
            if(!permission){
                return res.status(404).json({
                    message:"Permission Not Found!"
                });
            }
            return req.status(200).json({
                message:"Success",
                data: permission
            });
            
        }catch(err){
            res.status(400).json(err)
        }
    },
    create:async(req,res) =>{
        const newPermission = new Permission(req.body);
        newPermission.createdBy = mongoose.Types.ObjectId(req.user.id)
        try{
            const newPermission = await newPermission.save();
            res.status(200).json({
                message:"Success",
                data:newPermission
            });
        }catch(err){
            res.status(400).json({
                message:"Failed",
                error:err
            })
        }
    },
    delete:async(req,res)=>{
        try{
            const permission = await Permission.findById(req.params.id);
            if(!permission){
                return res.status(404).send({
                    message:"Permission Not Found!"
                }); 
            }else{
                try{
                    await permission.delete();
                    res.status(200).json({
                        message:"Success! Permission has been deleted"                        
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

module.exports = permissionController