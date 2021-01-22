const protect = require("../auth/middlewares/protect");

const router = require("express").Router();
const client = require("../db");

router.get("/:id", protect, async (req, res) => {
  try {
    const data = (await client.query(
      "SELECT user_image FROM users_data WHERE user_id = $1",
      [req.params.id]
    )).rows[0]
      if(data.user_image == null){
        data.user_image = ''
      } 
        res.status(200).json(data)
      
  } catch (error) {
      console.log(error);
      res.json(400).json('error')
  }
});

module.exports = router;
