var flashcard = document.querySelector(".flashcard");
var deckName = document.getElementById('deck-name').innerText;
var btnContainer = document.getElementById('btn-container');
var passBtn = document.getElementById("pass-btn");
var failBtn = document.getElementById("fail-btn");
var finishMessages = document.getElementById('study-complete-msg-container');
var finishMessage1 = document.getElementById('msg-1');
var finishMessage2 = document.getElementById('msg-2');

// Nodes for editing flashcard eleements
var frontWordNode = document.getElementById("front-word");
var backWordNode = document.getElementById("back-word");
var backDefinitionNode = document.getElementById("back-definition");
var reviewCount = document.getElementById("review-count");

// Store cards for study
var cards;
var maxCards;
var currentCardIndex = 0;

// AJAX call to retrieve cards for review/new
function getFlashcards() {
	return new Promise((resolve, reject) => {
		let xhttp = new XMLHttpRequest();

		xhttp.open('GET', '/getStudyCards?deck=' + deckName, true);
	
		xhttp.onload = function () {
			console.log("GOT cards!");
			resolve(this.responseText);
		};
	
		xhttp.send();
	});
}

async function loadFlashcards() {
	cards = await getFlashcards();
	cards = JSON.parse(cards);
	console.log("Successfully loaded cards.");
	console.log(cards);

	maxCards = cards.newCards.length;

	// Initialize review for first card, track if fadeIn or fadeOut
	frontWordNode.innerHTML = cards.newCards[0].FrontWord;
	backWordNode.innerHTML = cards.newCards[0].FrontWord;
	backDefinitionNode.innerHTML = cards.newCards[0].BackWord;
	reviewCount.innerHTML = maxCards - currentCardIndex;
}

loadFlashcards();

var isFadeIn = false;
var hasFinishedStudying = false;

// flip event
flashcard.addEventListener('click', function() {
	flashcard.classList.toggle('flip');
})

flashcard.addEventListener('animationend', function() {
	if (isFadeIn) {
		flashcard.classList.remove("animate__fadeInRight");
		isFadeIn = false;
	}
	else if (hasFinishedStudying) {
		flashcard.classList.add('is-hidden');
		finishMessages.classList.remove('is-hidden');
		finishMessages.classList.add('animate__bounceIn');
	}
});

// pass button event, replace card content with next, fade in to next card
passBtn.addEventListener('click', function() {
	if (currentCardIndex < maxCards - 1) {
		flashcard.classList.remove('flip');
		currentCardIndex += 1;
		reviewCount.innerHTML = maxCards - currentCardIndex;
		cards.newCards.shift();
		frontWordNode.innerHTML = cards.newCards[0].FrontWord;
		backWordNode.innerHTML = cards.newCards[0].FrontWord;
		backDefinitionNode.innerHTML = cards.newCards[0].BackWord;
		flashcard.classList.add("animate__fadeInRight");
		isFadeIn = true;
	}
	else {
		flashcard.classList.add("animate__fadeOutLeft");
		btnContainer.classList.add('animate__fadeOutDown');
		hasFinishedStudying = true;
	}
});

/* 	fail button event, replace card content with next, move card to end of review, 
 	fade to next card */
failBtn.addEventListener('click', function() {
	cards.newCards.push(cards.newCards.shift());
	frontWordNode.innerHTML = cards.newCards[0].FrontWord;
	backWordNode.innerHTML = cards.newCards[0].FrontWord;
	backDefinitionNode.innerHTML = cards.newCards[0].BackWord;
	flashcard.classList.add("animate__fadeInRight");
	isFadeIn = true;
});