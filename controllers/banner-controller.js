const Banner = require('../models/banner-model');

const mongoose = require("mongoose");

const bannerController = {
    list:async(req,res) =>{
        try{
            const banners = await Banner.find()
            res.status(200).json({
                message:"Success",
                data: banners
            })
        }catch(err){
            res.status(400).json(err)
        }
    },
    getById:async(req,res) =>{
        try{
            const banner = await Banner.findById(req.params.id)
            if(!banner){
                return res.status(404).json({
                    message:"Banner Not Found!"
                });
            }
            return req.status(200).json({
                message:"Success",
                data: banner
            });
            
        }catch(err){
            res.status(400).json(err)
        }
    },
    create:async(req,res) =>{
        const {createBy} = req.body
        console.log(createBy)
        const newBanner = new Banner(req.body);
        newBanner.createdBy = mongoose.Types.ObjectId(createBy)
        try{
            const saveBanner = await newBanner.save();
            res.status(200).json(saveBanner);
        }catch(err){
            res.status(400).json({
                message:"Failed",
                error:err
            })
        }
    },
    update:async(req,res)=>{
        try{
            const banner = await Banner.findById(req.params.id);
            if(!banner){
                return res.status(404).send({
                    message:"Banner Not Found!"
                }); 
            }else{
                try{
                    const updateBanner = await Banner.findByIdAndUpdate(
                        req.params.id,
                        {
                            $set:req.body
                        },
                        {new:true}
                    );
                    res.status(200).json({
                        message:"Success",
                        data:updateBanner
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
    },
    delete:async(req,res)=>{
        try{
            const banner = await Banner.findById(req.params.id);
            if(!banner){
                return res.status(404).send({
                    message:"Banner Not Found!"
                }); 
            }else{
                try{
                    await banner.delete();
                    res.status(200).json({
                        message:"Success! Post has been deleted"                        
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

module.exports = bannerController