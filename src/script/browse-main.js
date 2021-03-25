var browse_table = document.getElementById('browse-table');
var rowSelected = NaN;

for (var i = 1; i < browse_table.rows.length; i++) {
    browse_table.rows[i].onclick = function() {
        if (!isNaN(rowSelected)) {
            browse_table.rows[rowSelected].style.boxShadow = "0 0 0 1px rgb(207, 207, 207)";
        }
        rowSelected = this.rowIndex;
        this.style.boxShadow = "0 0 0 1px rgb(36, 36, 36)";
    }
}

document.addEventListener('click', function(event) {
    var isClickedInside = browse_table.contains(event.target);

    if (!isClickedInside) {
        browse_table.rows[rowSelected].style.boxShadow = "0 0 0 1px rgb(207, 207, 207)";
        rowSelected = NaN;
    }
});