const express = require("express")
var pug = require('pug');
const path = require('path')
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
var session = require('express-session')
const { body, validationResult } = require("express-validator")
const flash = require("connect-flash")
const config = require('./config/database')
const passport = require("passport")

mongoose.connect(config.database, {
    useNewUrlParser: true,
    useCreateIndex: true
})
let db = mongoose.connection

db.once('open', () => {
    console.log("Connected to db")
})

db.on('error', (err) => {
    console.log(err)
})

//Init app
const app = express()
const port = process.env.PORT || 3000
let Article = require("./models/article")

//Body Parser (Used to parse form data)
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

//Session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

//Express Messages
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// // Express Validator Middleware
// app.use(expressValidator({
//     errorFormatter: function(param, msg, value) {
//         var namespace = param.split('.'),
//             root = namespace.shift(),
//             formParam = root;

//         while (namespace.length) {
//             formParam += '[' + namespace.shift() + ']';
//         }
//         return {
//             param: formParam,
//             msg: msg,
//             value: value
//         };
//     }
// }));

//load view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', "pug")

require("./config/passport")(passport);

app.use(passport.initialize());
app.use(passport.session());

app.get("*", (req, res, next) => {
    res.locals.user = req.user || null;
    console.log(req.user)
    next();
})

//home route
app.get('/', (req, res) => {

    // let articles = [{
    //         id: 1,
    //         title: "Article 1",
    //         author: "Saferio",
    //         body: "This is article 1"

    //     },
    //     {
    //         id: 2,
    //         title: "Article 2",
    //         author: "John",
    //         body: "This is article 2"

    //     },
    //     {
    //         id: 3,
    //         title: "Article 3",
    //         author: "Pavi",
    //         body: "This is article 3"

    //     },
    //     {
    //         id: 4,
    //         title: "Article 4",
    //         author: "Niranjan",
    //         body: "This is article 4"

    //     },
    // ]
    Article.find({}, (err, articles) => {
        if (err) {
            console.log(err)
        } else {
            res.render("index", {
                title: "Articles",
                articles
            })
        }

    })

})



let articles = require("./routes/article")
let users = require("./routes/users")
app.use("/article", articles)
app.use("/users", users)

//start server
app.listen(port, () => {
    console.log("Server started in 3000")
})