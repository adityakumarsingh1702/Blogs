const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Ensure template variable defaults so EJS never throws ReferenceError
router.use((req, res, next) => {
  res.locals.nextPage = null;
  next();
});

/**
 * GET /
 * HOME
 */
router.get('/', async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    };

    let perPage = 6;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage);

    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /post/:id
 */
router.get('/post/:id', async (req, res) => {
  try {
    const data = await Post.findById(req.params.id);

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    };

    res.render('post', {
      locals,
      data,
      currentRoute: '/post'
    });

  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /search
 */
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    };

    const searchTerm = req.body.searchTerm || '';
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, '');

    const data = await Post.find({
      $or: [
        { title: { $regex: searchNoSpecialChar, $options: 'i' } },
        { body: { $regex: searchNoSpecialChar, $options: 'i' } }
      ]
    });

    res.render('search', {
      locals,
      data,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /about
 */
router.get('/about', (req, res) => {
  res.render('about', {
    locals: {
      title: 'About',
      description: 'About page'
    },
    currentRoute: '/about'
  });
});

/**
 *  GET /contact  
 */
router.get('/contact', (req, res) => {
  res.render('contact', {
    locals: {
      title: 'Contact',
      description: 'Contact page',
      email: 'xyz@gmail.com',
      phone: '94xxxxxx20'
    }
  });
});


module.exports = router;
