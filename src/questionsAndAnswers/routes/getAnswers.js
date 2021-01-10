const router = require("express").Router();
const protect = require("../../auth/middlewares/protect");
const client = require("../../db");

router.get("/:id", protect, async(req, res) => {
    const profileId = req.params.id
  try {
      const data = (await client.query('SELECT * FROM questions WHERE reciever_id = $1 AND answer IS NOT NULL', [profileId])).rows
      res.status(200).json(data)
  } catch (error) {
    res.status(400).json(['error'])
  }
});

module.exports = router;
