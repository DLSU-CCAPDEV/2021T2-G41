var changeEmailBtn = document.getElementById('change-email-btn');
changeEmailBtn.addEventListener('click', function() {
	document.getElementById('change-email-modal').classList.add('is-active');
});

var emailModalClose = document.getElementById('email-close-btn');
emailModalClose.addEventListener('click', function() {
	document.getElementById('change-email-modal').classList.remove('is-active');
})


var changePasswordBtn = document.getElementById('change-password-btn');
changePasswordBtn.addEventListener('click', function() {
	document.getElementById('change-password-modal').classList.add('is-active');
});

var passwordModalClose = document.getElementById('password-close-btn');
passwordModalClose.addEventListener('click', function() {
	document.getElementById('change-password-modal').classList.remove('is-active');
})