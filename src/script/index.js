const feature1 = document.querySelector(".feature1-container")
const feature2 = document.querySelector(".feature2-container")

const callback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains("feature1-container")) {
            entry.target.classList.add("animate__fadeInLeft")
            entry.target.style.visibility = "visible";
        }
        else if (entry.isIntersecting && entry.target.classList.contains("feature2-container")) {
            entry.target.classList.add("animate__fadeInRight")
            entry.target.style.visibility = "visible";
        };
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

var loginCloseBtn = document.getElementById("login-close-btn");
loginCloseBtn.addEventListener('click', function(){
    document.getElementById("login-modal").classList.remove("is-active");
});

var loginBtn = document.getElementById("login-button");
loginBtn.addEventListener('click', function() {
    document.getElementById("login-modal").classList.add("is-active");
    document.getElementById("login-card").classList.add("animate__fadeInDown");
});

var registerCloseBtn = document.getElementById("register-close-btn");
registerCloseBtn.addEventListener('click', function(){
    document.getElementById("register-modal").classList.remove("is-active");
});

var registerBtn = document.getElementById("register-button");
registerBtn.addEventListener('click', function() {
    document.getElementById("register-modal").classList.add("is-active");
    document.getElementById("register-card").classList.add("animate__fadeInDown");
});