const fs = require('fs');

module.exports = async function(req, res, next) {
    try {
        if(!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({msg: "No files were uploaded."})
            
        const file = req.files.file;

        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/webp'){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "File format is incorrect."})
        }

        next()
    } catch (err) {
        console.log("hihi")
        return res.status(500).json({msg: err.message})
    }
}

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if(err) throw err
    })
}