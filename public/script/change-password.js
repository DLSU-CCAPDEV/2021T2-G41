$(document).ready(function () {

	function isFilled() {

        var old_password_input = validator.trim($('#old_password_input').val());
        var new_password_input = validator.trim($('#new_password_input').val());
        var new_password_confirm_input = validator.trim($('#new_password_confirm_input').val());

        var old_password_inputEmpty = validator.isEmpty(old_password_input);
        var new_password_inputEmpty = validator.isEmpty(new_password_input);
        var new_password_confirm_inputEmpty = validator.isEmpty(new_password_confirm_input);
        return !old_password_inputEmpty && !new_password_inputEmpty && !new_password_confirm_inputEmpty;
    }

    function isValidOldPassword(field) {
        var validPassword = false;
        var password = validator.trim($('#old_password_input').val());
        var isValidLength = validator.isLength(password, {min: 8});
    
        if(isValidLength) {
            if(field.is($('#old_password_input')))
                $('#old_password_input_error').text('');
            validPassword = true;
        }
        else {
            if(field.is($('#old_password_input')))
                $('#old_password_input_error').text(`Passwords should contain at least 8 characters.`);
        }
        return validPassword;
    }

    function isValidNewPassword(field) {
        var validPassword = false;
        var password = validator.trim($('#new_password_input').val());
        var old_password = validator.trim($('#old_password_input').val());
        var oldEqualsNew = validator.equals(password, old_password);
        var isValidLength = validator.isLength(password, {min: 8});
    
        if(isValidLength && !oldEqualsNew) {
            if(field.is($('#new_password_input')))
                $('#new_password_input_error').text('');
            validPassword = true;
        }
        else if(isValidLength && oldEqualsNew) {
            if(field.is($('#new_password_input')))
                $('#new_password_input_error').text('New password cannot be the same as old password.');
        }
        else{
            if(field.is($('#new_password_input')))
                $('#new_password_input_error').text(`Passwords should contain at least 8 characters.`);
        }
        return validPassword;
    }

    function isValidConfirmPassword(field) {
        var validConfirmPassword = false;
        var password = validator.trim($('#new_password_input').val());
        var confirmPassword = validator.trim($('#new_password_confirm_input').val());
        var isValidPassword = validator.equals(password, confirmPassword);

        if(isValidPassword) {
            if(field.is($('#new_password_confirm_input')))
                $('#new_password_confirm_input_error').text('');
                validConfirmPassword = true;
        }
        else {
            if(field.is($('#new_password_confirm_input')))
                $('#new_password_confirm_input_error').text(`Passwords do not match.`);
        }
        return validConfirmPassword;
    }

    function validateField(field) {
        var filled = isFilled();
        var validOldPassword = isValidOldPassword(field);
        var validNewPassword = isValidNewPassword(field);
        var validConfirmPassword = isValidConfirmPassword(field);
        
        if(filled && validOldPassword && validNewPassword && validConfirmPassword)
            $('#change_password_submit').prop('disabled', false);
    
        else
            $('#change_password_submit').prop('disabled', true);
    }

    $('#old_password_input').keyup(function () {
        validateField($('#old_password_input'));
    });

    $('#new_password_input').keyup(function () {
        validateField($('#new_password_input'));
    });

    $('#new_password_confirm_input').keyup(function () {
        validateField($('#new_password_confirm_input'));
    });

});