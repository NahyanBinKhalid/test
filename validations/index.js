const { check } = require('express-validator');
var userModel = require('../models/User');
const path = require('path');

const index = () => {
    return [];
}

const register = () => {
    return [
        check('name', 'Name must not be empty').isString().exists().notEmpty(),
        check('phone', 'Phone Name must not be empty. Phone Should be unique').isString().exists().notEmpty().custom(value => {
            return userModel.findOne({ phone: value } )
                .then(user => {
                    if(user) {
                        return Promise.reject('Phone already taken');
                    }
                })
        }),
        check('email', 'Email must not be empty. Email Should be unique').isEmail().normalizeEmail().notEmpty().exists().custom(value => {
            return userModel.findOne({ email: value} )
                .then(user => {
                    if(user) {
                        return Promise.reject('Email already taken');
                    }
                })
        }),
        check('old_password').isString().optional({required: false, checkFalsy: true}),
        check('password', 'Password Number must not be empty').isString().exists().notEmpty(),
        check('confirm', 'Password Confirmation field must have the same value as the password field').isString().exists().notEmpty()
            .custom((value, { req }) => value === req.body.password),
    ];
}

const login = () => {
    return [
        check('identity').isString().exists().notEmpty(),
        check('password').isString().exists().notEmpty(),
    ]
}

const profile = () => {
    return [
        check('name', 'Name must not be empty').isString().exists().notEmpty(),
        check('phone', 'Phone must not be empty').isString().exists().notEmpty(),
        check('old_password').isString().optional({required: false, checkFalsy: true}),
        check('password').isString().optional({required: false, checkFalsy: true}),
        check('confirm', 'Password Confirmation field must have the same value as the password field')
            .isString()
            .optional({required: false, checkFalsy: true})
            .custom((value, { req }) => value === req.body.password),
    ];
}

const avatar = () => {
    return [
        // Validate the avatar file
        check('avatar')
            .custom((value, { req }) => {
                if (!req.file) {
                    throw new Error('Avatar file is required');
                }
                const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
                if (!allowedMimeTypes.includes(req.file.mimetype)) {
                    throw new Error('Invalid file type for avatar (only JPG, JPEG, PNG, and GIF allowed)');
                }
                return true;
            }),
    ];
};

module.exports = {
    index,
    register,
    login,
    profile,
    avatar
};