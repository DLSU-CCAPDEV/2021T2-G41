$(document).ready(function () {
    var loginForm = document.querySelector('#login-form');

    // login submit event
    loginForm.addEventListener('submit', (e) => {
        // Get login form values
        let emailInput = loginForm.elements['login_email_input'].value;
        let passInput = loginForm.elements['login_password_input'].value;

        // AJAX Call, check if login information is correct
        let xhttp = new XMLHttpRequest();

        xhttp.open('POST', '/login');

        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhttp.onload = () => {
            if (xhttp.responseText == "success") {
                window.location.href = "/decks";
                return;
            }
            if (xhttp.responseText == "invalidpassword") {
                $('#login_password_input_error').text('Password is incorrect.');
                return;
            }
            if (xhttp.responseText == "invalidemail") {
                $('#login_password_input_error').text('Email does not exist.');
                return;
            }

        };
        
        xhttp.send("login_email_input=" + emailInput + "&login_password_input=" + passInput);
    });

    //checks if every field is not empty
    function isFilled() {

        var login_email = validator.trim($('#login_email_input').val());
        var login_password = validator.trim($('#login_password_input').val());

        var login_emailEmpty = validator.isEmpty(login_email);
        var login_passwordEmpty = validator.isEmpty(login_password);

        return !login_emailEmpty && !login_passwordEmpty;
    }
    //checks if email is valid
    function isValidEmail(field, callback) {

        var login_email_ = validator.trim($('#login_email_input').val());
        var isValidEmail_ = validator.isEmail(login_email_);
        
        if(isValidEmail_) {
            if(field.is($('#login_email_input')))
                $('#login_email_input_error').text('');
            
            return callback(true);
        }
        else {
            if(field.is($('#login_email_input')))
                $('#login_email_input_error').text('Input should be a valid email.');
            
            return callback(false);
        }
    }
    //checks if password is valid (minimum of 8 characters)
    function isValidPassword(field) {

        var validPassword = false;
    
        var password = validator.trim($('#login_password_input').val());
        var isValidLength = validator.isLength(password, {min: 8});
    
        if(isValidLength) {
            if(field.is($('#login_password_input')))
                $('#login_password_input_error').text('');
            validPassword = true;
        }
    
        else {
            if(field.is($('#login_password_input')))
                $('#login_password_input_error').text(`Passwords should contain at least 8 characters.`);
        }
    
        return validPassword;
    }
    //calls isFilled(), isValidPassword(), and isValidEmail
    function validateField(field) {
    
        var filled = isFilled();
        var validPassword = isValidPassword(field);
        isValidEmail(field, function (validEmail) {
            if(filled && validPassword && validEmail)
                $('#login-submit').prop('disabled', false);
    
            else
                $('#login-submit').prop('disabled', true);
        });
    }
    //call validateField() everytime a key is pressed
    $('#login_email_input').keyup(function () {
        validateField($('#login_email_input'));
    });

    $('#login_password_input').keyup(function () {
        validateField($('#login_password_input'));
    });
});