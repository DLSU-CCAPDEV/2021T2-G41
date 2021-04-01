var meetTheTeamText = document.getElementById("meet-the-team");
var gabbyContainer = document.getElementById("gabby-container");
var adrianContainer = document.getElementById("adrian-container");

meetTheTeamText.addEventListener("animationend", function () {
    meetTheTeamText.classList.remove("animate__animated");
    meetTheTeamText.classList.remove("animate__fadeInUpBig");
    gabbyContainer.classList.remove("is-hidden");
    gabbyContainer.classList.add("animate__fadeInLeft");
})

gabbyContainer.addEventListener("animationend", function() {
    adrianContainer.classList.remove("is-hidden");
    adrianContainer.classList.add("animate__fadeInRight");
});