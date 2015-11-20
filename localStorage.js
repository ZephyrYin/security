function inLocalDict(source_url, dest_url){
	if(local_dict[source_url] != undefined){
		for(i in local_dict[source_url]){
			if(local_dict[source_url] == dest_url)
				return true;
		}
	}
	return false;
}



function saveLeafInfoToLocal(current_url){
	console.log(current_url)
	window.setTimeout(getLeakInfo, 1000, current_url, function(info){
		local_dict[current_url] = [];
		console.log(info)
		for(i in info.pages){
			local_dict[current_url].push(info.pages[i].url.toString());
		}
		console.log(local_dict[current_url].length)
	});		// query baidu.com
}