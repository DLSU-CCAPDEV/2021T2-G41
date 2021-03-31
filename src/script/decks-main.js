// Deck main modal nodes
var deck_modal = document.getElementById("modal-deck-container");
var deck_onModal = document.getElementsByClassName("deck-options-button");
var deck_offModal = document.getElementById("modal-deck-btn-close");

// Deck sub modal nodes
var changeNameBtn = document.getElementById("modal-changeName-btn");
var seeAllCards = document.getElementById("modal-seeAllCards-btn");
var modalDeckTitle = document.getElementById("modal-deck-title");
var originalDeckName = undefined;

// Add card modal nodes
var addCardModal = document.getElementById("modal-addCard-container");
var addCard_onModal = document.getElementById("addCard-btn");
var addCard_offModal = document.getElementById("modal-addCard-btn-close");

// Add new deck modal nodes
var addDeckModal = document.getElementById("modal-addDeck-container");
var addDeck_onModal = document.getElementById("createDeck-btn");
var addDeck_offModal = document.getElementById("modal-addDeck-btn-close");

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