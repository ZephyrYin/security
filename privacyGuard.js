// Query vector Is used to get User PII information
var query_vector = ['FirstName', 'LastName', 'DateOfBirth', 'Email', 'Address', 'PhoneNumber'];

chrome.storage.local.get(query_vector,  function(ret) {
	firstName = ret.FirstName;
	lastName = ret.LastName;
	email = ret.Email
	dob = ret.DateOfBirth;
	address = ret.Address;
	phone = ret.PhoneNumber;
	
	console.log(  firstName + " "
				+ lastName + " "
				+ email + " "
				+ dob + " "
				+ address + " "
				+ phone + " ");
});

function checkPIILeak(str){
    str=str.toLowerCase();
    var isLeaked = false,
        leakId = 0;
		
    if(leakFirstName(str)){
        leakId += 1;
		isLeaked = true;
    }
    if(leakLastName(str)){
        leakId += 2;
        isLeaked = true;
    }
    if(leakEmail(str)){
        leakId += 4;
        isLeaked = true;
    }
    if(leakBirthday(str)){
        leakId += 8;
        isLeaked = true;
    }
    if(leakAddress(str)){
        leakId += 16;
        isLeaked = true;
    }
    if(leakPhoneNumber(str)){
        leakId += 32;
        isLeaked = true;
    }
    
    return {'isLeaked':isLeaked, 'leakId':leakId};
}
function leakFirstName(str){
	str = str.toLowerCase();
    return str.match(firstName)!=null;
}
function leakLastName(str){
	str = str.toLowerCase();
    return str.match(lastName)!=null;
}
function leakEmail(str){
    return str.match(email)!=null;
}
function leakBirthday(str){
	// Construct the pattern to be matched
	var pattern = ".*" + dob.substring(0,2) + ".*" 
	                   + dob.substring(2,4) + ".*" 
					   + dob.substring(4,8) + ".*";
					
	var rgx = new RegExp(pattern);
    
	return rgx.test(str);
}
function leakAddress(str){
	str = str.toLowerCase();
    return str.match(address)!=null;
}
function leakPhoneNumber(str){
	// Construct the pattern to be matched
	var pattern = ".*" + phone.substring(0,3) + ".*" 
	                   + phone.substring(3,6) + ".*" 
					   + phone.substring(6,10) + ".*";
	
	var rgx = new RegExp(pattern);
	
    return rgx.test(str);
}