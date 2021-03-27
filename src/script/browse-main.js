var browse_table = document.getElementById('browse-table');
var rowSelected = NaN;

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

        document.getElementById('browse-edit-front-input').value = this.cells[0].innerHTML;
        document.getElementById('browse-edit-back-input').value = this.cells[1].innerHTML;
    }
}

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

        document.getElementById('browse-edit-front-input').value = "";
        document.getElementById('browse-edit-back-input').value = "";
        document.getElementById('browse-edit-submit-btn').style.backgroundColor = "grey";
    }
});