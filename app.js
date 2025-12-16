require('dotenv').config();

const express = require('express');
const expresslate = require('express-ejs-layouts');
const methodOverride = require('method-override');  
const connectDB = require('./server/config/db');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const {isActiveRoute} = require('./server/helpers/routeHelper'); 

const app = express();
const port = process.env.PORT || 9000;

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride());
app.locals.isActiveRoute = isActiveRoute;




app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    })
  })
);

app.use((req, res, next) => {
  res.locals.currentRoute = req.path;
  next();
});


app.use(express.static('public'));

// template engine
app.use(expresslate);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
