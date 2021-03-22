let deck_modal = document.getElementById("modal-deck-container");

let deck_onModal = document.getElementsByClassName("deck-options-button");

let deck_offModal = document.getElementById("modal-deck-btn-close");

a = function() {
    deck_modal.style.display = "block";
};

for (var i = 0; i < deck_onModal.length; i++) {
    deck_onModal[i].addEventListener('click', a);
}

deck_offModal.onclick = function() {
    deck_modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == deck_modal) {
        deck_modal.style.display = "none";
    }
}