const express = require('express');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const db = require('../data/database');
const router = express.Router();

router.get('/', function (req, res) {
  res.redirect('/posts');
});

router.get('/posts', async function (req, res) {
  const posts = await db
    .getDb()
    .collection('posts')
    .find({})
    .project({ title: 1, summary: 1, 'author.name': 1 })
    .toArray();
  res.render('posts-list', { posts, posts });//posts is data which is stored under posts key
});

router.get('/new-post', async function (req, res) {
  const authors = await db.getDb().collection('authors').find().toArray();
  res.render('create-post', { authors, authors });
});

router.post('/posts', async function (req, res) {
  const authorId = new ObjectId(req.body.author);
  const author = await db.getDb().collection('authors').findOne({ _id: authorId });
  //authors collection ke sabhi documents mein se jiski id author_id jaisi hai

  const newPost = {
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
    date: req.body.content,
    date: new Date(),
    author: {
      id: authorId,      // id ko string ke bjaye objectid ke format mein store kia
      name: author.name,
      email: author.email
    }
  };
  const result = await db.getDb().collection('posts').insertOne({ newPost });
  console.log(result);
  res.redirect('/posts');
});

router.get('/posts/:id', async function (req, res) {
  const postId = req.params.id;
  const post = await db.getDb().collection('posts')
    .findOne({ _id: new ObjectId(postId) }, { summary: 0 });

  if (!post) {
    return res.status(404).render('404');
  }

  post.humanReadableDate = post.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  res.render('post-detail', { post: post });
});


module.exports = router;