const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB =
    process.env.DB === 'dataLocale'
        ? process.env.DATABASE_LOCAL
        : process.env.DATABASE_FOREIGN.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        // console.log(con.connections);
        console.log(`connection to ${DB}`);
        console.log('DB connections successful!!!');
    });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}... as ${process.env.NODE_ENV}`);
});
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION!💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
