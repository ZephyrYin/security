// Query vector Is used to get User PII information
var query_vector = ['FirstName', 'LastName', 'DateOfBirth', 'Email', 'Address', 'PhoneNumber'];

chrome.storage.local.get(query_vector,  function(ret) {
	firstName = ret.FirstName;
	lastName = ret.LastName;
	email = ret.Email
	dob = ret.DateOfBirth;
	address = ret.Address;
	phone = ret.PhoneNumber;
});

function checkPIILeak(str){
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
    
    return {'isLeaked':leak, 'leakId':leakId};
}
function leakFirstName(str){
    // Normalize the string
	str = str.toLowerCase();
	var got = str.search(firstName);
	if(got == -1) {
		return false;
	}
	else {
		return true;
	}
}
function leakLastName(str){
    // Normalize the string
	str = str.toLowerCase();
	var got = str.search(lastName);
	if(got == -1) {
		return false;
	}
	else {
		return true;
	}
}
function leakEmail(str){
    var got = str.search(email);
	if(got == -1) {
		return false;
	}
	else {
		return true;
	}
}
// TODO: Complete Check for the rest of the three
function leakBirthday(str){
    return false;
}
function leakAddress(str){
    return false;
}
function leakPhoneNumber(str){
    return false;
}