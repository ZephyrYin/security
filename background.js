
function popupwindow(url, title, w, h) {
  var left = (screen.width/2)-(w/2);
  var top = (screen.height/2)-(h/2);
  return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
}


// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("This is a first install!");
		windowName = "Information Collection";
		popupwindow("getInfo.html", windowName, screen.width / 1.5, screen.height / 1.5);
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
		windowName = "Information Collection";
		popupwindow("getInfo.html", windowName, screen.width / 1.5, screen.height / 1.5);
    }
});

/*
function getURL(tablink) {
  // do stuff here
  return tablink;
}
*/

// check web request
chrome.webRequest.onBeforeRequest.addListener(
    function(info) {
		
		// Get the current URL of this window
		
		// Notice: There is minor bug, Some url is undefined
		chrome.tabs.query({'lastFocusedWindow': true, 'active': true}, function(tabs){
			var current_url = tabs[0].url;
			
			console.log(current_url);
					
			if(info.requestBody === undefined) {
				// If requestBody is not defined, No need to check 
			}
			else {
				// console.log("It has been defined");
				// console.log("Request to :" + info.url);
				// console.log(info);
				if(info.requestBody.formData !== undefined) {
					console.log(info.requestBody.formData);
				}
				else if(info.requestBody.raw !== undefined) {
					
					console.log(info.requestBody.raw);
				}				
			}
			
		});
    },
    // filters
    {urls: [ "<all_urls>" ]},
    // extraInfoSpec
    ["blocking", "requestBody"]
);


chrome.webRequest.onBeforeSendHeaders.addListener(
	function(details) {
		// console.log("Trigger On before Send Header Event!");
		var header = details.requestHeaders;
		// console.log(details.method);
		console.log(header);
	},
	// filters
	{urls: ["<all_urls>" ]},
	// some other specification
	["blocking", "requestHeaders"]
);
