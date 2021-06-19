const express= require('express');
var expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const app = express();

require('./middleweare/passport')(passport);
require('./config/dbconnection');
// EJS
 app.use(expressLayouts);
 app.set('view engine', 'ejs');
// body parser
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//require routes 
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

// setup require routes
app.use('/', indexRouter);
app.use('/users', userRouter);

// running port
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log('Server started on port '+PORT);
});