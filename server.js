const connectDB = require('./config/connectDB');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middlewares/credentials');
const express = require('express');
const mongoose = require('mongoose');
const verifyJWT = require('./middlewares/verifyJWT');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5500;

connectDB();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));


// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// routes
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);

app.use('/manage-room', require('./routes/manageRoom'));
app.use('/university-exam', require('./routes/universityExam'));
app.use('/seat-allocation', require('./routes/seatAllocation'));

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => { console.log(`Server running on port ${PORT}...`) });
});