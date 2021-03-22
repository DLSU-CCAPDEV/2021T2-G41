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