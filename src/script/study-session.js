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
var newCount = document.getElementById("new-count");
var reviewCount = document.getElementById("review-count");

// Store cards for study
var cards;

// track
var maxCards;
var currentCardSelection = undefined; // select review/new
var currentCountSelection = undefined;
var currentCardIndex = 0;

// DELETE THIS (testing how to use Date() objects)
let x = new Date();
let y = new Date(new Date().toDateString());
console.log(y);

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
		currentCountSelection = newCount;
		console.log("NO cards due for review.");
	} else if (cards.newCards.length == 0 && cards.reviewCards.length == 0) { // Zero cards
		flashcard.classList.add('is-hidden');
		finishMessages.classList.remove('is-hidden');
		finishMessages.classList.add('animate__bounceIn');
		btnContainer.classList.add('animate__fadeOutDown');
	}
	 else { // Review cards found
		maxCards = cards.reviewCards.length;
		currentCardSelection = cards.reviewCards;
		currentCountSelection = reviewCount;
		newCount.innerHTML = cards.newCards.length;
		console.log("Review cards FOUND.");
	}
	
	frontWordNode.innerHTML = currentCardSelection[0].FrontWord;
	backWordNode.innerHTML = currentCardSelection[0].FrontWord;
	backDefinitionNode.innerHTML = currentCardSelection[0].BackWord;
	currentCountSelection.innerHTML = maxCards - currentCardIndex;
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

// AJAX Post request (PASS update card review date by *2)
function passCardEvent(card) {
	let xhttp = new XMLHttpRequest();

	xhttp.open('POST', '/passCard', true);

	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhttp.onload = () => {
		console.log("GOT Response (Pass card AJAX event).");
	};

	xhttp.send("card=" + JSON.stringify(card).replaceAll("&nbsp", " "));
}

// AJAX Post request (FAIL reset review interval)
function failCardEvent(card) {
	let xhttp = new XMLHttpRequest();

	xhttp.open('POST', '/failCard', true);

	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhttp.onload = () => {
		console.log("GOT Response (Fail card AJAX event).");
	};

	xhttp.send("card=" + JSON.stringify(card).replaceAll("&nbsp", " "));
}

// pass button event, replace card content with next, fade in to next card
passBtn.addEventListener('click', function() {
	passCardEvent(currentCardSelection[0]);
	currentCardIndex += 1;

	if (currentCardIndex < maxCards) { // continue to next card
		flashcard.classList.remove('flip');

		currentCountSelection.innerHTML = maxCards - currentCardIndex;
		currentCardSelection.shift();

		frontWordNode.innerHTML = currentCardSelection[0].FrontWord;
		backWordNode.innerHTML = currentCardSelection[0].FrontWord;
		backDefinitionNode.innerHTML = currentCardSelection[0].BackWord;

		flashcard.classList.add("animate__fadeInRight");
		isFadeIn = true;
	}
	else if (currentCardIndex >= maxCards  // review cards done,
		&& currentCardSelection == cards.reviewCards // move to new cards
		&& cards.newCards.length != 0) {
			// update review count (one last time)
			currentCountSelection.innerHTML = maxCards - currentCardIndex;
			currentCardSelection.shift();

			// shift to new cards
			maxCards = cards.newCards.length ;
			currentCardIndex = 0;
			currentCardSelection = cards.newCards;
			currentCountSelection = newCount;

			// show first new card
			frontWordNode.innerHTML = currentCardSelection[0].FrontWord;
			backWordNode.innerHTML = currentCardSelection[0].FrontWord;
			backDefinitionNode.innerHTML = currentCardSelection[0].BackWord;

			flashcard.classList.add("animate__fadeInRight");
			isFadeIn = true;
	}
	else { // finished
		flashcard.classList.add("animate__fadeOutLeft");
		btnContainer.classList.add('animate__fadeOutDown');
		hasFinishedStudying = true;
	}
	console.log(currentCardIndex);
});

/* 	fail button event, replace card content with next, move card to end of review, 
 	fade to next card */
failBtn.addEventListener('click', function() {
	failCardEvent(currentCardSelection[0]);

	currentCardSelection.push(currentCardSelection.shift());

	frontWordNode.innerHTML = currentCardSelection[0].FrontWord;
	backWordNode.innerHTML = currentCardSelection[0].FrontWord;
	backDefinitionNode.innerHTML = currentCardSelection[0].BackWord;

	flashcard.classList.add("animate__fadeInRight");
	isFadeIn = true;
});