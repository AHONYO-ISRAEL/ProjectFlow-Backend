const express = require('express');
const cors = require('cors')
const app = express()





// MIDDLEWARE
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))


const Routes = require('./routes/router')
app.use('/api/', Routes)


module.exports = app