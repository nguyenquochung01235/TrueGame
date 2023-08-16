const express = require('express');
const router = express.Router();

router.get('/',(req, res, next)=>{
    res.render('game/spin_game', {title: "Spine Game Page | TRUE GAME"});
});

module.exports = router;