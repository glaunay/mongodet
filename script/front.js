$(document).ready(function() {
	
	// Logo which show the missing value in DataTable
	var alertLogo = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>'
	// Logo which show the color of detergent
	var colorLogo = '<i class="fa fa-heart" aria-hidden="true"></i>'

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
					$(nTd).html(colorLogo+colorLogo+colorLogo)
					$(nTd).css('color', detColor)
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
	
	// Subtitle content
	$("#text").html("User-friendly front-end for MongoDB");
	
	// Footer content
	$("footer").html(
		'<div id="flogo" class="w3-container w3-col m4 13">'+
		'<a href="http://www.cnrs.fr/" target="_blank">'+
		'<img src="/pic/logo_CNRS.png" alt="CNRS" height="100">'+
		'</a>'+
		'<a href="http://ww3.ibcp.fr/mmsb/" target="_blank">'+
		'<img src="/pic/logo_MMSB.png" alt="MMSB" height="100">'+
		'</a>'+
		'<a href="https://www.univ-lyon1.fr/" target="_blank">'+
		'<img src="/pic/logo_UCBL.png" alt="UCBL" height="100">'+
		'</a>'+
		'</div>'+
		'<div class="w3-container w3-small w3-col m8 19">'+
		'<p>'+
		'Contact :<br>'+
		'<a href="mailto:sebastien.delolme-sabatier@etu.univ-lyon1.fr">Sebastien Delolme-Sabatier</a><br>'+
		'<a href="mailto:caroline.gaud@etu.univ-lyon1.fr">Caroline Gaud</a><br>'+
		'<a href="mailto:shangnong.hu@etu.univ-lyon1.fr">Shangnong Hu</a>'+
		'</p>'+
		'</div>');

	// Send POST request for new detergent
	$("#submit").click(function(){
		let rgbColor = $("#dcolor").val().match(/[A-Za-z0-9]{2}/g).map(function(v) { return parseInt(v, 16) });
		$.post("/newDet",
		{
			"category": $("#categ").val(),
			"_id": $("#dname").val(),
			"vol": $("#volum").val(),
			"color": rgbColor
		});
	}); 

} );