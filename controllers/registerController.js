const bcrypt = require('bcrypt');
const User = require('../models/User');

const handleNewUser = async (req, res) => {
    const { user, email, pwd } = req.body;
    if (!user || !email || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    const duplicate = await User.findOne({ username: user }).exec();

    // checking for duplicate usernames
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const newUser = await User.create({ username: user, email, password: hashedPwd });
        console.log(newUser);
        res.status(201).json({ 'success': `New user ${newUser.username} created successfully.` });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };