var flashcard = document.querySelector(".flashcard");
var passBtn = document.getElementById("pass-btn");
var failBtn = document.getElementById("fail-btn");

// Nodes for editing flashcard eleements
var frontWordNode = document.getElementById("front-word");
var backWordNode = document.getElementById("back-word");
var backDefinitionNode = document.getElementById("back-definition");

// Card data for study session (HARCODED for now)
var reviewCards = [
	{
		frontWord: "叶う",
		backWord: "Kanau",
		backDefinition: "[to come true (of a wish, prayer, etc.); to be realized; to be fulfilled]"
	},
	{
		frontWord: "開く",
		backWord: "Aku",
		backDefinition: "To open (a door etc.)"
	}];

// track current card being studied
var currentCardIndex = 0;
var maxCards = 2;

// Initialize review for first card, track if fadeIn or fadeOut
var isFadeIn = false;
frontWordNode.innerHTML = reviewCards[currentCardIndex].frontWord;
backWordNode.innerHTML = reviewCards[currentCardIndex].backWord;
backDefinitionNode.innerHTML = reviewCards[currentCardIndex].backDefinition;

flashcard.addEventListener('click', function() {
	flashcard.classList.toggle('flip');
})

flashcard.addEventListener('animationend', function() {
	if (isFadeIn) {
		flashcard.classList.remove("animate__fadeInRight");
		isFadeIn = false;
	}
});

passBtn.addEventListener('click', function() {
	if (currentCardIndex < maxCards - 1) {
		currentCardIndex += 1;
		frontWordNode.innerHTML = reviewCards[currentCardIndex].frontWord;
		backWordNode.innerHTML = reviewCards[currentCardIndex].backWord;
		backDefinitionNode.innerHTML = reviewCards[currentCardIndex].backDefinition;
		flashcard.classList.add("animate__fadeInRight");
		isFadeIn = true;
	}
	else {
		flashcard.classList.add("animate__fadeOutLeft");
	}
});