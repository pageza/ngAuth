const express = require('express');
const Post = require('../models/post')

const router = express.Router();


router.post('', (req,res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(result => {
    res.status(201).json({
      message: 'Post added',
      postID: result._id
    });
  })

})

router.put('/:id', (req,res) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post )
    .then( result => {
      console.log(result);
      res.status(200).json({
        message: 'Updated Successfully'
      })
    })
})

router.get('',(req,res) => {
  Post.find()
    .then(posts => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: posts
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong fetching posts',
        error: err
      })
    })

})

router.get('/:id', (req,res) => {
  Post.findById(req.params.id)
    .then( post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: 'Post not found'
        });
      }
    })
})

router.delete('/:id', (req,res) => {
  Post.findByIdAndDelete({_id: req.params.id})
    .then(result => {
      console.log(result)
      res.status(200).json({
        message: 'Post deleted'
      })
    })
    .catch()

})


module.exports = router;
