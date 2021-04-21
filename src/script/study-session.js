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

// AJAX call to retrieve cards for review/new
function getFlashcards() {
	let xhttp = new XMLHttpRequest();

	xhttp.open('GET', '/getStudyCards?deck=' + deckName, true);

	xhttp.onload = function () {
		console.log("GOT transaction!");
	};

	xhttp.send();
}

getFlashcards();

// Card data for study session (HARCODED for now)
var reviewCards = [
	{
		frontWord: "叶う",
		backWord: "Kanau<br>[to come true (of a wish, prayer, etc.); to be realized; to be fulfilled]",
	},
	{
		frontWord: "開く",
		backWord: "Aku<br>To open (a door etc.)",
	},
    {
        frontWord: "切る",
        backWord: "Kiru<br>To Cut",

    },
    {
        frontWord: "閉める",
        backWord: "Shimeru<br>To close something (intransitive verb)",

    },
    {
        frontWord: "食べる",
        backWord: "Taberu<br>To eat something",

    },
    {
        frontWord: "閉める",
        backWord: "Shimeru<br>To close something (intransitive verb)",

    },
    {
        frontWord: "届ける",
        backWord: "Todokeru<br>To deliver something",

    },
    {
        frontWord: "慰める",
        backWord: "Nagusameru<br>To comfort",

    },
    {
        frontWord: "話す",
        backWord: "Hanasu<br>To talk, to discourse (e.g story)",

    }];

// track current card being studied
var hasFinishedStudying = false;
var currentCardIndex = 0;
var maxCards = reviewCards.length;

// Initialize review for first card, track if fadeIn or fadeOut
var isFadeIn = false;
frontWordNode.innerHTML = reviewCards[0].frontWord;
backWordNode.innerHTML = reviewCards[0].frontWord;
backDefinitionNode.innerHTML = reviewCards[0].backWord;
reviewCount.innerHTML = maxCards - currentCardIndex;

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
		reviewCards.shift();
		frontWordNode.innerHTML = reviewCards[0].frontWord;
		backWordNode.innerHTML = reviewCards[0].frontWord;
		backDefinitionNode.innerHTML = reviewCards[0].backWord;
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
	reviewCards.push(reviewCards.shift());
	frontWordNode.innerHTML = reviewCards[0].frontWord;
	backWordNode.innerHTML = reviewCards[0].frontWord;
	backDefinitionNode.innerHTML = reviewCards[0].backWord;
	flashcard.classList.add("animate__fadeInRight");
	isFadeIn = true;
});