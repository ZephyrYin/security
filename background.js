// Pop up window in the center of the screen
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

// Query vector Is used to get User PII information
query_vector = ['FirstName', 'LastName', 'DateOfBirth', 'Email', 'Address', 'PhoneNumber'];
	
chrome.storage.local.get(query_vector,  function(ret) {
	firstName = ret.FirstName;
	lastName = ret.LastName;
	email = ret.Email
	dob = ret.DateOfBirth;
	address = ret.Address;
	phone = ret.PhoneNumber;
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

	
chrome.webRequest.onBeforeRequest.addListener(
    function(info) {
				
		// Notice: There is some minor bug, Some URL will be undefined
		chrome.tabs.query({'currentWindow': true, 'active': true}, function(tabs){
			
			// Get Current Tab			
			var cur_url = tabs[0].url;
			var cur_hostName = parseURLToHostname(cur_url);;		

			// Get URL of this request
			var rqst_hostName = parseURLToHostname(info.url);
						
			// Only check request body when host names are different
			if(rqst_hostName != cur_hostName) {
				
				// console.log("Current Window URL: " + cur_url);
				// console.log("Current Window hostName: " + cur_hostName);
				// console.log("Request hostName: " + rqst_hostName);
							
				if(info.requestBody !== undefined) {
					
					// TODO: We need to check if there is private information 
					// In all these headers
					
					if(info.requestBody.error !== undefined) {
						console.log(info.requestBody.error);
					}
					else if(info.requestBody.formData !== undefined) {
						// console.log(info.requestBody.formData);
						
						// *******************************************
						//         Test If PII has Leaked
						// *******************************************
						// TODO: Test if formData has PII leaked

						var isLeaked = false;
						var infoLeaked = [];
							
						// Form data is a dictionary e.g. {key: [value1, value2]}
						for(var key in info.requestBody.formData) {
							var content = info.requestBody.formData[key];
							for (var jj = 0; jj < content.length; jj++) {
								// Test over Six type of PII 
								// 1) Test for FirstName and LastName
								content[jj].search(ret.FirstName);
								content[jj].search(ret.LastName);
								// 2) Test for Email Address
							
								// 3) Test for TelephoneNumber
								
								// 4) Test for Physical Address
								
								// 5) Test for Date of Birth
								
							}
						}
					}
					else if(info.requestBody.raw !== undefined) {						
					// TODO: Test if Raw has PII leaked
					 
					}				
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
	function(info) {

		// Notice: There is some minor bug, Some URL will be undefined
		chrome.tabs.query({'currentWindow': true, 'active': true}, function(tabs){
			
			// Get Current Tab			
			var cur_url = tabs[0].url;
			var cur_hostName = parseURLToHostname(cur_url);;		

			// Get URL of this request
			var rqst_hostName = parseURLToHostname(info.url);
				
			var query_vector = ['FirstName', 'LastName', 'DateOfBirth', 'Email', 'Address', 'PhoneNumber'];
			// Only check request body when host names are different
			if(rqst_hostName != cur_hostName) {
				
				// header is an array
				var header = info.requestHeaders;
				// console.log(header);
				// TODO: Check if requestHeader has PII leaked

				console.log(firstName);			
				
			}
		});
		
		
	},
	// filters
	{urls: ["<all_urls>" ]},
	// some other specification
	["blocking", "requestHeaders"]
);
