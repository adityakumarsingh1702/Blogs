const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { get } = require('mongoose');
const jwtSecret = process.env.JWT_SECRET;


// Check Login

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthoried' });
  }
}



/**
 * GET /admin
 */
router.get('/admin', (req, res) => {
  const locals = {
    title: "Admin",
    description: "Simple Blog created with NodeJs, Express & MongoDb."
  };

  res.render('admin/index', {
    locals,
    layout: 'layouts/admin'
  });
});

/**
 * POST /
 * Admin - Check Login
*/
router.post('/admin', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard');

  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});


// GET
// Admin dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    };

    const data = await Post.find({});
    res.render('admin/dashboard', { locals, data, layout: 'layouts/admin' });

  } catch (error) {
    console.log(error);

  }
});




// GET
// Admin - create new post 
router.get('/add-post', async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    };

    const data = await Post.find({});
    res.render('admin/add-post', { locals, layout: 'layouts/admin' });

  } catch (error) {
    console.log(error);

  }
});



// GET
// Admin - create new pos 


router.post('/add-post', async (req, res) => {
  try {
   
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
        author: req.body.author
      })
      await Post.create(newPost);
      res.redirect('/dashboard');
    } catch (err) {
      console.log(err);
    }
  } catch (error) {
    console.log(error);
  }
});


// GET
// Admin - create new post 
router.get('/edit-post/:id', async (req, res) => {
  try {
    const local ={
      title: "Edit Post",
      description: "free NodeJs User management System"
    }
   
    const data = await Post.findOne({ _id: req.params.id });
   res.render('admin/edit-post', {local, data, layout: 'layouts/admin' });
  } catch (error) {
    console.log(error);

  }
});


// PUT
// Admin - create new post 
router.put('/edit-post/:id', async (req, res) => {
  try {
   
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now()
    });
    res.redirect('/edit-post/' + req.params.id);
  } catch (error) {
    console.log(error);

  }
});

/**
 * Delete /
 * Admin - Delete Post
*/

router.delete('/delete-post/:id', async (req, res) => {
 try{
  await Post.deleteOne({_id: req.params.id});
  res.redirect('/dashboard');
 }catch(err){
  console.log(err);
 }
});



/**
 * Post /
 * Admin - Register
*/

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username.toLowerCase(),
      password: hashedPassword
    });

    res.status(201).json({ message: 'User created' });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'User already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});



/**
 * GET /
 * Admin - Logout
*/
router.get('/logout', (req, res) => {
res.clearCookie('token');
res.redirect('/admin');


});


module.exports = router;
