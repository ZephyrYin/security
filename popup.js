$(document).ready(
    function getLeakItems() {
		var leakitems = "first name, last name and .."; //modify this line to get real leak items.
		document.getElementById("leakitems").innerHTML = leakitems;
	}
);

$(document).ready(
	function getLeakTo() {
		var leakto = "3party.com"; //modify this line to get real leak to.
		document.getElementById("leakto").innerHTML = leakto;
	}
);

$(document).ready(
	function getRank() {
		var rank = "11777"; //modify this line to get real rank.
		document.getElementById("rank").innerHTML = rank;
	}
);

$(document).ready(
	function getWOT() {
		var wot = "low trust"; //modify this line to get real WOT.
		document.getElementById("wot").innerHTML = wot;
	}
);

$(document).ready(
	function getIsVisited() {
		var isvisited = "Yes"; //modify this line to get real isvisited.
		document.getElementById("isvisited").innerHTML = isvisited;
	}
);

$(document).ready(
	function getCommunity() {
		var community = '99% of users choose "Scrub"'; //modify this line to get real community.
		document.getElementById("community").innerHTML = community;
	}
);

//modify this function for clicking Allow
function allow() {
	alert("allow");
}
document.getElementById('allow').addEventListener('click', allow);

//modify this function for clicking Scrub
function scrub() {
	alert("scrub");
}
document.getElementById('scrub').addEventListener('click', scrub);

//modify this function for clicking Stop
function stop() {
	alert("stop");
}
document.getElementById('stop').addEventListener('click', stop);