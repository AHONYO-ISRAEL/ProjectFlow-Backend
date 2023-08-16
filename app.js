const express = require('express');
const cors = require('cors')
const path = require('path');
const app = express()



// MIDDLEWARE
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))


const Routes = require('./routes/router')
app.use('/api/', Routes)
app.use('/uploads/', express.static(path.join(__dirname, '/uploads')))

module.exports = app