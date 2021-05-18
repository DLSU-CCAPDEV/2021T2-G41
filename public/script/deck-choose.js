const cards = document.querySelectorAll(".card");
const continueBtn = document.getElementById("continue-btn");

// hide/show nodes for background animation (adding decks)
const bodyDocument = document.getElementsByTagName("BODY")[0];
const decksChooseTitleContainer = document.getElementById('choose-deck-title');
const decksChooseContainer = document.getElementById('decks-choose-container');
const waitMessageContainer = document.getElementById('wait-message');

var selectedDecks = new Set();

// Setup click event for each card
cards.forEach((card, indedx) => {
    card.addEventListener('click', (e) => {
        let selectedDeck = card.childNodes[1].firstElementChild.innerText;
        
        if (!selectedDecks.has("\"" + selectedDeck + "\"")) { // Select deck
            console.log("Deck select.");
            selectedDecks.add("\"" + selectedDeck + "\"");
            card.style.animation = "0.2s ease-in 0s 1 normal forwards box-select";

            // enable or disable button
            continueBtn.disabled = selectedDecks.size == 0 ? true : false;
            return
        }

        // Deselect deck
        console.log("Deck deselect.");
        selectedDecks.delete("\"" + selectedDeck + "\"");
        card.style.animation = "0.1s ease-out 0s 1 normal forwards box-deselect";

        // enable or disable button
        continueBtn.disabled = selectedDecks.size == 0 ? true : false;
    });
});

function addDeck(selectedDecks) {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();

        xhttp.open('GET', '/add?selectedDecks=' + selectedDecks);

        xhttp.onload = () => {
            resolve();
        }

        xhttp.send();
    });
}

decksChooseTitleContainer.addEventListener('animationend', async (e) => {
    decksChooseTitleContainer.style.display = "none";
    decksChooseContainer.style.display = "none";

    waitMessageContainer.hidden =  false;
    waitMessageContainer.classList.add("animate__fadeIn");

    let selectedDecksArray = (Array.from(selectedDecks)).toString();
    await addDeck(selectedDecksArray);

    location.href = "/decks";
});

continueBtn.addEventListener('click', (e) => {
    
    // Hide deck elements, start animations
    bodyDocument.style.animation = "gradient 15s ease infinite";

    decksChooseTitleContainer.classList.add("animate__fadeOut")
    decksChooseContainer.classList.add("animate__fadeOut");
});

