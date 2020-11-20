// const fs = require('fs');
// const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
// const cors = require('cors');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const compression = require('compression');

const AppError = require('./api/utils/appError');
const globalErrorHandler = require('./api/controllers/errorController');

// const aboutRouter = require('./routes/aboutRoutes');
// const blogRouter = require('./routes/blogRoutes');
// const categoryRouter = require('./routes/categoryRoutes');
// const galleryRouter = require('./routes/galleryRoutes');
// const imageRouter = require('./routes/imageRoutes');
// const projectRouter = require('./routes/projectRoutes');
// const searchRouter = require('./routes/searchRouter');
// const tagRouter = require('./routes/tagRoutes');
// const userRouter = require('./routes/userRoutes');
// const subscriberRouter = require('./routes/subscriberRoutes');

const app = express();

// app.use(cors());
app.set('trust proxy', 'loopback');

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(`${__dirname}/public`));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.static(`${__dirname}/media`));

// Security BLOCK start//

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
    max: 60000,
    windowMs: 60 * 60 * 1000,
    message: 'To many request from this IP, Please try again in an hour!',
});

// only apply to requests that begin with /api/
app.use('/api/', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '250mb' }));
app.use(express.urlencoded({ extended: true, limit: '250mb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection {"email": {"$gt": ""}, "password": "12345678"}
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// preventing parameter pollution
app.use(
    hpp({
        whitelist: [
            'content',
            'sub_title',
            'ratingsQuantity',
            'ratingsAverage',
            'visibility',
            'hash_sort',
            'title',
            'type',
            'description',
        ],
    }),
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toString();
    // req.requestTime = new Date().toISOString();
    // console.log(req.requestTime);
    next();
});

// Routes

// app.use('/api/v1/about', aboutRouter);
// app.use('/api/v1/blogs', blogRouter);
// app.use('/api/v1/categories', categoryRouter);
// app.use('/api/v1/galleries', galleryRouter);
// app.use('/api/v1/images', imageRouter);
// app.use('/api/v1/projects', projectRouter);
// app.use('/api/v1/searches', searchRouter);
// app.use('/api/v1/tags', tagRouter);
// app.use('/api/v1/users', userRouter);
// app.use('/api/v1/subscribers', subscriberRouter);
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });

// error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
