document.addEventListener('DOMContentLoaded',
	function() {
		document.getElementById("form").addEventListener("submit", 
			function(){
				
				var form = document.getElementById("form");
				// If the form is not 7 (should not happen)
				if(form.length != 7) {
					alert("something wrong!")
				}				
				
				/* Check if Input Data is valid */
				var isvalid = true;
					
				// Test for names
				if(!(/^[a-zA-Z ]+$/.test(form[0].value))) {
					alert("FirstName is not legal");
					isvalid = false;
				}				
				if(!(/^[a-zA-Z ]+$/.test(form[1].value))) {
					alert("LastName is not legal");
					isvalid = false;
				}	
				if(!(/^\d{2}[./-]\d{2}[./-]\d{4}$/.test(form[2].value))) {
					alert("Date of Birth is not legal");
					isvalid = false;
				}
				if(!(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(form[3].value))) {
					alert("Email Address is not legal");
					isvalid = false;
				}
				if(!(/^[a-zA-Z0-9\s,'-]*$/i.test(form[4].value))) {
					alert("Physical Address is not legal");
					isvalid = false;
				}
				if(!(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(form[5].value))) {
					alert("Phone Number is not legal");
					isvalid = false;
				}
				if(!isvalid) {
					// If one of the checks have not been passed
					alert("Please check your user information again");
					return;
				}
				/* Normalize input data */
				
				// Change names to lowercase
				var firstname = form[0].value.toLowerCase();
				var lastname = form[1].value.toLowerCase();
				// Delete / in DOB, only store digits
				var dob = form[2].value.replace(/\D/g,'');
				// Do nothing with email
				var email = form[3].value.toLowerCase();
				// Change address to lowercase
				var address = form[4].value.toLowerCase();
				// Delete - in DOB, only store digits
				var phone = form[5].value.replace(/\D/g,'');
				
				
				chrome.storage.local.set( {'FirstName' : firstname});
				chrome.storage.local.set( {'LastName' : lastname});
				chrome.storage.local.set( {'DateOfBirth' : dob});
				chrome.storage.local.set( {'Email' : email});			
				chrome.storage.local.set( {'Address' : address});
				chrome.storage.local.set( {'PhoneNumber' : phone});
				
				alert("Saving Information to Local Storage");
				window.close();
			
			}
		);
		
		
		
	}
);
