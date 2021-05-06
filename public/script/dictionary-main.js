// activate modal, dictionary sentence nodes
const addButtons = document.querySelectorAll('.add-icon');
const translationTexts = document.querySelectorAll('.japanese-sentence');
const englishTranslationTexts = document.querySelectorAll('.english-sentence-example');

// modal field node
const addSentenceModal = document.getElementById('add-sentence-modal');
const modalFrontWord = document.getElementById('frontWord');
const modalBackWord = document.getElementById('backWord');
const deckSelect = document.getElementById('deckSelect');

// modal button nodes
const saveSentence = document.getElementById('save-btn');
// activate/deactivate modal nodes
const closeBtn = document.getElementById('modal-close');
const cancelBtn = document.getElementById('cancel-btn');

function getTranslationRequest(sentence) {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();
        let query = "sentence=" + sentence;

        xhttp.open('GET', '/getEngTranslation?' + query, true);

        xhttp.onload = () => {
            console.log("Got English translation.");
            resolve(xhttp.responseText);
        }

        xhttp.send();
    });
}

// X button clicked event
closeBtn.addEventListener('click', (e) => {
    modalFrontWord.value = "";
    modalBackWord.value = "";
    addSentenceModal.classList.remove('is-active');
});

// Cancel button clicked event
cancelBtn.addEventListener('click', (e) => {
    modalFrontWord.value = "";
    modalBackWord.value = "";
    addSentenceModal.classList.remove('is-active');
});

// On Japanese sentence click event, show translation
translationTexts.forEach((translationText, translationTextIndex) => {
    translationText.addEventListener('click', async (e) => {
        // show text (loading)
        englishTranslationTexts[translationTextIndex].hidden = false;

        // get English translation
        let engTranslationText = await getTranslationRequest(translationText.innerHTML);

        englishTranslationTexts[translationTextIndex].innerHTML = engTranslationText;
        console.log(engTranslationText);
    });
});

// On Add btn (add sentence to deck) click event, show modal
addButtons.forEach((addButton, addButtonIndex) => {
    addButton.addEventListener('click', async (e) => {
        // activate modal
        addSentenceModal.classList.add('is-active');

        // Set textarea content (Front, Back)
        modalFrontWord.value = translationTexts[addButtonIndex].innerHTML;

        if (englishTranslationTexts[addButtonIndex].textContent == "Loading...") {
            let translationText = await getTranslationRequest(translationTexts[addButtonIndex].textContent);
            modalBackWord.value = translationText;
        }
        else 
            modalBackWord.value = englishTranslationTexts[addButtonIndex].textContent;
    });
});

saveSentence.addEventListener('click',  (e) => {
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/addCard', true);

    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhttp.onload = function() {
        modalFrontWord.value = "";
        modalBackWord.value = "";
        addSentenceModal.classList.remove('is-active');
    };

    let deckSelected = deckSelect.options[deckSelect.selectedIndex].text;

    xhttp.send("front=" + modalFrontWord.value + "&back=" + modalBackWord.value + "&deck=" + deckSelected);
});