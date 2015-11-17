function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function ranking(theUrl) {
    var alexaurl = "http://data.alexa.com/data?cli=10&url=" + theUrl;
    var xml = httpGet(alexaurl);
    xmlDoc = $.parseXML(xml),
    $xml = $(xmlDoc),
    $rank = $xml.find("COUNTRY").attr("RANK");
	return $rank;
}

chrome.extension.onConnect.addListener(function(port) {
  console.log("Connected .....");
  port.onMessage.addListener(function(msg) {
        msg=msg.split(';');
        document.getElementById("leakitems").innerHTML=msg[0];
        document.getElementById("leakto").innerHTML=msg[1];
        document.getElementById("rank").innerHTML=ranking(msg[1]);
        document.getElementById("wot").innerHTML =msg[2];
        document.getElementById("isvisited").innerHTML=msg[3];
        document.getElementById("community").innerHTML=msg[4];
        console.log("message recieved "+ msg);
        port.postMessage("Hi Popup.js");
  });
});

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