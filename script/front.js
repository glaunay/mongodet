$(document).ready(function() {
	
	// Logo which show the missing value in DataTable
	var alertLogo = '<i class="fa fa-question-circle-o" aria-hidden="true"></i>'
	// Logo which show the color of detergent
	var colorLogo = '<i class="fa fa-square" aria-hidden="true"></i>'

	// Get the header of page with title
	$("header").html("<h1>Detergent Database CRUD Interface</h1>");

	// Initialise DataTables with column names
	$("#table").html(
		"<table id='detable' class='cell-border' cellspacing='0' width='100%''>"+
			"<thead>"+
				"<tr>"+
					"<th>Category</th>"+
					"<th>Name</th>"+
					"<th>Volum</th>"+
					"<th>Color</th> "+
					"<th>Complete name</th>"+
					"<th>Molecular formula</th>"+
					"<th>MM</th>"+
					"<th>CMC (mM)</th>"+
					"<th>Aggregation number</th>"+
					"<th>Ref</th>"+
					"<th>PDB file</th>"+
					"<th>detergent image</th>"+
					"<th>SMILES</th>"+
				"</tr>"+
			"</thead>"+
			"<tfoot>"+
				"<tr>"+
					"<th>Category</th>"+
					"<th>Name</th>"+
					"<th>Volum</th>"+
					"<th>Color</th>"+
					"<th>Complete name</th>"+
					"<th>Molecular formula</th>"+
					"<th>MM</th>"+
					"<th>CMC (mM)</th>"+
					"<th>Aggregation number</th>"+
					"<th>Ref</th>"+
					"<th>PDB file</th>"+
					"<th>detergent image</th>"+
					"<th>SMILES</th>"+
				"</tr>"+
			"</tfoot>"+
		"</table>");
	// Insert data into DataTable with options
	var table = $('#detable').DataTable( {
		"processing": true,
		"scrollX": true,
		"ajax": { "url": "/loadTab" },
		"columns": [
			{ "data": "category", "defaultContent": alertLogo },
			{ "data": "_id", "defaultContent": alertLogo },
			{ "data": "vol", "defaultContent": alertLogo },
			{ "data": "color", "defaultContent": alertLogo },
			{ "data": "complete_name", "defaultContent": alertLogo },
			{ "data": "Molecular_formula", "defaultContent": alertLogo },
			{ "data": "MM", "defaultContent": alertLogo },
			{ "data": "CMC_(mM)", "defaultContent": alertLogo },
			{ "data": "Aggregation_number", "defaultContent": alertLogo },
			{ "data": "Ref", "defaultContent": alertLogo },				
			{ "data": "PDB_file", "defaultContent": alertLogo },
			{ "data": "detergent_image", "defaultContent": alertLogo },
			{ "data": "SMILES", "defaultContent": alertLogo }

		],
		"aoColumnDefs": [ {
			"aTargets": [3],
			"fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
				let detColor = "rgb(" + String(sData) + ")"
				$(nTd).html(colorLogo)
				$(nTd).css('color', detColor)
			}
		} ]
	} );

	$("#modif").append('<button id="remove">Remove selected</button>');
	$("#remove").hide();

	// Select row for deleting
	$('#detable tbody').on( 'click', 'tr', function () {
		if ( $(this).hasClass('selected') ) {
			$(this).removeClass('selected');
			$("#remove").hide();
		}
		else {
			table.$('tr.selected').removeClass('selected');
			$(this).addClass('selected');
			$("#remove").show();
		}
	} );

	// Sent detergent for removing by POST
	$('#remove').click( function () {
        $.post("/removeDet",table.row('.selected').data());
        //$('#suptest').html(JSON.stringify(table.row('.selected').data()));
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