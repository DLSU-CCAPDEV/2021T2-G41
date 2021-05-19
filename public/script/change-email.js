$(document).ready(function () {

	function isFilled() {

        var old_email = validator.trim($('#old_email_input').val());
        var new_email = validator.trim($('#new_email_input').val());
        var confirm_new_email = validator.trim($('#new_email_confirm_input').val());
        var password_input = validator.trim($('#password_input').val());
        
        var old_emailEmpty = validator.isEmpty(old_email);
        var new_emailEmpty = validator.isEmpty(new_email);
        var confirm_new_emailEmpty = validator.isEmpty(confirm_new_email);
        var password_inputEmpty = validator.isEmpty(password_input);

        return !old_emailEmpty && !new_emailEmpty && !confirm_new_emailEmpty && !password_inputEmpty;
    }

    function isValidOldEmail(field, callback) {
		var email = validator.trim($('#old_email_input').val());
        var isValidEmail_ = validator.isEmail(email);
        
        if(isValidEmail_) {
            $.get('/checkCurrentEmail', function (result) {
                if(result == email) {
                    if(field.is($('#old_email_input')))
						$('#old_email_input_error').text('');
                    return callback(true);
                }
                else {
                    if(field.is($('#old_email_input')))
						$('#old_email_input_error').text('This is not your current email.');
                    return callback(false);
				}
            });
        }
        else {
            if(field.is($('#old_email_input')))
				$('#old_email_input_error').text('Input should be a valid email.');
            return callback(false);
        }
    }

	function isValidNewEmail(field, callback) {
		var email = validator.trim($('#new_email_input').val());
        var old_email = validator.trim($('#old_email_input').val());
        var oldEqualsNew = validator.equals(email, old_email);
        var isValidEmail_ = validator.isEmail(email);

        if(isValidEmail_ && !oldEqualsNew) {
            $.get('/register-check', {Email: email}, function (result) {
                if(result.Email != email) {
                    if(field.is($('#new_email_input')))
						$('#new_email_input_error').text('');
                    return callback(true);
                }
                else {
                    if(field.is($('#new_email_input')))
						$('#new_email_input_error').text('Email already registered.');
                    return callback(false);
				}
            });
        }
    
        else if(isValidEmail_ && oldEqualsNew) {
            if(field.is($('#new_email_input')))
				$('#new_email_input_error').text('New email cannot be the same as old email.');	
            return callback(false);
        }
        else{
            if(field.is($('#new_email_input')))
				$('#new_email_input_error').text('Input should be a valid email.');	
            return callback(false);
        }
    }

    function isValidConfirmEmail(field) {
        var validConfirmEmail = false;
        var email = validator.trim($('#new_email_input').val());
        var confirmEmail = validator.trim($('#new_email_confirm_input').val());
        var isValidEmail = validator.equals(email, confirmEmail);

        if(isValidEmail) {
            if(field.is($('#new_email_confirm_input')))
                $('#new_email_confirm_input_error').text('');
                validConfirmEmail = true;
        }
        else {
            if(field.is($('#new_email_confirm_input')))
                $('#new_email_confirm_input_error').text(`Emails do not match.`);
        }
        return validConfirmEmail;
    }

    function isValidPassword(field) {
        var validPassword = false;
        var password = validator.trim($('#password_input').val());
        var isValidLength = validator.isLength(password, {min: 8});
    
        if(isValidLength) {
            if(field.is($('#password_input')))
                $('#password_input_error').text('');
            validPassword = true;
        }
        else {
            if(field.is($('#password_input')))
                $('#password_input_error').text(`Passwords should contain at least 8 characters.`);
        }
        return validPassword;
    }

	function validateField(field) {
        var filled = isFilled();
        var validPassword = isValidPassword(field);

        isValidOldEmail(field, function(validOldEmail) {
            isValidNewEmail(field, function (validNewEmail) {
                var validConfirmEmail = isValidConfirmEmail(field);

                if(filled && validOldEmail && validNewEmail && validConfirmEmail && validPassword)
                    $('#change_email_submit').prop('disabled', false);
                else
                    $('#change_email_submit').prop('disabled', true);
            });

        })
        
    }

    $('#old_email_input').keyup(function () {
        validateField($('#old_email_input'));
    });

	$('#new_email_input').keyup(function () {
        validateField($('#new_email_input'));
    });

    $('#new_email_confirm_input').keyup(function () {
        validateField($('#new_email_confirm_input'));
    });

    $('#password_input').keyup(function () {
        validateField($('#password_input'));
    });
});