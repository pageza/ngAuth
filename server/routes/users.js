const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const router = express.Router();

router.post('/signup', (req,res) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then( result => {
          res.status(201).json({
            message: 'User created',
            result: result
          });
        })
        .catch(() => {
          res.status(500).json({
              message: 'Invalid authentication credentials'
          });
        });
    });
});

router.post('/login', (req,res) => {
  let fetchedUser;
  User.findOne({ email: req.body.email})
    .then( user => {
      if (!user) {
        return res.status(401 ).json({
          message: 'Not an authorized user'
        })
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Not an authorized user'
        });
      }
      const token = jwt.sign(
        {email: fetchedUser.email, userID: fetchedUser._id},
        'ThisShouldBeVerySecret',
        {expiresIn: '1hr'}
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userID: fetchedUser._id
      })
    })
    .catch( () => {
      return res.status(401 ).json({
        message: 'Invalid email and password combination',
      })
    })
});

module.exports = router;
