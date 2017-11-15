$(document).ready(function() {
	
	// Logo which show the missing value in DataTable
	var alertLogo = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>'

	// Get the header of page with title
	$.get("/getHeader", function(data, status){
		$("header").html(data);
	});

	// Get the table field with data
	$.get("/getTable", function(data, status){
		// Initialise DataTables with column names
		$("#table").html(data);
		// Insert data into DataTable with options
		var table = $('#detable').DataTable( {
			"processing": true,
			"scrollX": true,
			"ajax": { "url": "/loadTab" },
			"columns": [
				{ "data": "category", "defaultContent": alertLogo },
				{ "data": "_id", "defaultContent": alertLogo },
				{ "data": "vol", "defaultContent": alertLogo },
				{ "data": "color", "defaultContent": alertLogo }
			],
			"aoColumnDefs": [ {
				"aTargets": [3],
				"fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
					let detColor = "rgb(" + String(sData) + ")"
					$(nTd).html('<i class="fa fa-cc-amex" aria-hidden="true"></i>')
					$(nTd).css('color', detColor)
					console.log(sData)
				}
			} ]
		} );
	});

	// Get info from row where clicked
	$('#detable').on('click', 'tr', function () {
		var data = table.row( this ).data();
		console.log(data[0]);
		console.log("I'm here!");
	} );
	
	document.getElementById("text").innerHTML = "Ici y aura du texte explicatif";

} );