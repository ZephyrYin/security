
function popupwindow(url, title, w, h) {
  var left = (screen.width/2)-(w/2);
  var top = (screen.height/2)-(h/2);
  return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
}


// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("This is a first install!");
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
		windowName = "Information Collection";
		popupwindow("getInfo.html", windowName, screen.width / 1.5, screen.height / 1.5);
    }
});


// check web request

chrome.webRequest.onBeforeRequest.addListener(
    function(info) {
        //alert("Cat intercepted: " + info.url);
        console.log("Cat intercepted: " + info.url);
        //// Redirect the lolcal request to a random loldog URL.
        //var i = Math.round(Math.random() * loldogs.length);
        //return {redirectUrl: loldogs[i]};
    },
    // filters
    {urls: [ "<all_urls>" ]},
    // extraInfoSpec
    ["blocking"]);