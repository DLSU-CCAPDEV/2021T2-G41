// Deck title node (for directing to study page)
var deck_titles = document.querySelectorAll(".deck-name-td");

// Deck main modal nodes
const deck_modal = document.getElementById("modal-deck-container");
const deck_onModal = document.getElementsByClassName("deck-options-button");
const deck_offModal = document.getElementById("modal-deck-btn-close");

// Deck sub modal nodes
const changeNameBtn = document.getElementById("modal-changeName-btn");
const seeAllCards = document.getElementById("modal-seeAllCards-btn");
var modalDeckTitle = document.getElementById("modal-deck-title");
var originalDeckName = undefined;

// Add card modal nodes
const addCardModal = document.getElementById("modal-addCard-container");
const addCard_onModal = document.getElementById("addCard-btn");
const addCard_offModal = document.getElementById("modal-addCard-btn-close");
const addCard_saveBtn = document.getElementById("modal-addCard-save-btn");
const addCard_frontText = document.getElementById("modal-addCard-front-input");
const addCard_backText = document.getElementById("modal-addCard-back-input");
const addCard_selectDeck = document.getElementById("add-card-select-deck");

// Add new deck modal nodes
const addDeckModal = document.getElementById("modal-addDeck-container");
const addDeck_onModal = document.getElementById("createDeck-btn");
const addDeck_offModal = document.getElementById("modal-addDeck-btn-close");
const addDeck_saveBtn = document.getElementById("modal-addDeck-save-btn");

// Direct to study page event when a deck title is clicked
deck_titles.forEach(title => {
    title.addEventListener('click', () => window.location.assign('study/' + title.innerText));
});

function getDeckRowAndCol(element) { // Returns [Row,Col]
    let row = undefined, col = undefined;
    row = element.parentNode.rowIndex;
    col = element.cellIndex;
    return [row, col];
}

// Add event for each deck option button, open the deck modal
for (var i = 0; i < deck_onModal.length; i++) {
    // Show modal
    deck_onModal[i].addEventListener('click', function() {
        deck_modal.style.display = "block";
    });
    // Update modal information
    deck_onModal[i].onclick = function() {
        let selectedRowNCol = getDeckRowAndCol(this); // no need?
        // Show deck name
        originalDeckName = this.parentElement.cells[0].childNodes[0].innerText;
        document.getElementById("modal-deck-title").textContent = originalDeckName;
    };
}

/* DECK MODAL events */

// Click outside the deck modal to exit modal
window.onclick = function(event) {
    if (event.target == deck_modal) {
        deck_modal.style.display = "none";
        changeNameBtn.disabled = false;
        modalDeckTitle.contentEditable = false;
        modalDeckTitle.style.border = "unset";
        originalDeckName = undefined;
        
    }
}

// Exit modal on X click
deck_offModal.onclick = function() {
    deck_modal.style.display = "none";
    changeNameBtn.disabled = false;
    modalDeckTitle.contentEditable = false;
    modalDeckTitle.style.border = "unset";
    originalDeckName = undefined;
}

// In modal, change deck name
changeNameBtn.addEventListener('click', function() {
    modalDeckTitle.contentEditable = true;
    modalDeckTitle.style.outline = "none";
    modalDeckTitle.style.border = "1px solid black";
    changeNameBtn.disabled = true;
});

seeAllCards.addEventListener('click', function() {
   location.href = "browse-main.html";
});

addCard_onModal.addEventListener('click', function() {
    addCardModal.style.display = "block";
});

addCard_offModal.addEventListener('click', function() {
    addCardModal.style.display = "none";
});

addDeck_onModal.addEventListener('click', function() {
    addDeckModal.style.display = "block";
});

addDeck_offModal.addEventListener('click', function() {
    addDeckModal.style.display = "none";
});

addDeck_saveBtn.addEventListener('click', function(event) {
    var xhttp = new XMLHttpRequest();

    xhttp.open('POST', '/testajax', true);
    console.log("XHTTP instance created!");

    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    xhttp.onload = function() {
        console.log("GOT transaction!");
        console.log("STATUS" + this.status);
        console.log(this.responseText);
    };

    xhttp.send("front=Frontie%back=Backie");
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
