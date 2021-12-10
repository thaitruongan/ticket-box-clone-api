const Seat = require('../models/seat-model')
const mongoose = require("mongoose");

class StringIdGenerator {
    constructor(chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
      this._chars = chars;
      this._nextId = [0];
    }
  
    next() {
      const r = [];
      for (const char of this._nextId) {
        r.unshift(this._chars[char]);
      }
      this._increment();
      return r.join('');
    }
  
    _increment() {
      for (let i = 0; i < this._nextId.length; i++) {
        const val = ++this._nextId[i];
        if (val >= this._chars.length) {
          this._nextId[i] = 0;
        } else {
          return;
        }
      }
      this._nextId.push(0);
    }
  
    *[Symbol.iterator]() {
      while (true) {
        yield this.next();
      }
    }
  }


const seatController = {
    list:async(req,res) =>{
        try{
            
            const seat = await Seat.aggregate([
                {
                    $lookup:{
                    from:"rooms",
                    localField:"roomId",
                    foreignField: "_id",
                    as:"room_info"
                }
                },{
                    $unwind:"$room_info",
                }
            ])
            res.status(200).json({
                message:"Success",
                data: seat
            })
        }catch(err){
            console.log(err)
            res.status(400).json(err)
        }
    },
    getById:async(req,res) =>{
        try{
            const seat = await Seat.findById(req.params.id)
            if(!seat){
                return res.status(404).json({
                    message:"Seat Not Found!"
                });
            }
            return res.status(200).json({
                message:"Success",
                data: seat
            });
            
        }catch(err){
            res.status(400).json(err)
        }
    },
    create:async(roomId,rowAmount,columnAmount,userId)=>{        
        try{
            const ids = new StringIdGenerator();
            for(let i = 0;i < rowAmount;i++){
                let increment = 0;
                let alphabet = ids.next();
                for(let j = 0; j < columnAmount;j++){
                    increment += 1;                    
                    const seats = new Seat({
                        row: alphabet,
                        column: increment,
                        roomId: mongoose.Types.ObjectId(roomId),
                        createBy:mongoose.Types.ObjectId(userId)
                    })
                    await seats.save()
                }
            }
            const seats = await Seat.find({ roomId: roomId });
            return Promise.resolve(seats);
        }catch(err){
            console.log(err);
            return Promise.reject(err);
        }

    },
    update:async(req,res)=>{
        try{
            const seat = await Seat.findById(req.params.id);
            if(!seat){
                return res.status(404).send({
                    message:"Seat Not Found!"
                }); 
            }else{
                const updateSeat = await Seat.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set:req.body
                    },
                    {new:true}
                );
                res.status(200).json({
                    message:"Success",
                    data:updateSeat
                })
            }
        }catch(err){
            res.status(400).json({
                message:"Failed",
                error:err
            })
        }
    },
    delete:async(roomId)=>{
        try{
            console.log(roomId)
            await Seat.remove({roomId: mongoose.Types.ObjectId(roomId)})            
        }catch(err){
            console.log(err)
        }
    }    
}

module.exports = seatController