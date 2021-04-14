const express = require("express")
const router = express.Router()
let Article = require("../models/article")
let User = require("../models/user")
const { body, validationResult } = require("express-validator")
const flash = require("connect-flash")
const user = require("../models/user")
const multer=require("multer")
const path = require('path')

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render("addArticle", {
        title: "Add Article"
    })
})


router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {

        // const user = User.findById(article.author);
        // console.log(user)
        User.findById(article.author, (err, user) => {
            console.log(user)
            res.render("article", {
                article,
                author: user.name
            })
        })
    })
})

const ext=path.join(__dirname, '../public/uploads')

const storageName = multer.diskStorage({
    destination: (req, file, cb)=> {
  
        // Uploads is the Upload_folder_name
        cb(null,ext)
    },
    filename: (req, file, cb) =>{
      cb(null,Date.now()+"-"+file.originalname)
    }
  })

var upload = multer({ 
    storage: storageName,
    // dest:"public/uploads",
    fileFilter:  (req, file, cb)=>{
        console.log(file.originalname)
        // if (path.extname(file.originalname) !== '.pdf') {
            
        //     return cb(new Error('Only pdfs are allowed'))
        // }
        cb(null, true)

      } 
  
// // mypic is the name of file attribute
})  


// const upload = multer({storage:storageName})

router.post(
    '/add',
    upload.single("file"),
    body('title').notEmpty().withMessage("Title is required"),
    // body('author').notEmpty().withMessage("Author is required"),
    body('body').isLength({ min: 1 }).withMessage("Body is required"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.errors)
            res.render("addArticle", {
                title: "Add Article",
                errors: errors.errors
            })
        } else {
            // alert("Yes da")
            // let filename=null
            // upload.single("file")
            if(req.file)
            {
                filename=req.file.filename
            }
            else
            {
                filename=null
            }
            let article = new Article();
            article.title = req.body.title
            article.author = req.user._id
            article.body = req.body.body
            article.filename=filename
            
            console.log(req.file)
            console.log(req.body)

            // // res.send("File added successfully")
            article.save((err) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    req.flash('success', "Article Added")
                    res.redirect('/')
                }
            })
        }
    })

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if (article.author != req.user._id) {
            req.flash("danger", "Not Authenticated")
            res.redirect("/")
        } else {
            res.render("edit_article", {
                title: "Edit Article",
                article,
                authorName:req.user.name
            })
        }

    })
})

router.post('/edit/:id', (req, res) => {
    let article = {}
    article.title = req.body.title
    article.author = req.user._id
    article.body = req.body.body

    // let query = { _id: req.params.id }
    Article.findByIdAndUpdate(req.params.id, article, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', "Updated Successfully")
            res.redirect('/')
        }
    })
})


router.post('/editUpload/:id',upload.single("file"), (req, res) => {
    let article = {}
    if(req.file)
    {
        filename=req.file.filename
    }
    else
    {
        filename=null
    }
    article.title = req.body.title
    article.author = req.user._id
    article.body = req.body.body
    article.filename=filename

    // let query = { _id: req.params.id }
    Article.findByIdAndUpdate(req.params.id, article, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', "Updated Successfully")
            res.redirect('/')
        }
    })
})

router.delete('/:id', (req, res) => {

    if (!req.user._id) {
        res.status(500).send()
    }
    // let query = { _id: req.params.id }
    Article.findById(req.params.id, (err, article) => {
        if (article.author != req.user._id) {
            res.status(500).send()
        } else {
            Article.findByIdAndDelete(req.params.id, (err) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    res.send('Success')
                }
            })
        }
    })
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        req.flash("danger", "Please Login")
        res.redirect('/users/login')
    }
}

module.exports = router