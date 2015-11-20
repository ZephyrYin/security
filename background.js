// Global Varabiles
var cur_url='';
var local_dict = {};					//current_url : [leak_dest_urls]
loadJQuery("./javascripts/jquery-2.1.4.min.js");			// initialize jQuery
var left=0,size=100;
function isChromeExtensionUrl(url){
    return url.indexOf('chrome:')==0||url.indexOf('chrome-extension:')==0;
}
function skipRequest(url){
    return url.indexOf('http://terminator.dpkg.me')==0||url.indexOf('chrome-extension:')==0;
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


// For window switching
chrome.windows.onFocusChanged.addListener(
	function(changeInfo, tab) {		
		chrome.tabs.query({'currentWindow': true, 'active': true}, function(tabs){
            if(isChromeExtensionUrl(tabs[0].url))return;
            cur_url=tabs[0].url;
            console.log("window changed: " + tabs[0].url);
            if(local_dict[cur_url] == undefined){
				saveLeafInfoToLocal(parseURLToHostname(cur_url));
			}
		});
	}
);
// Add listener to event when current activate tab updates
chrome.tabs.onUpdated.addListener(
	function(changeInfo, tab) {
		chrome.tabs.query({'currentWindow': true, 'active': true}, function(tabs){
            if(isChromeExtensionUrl(tabs[0].url))return;
            cur_url=tabs[0].url;
            console.log("Tab Updated: " + tabs[0].url);
            if(local_dict[cur_url] == undefined){
				saveLeafInfoToLocal(parseURLToHostname(cur_url));
			}
		});
	}
);
// Add listener to event when current activate tab changes
chrome.tabs.onActivated.addListener(
	function(changeInfo, tab) {		
		chrome.tabs.query({'currentWindow': true, 'active': true}, function(tabs){
            if(isChromeExtensionUrl(tabs[0].url))return;
			console.log("Tab Changed: " + tabs[0].url);
			cur_url = tabs[0].url;
			if(local_dict[cur_url] == undefined){
				saveLeafInfoToLocal(parseURLToHostname(cur_url));
			}
		});
	}
);
chrome.webRequest.onBeforeRequest.addListener(
    function(info) {
		if(isChromeExtensionUrl(cur_url)||skipRequest(info.url))return;
		//if(local_dict[info.url]==undefined)
		//	return;
		//console.log("a request got " + info.url);
		// Flag whether to block the request
		var block = false;
		var cur_hostName = parseURLToHostname(cur_url);;		
		// Get URL of this request
		var rqst_hostName = parseURLToHostname(info.url);
        var isLeaked = false;
		var infoLeaked = 0;
		var res = checkPIILeak(info.url);
        console.log(info);
		if(res.isLeaked) {
								isLeaked = true;
								infoLeaked = infoLeaked | res.leakId;
								// console.log(content[jj]);
		}	
						
		// Only check request body when host names are different
		if(rqst_hostName != cur_hostName) {
				
			console.log("Current Window URL: " + cur_url);
			console.log("Current Window hostName: " + cur_hostName);
			console.log("Request hostName: " + rqst_hostName);
							
			if(info.requestBody !== undefined) {
					
				// TODO: We need to check if there is private information 
				// In all these headers
					
				// Flags to check for Info Leakage in who requestBody	
				if(info.requestBody.error !== undefined) {
					console.log(info.requestBody.error);
				}
				else if(info.requestBody.formData !== undefined) {
					// console.log(info.requestBody.formData);
						
					// *******************************************
					//         Test If PII has Leaked
					// *******************************************
						
					// TODO: Check in the server side to do Crowd Sourcing 
						
						
					// Form data is a dictionary e.g. {key: [value1, value2]}
					for(var key in info.requestBody.formData) {
						var content = info.requestBody.formData[key];
						for (var jj = 0; jj < content.length; jj++) {
							// res has two property: isLeaked : true/false
							//                       leakID: 0-63-->"what info is leaked" 
							res = checkPIILeak(content[jj]);
							if(res.isLeaked) {
								isLeaked = true;
								infoLeaked = infoLeaked | res.leakId;
								// console.log(content[jj]);
							}								
						}
					}
						
					// After Check for all the formData
										
						
				}
				
				/* Does not care about raw data for now 
				else if(info.requestBody.raw !== undefined) {						
						
					// *******************************************
					//         Test If PII has Leaked
					// *******************************************
					// TODO: Test if Raw has PII leaked
						
					// TODO: Check in the server side to do Crowd Sourcing
					for(var ii = 0; ii < info.requestBody.raw.length; ii++) {
						var content = info.requestBody.raw[ii].bytes;
						var path = info.requestBody.raw[ii].file;
													
						if(content !== undefined) {
							
						
						}
					}	
				*/
				
			}else{
                // check others leak
            }	
            left+=1;
            if(isLeaked) {
                        if(left<size){
                            popupHTML(infoLeaked,rqst_hostName);                  
                        //popupHTML('popup.html');
                            console.log("User information has been leaked with type: " + infoLeaked);
                            block = true;
                        //console.log(left+" "+cursize);
                            return {cancel:block};	
                        }
                        console.log(left+" "+size);
			}else{
                used=false;
                return {cancel:block};
            }		
		} // End if for testing 3rd party request		
    },
    // filters
    {urls: [ "<all_urls>" ]},
    // extraInfoSpec
    ["blocking", "requestBody"]
);

/*
chrome.webRequest.onBeforeSendHeaders.addListener(
	function(info) {
		
		var block = false;
		
		var cur_hostName = parseURLToHostname(cur_url);;		

		// Get URL of this request
		var rqst_hostName = parseURLToHostname(info.url);
				
				
		// Only check request body when host names are different
		if(rqst_hostName != cur_hostName) {
				
			// header is an array
			var header = info.requestHeaders;
			// console.log(header);
			// TODO: Check if requestHeader has PII leaked	
				
			var isLeaked = false;
			var infoLeaked = 0;
				
			for(var ii = 0; ii < header.length; ii++) {
				// res has two property: isLeaked : true/false
				//                       leakID: 0-63-->"what info is leaked" 
				var res = checkPIILeak(header[ii].value);
				if(res.isLeaked) {
					isLeaked = true;
					infoLeaked = infoLeaked | res.leakId;
					// console.log(header[ii].value);
				}										
			}
				
			// After Check for all the formData
			if(isLeaked) {
				console.log("User information has been leaked with type: " + infoLeaked);
				block = true;
			}	
				
		} // End if for Cheking 3rd party Domain
		
		return {cancel : block};
	},
	// filters
	{urls: ["<all_urls>" ]},
	// some other specification
	["blocking", "requestHeaders"]
);
*/

function loadJQuery(src_path){
	var jqueryScript = document.createElement("script");
	jqueryScript.type = "text/javascript";
	jqueryScript.src = src_path;
	document.getElementsByTagName("head")[0].appendChild(jqueryScript);
}
