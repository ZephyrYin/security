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
    
    return true;
}
function leakLastName(str){
    
    return true;
}
function leakEmail(str){
    return true;
}
function leakBirthday(str){
    return true;
}
function leakAddress(str){
    return true;
}
function leakPhoneNumber(str){
    return true;
}