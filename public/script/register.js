$(document).ready(function () {
    //checks if every field is not empty
    function isFilled() {

        var register_email = validator.trim($('#register_email_input').val());
        var register_password = validator.trim($('#register_password_input').val());
        var register_password_confirm = validator.trim($('#register_password_confirm_input').val());
      
        var register_emailEmpty = validator.isEmpty(register_email);
        var register_passwordEmpty = validator.isEmpty(register_password);
        var register_password_confirmEmpty = validator.isEmpty(register_password_confirm);

        return !register_emailEmpty && !register_passwordEmpty && !register_password_confirmEmpty;
    }
    //checks if email is valid
    function isValidEmail(field, callback) {

        var register_email_ = validator.trim($('#register_email_input').val());
        var isValidEmail_ = validator.isEmail(register_email_);

        if(isValidEmail_) {
            $.get('/register-check', {Email: register_email_}, function (result) {
                if(result.Email != register_email_) {
                    if(field.is($('#register_email_input')))
                        $('#register_email_input_error').text('');
                    
                    return callback(true); 
    
                }
    
                else {
                    if(field.is($('#register_email_input')))
                        $('#register_email_input_error').text('Email already registered.');
                        return callback(false);
                    }
                });
            }
    
        else {
            if(field.is($('#register_email_input')))
                $('#register_email_input_error').text('Input should be a valid email.');
                return callback(false);
        }
    }
    //checks if password is valid (minimum of 8 characters)
    function isValidPassword(field) {

        var validPassword = false;
    
        var password = validator.trim($('#register_password_input').val());
        var isValidLength = validator.isLength(password, {min: 8});
    
        if(isValidLength) {
            if(field.is($('#register_password_input')))
                $('#register_password_input_error').text('');
            validPassword = true;
        }
    
        else {
            if(field.is($('#register_password_input')))
                $('#register_password_input_error').text(`Passwords should contain at least 8 characters.`);
        }
    
        return validPassword;
    }
    //checks if password inputs are the same
    function isValidConfirmPassword(field) {

        var validConfirmPassword = false;
        var password = validator.trim($('#register_password_input').val());
        var confirmPassword = validator.trim($('#register_password_confirm_input').val());
        var isValidPassword = validator.equals(password, confirmPassword);
        if(isValidPassword) {
            if(field.is($('#register_password_confirm_input')))
                $('#register_password_confirm_input_error').text('');
                validConfirmPassword = true;
        }
    
        else {
            if(field.is($('#register_password_confirm_input')))
                $('#register_password_confirm_input_error').text(`Passwords do not match.`);
        }
    
        return validConfirmPassword;
    }

    //calls isFilled(), isValidPassword(), isValidConfirmPassword(), and isValidEmail
    function validateField(field) {
    
        var filled = isFilled();
        var validPassword = isValidPassword(field);
        var validConfirmPassword = isValidConfirmPassword(field);
        
        isValidEmail(field, function (validEmail) {
            console.log("Check NOW!");
            if(filled && validPassword && validConfirmPassword && validEmail)
                $('#register-submit').prop('disabled', false);
    
            else
                $('#register-submit').prop('disabled', true);
        });
    }
    //call validateField() everytime a key is pressed
    $('#register_email_input').keyup(function () {
        validateField($('#register_email_input'));
    });

    $('#register_password_input').keyup(function () {
        validateField($('#register_password_input'));
    });

    $('#register_password_confirm_input').keyup(function () {
        validateField($('#register_password_confirm_input'));
    });
});