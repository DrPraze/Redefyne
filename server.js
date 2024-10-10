const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

//------------ EJS Configuration ------------//
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/views'));

//------------ Bodyparser Configuration ------------//
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//------------ Express session Configuration ------------//
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//------------ Connecting flash ------------//
// app.use(flash());

//------------ Global variables ------------//
// app.use(function(req, res, next) {
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
//     res.locals.error = req.flash('error');
//     next();
// });

//------------ Routes ------------//
app.use('/', require('./routes/index'));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on 127.0.0.1:${PORT}`);
});
