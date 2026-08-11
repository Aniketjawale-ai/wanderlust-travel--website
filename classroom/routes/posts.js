const express =require("express");
const router = express.Router();

//Posts
//index
router.get("/", (req, res)=>{
    res.send("GET for posts");
});
//show 
router.get("/:id", (req, res) =>{
    res.send("GET for post id");
});
//post

router.post("/", (req, res)=>{
    res.send("POST for posts");
});

//DELETE

router.delete("/:id",(req, res) =>{
    res.send("DELETE for post_id");
});

module.exports = router;
