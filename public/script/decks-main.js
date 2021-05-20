// Deck title node (for directing to study page)
var deck_table = document.getElementById('deck-select-table');
var deck_titles = document.querySelectorAll(".deck-name-td");
var new_counts = document.querySelectorAll(".new-count");

// Deck main modal nodes
const deck_modal = document.getElementById("modal-deck-container");
const deck_onModal = document.getElementsByClassName("deck-options-button");
const deck_offModal = document.getElementById("modal-deck-btn-close");

// Deck sub modal nodes
const changeNameBtn = document.getElementById("modal-changeName-btn");
const seeAllCards = document.getElementById("modal-seeAllCards-btn");
var modalDeckTitle = document.getElementById("modal-deck-title");
var originalDeckName = undefined;
const newCardCountInput = document.getElementById('modal-deck-input-newCardsPerDay');
const modal_saveBtn = document.getElementById('modal-deck-save-btn');
const modal_deleteBtn = document.getElementById('modal-deck-delete-btn');

// Add card modal nodes
const addCardModal = document.getElementById("modal-addCard-container");
const addCard_onModal = document.getElementById("addCard-btn");
const addCard_offModal = document.getElementById("modal-addCard-btn-close");
const addCard_saveBtn = document.getElementById("modal-addCard-save-btn");
const addCard_frontText = document.getElementById("modal-addCard-front-input");
const addCard_backText = document.getElementById("modal-addCard-back-input");
const addCard_selectDeck = document.getElementById("add-card-select-deck");

// Add new deck modal nodes
const addDeckForm = document.getElementById('modal-addDeck-form-container');
const addDeckModal = document.getElementById("modal-addDeck-container");
const addDeck_onModal = document.getElementById("createDeck-btn");
const addDeck_offModal = document.getElementById("modal-addDeck-btn-close");
const addDeck_saveBtn = document.getElementById("modal-addDeck-save-btn");

function postEditedDeckInfo(newDeckName, oldDeckName, newCardCount) {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();

        xhttp.open('POST', '/editDeck', true);

        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhttp.onload = () => {
          console.log("New deck settings saved Updated name and newcount.");
          resolve(xhttp.responseText);
        };
        
        xhttp.send("newDeck=" + newDeckName + "&oldDeck=" + oldDeckName + "&newCardCount=" + newCardCount);
    });
}

function postDeleteDeck(deckName) {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();

        xhttp.open('POST', '/deleteDeck', true);

        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhttp.onload = () => {
            resolve();
        };

        xhttp.send("deckName=" + deckName);
    });
}

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

// Add event for each deck option button, OPEN the deck modal
for (var i = 0; i < deck_onModal.length; i++) {
    // Show modal
    deck_onModal[i].addEventListener('click', function() {
        deck_modal.style.display = "block";
        modal_deleteBtn.disabled = false;

        // Show deck name
        originalDeckName = this.parentElement.cells[0].childNodes[0].innerText;
        document.getElementById("modal-deck-title").textContent = originalDeckName;
    });
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

// Deck settings save
modal_saveBtn.addEventListener('click', async (e) => {
    let newDeckName = modalDeckTitle.innerText;
    let oldDeckName = originalDeckName;
    let newCount = newCardCountInput.value;

    let updatedNewCount = await postEditedDeckInfo(newDeckName, oldDeckName,newCount);

    // use for loop to change deck name and new maximum count (front view)
    (Array.prototype.slice.call(deck_titles)).some((deck_title, index) => {
        if (deck_title.innerText == oldDeckName) {
            deck_titles[index].innerText = newDeckName
            new_counts[index].innerText = updatedNewCount;
        }
    });

    // exit modal
    console.log("EXIT MODAL NOW!!");
    deck_modal.style.display = "none";
    changeNameBtn.disabled = false;
    modalDeckTitle.contentEditable = false;
    modalDeckTitle.style.border = "unset";
    originalDeckName = undefined;
});

// DELETE Deck
modal_deleteBtn.addEventListener('click', async (e) => {
    let deckName = originalDeckName;

    await postDeleteDeck(deckName);

    // loop each table row to find the deck list and delete from view
    (Array.prototype.slice.call(deck_titles)).some((deck_title, index) => {
        if (deck_title.innerText == deckName)
            deck_table.deleteRow(index + 1);
    });

    // exit modal
    deck_modal.style.display = "none";
    changeNameBtn.disabled = false;
    modalDeckTitle.contentEditable = false;
    modalDeckTitle.style.border = "unset";
    originalDeckName = undefined;
});

// In modal, change deck name
changeNameBtn.addEventListener('click', function() {
    modalDeckTitle.contentEditable = true;
    modalDeckTitle.style.outline = "none";
    modalDeckTitle.style.border = "1px solid black";
    modal_deleteBtn.disabled = true;
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

function addNewDeck(newDeckName) {
    return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();

        xhttp.open('POST', '/addDeck', true);
        console.log("XHTTP instance created!");
    
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        xhttp.onload = function() {
            // exit modal
            addDeckModal.style.display = "none";

            // refresh
            location.reload();
        };
    
        xhttp.send("newDeckName=" + newDeckName);
    });
}

addDeck_saveBtn.addEventListener('click', function(event) {
    let newDeckName = addDeckForm.elements['modal-addDeck-front-input'].value;

    addNewDeck(newDeckName);

    return;
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

    let deckSelected = addCard_selectDeck.options[addCard_selectDeck.selectedIndex].text;

    xhttp.send("front=" + addCard_frontText.value + "&back=" + addCard_backText.value + "&deck=" + deckSelected);
});

function buttonCheck(text) {
    if(addCard_frontText.value === "" || addCard_backText.value === "") {
        addCard_saveBtn.disabled = true;
    }
    else {
        addCard_saveBtn.disabled = false;
    }
}
