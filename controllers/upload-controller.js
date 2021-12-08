const cloudinary = require('cloudinary')
const fs = require('fs')
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

let storage = multer.diskStorage({
    destination:(req,file, cb) =>{
        cb(null,"uploads/");
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}_${file.originalname}`)
    },
    fileFilter:(req,file,cb) =>{
        const ext = path.extname(file.originalname)
        if(ext !== '.jpg' && ext !== '.png' && ext !== '.webp'){
            return cb(res.status(400).end('Only jpg, png, mp4 is allowed'),false);
        }
        cb(null,true)
    }
});

const upload = multer({storage: storage}).single("file");

const uploadController = {
    upload: (req, res) => {
        try {
            const file = req.files.file;
            cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: 'image'
            }, async(err, result) => {
                if(err) throw err;

                removeTmp(file.tempFilePath)

                res.json({url: result.secure_url})
            })
        
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    uploadFile: (req, res) =>{
        upload(req,res,err => {
            if(err){
                return res.json({success:false,err});
            }
            console.log(res.req.file,"hihi")
            return res.json({success:true, url: res.req.file.path, fileName: res.req.file.filename})
        });
    },

}


// const removeTmp = (path) => {
//     fs.unlink(path, err => {
//         if(err) throw err
//     })
// }

module.exports = uploadController