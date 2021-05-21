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
        return new Promise((resolve, reject) => {
            var filled = isFilled();
            var validPassword = isValidPassword(field);
            var validConfirmPassword = isValidConfirmPassword(field);
            
            isValidEmail(field, function (validEmail) {
                console.log("Check NOW!");
                if(filled && validPassword && validConfirmPassword && validEmail) // valid input
                    resolve();
        
                else
                    reject(); // invalid input
            });
        });
    }
    // call validateField() everytime a key is pressed
    $('#register_email_input').keyup(function () {
        validateField($('#register_email_input'))
        .catch(_ => {return});
    });

    $('#register-form').submit(async function (e) {
        e.preventDefault();
        $('#register-submit').addClass("is-loading");

        await validateField($('#register_password_input'))
        .catch(_ => { // invalid input
            $('#register-submit').removeClass("is-loading");    
            console.log("INVALID Input!");
            return
        });

        await validateField($('#register_password_confirm_input'))
        .then(_ => { 
            let registerForm = document.getElementById('register-form');

            // Get register form values
            let emailInput = registerForm.elements['register_email_input'].value;
            let passInput = registerForm.elements['register_password_input'].value;
            let passConfirmInput = registerForm.elements['register_password_confirm_input'].value;
            
            // AJAX Call, check if login information is correct
            let xhttp = new XMLHttpRequest();

            xhttp.open('POST', '/register');

            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhttp.onload = () => {
                if (xhttp.responseText == "error") {
                    window.location.href = '/';
                    return
                }
                    
                window.location.href = '/chooseDeck';
            };
            
            xhttp.send("register_email_input=" + emailInput + "&register_password_input=" + passInput + "&register_password_confirm_input=" + passConfirmInput);    
        })
        .catch(_ => {
            $('#register-submit').removeClass("is-loading");    
            console.log("INVALID Input!");
            return
        });

        return false;
    });

});