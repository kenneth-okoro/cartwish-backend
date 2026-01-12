const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

userRouter.post('/', async (req, res) => {
    const { name, email, password, deliveryAddress} = req.body;
    const user = await User.findOne({ email: email});

    if (user) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword,
        deliveryAddress: deliveryAddress
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
});

module.exports = userRouter;