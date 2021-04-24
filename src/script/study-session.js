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

// track
var maxCards;
var currentCardSelection = undefined; // select review/new
var currentCardIndex = 0;

// AJAX call to retrieve cards for review/new, return Promise
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

	// Initialize review for first card
	if (cards.reviewCards.length == 0) { // No cards due for review
		maxCards = cards.newCards.length;
		currentCardSelection = cards.newCards;
		console.log("NO cards due for review.");
	} else if (cards.newCards.length == 0 && cards.reviewCards.length == 0) { // Zero cards
		flashcard.classList.add('is-hidden');
		finishMessages.classList.remove('is-hidden');
		finishMessages.classList.add('animate__bounceIn');
		btnContainer.classList.add('animate__fadeOutDown');
	}
	 else { // NO new cards, review cards only
		maxCards = cards.reviewCards.length;
		currentCardSelection = cards.reviewCards;
		console.log("Review cards FOUND.");
	}

	frontWordNode.innerHTML = currentCardSelection[0].FrontWord;
	backWordNode.innerHTML = currentCardSelection[0].FrontWord;
	backDefinitionNode.innerHTML = currentCardSelection[0].BackWord;
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

// AJAX Post request here (update card review date by *2)
function passCardEvent(card) {
	let xhttp = new XMLHttpRequest();

	xhttp.open('POST', '/passCard', true);

	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhttp.onload = () => {
		console.log("GOT Response (Pass card AJAX event).");
	};
	
	xhttp.send("card=" + JSON.stringify(card));
}

// pass button event, replace card content with next, fade in to next card
passBtn.addEventListener('click', function() {

	passCardEvent(currentCardSelection[0]);

	if (currentCardIndex < maxCards - 1) { // continue to next card
		flashcard.classList.remove('flip');

		currentCardIndex += 1;
		reviewCount.innerHTML = maxCards - currentCardIndex;
		currentCardSelection.shift();

		frontWordNode.innerHTML = currentCardSelection[0].FrontWord;
		backWordNode.innerHTML = currentCardSelection[0].FrontWord;
		backDefinitionNode.innerHTML = currentCardSelection[0].BackWord;

		flashcard.classList.add("animate__fadeInRight");
		isFadeIn = true;
	}
	else if (currentCardIndex >= maxCards 
		&& currentCardSelection == cards.reviewCards
		&& cards.newCards.length != 0) {
			maxCards = cards.newCards.length ;
			currentCardIndex = 0;
			currentCardSelection = cards.newCards;
	}
	else { // finished studies
		flashcard.classList.add("animate__fadeOutLeft");
		btnContainer.classList.add('animate__fadeOutDown');
		hasFinishedStudying = true;
	}
});

/* 	fail button event, replace card content with next, move card to end of review, 
 	fade to next card */
failBtn.addEventListener('click', function() {
	currentCardSelection.push(cards.newCards.shift());

	frontWordNode.innerHTML = currentCardSelection[0].FrontWord;
	backWordNode.innerHTML = currentCardSelection[0].FrontWord;
	backDefinitionNode.innerHTML = currentCardSelection[0].BackWord;

	flashcard.classList.add("animate__fadeInRight");
	isFadeIn = true;
});