document.addEventListener('DOMContentLoaded',
	function() {
		document.getElementById("form").addEventListener("submit", 
			function(){
				
				var form = document.getElementById("form");
				// If the form is not 7 (should not happen)
				if(form.length != 7) {
					alert("something wrong!")
				}
								
				chrome.storage.local.set( {'FirstName' : form[0].value.toLowerCase()});
				chrome.storage.local.set( {'LastName' : form[1].value.toLowerCase()});
				chrome.storage.local.set( {'DateOfBirth' : form[2].value});
				chrome.storage.local.set( {'Email' : form[3].value});			
				chrome.storage.local.set( {'Address' : form[4].value});
				chrome.storage.local.set( {'PhoneNumber' : form[5].value});
				
				/* Test If we can get information 
				chrome.storage.local.get(['FirstName', 'LastName'], function(ret) {
					console.log("FirstName Saved is: " + ret.FirstName);
					console.log("LastName Saved is: " + ret.LastName);
				});
				*/
				
				alert("Saving Information to Local Storage");
				window.close();
			
			}
		);
		
		
		
	}
);
