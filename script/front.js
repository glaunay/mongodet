$(document).ready(function() {
	
	// Logo which show the missing value in DataTable
	var alertLogo = '<i class="fa fa-question-circle-o" aria-hidden="true"></i>';
	// Logo which show the color of detergent
	var colorLogo = '<i class="fa fa-square" aria-hidden="true"></i>';

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
	'</div>';

	// From https://gist.github.com/lrvick/2080648
	RGBToHex = function(r,g,b){
		var bin = r << 16 | g << 8 | b;
		return (function(h){
			return new Array(7-h.length).join("0")+h
		})(bin.toString(16).toUpperCase())
	};

	// From https://gist.github.com/lrvick/2080648
	hexToRGB = function(hex){
		var r = hex >> 16;
		var g = hex >> 8 & 0xFF;
		var b = hex & 0xFF;
		return [r,g,b];
	};

	// Build JSON by getting values from input field
	formToJSON = function(){
		return {
				"category": $("#categ").val(),
				"_id": $("#dname").val(),
				"vol": $("#volum").val(),
				"color": hexToRGB("0x"+$("#dcolor").val().slice(1)),
				"complete_name": $("#dcname").val(),
				"Molecular_formula": $("#molform").val(),
				"MM": $("#molmass").val(),
				"CMC": $("#cmc").val(),
				"Aggregation_number": $("#aggnum").val(),
				"Ref": $("#docref").val(),
				"PDB_file": $("#pdbfile").val(),
				"detergent_image": $("#detpic").val(),
				"SMILES": $("#smiles").val()
			};
	};

	buildTabColumns = function(){
		return "<th>Category</th>"+
				"<th>Name</th>"+
				"<th>Volume</th>"+
				"<th>Color</th> "+
				"<th>Complete name</th>"+
				"<th>Molecular formula</th>"+
				"<th>MM</th>"+
				"<th>CMC (mM)</th>"+
				"<th>Aggregation number</th>"+
				"<th>References</th>"+
				"<th>PDB file</th>"+
				"<th>Detergent image</th>"+
				"<th>SMILES</th>"
	}


////////////////// INITIALIZE PAGE CONTENTS //////////////////

	// Header content
	$("header").html("<h1>Detergent Database CRUD Interface</h1>");

	// Subtitle content
	$("#text").html("User-friendly front-end for MongoDB");
	
	// Footer content
	$("footer").html(
		'<div id="flogo" class="w3-container w3-col w3-half">'+
			'<a href="http://www.cnrs.fr/" target="_blank">'+
				'<img src="/pic/logo_CNRS.png" alt="CNRS">'+
			'</a>'+
			'<a href="http://ww3.ibcp.fr/mmsb/" target="_blank">'+
				'<img src="/pic/logo_MMSB.png" alt="MMSB">'+
			'</a>'+
			'<a href="https://www.univ-lyon1.fr/" target="_blank">'+
				'<img src="/pic/logo_UCBL.png" alt="UCBL">'+
			'</a>'+
			'<a href="https://www.bioinfo-lyon.fr/" target="_blank">'+
				'<img src="/pic/logo_BI.png" alt="Bioinfo@Lyon">'+
			'</a>'+
		'</div>'+
		'<div class="w3-container w3-small w3-col w3-half">'+
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
			"<thead><tr>" + buildTabColumns() + "</tr></thead>"+
			"<tfoot><tr>" +	buildTabColumns() +	"</tr></tfoot>"+
		"</table>");
	
	// Insert data into DataTable with options
	var table = $('#detable').DataTable( {
		"processing": true,
		"scrollX": true,
		"deferRender": true,
		"ajax": { "url": "/loadTab" },
		"columns": [
			{ "data": "category", "defaultContent": alertLogo },
			{ "data": "_id", "defaultContent": alertLogo },
			{ "data": "vol", "defaultContent": alertLogo },
			{ "data": "color", "defaultContent": alertLogo },
			{ "data": "complete_name", "defaultContent": alertLogo },
			{ "data": "Molecular_formula", "defaultContent": alertLogo },
			{ "data": "MM", "defaultContent": alertLogo },
			{ "data": "CMC", "defaultContent": alertLogo },
			{ "data": "Aggregation_number", "defaultContent": alertLogo },
			{ "data": null, "defaultContent": "<button>See ref</button>" },				
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

	// Buttons for operations on database
	$("#operationsbtn").html(
		'<h3>Operations</h3>'+
		'<div class="w3-container w3-margin">'+
			'<button id="btnbrowse" class="w3-btn w3-ripple w3-teal">Browse only</button>'+
			'<button id="btnadd" class="w3-btn w3-ripple w3-green">Add new</button>'+
			'<button id="btnremv" class="w3-btn w3-ripple w3-red w3-right">Remove one</button>'+
			'<button id="btnupdt" class="w3-btn w3-ripple w3-blue">Update one</button>'+
		'</div>');

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
			let selCol = selectedData.color
			$("#dcolor").val("#"+RGBToHex(selCol[0],selCol[1],selCol[2]));
			$("#dcname").val(selectedData.complete_name);
			$("#molform").val(selectedData.Molecular_formula);
			$("#molmass").val(selectedData.MM);
			$("#cmc").val(selectedData.CMC);
			$("#aggnum").val(selectedData.Aggregation_number);
			$("#docref").val(selectedData.Ref);
			$("#pdbfile").val(selectedData.PDB_file);
			$("#detpic").val(selectedData.detergent_image);
			$("#smiles").val(selectedData.SMILES);
		}
	} );

	// Alert reference of detergent
	$('#detable tbody').on( 'click', 'button', function () {
        var data = table.row( $(this).parents('tr') ).data();
        alert( data.Ref );
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
			$.post("/newDet", formToJSON() );
			$('#detable').DataTable().ajax.reload();
			$("#modif").empty();
			$("#modif").html(attFields);
			alert(formToJSON()._id + " was successfully insert to database!");
		});
	});

	// Enable field for removing detergent
	$("#btnremv").click(function(){
		$("#modif").empty();
		$("#modif").html('<button id="sendremove" class="w3-btn w3-red w3-block w3-ripple">Remove selected!</button>');
		$("#sendremove").prop('disabled',true);
		// Send POST request for removing one detergent
		$('#sendremove').click( function () {
			let deletedName = table.row('.selected').data()._id;
			$.post("/removeDet",table.row('.selected').data());
			$('#detable').DataTable().ajax.reload();
			$("#sendremove").prop('disabled',true);
			alert(deletedName + " was successfully removed from database!");
		} );
	});

	// Enable field for updating a detergent
	$("#btnupdt").click(function(){
		$("#modif").empty();
		$("#modif").html(attFields);
		$("#modif").append('<button id="sendupdate" class="w3-btn w3-blue w3-block w3-ripple">Update detergent</button>');
		// Send POST request for update one detergent
		$("#sendupdate").click(function(){
			let modifiedName = table.row('.selected').data()._id;
			$.post("/updateDet", formToJSON() );
			$('#detable').DataTable().ajax.reload();
			$("#modif").empty();
			$("#modif").html(attFields);
			alert(modifiedName + " is now up to date!");
		});
	});

} );