const express = require("express")
const bcrypt = require("bcryptjs")
const router = express.Router()
let User = require("../models/user")
const { body, validationResult } = require("express-validator")
const flash = require("connect-flash")
const passport = require("passport")

router.get('/signup', (req, res) => {
    res.render("signUp", {
        title: "Sign Up"

    })
})

router.post(
    '/add',
    body('name')
    .isLength({ min: 1 })
    .withMessage('Name is required.'),
    body('email')
    .isLength({ min: 1 })
    .withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address'),
    body('username')
    .isLength({ min: 1 })
    .withMessage('Name is required.'),
    body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required.'),
    body('confirm_password')
    .isLength({ min: 1 })
    .withMessage('Confirm Password is required.')
    .custom((value, { req }) => {
        // console.log(value, req.body.password)
        if (value != req.body.password) {
            throw new Error('Password confirmation does not match password');
        }

        // Indicates the success of this synchronous custom validator
        return true;
    }),
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.errors)
            res.render("signUp", {
                title: "Sign Up",
                errors: errors.errors
            })
        } else {
            var user = new User();
            user.name = req.body.name
            user.email = req.body.email
            user.username = req.body.username
            user.password = await bcrypt.hash(req.body.password, 8)

            // bcrypt.genSalt(10, (err, salt) => {
            //     bcrypt.hash(user.password, salt, (err, hash) => {


            //         user.password = hash
            //     })
            // })
            await user.save((err) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    req.flash('success', "User Created")
                    res.redirect('/users/login')
                }
            })
        }
    })

router.get('/login', (req, res) => {
    res.render("login", {
        title: "Login"
    })
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})
router.get('/logout', (req, res) => {
    req.logout()
    req.flash("success", "You are successfully logged out")
    res.redirect('/users/login')
})


module.exports = router