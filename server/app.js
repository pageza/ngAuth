const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

//Requiring the posts and users routes from the module containing the route logic
const postsRoutes = require('./routes/posts')
const usersRoutes = require('./routes/users')

//Instantiating the express server
const app = express();

//Setting the database connection info
mongoose.connect('mongodb+srv://admin:' + process.env.MONGO_PASS + '@cluster0.uvb3p.mongodb.net/ngAuth?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Connected to database')
  })
  .catch((err) => {
    console.log(process.env.MONGO_PASS ,err,' Connection failed')
  })

//Set the app to use body-parser to access the request body
app.use(bodyParser.json())

//Configuring express to allow access to the 'images' folder on the server to store uploaded images
app.use('/images', express.static(path.join(__dirname,'images')))
app.use('/', express.static(path.join(__dirname,'ngAuth')))

//Setting the request Headers to allow Front-end Server to talk to API Server
app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
})

//sending the app to respective routes
app.use('/api/posts', postsRoutes)
app.use('/api/users', usersRoutes)
app.use((req,res) => {
  res.sendFile(path.join(__dirname, 'ngAuth', 'index.html'))
})

module.exports = app;
