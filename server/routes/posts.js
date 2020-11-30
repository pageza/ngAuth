const express = require('express');
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid MIME type');
    if (isValid) {
      error = null;
    }
    cb(error, 'server/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype]
    cb(null, name + '-' + Date.now() + '.' + ext )
  }
})

router.post('',
  multer({storage: storage}).single('image'),
  (req,res) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added',
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  })

})

router.put('/:id',
  multer({storage: storage}).single('image'),
  (req,res) => {
  let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename
    }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({_id: req.params.id}, post )
    .then( () => {
      res.status(200).json({
        message: 'Updated Successfully'
      })
    })
})

router.get('',(req,res) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery.then(documents => {
    fetchedPosts = documents;
    return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully.',
        posts: fetchedPosts,
        maxPosts: count
      })
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
