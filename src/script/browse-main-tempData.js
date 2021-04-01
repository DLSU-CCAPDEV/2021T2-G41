var browse_table = document.getElementById('browse-table');
var row = undefined, front = undefined, back = undefined, deck = undefined, date = undefined; 

// Card data (hardcoded for now) [Front, Back, Deck, Date]
var tempCardData /*harcoded for now*/ = [
    {
        front: "切る",
        back: "Kiru<br>To Cut",
        deck: "Core 2K Japanese Vocabulary",
        date: "12-May-21"
    },
    {
        front: "閉める",
        back: "Shimeru<br>To close something (intransitive verb)",
        deck: "Core 2K Japanese Vocabulary",
        date: "24-May-21"
    },
    {
        front: "食べる",
        back: "Taberu<br>To eat something",
        deck: "Core 2K Japanese Vocabulary",
        date: "24-May-21"
    },
    {
        front: "閉める",
        back: "Shimeru<br>To close something (intransitive verb)",
        deck: "Core 2K Japanese Vocabulary",
        date: "24-May-21"
    },
    {
        front: "届ける",
        back: "Todokeru<br>To deliver something",
        deck: "Core 2K Japanese Vocabulary",
        date: "24-May-21"
    },
    {
        front: "慰める",
        back: "Nagusameru<br>To comfort",
        deck: "Core 2K Japanese Vocabulary",
        date: "16-May-21"
    },
    {
        front: "話す",
        back: "Hanasu<br>To talk, to discourse (e.g story)",
        deck: "Core 2K Japanese Vocabulary",
        date: "24-May-21"
    }
    ];

var browseTable = document.getElementById('browse-table');

tempCardData.forEach(function(currCard) {
    row = browseTable.insertRow();
    front = row.insertCell();
    front.classList.add("browse-table-front-data");
    front.innerHTML = currCard.front;
    back = row.insertCell();
    back.classList.add("browse-table-date-data");
    back.innerHTML = currCard.back;
    deck = row.insertCell();
    deck.innerHTML = currCard.deck;
    date = row.insertCell();
    date.innerHTML = currCard.date;
});
