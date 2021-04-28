const addButtons = document.querySelector('.add-icon');
const englishTranslationTexts = document.querySelector('english-sentence-example');

// modal node
const addSentenceModal = document.getElementById('add-sentence-modal');

// activate/deactivate modal nodes
const closeBtn = document.getElementById('modal-close');
const cancelBtn = document.getElementById('cancel-btn');

// X button clicked
closeBtn.addEventListener('click', (e) => {
    addSentenceModal.classList.remove('is-active');
});

// Cancel button clicked
cancelBtn.addEventListener('click', (e) => {
    addSentenceModal.classList.remove('is-active');
});