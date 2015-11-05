document.addEventListener('DOMContentLoaded',
	function() {
		document.getElementById("form").addEventListener("submit", 
			function(){
				
				var form = document.getElementById("form");
				// If the form is not 7 (should not happen)
				if(form.length != 7) {
					alert("something wrong!")
				}
				
				localStorage.setItem('FirstName', form[0].value);
				localStorage.setItem('LastName', form[1].value);
				localStorage.setItem('DateOfBirth', form[2].value);
				localStorage.setItem('Email', form[3].value);				
				localStorage.setItem('Address', form[4].value);
				localStorage.setItem('PhoneNumber', form[5].value);
				
				alert("Saving Information to Local Storage");
				//window.close();
			}
		);
		
		
		
	}
);
