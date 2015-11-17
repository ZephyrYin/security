// Global Varabiles
var cur_url;

// Pop up window in the center of the screen
function popupwindow(url, title, w, h) {
  var left = (screen.width/2)-(w/2);
  var top = (screen.height/2)-(h/2);
  return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
}

function popup(){   
    var port = chrome.extension.connect({name: "Sample Communication"});
    port.postMessage("firstname;cs.sunysb.edu;low;yes;90% allow 5%Scrub %5 Stop");
    port.onMessage.addListener(function(msg) {
        console.log("message recieved "+ msg);
    });
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

// Parse a string to get the host of this url
function parseURLToHostname(url) {
	var parser = document.createElement('a');
	parser.href = url;
	var hostname = parser.hostname;
	// Find last 2 points in the hostname string
	var point2 = hostname.lastIndexOf(".");
	var point1 = hostname.lastIndexOf(".", point2 - 1);
	if(point1 == -1) {
		return hostname;
	}
	else {
		return hostname.substring(point1 + 1);
	}
}

// Add listener to event when current activate tab changes
chrome.tabs.onActivated.addListener(
	function(activeInfo) {
		chrome.tabs.query({'currentWindow': true, 'active': true}, function(tabs){
			console.log("Tab Changed: " + tabs[0].url);
		});
	}
);

// Add listener to event when current activate tab updates
chrome.tabs.onUpdated.addListener(
	function(changeInfo, tab) {		
		chrome.tabs.query({'currentWindow': true, 'active': true}, function(tabs){
			console.log("Tab Updated: " + tabs[0].url);
		});
	}
);
	
chrome.webRequest.onBeforeRequest.addListener(
    function(info) {
		
		// Flag whether to block the request
		var block = false;

		var cur_hostName = parseURLToHostname(cur_url);;		

		// Get URL of this request
		var rqst_hostName = parseURLToHostname(info.url);
						
		// Only check request body when host names are different
		//if(rqst_hostName != cur_hostName) {
				
			// console.log("Current Window URL: " + cur_url);
			// console.log("Current Window hostName: " + cur_hostName);
			// console.log("Request hostName: " + rqst_hostName);
							
			if(info.requestBody !== undefined) {
					
				// TODO: We need to check if there is private information 
				// In all these headers
					
				// Flags to check for Info Leakage in who requestBody
				var isLeaked = false;
				var infoLeaked = 0;
					
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
							var res = checkPIILeak(content[jj]);
							if(res.isLeaked) {
								isLeaked = true;
								infoLeaked = infoLeaked | res.leakId;
								// console.log(content[jj]);
							}								
						}
					}
						
					// After Check for all the formData
					if(isLeaked) {
						console.log("User information has been leaked with type: " + infoLeaked);
						blocked = true;
					}						
						
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
				return {cancel:blocked};				
			}				
		//} // End if for testing 3rd party request		
    },
    // filters
    {urls: [ "<all_urls>" ]},
    // extraInfoSpec
    ["blocking", "requestBody"]
);


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



function loadJQuery(src_path){
	var jqueryScript = document.createElement("script");
	jqueryScript.type = "text/javascript";
	jqueryScript.src = src_path;
	document.getElementsByTagName("head")[0].appendChild(jqueryScript);
}

//jQuery MAY OR MAY NOT be loaded at this stage
function getLeakInfo(url) {
	if(typeof jQuery != "undefined"){

		var json_query_obj = {
			type: 'domain',
			url: url				// url wanna to query
		};


		$.ajax({
			url: 'http://terminator.dpkg.me/api/get',
			type: 'POST',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify(json_query_obj),
			dataType: 'json',
			success: function(info) {
				console.log(info);		// get info here
			},
			error: function(err){
				console.log(err);
			}
		});
	}else{
		window.setTimeout(getLeakInfo, 1000, url);
	}
};

function saveLeakInfo(source_url, is_leak, is_accept, dest_url){
	if(typeof jQuery != "undefined"){
		var json_query_obj = {
			url: source_url,
			isLeak: is_leak,
			isAccept: is_accept,
			leakTo: dest_url
		}

		$.ajax({
			url: 'http://terminator.dpkg.me/api/put',
			type: 'POST',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify(json_query_obj),
			dataType: 'json',

			success: function(result) {
				console.log(result);
			},
			error: function(err){
				console.log(err);
			}
		});
	}else{
		window.setTimeout(saveLeakInfo, 1000, source_url, is_leak, is_accept, dest_url);
	}
}

//loadJQuery("./javascripts/jquery-2.1.4.min.js");			// initialize jQuery
//
//window.setTimeout(getLeakInfo, 1000, 'baidu.com');		// query baidu.com
//
//window.setTimeout(saveLeakInfo, 1000, "pornhub.com", true, true, [
//	{
//		url: 'https://91porn.com',
//		type: 1
//	},
//	{
//		url: 'http://sexinsex.net',
//		type: 2
//	}
//])
