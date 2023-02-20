const asyncHandler = require('express-async-handler');
const fs = require('fs');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
const Image = require('../models/Image');


const getFiles = asyncHandler(async (req, res) => {
    const user = req.user;
    const imageUserId = await Image.find({ userid: user._id }) //.filter(x => x.userid == user._id)

    res.json(imageUserId);

})


const fileUpload = (asyncHandler(async (req, res) => {
    // console.log(appDir);
    if (req.files) {

        var path = appDir + "/files/";

        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }

        // console.log(req.user.username + " feltöltött");


        for (prop in req.files) {
            var userPath = path + req.user.username + '/';

            if (!fs.existsSync(userPath)) {
                fs.mkdirSync(userPath, { recursive: true }, err => err && console.log(err));
            }
            // console.log(userPath);
            fs.writeFile(userPath + req.files[prop].name, req.files[prop].data, err => { err && console.log(err) });
            try {
                const newImg = await Image.create({
                    userid: req.user._id,
                    imageName: req.files[prop].name
                })
            } catch (err) {
                throw new Error(`Már van ${req.files[prop].name} nevű fájl!`)
            }
        }

    }
    // res.send("<h2>Feltöltés</h2>")
    res.json({ message: "Feltöltés kész!" });
})
);



module.exports = {
    getFiles,
    fileUpload
}