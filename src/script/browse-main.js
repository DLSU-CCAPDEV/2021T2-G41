// Card selection
var browse_table = document.getElementById('browse-table');
var rowSelected = NaN;

// Filter option nodes
var filterOptionsOnBtn = document.getElementById('filter-options-btn');
var filterOptionsBackBtn = document.getElementById('filter-back-btn');
var filterOptionsSaveBtn = document.getElementById('filter-save-btn');
var menuNavigationContainer = document.getElementById('navigation-menu');
var filterContainer = document.getElementById('filter-form');
var hideNav = false;

// filter fields and values
var deckSelectFilter = document.getElementById('deck-filter');
var newCardFilter = document.getElementById('new-cards-check');
var reviewCardFilter = document.getElementById('review-cards-check');

// Add card modal nodes
var addCardModal = document.getElementById("modal-addCard-container");
var addCard_onModal = document.getElementById("addCard-btn");
var addCard_offModal = document.getElementById("modal-addCard-btn-close");
var addCard_saveBtn = document.getElementById("modal-addCard-save-btn");
var addCard_frontText = document.getElementById("modal-addCard-front-input");
var addCard_backText = document.getElementById("modal-addCard-back-input");
var addCard_selectDeck = document.getElementById("add-card-select-deck");

var browseTable = document.getElementById('browse-table');
var row, front, back, deck, date; 

var cardData = [] // {FrontWord, BackWord, Deck, ReviewDate, ReviewInterval} per element

function getFlashcards() {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();

        xhttp.open('GET', '/getFlashcardData', true);

        xhttp.onload = function() {
            console.log("GOT cards!");
            resolve(this.responseText);
        };

        xhttp.send();
    });
}

function getFlashcardsFilter() {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();

        xhttp.open('GET', '/getFlashcardDataFilter', true);

        xhttp.onload = function() {
            console.log("GOT cards (filtered)");
            resolve(this.responseText);
        }

        xhttp.send();
    });
}

// setup click event for every row data
function addEventListeners() {
    // Row selected event handler
    for (var i = 1; i < browse_table.rows.length; i++) {
        browse_table.rows[i].onclick = function() {
            if (!isNaN(rowSelected)) {
                browse_table.rows[rowSelected].style.animationName = "none";
            }
            rowSelected = this.rowIndex;
            this.style.animationName = "box-select";

            document.getElementById('browse-edit-front-input').disabled = false;
            document.getElementById('browse-edit-back-input').disabled = false;
            document.getElementById('browse-edit-submit-btn').disabled = false;
            document.getElementById('browse-edit-select-deck').disabled = false;
            document.getElementById('browse-edit-submit-btn').style.cursor = "pointer";
            document.getElementById('browse-edit-delete-btn').disabled = false;
            document.getElementById('browse-edit-delete-btn').style.cursor = "pointer";
            
            document.getElementById('browse-edit-front-input').value = this.cells[0].innerHTML;
            document.getElementById('browse-edit-back-input').value = this.cells[1].innerHTML;
        }
    }
}

// get all flashcards from database
async function loadFlashcards() {
    let cards = await getFlashcards();
    console.log(cardData = JSON.parse(cards));

    // fill table with all flashcard data (may be filtered)
    cardData.forEach(function(currCard) {
        row = browseTable.insertRow();
        front = row.insertCell();
        front.classList.add("browse-table-front-data");
        front.innerHTML = currCard.FrontWord;
        back = row.insertCell();
        back.classList.add("browse-table-date-data");
        back.innerHTML = currCard.BackWord;
        deck = row.insertCell();
        deck.innerHTML = currCard.Deck;
        date = row.insertCell();
        date.innerHTML = currCard.ReviewDate;
    });

    addEventListeners()
}

loadFlashcards();

// Deselect row event handler
document.addEventListener('click', function(event) {
    var isClickedRow = browse_table.contains(event.target);
    var isClickedInput = document.getElementById('browse-edit-form').contains(event.target);
    var isClickedSelect = document.getElementById('browse-edit-select-deck').contains(event.target);

    if ((!isClickedRow && !isClickedInput && !isClickedSelect) && !isNaN(rowSelected)) {
        browse_table.rows[rowSelected].style.animationName = "none";
        rowSelected = NaN;

        document.getElementById('browse-edit-front-input').disabled = true;
        document.getElementById('browse-edit-back-input').disabled = true;
        document.getElementById('browse-edit-submit-btn').disabled = true;
        document.getElementById('browse-edit-select-deck').disabled = true;
        document.getElementById('browse-edit-submit-btn').style.cursor = "unset";
        document.getElementById('browse-edit-delete-btn').disabled = true;
        document.getElementById('browse-edit-delete-btn').style.cursor = "unset";

        document.getElementById('browse-edit-front-input').value = "";
        document.getElementById('browse-edit-back-input').value = "";
    }
});

filterOptionsOnBtn.addEventListener('click', function() {
    menuNavigationContainer.classList.remove('animate__fadeIn');
    menuNavigationContainer.classList.add('animate__fadeOut');
    hideNav = true;
});

menuNavigationContainer.addEventListener('animationend', function() {
    if (hideNav) {
        menuNavigationContainer.classList.add('is-hidden');
        filterContainer.classList.remove('is-hidden');
        filterContainer.classList.remove('animate__fadeOutLeft');
        filterContainer.classList.add('animate__fadeInLeft');
        menuNavigationContainer.classList.remove('animate__fadeOut');
    }
});

filterOptionsBackBtn.addEventListener('click', function() {
    hideNav = false;
    filterContainer.classList.remove('animate__fadeInLeft');
    filterContainer.classList.add('animate__fadeOutLeft');
});

filterContainer.addEventListener('animationend', function() {
    if (!hideNav) {
        filterContainer.classList.add('is-hidden');
        menuNavigationContainer.classList.remove('is-hidden');
        menuNavigationContainer.classList.remove('animate__fadeOut');
        menuNavigationContainer.classList.add('animate__fadeIn');
        filterContainer.classList.remove('animate__fadeOutLeft');
    }
});

filterOptionsSaveBtn.addEventListener('click', function() {
    console.log(deckSelectFilter.options[deckSelectFilter.selectedIndex].text);
});

addCard_onModal.addEventListener('click', function() {
    addCardModal.style.display = "block";
});

addCard_offModal.addEventListener('click', function() {
    addCardModal.style.display = "none";
});

addCard_saveBtn.addEventListener('click', function(event) {
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/addCard', true);
    console.log("XHTTP instance created!");

    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhttp.onload = function() {
        console.log("GOT transaction!");
        console.log("STATUS" + this.status);
        console.log(this.responseText);
        addCardModal.style.display = "none";
    };

    xhttp.send("front=" + addCard_frontText.value + "&back=" + addCard_backText.value + "&deck=" + addCard_selectDeck.value);
});
    function buttonCheck(text) {
        if(addCard_frontText.value === "" || addCard_backText.value === "") {
            addCard_saveBtn.disabled = true;
        }
        else {
            addCard_saveBtn.disabled = false;
        }
    }