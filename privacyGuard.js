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
function decode(leakId){
    var str='',
        index=0;
    while(leakId>0&&index<6){
        if(leakId%2==1){
            if(str.length>0){
                str=str+',';
            }
            str=str+query_vector[index];
            index=index+1;
        }
        leakId=Math.floor(leakId/2);
     
    }
    return str;
}
function checkPIILeak(str){
    str=str.toLowerCase();// to lower case
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
	// Construct the pattern to be matched
	var pattern = "[^a-z]{0,1}" + firstName + "[^a-z]";
	var rgx = new RegExp(pattern);
	
	var pattern2 = firstName + "$";
	var rgx2 = new RegExp(pattern2);
	
    return rgx.test(str) || rgx2.test(str);
}
function leakLastName(str){
    // COnstruct the pattern to be matched
	var pattern = "[^a-z]{0,1}" + lastName + "[^a-z]";
	var rgx = new RegExp(pattern);
	
	var pattern2 = lastName + "$";
	var rgx2 = new RegExp(pattern2);
	
    return rgx.test(str) || rgx2.test(str);
}
function leakEmail(str){
    return str.match(email)!=null;
}
function leakBirthday(str){
	// Construct the pattern to be matched
	var day = dob.substring(0,2);
	var month = dob.substring(2,4);
	var year = dob.substring(4,8);
	
	var pattern = ".*" + day + ".*" + month + ".*" + year + ".*";
	var rgx = new RegExp(pattern);
	
	var pattern2 = ".*" + month + ".*" + day + ".*" + year + ".*";
    var rgx2 = new RegExp(pattern2);
	
	var pattern3 = ".*" + year + ".*" + month + ".*" + day + ".*";
	var rgx3 = new RegExp(pattern3);
	
	var pattern4 = ".*" + year + ".*" + day + ".*" + month + ".*";
	var rgx4 = new RegExp(pattern4);
	
	return rgx.test(str) || rgx2.test(str) || rgx3.test(str) || rgx4.test(str);
}
function leakAddress(str){	
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