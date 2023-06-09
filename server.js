const express = require('express');
const app = express()
const PORT = process.env.PORT || 8000
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');
const { urlencoded } = require('body-parser');
const homeRoute = require('./routes/home')
const userRoute = require('./routes/user')

//config
dotenv.config()

app.use(urlencoded({ extended: false }))

//cookie parser
app.use(cookieparser())

app.set('view engine', 'ejs')

//db connection
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then((connect) => {
    console.log('Connected to db')
})
.catch((err) => {
    console.log(err)
})

//routes
app.use('/', homeRoute)
app.use('/user', userRoute)

app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`)
})