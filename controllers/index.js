var userModel = require('../models/User');
const { validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var randonString = require('../helpers/random_string');

const index = async (req, res, next) => {
    res.status(200).json({
        error: false,
        message: 'Welcome to Test APIs on Port: ' + process.env.PORT,
        data: null
    });
};

const register = async (req, res, next) => {
    try {
        var errors = validationResult(req);
        if(errors.errors.length > 0) {
            validationResult(req).throw();
        }
        
        const { _id, name, email, phone } = req.body;
        const password = await bcrypt.hash(req.body.password, 10);
        var user = new userModel({ name, email, phone, password, avatar });

        await user.save();

        // Create token
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            process.env.TOKEN_KEY
        );

        // save user token
        user.token = token;
        await user.save();

        res.status(200).json({
            error: false,
            message: 'User Registered Successfully',
            data: user
        });
    } catch (exception) {
        console.log('excep', exception)
        return res.status(422).json({
            error: true,
            message: (process.env.ENV === 'local') ? exception.message : "Something Went Wrong",
            data: exception
        });
    }
};

const login = async (req, res, next) => {
    try {
        validationResult(req).throw();

        const { identity, password } = req.body;
        const user = await userModel.findOne({email: identity}).select('name email phone password avatar active')

        if (user && await user.isValidPassword(password)) {
            if(user.active) {
                // Create token
                const token = jwt.sign(
                    {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        active: user.active
                    },
                    process.env.TOKEN_KEY
                );

                // save user token
                user.token = token;
                await user.save();

                res.status(200).json({
                    error: false,
                    message: 'User Logged in Successfully',
                    data: user
                });
            } else {
                res.status(200).json({
                    error: true,
                    message: 'User Unapproved. Wait for the Administrator to activate your account.',
                    data: null
                });
            }
        } else {
            res.status(200).json({
                error: true,
                message: 'Incorrect Credentials',
                data: null
            });
        }
    } catch (exception) {
        return res.status(422).json({
            error: true,
            message: (process.env.ENV === 'local') ? exception.message : "Something Went Wrong",
            data: null
        });
    }

};

const profile = async (req, res, next) => {
    const user = await userModel.findOne({ _id: req.user.id }).select('name phone email avatar active');
    res.status(200).json({
        error: false,
        message: 'User Profile',
        data: user
    });
};

const updateProfile = async (req, res, next) => {
    const user = await userModel.findOne({ _id: req.user.id }).select('name email phone password avatar active');
    const { _id, name, phone, old_password, password, confirm  } = req.body;

    try {
        if (user) {
            // save user token
            user.name = name;
            user.phone = phone;
            await user.save();
            if(old_password != undefined && password != undefined && confirm != undefined)
            {
                if(await user.isValidPassword(old_password) && password === confirm) {
                    const newPassword = await bcrypt.hash(req.body.password, 10);
                    user.password = newPassword;
                    await user.save();
                }
            }
            res.status(200).json({
                error: false,
                message: 'Profile Updated',
                data: user
            });
        } else {
            res.status(200).json({
                error: true,
                message: 'Incorrect Credentials',
                data: null
            });
        }
    } catch (exception) {
        return res.status(422).json({
            error: true,
            message: (process.env.ENV === 'local') ? exception.message : "Something Went Wrong",
            data: null
        });
    }
}

const avatar = async (req, res, next) => {
    const user = await userModel.findOne({ _id: req.user.id }).select('name email phone password avatar active');
    try {
        if (user) {
            user.avatar = req.file.path;
            await user.save();
            res.status(200).json({
                error: false,
                message: 'Avatar Updated',
                data: user
            });
        } else {
            res.status(200).json({
                error: true,
                message: 'Incorrect Credentials',
                data: null
            });
        }
    } catch (exception) {
        return res.status(422).json({
            error: true,
            message: (process.env.ENV === 'local') ? exception.message : "Something Went Wrong",
            data: null
        });
    }
}

module.exports = {
    index,
    register,
    login,
    profile,
    updateProfile,
    avatar
};

