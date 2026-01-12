require('dotenv').config();
const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

const createUserSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    deliveryAddress: Joi.string().min(5).required()
});

userRouter.post('/', async (req, res) => {
    const { name, email, password, deliveryAddress} = req.body;
    const joiValidation = createUserSchema.validate(req.body);

    if (joiValidation.error) {
        return res.status(400).json({ message: joiValidation.error.details[0].message });
    }
    
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

    const token = jwt.sign(
        { _id: newUser._id, name: newUser.name},
        process.env.JWT_KEY,
        { expiresIn: '1h'}
    );

    res.status(201).json({ message: 'User created successfully', user: newUser, token: token });
});

module.exports = userRouter;