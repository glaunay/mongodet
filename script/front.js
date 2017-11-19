$(document).ready(function() {
	
	// Logo which show the missing value in DataTable
	var alertLogo = '<i class="fa fa-question-circle-o" aria-hidden="true"></i>'
	// Logo which show the color of detergent
	var colorLogo = '<i class="fa fa-square" aria-hidden="true"></i>'

	var attFields = '<div id="fieldadd">'+
		'<div class="w3-col m2">'+
			'<b>Category:</b><br>'+
			'<input type="text" id="categ"><br>'+
			'<b>Name:</b><br>'+
			'<input type="text" id="dname"><br>'+
		'</div>'+
		'<div class="w3-col m2">'+
			'<b>Volum:</b><br>'+
			'<input type="text" id="volum"><br>'+
			'<b>Color:</b><br>'+
			'<input type="color" id="dcolor" value=#cc66ff style="width:70%;"><br>'+
		'</div>'+
		'<div class="w3-col m2">'+
			'Complete name:<br>'+
			'<input type="text" id="dcname"><br>'+
			'Molecular formula:<br>'+
			'<input type="text" id="molform"><br>'+
		'</div>'+
		'<div class="w3-col m2">'+
			'MM:<br>'+
			'<input type="text" id="molmass"><br>'+
			'CMC (nm):<br>'+
			'<input type="text" id="cmc"><br>'+
		'</div>'+
		'<div class="w3-col m2">'+
			'Aggregation number:<br>'+
			'<input type="text" id="aggnum"><br>'+
			'Ref:<br>'+
			'<input type="text" id="docref"><br>'+
		'</div>'+
		'<div class="w3-col m2">'+
			'PDB file:<br>'+
			'<input type="text" id="pdbfile"><br>'+
			'Detergent image:<br>'+
			'<input type="text" id="detpic"><br>'+
		'</div>'+
		'<div class="w3-col m2">'+
			'SMILES:<br>'+
			'<input type="text" id="smiles"><br>'+
		'</div>'+
	'</div>'

////////////////// INITIALIZE PAGE CONTENTS //////////////////

	// Header content
	$("header").html("<h1>Detergent Database CRUD Interface</h1>");

	// Subtitle content
	$("#text").html("User-friendly front-end for MongoDB");
	
	// Footer content
	$("footer").html(
		'<div id="flogo" class="w3-container w3-col m4 13">'+
		'<a href="http://www.cnrs.fr/" target="_blank">'+
		'<img src="/pic/logo_CNRS.png" alt="CNRS">'+
		'</a>'+
		'<a href="http://ww3.ibcp.fr/mmsb/" target="_blank">'+
		'<img src="/pic/logo_MMSB.png" alt="MMSB">'+
		'</a>'+
		'<a href="https://www.univ-lyon1.fr/" target="_blank">'+
		'<img src="/pic/logo_UCBL.png" alt="UCBL">'+
		'</a>'+
		'</div>'+
		'<div class="w3-container w3-small w3-col m8 19">'+
		'<p style="vertical-align:middle;">'+
		'Contact :<br>'+
		'<a href="mailto:sebastien.delolme-sabatier@etu.univ-lyon1.fr">Sebastien Delolme-Sabatier</a><br>'+
		'<a href="mailto:caroline.gaud@etu.univ-lyon1.fr">Caroline Gaud</a><br>'+
		'<a href="mailto:shangnong.hu@etu.univ-lyon1.fr">Shangnong Hu</a>'+
		'</p>'+
		'</div>');

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

	// Buttons for operations on database
	$("#operationsbtn").html(
		'<h3>Operations</h3>'+
		'<div class="w3-container w3-margin">'+
			'<button id="btnbrowse" class="w3-btn w3-ripple w3-teal">Browse only</button>'+
			'<button id="btnadd" class="w3-btn w3-ripple w3-green">Add new</button>'+
			'<button id="btnremv" class="w3-btn w3-ripple w3-red w3-right">Remove one</button>'+
			'<button id="btnupdt" class="w3-btn w3-ripple w3-blue">Update one</button>'+
		'</div>');
	
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
			{ "data": "cmc", "defaultContent": alertLogo },
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

////////////////// ACTIONS ON PAGE //////////////////

	// Select row
	$('#detable tbody').on( 'click', 'tr', function () {
		if ( $(this).hasClass('selected') ) {
			$(this).removeClass('selected');
			// For removing
			$("#sendremove").prop('disabled',true);
		}
		else {
			table.$('tr.selected').removeClass('selected');
			$(this).addClass('selected');
			// For removing
			$("#sendremove").prop('disabled',false);
			// Data of dertergent when selected
			var selectedData = table.row('.selected').data();
			$("#categ").val(selectedData.category);
			$("#dname").val(selectedData._id);
			$("#volum").val(selectedData.vol);
			//$("#dcolor").val(selectedData.dcolor);	// there has convertion to do
			$("#dcname").val(selectedData.complete_name);
			$("#molform").val(selectedData.Molecular_formula);
			$("#molmass").val(selectedData.MM);
			$("#cmc").val(selectedData.CMC_(mM));
			$("#aggnum").val(selectedData.Aggregation_number);
			$("#docref").val(selectedData.Ref);
			$("#pdbfile").val(selectedData.PDB_file);
			$("#detpic").val(selectedData.detergent_image);
			$("#smiles").val(selectedData.SMILES);
		}
	} );
	
	// Reset field
	$("#btnbrowse").click(function(){
		$("#modif").empty();
	});

	// Enable field for adding new detergent
	$("#btnadd").click(function(){
		$("#modif").empty();
		$("#modif").html(attFields);
		$("#modif").append('<button id="sendnew" class="w3-btn w3-green w3-block w3-ripple">Add new detergent</button>');
		// Send POST request for new detergent
		$("#sendnew").click(function(){
			let rgbColor = $("#dcolor").val().match(/[A-Za-z0-9]{2}/g).map(function(v) { return parseInt(v, 16) });
			$.post("/newDet",
			{
				"category": $("#categ").val(),
				"_id": $("#dname").val(),
				"vol": $("#volum").val(),
				"color": rgbColor,
				"complete_name": $("#dcname").val(),
				"Molecular_formula": $("#molform").val(),
				"MM": $("#molmass").val(),
				"cmc": $("#cmc").val(),
				"Aggregation_number": $("#aggnum").val(),
				"Ref": $("#docref").val(),
				"PDB_file": $("#pdbfile").val(),
				"detergent_image": $("#detpic").val(),
				"SMILES": $("#smiles").val()
			};
		});
	});

	// Enable field for removing detergent
	$("#btnremv").click(function(){
		$("#modif").empty();
		$("#modif").html('<button id="sendremove" class="w3-btn w3-red w3-block w3-ripple">Remove selected!</button>');
		$("#sendremove").prop('disabled',true);
		// Send POST request for removing one detergent
		$('#sendremove').click( function () {
			$.post("/removeDet",table.row('.selected').data());
		} );
	});

	// Enable field for updating a detergent
	$("#btnupdt").click(function(){
		$("#modif").empty();
		$("#modif").html(attFields);
		$("#modif").append('<button id="sendupdate" class="w3-btn w3-blue w3-block w3-ripple">Update detergent</button>');
		// Send POST request for update one detergent
		$("#sendupdate").click(function(){
			let rgbColor = $("#dcolor").val().match(/[A-Za-z0-9]{2}/g).map(function(v) { return parseInt(v, 16) });
			$.post("/updateDet",
			{
				"category": $("#categ").val(),
				"_id": $("#dname").val(),
				"vol": $("#volum").val(),
				"color": rgbColor,
				"complete_name": $("#dcname").val(),
				"Molecular_formula": $("#molform").val(),
				"MM": $("#molmass").val(),
				"cmc": $("#cmc").val(),
				"Aggregation_number": $("#aggnum").val(),
				"Ref": $("#docref").val(),
				"PDB_file": $("#pdbfile").val(),
				"detergent_image": $("#detpic").val(),
				"SMILES": $("#smiles").val()
			});
		});
	});

} );