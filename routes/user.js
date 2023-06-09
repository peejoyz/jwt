const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    //handling validation error in form
    const errors = []
    const { name, email, password, password2 } = req.body
    if(!name || !email || !password || !password2) {
        errors.push({ msg: "All fields are required" })
        console.log("All fields are required")
    }

    //email validation
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9]+)*$/;

    //Email validation
    if(!email.match(validRegex)) {
        errors.push({message: 'Invalid Email'})
        console.log('Invalid email')
    }
    //password length
    if(password.length < 0) {
        errors.push({ msg: "Password length must be min 0" })
        console.log("Password length must be min 0") 
    }

    //match
    if(password !== password2) {
        errors.push({ msg: "Password doesn't match" })
        console.log("Password doesn't match") 
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email, 
            password,
            password2
        })
    } else {
       //check if user already exists(registered) 
       User.findOne({ email: email })
        .then((user) => {
            if(user) {
                errors.push({ msg: "User already exist"})
                console.log('User already exist')
                res.render('register')
            }
            else {
                //create new user
                const user = new User({
                    name,
                    email, 
                    password
                })
                //hashing the password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        user.password = hash
                        user.save()
                        .then((user) => {
                            console.log('User created')
                            res.redirect('/user/login')
                        })
                        .catch((err) => {
                            res.redirect('/user/register')
                        })
                    })
                })
            }
        })
        .catch((err) => {
            res.render('register')
        })
    }
})

//sign the token
const createToken = (id) => {
    return jwt.sign({ id }, "secretkey")
}

router.post('/login', (req, res) => {
    const { email, password } = req.body
    //check email
    User.findOne({ email: email })
    .then((user) => {
        //if user exists check password
        if(user){
            bcrypt.compare(password, user.password, (err, isMacth) => {
               if(isMacth) {
                //generate token
                const token = createToken(user._id)
                //store the jwt in cookie
                res.cookie("access-token", token)
                // console.log(token);
                res.redirect('/dashboard')
               } 
               else {
                // res.redirect('/user/login')
                res.render('login')
               } 
            })
        }
        else {
            // res.redirect('/user/login')
            res.render('login')
        }
    })
})

router.get('/logout', (req, res) => {
    res.cookie("access-token", " ", { maxAge : 1 })
    res.redirect('/user/login')
})

module.exports = router