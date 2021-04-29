const addButtons = document.querySelectorAll('.add-icon');
const translationTexts = document.querySelectorAll('.japanese-sentence');
const englishTranslationTexts = document.querySelectorAll('.english-sentence-example');

// modal node
const addSentenceModal = document.getElementById('add-sentence-modal');

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
    addSentenceModal.classList.remove('is-active');
});

// Cancel button clicked event
cancelBtn.addEventListener('click', (e) => {
    addSentenceModal.classList.remove('is-active');
});

translationTexts.forEach((translationText, translationTextIndex) => {
    translationText.addEventListener('click', async (e) => {
        // show text (loading)
        englishTranslationTexts[translationTextIndex].hidden = false;

        // get English translation
        let engTranslationText = await getTranslationRequest(translationText.innerHTML);

        englishTranslationTexts[translationTextIndex].innerHTML = engTranslationText;
        console.log(engTranslationText);
    });
})