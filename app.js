const express = require('express');
const bodyParser = require('body-parser');
const homeRoutes = require('./routes/home.router');
const spinRoutes = require('./routes/spin.router');
const voteRoutes = require('./routes/vote_admin.router');
const voteViewerRoutes = require('./routes/vote_viewer.router');
const voteExaminerRoutes = require('./routes/vote_examiner.router');
const database = require("./models");
// const WebSocketService = require("./services/realtime/realtime.service");



const app = express();

database.sequelize.sync();
// WebSocketService.initialize();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
    

app.use('/', homeRoutes);
app.use('/spin-game', spinRoutes);
app.use('/vote-game', voteRoutes);
app.use('/vote-game/examiner', voteExaminerRoutes);
app.use('/vote-game/viewer', voteViewerRoutes);


app.use(function(req, res, next) {
    res.render('page_not_found');

});


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


module.exports = app;