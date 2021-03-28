var flashcard = document.querySelector(".flashcard");
var passBtn = document.getElementById("pass-btn");
var failBtn = document.getElementById("fail-btn");

// Nodes for editing flashcard eleements
var frontWordNode = document.getElementById("front-word");
var backWordNode = document.getElementById("back-word");
var backDefinitionNode = document.getElementById("back-definition");

// Card data for study session (hardcoded for now)
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

// Initialize review for first card
frontWordNode.innerHTML = reviewCards[currentCardIndex].frontWord;
backWordNode.innerHTML = reviewCards[currentCardIndex].backWord;
backDefinitionNode.innerHTML = reviewCards[currentCardIndex].backDefinition;

flashcard.addEventListener('click', function() {
	flashcard.classList.toggle('flip');
})

flashcard.addEventListener('click', function() {
	flashcard.classList.remove("animate__fadeInRight");
});

passBtn.addEventListener('click', function() {
	if (currentCardIndex < maxCards - 1) {
		flashcard.classList.add("animate__fadeInRight");
		currentCardIndex += 1;
		frontWordNode.innerHTML = reviewCards[currentCardIndex].frontWord;
		backWordNode.innerHTML = reviewCards[currentCardIndex].backWord;
		backDefinitionNode.innerHTML = reviewCards[currentCardIndex].backDefinition;
	}
	else {
		flashcard.classList.add("animate__fadeOutLeft");
	}
});