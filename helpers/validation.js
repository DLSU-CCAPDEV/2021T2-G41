
// import module `check` from `express-validator`
const { check } = require('express-validator');

const validation = {

    //for login validations
    loginValidation: function () {

        var validation = [

            // checks if email is valid
            check('login_email_input', 'Input should be a valid email.')
             .isEmail(),

            // checks if password contains at least 8 characters
            check('login_password_input', 'Passwords should contain at least 8 characters.')
                .isLength({min: 8})
        ];

        return validation;
    },

    //for register validations
    registerValidation: function () {

        var validation = [

            // checks if email is valid
            check('register_email_input', 'Input should be a valid email.')
                .isEmail(),

            // checks if password contains at least 8 characters
            check('register_password_input', 'Passwords should contain at least 8 characters.')
                .isLength({min: 8}),

            // checks if input passwords are the same
            check('register_password_confirm_input')
                .custom((value, {req}) => {
                    if(value !== req.body.register_password_input)
                        throw new Error('Passwords do not match.');

                    return value;
            })
                
        ];

        return validation;
    }
}

module.exports = validation;
