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