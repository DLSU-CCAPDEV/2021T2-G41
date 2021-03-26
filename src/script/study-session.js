var flashcard = document.querySelector(".flashcard");

flashcard.addEventListener("click", function(e) {
	flashcard.classList.toggle('flip');
})