const express = require('express');
const router = express.Router();

router.get('/',(req, res, next)=>{
    res.render('home_page', {title: "Home Page | TRUE GAME"});
});

module.exports = router;