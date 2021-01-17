const multer = require("multer");
const router = require("express").Router();
const protect = require("./auth/middlewares/protect");
const fs = require("fs");
const uuidv4 = require("uuid").v4;
const tokenSender = require("./questionsAndAnswers/helpers/tokenSender");

const storage = multer.diskStorage({
  destination: "./images/",
  filename: (req, file, cb) => {
    const checkUserFolder = fs.existsSync(`./images/${req.user}`);
    if (!checkUserFolder) {
      fs.mkdir(`./images/${req.user}`, (err) => {
          if(err){console.log(err)}
      });
    }
    const newImageFolder = uuidv4();
    fs.mkdir(`./images/${req.user}/${newImageFolder}`, (err) => {
        if(err){console.log(err)}
    });
    cb(null, `./${req.user}/${newImageFolder}/${file.originalname}`);
  },
});

const upload = multer({
  storage,
}).single("image");

router.post("/", protect, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.status(400).json("Error uploading");
    } else {
        const payload = req.file.path 
      if (res.get("isrefreshed") === "true") {
        tokenSender(res, payload);
      } else {
        res.status(200).json({message: 'uploaded successfully', payload});
      }

    }
  });
});

module.exports = router;
