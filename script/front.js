$(document).ready(function() {
	// Get the header of page with title
	var getHead = new XMLHttpRequest();
	getHead.onreadystatechange=function() {
	if (this.readyState == 4 && this.status == 200) {
		$("header").html(this.responseText);
		}
	};
	getHead.open("GET", "/getHeader", true);
	getHead.send();
	
	// Get the table field with data
	var getTab = new XMLHttpRequest();
	getTab.onreadystatechange=function() {
	if (this.readyState == 4 && this.status == 200) {
		$("#table").html(this.responseText);
		// Initialize DataTable with options
		$('#detable').DataTable( {
			"processing": true,
			"serverSide": false,
			"ajax": "data/det.json",
			"columns": [
				{ "data": "category" },
				{ "data": "name" },
				{ "data": "vol" },
				{ "data": "color" }
			]
		} );
		}
	};
	getTab.open("GET", "/getTable", true);
	getTab.send();

	document.getElementById("text").innerHTML = "Ici y aura du texte explicatif";

	// button for jQuery testing
	$("#btn1").click(function(){
		$("#text").append(" <b>Appended text</b>.");
	});
	$("#btn2").click(function(){
		$("#text").empty();
	});

} );