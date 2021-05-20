const feature1 = document.querySelector(".feature1-container")
const feature2 = document.querySelector(".feature2-container")
const brandLogoHeader = document.getElementById("brand-logo");
const brandLogoMsg = document.getElementById("welcome-geisha-img");
var hasScrolledDown = false, hasScrolledUp = false;

const callback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains("feature1-container")) {
            entry.target.classList.add("animate__fadeInLeft");
            entry.target.style.visibility = "visible";
        }
        else if (entry.isIntersecting && entry.target.classList.contains("feature2-container")) {
            entry.target.classList.add("animate__fadeInRight");
            entry.target.style.visibility = "visible";
        }
        // scrolled down
        else if (!(entry.isIntersecting) && entry.target.id == "welcome-geisha-img") {
            hasScrolledUp = false;
            brandLogoHeader.classList.remove("is-hidden");
            brandLogoHeader.classList.remove("animate__fadeOutDown");
            brandLogoHeader.classList.add("animate__fadeInUp");
            hasScrolledDown = true;
        }
        else if (entry.isIntersecting && entry.target.id == "welcome-geisha-img") {
            brandLogoHeader.classList.remove("animate__fadeInUp");
            if (hasScrolledDown) {
                brandLogoHeader.classList.add("animate__fadeOutDown");
                hasScrolledUp = true;
            }
        }
    })
}

const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
}

const myObserver = new IntersectionObserver(callback, options);
myObserver.observe(feature1);
myObserver.observe(feature2);
myObserver.observe(brandLogoMsg);

var loginCloseBtn = document.getElementById("login-close-btn");
loginCloseBtn.addEventListener('click', function(){
    document.getElementById("login-modal").classList.remove("is-active");
    
    //remove textarea values
    document.getElementById("login_email_input").value = "";
    document.getElementById("login_password_input").value = "";
});

var loginBtn = document.getElementById("login-button");
loginBtn.addEventListener('click', function() {
    document.getElementById("login-modal").classList.add("is-active");
    document.getElementById("login-card").classList.add("animate__fadeInDown");
});

var registerCloseBtn = document.getElementById("register-close-btn");
registerCloseBtn.addEventListener('click', function(){
    document.getElementById("register-modal").classList.remove("is-active");

    //remove textarea values
    document.getElementById("register_email_input").value = "";
    document.getElementById("register_password_input").value = "";
    document.getElementById("register_password_confirm_input").value = "";
});

var registerBtn = document.getElementById("register-button");
registerBtn.addEventListener('click', function() {
    document.getElementById("register-modal").classList.add("is-active");
    document.getElementById("register-card").classList.add("animate__fadeInDown");
});

brandLogoHeader.addEventListener("animationend", function() {
    if (hasScrolledUp)
        brandLogoHeader.classList.add("is-hidden");
});