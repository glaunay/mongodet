$(document).ready(function() {
	
	// This document will getting from database in the future
	fieldname = {	"_id" : "fieldname",
		"database":[
			"category",
			"_id",
			"vol",
			"color",
			"complete_name",
			"Molecular_formula",
			"MM",
			"CMC",
			"Aggregation_number",
			"Ref",
			"PDB_file",
			"detergent_image",
			"SMILES"
		],
		"htmltable":[
			"Category",
			"Name",
			"Volume",
			"Color",
			"Complete name",
			"Molecular formula",
			"MM",
			"CMC (mM)",
			"Aggregation number",
			"References",
			"PDB file",
			"Detergent image",
			"SMILES"
		],
		"inpfield":[
			"category",
			"_id",
			"volume",
			"color",
			"complete_name",
			"molecular_formula",
			"molecular_mass",
			"CMC",
			"aggregation_number",
			"ref",
			"pdbfile",
			"image",
			"smiles"
		]
	};
	var dbField = fieldname.database;
	var htField = fieldname.htmltable;
	var ipField = fieldname.inpfield;

	var table = undefined;

	var listHide = [];

	// Logo which show the color of detergent
	var colorLogo = '<i class="fa fa-square" aria-hidden="true"></i>';

	var attFields = '<div id="fieldadd">'+
		'<div class="w3-col m2">'+
			'<b>Category:</b><br>'+
			'<input type="text" id="category"><br>'+
			'<b>Name:</b><br>'+
			'<input type="text" id="_id"><br>'+
		'</div>'+
		'<div class="w3-col m2">'+
			'<b>Volum:</b><br>'+
			'<input type="text" id="volume"><br>'+
			'<b>Color:</b><br>'+
			'<input type="color" id="color" value=#cc66ff style="width:70%;"><br>'+
		'</div>'+
		'<div class="w3-col m2">'+
			'Complete name:<br>'+
			'<input type="text" id="complete_name"><br>'+
			'Molecular formula:<br>'+
			'<input type="text" id="molecular_formula"><br>'+
		'</div>'+
		'<div class="w3-col m2">'+
			'MM:<br>'+
			'<input type="text" id="molecular_mass"><br>'+
			'CMC (nm):<br>'+
			'<input type="text" id="CMC"><br>'+
		'</div>'+
		'<div class="w3-col m2">'+
			'Aggregation number:<br>'+
			'<input type="text" id="aggregation_number"><br>'+
			'Ref:<br>'+
			'<input type="text" id="ref"><br>'+
		'</div>'+
		'<div class="w3-col m2">'+
			'PDB file:<br>'+
			'<input type="text" id="pdbfile"><br>'+
			'Detergent image:<br>'+
			'<input type="text" id="image"><br>'+
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
		let jfile = {};
		for (i = 0; i < dbField.length; i++) {
			jfile[String(dbField[i])] = eval("$('#" + ipField[i] + "').val()");
		};
		jfile.color = hexToRGB("0x"+jfile.color.slice(1));
		return jfile;
	};

	buildTabColumns = function(){
		let HTML = "";
		for (i = 0; i < htField.length; i++) {
			HTML += "<th>" + htField[i] + "</th>";
		};
		return HTML;
	}

	selectedToInput = function(sRow){
		// Data of dertergent when selected
		$("#category").val(sRow.category);
		$("#_id").val(sRow._id);
		$("#volume").val(sRow.vol);
		let selCol = sRow.color
		$("#color").val("#"+RGBToHex(selCol[0],selCol[1],selCol[2]));
		$("#complete_name").val(sRow.complete_name);
		$("#molecular_formula").val(sRow.Molecular_formula);
		$("#molecular_mass").val(sRow.MM);
		$("#CMC").val(sRow.CMC);
		$("#aggregation_number").val(sRow.Aggregation_number);
		$("#ref").val(sRow.Ref);
		$("#pdbfile").val(sRow.PDB_file);
		$("#image").val(sRow.detergent_image);
		$("#smiles").val(sRow.SMILES);
	};


////////////////// INITIALIZE PAGE CONTENTS //////////////////

	// Header content
	$("header").html("<h1><br>Detergent Database CRUD Interface</h1>");

	// Subtitle content
	$("#text").html("User-friendly front-end for Det.Belt detergents database");

	// Generate message card at openning
	/*$("#message").html(
		'<div class="w3-panel w3-red w3-display-container">'+
			'<span onclick="this.parentElement.style.display='+"'none'"+'" class="w3-button w3-red w3-large w3-display-topright">&times;</span>'+
			'<h3>Adblock detected!</h3>'+
			'<p>Please disable Adblock to continue dealing with your favorite detergents ;)</p>'+
		'</div>'+
		'<div class="w3-panel w3-blue w3-display-container">'+
			'<span onclick="this.parentElement.style.display='+"'none'"+'" class="w3-button w3-blue w3-large w3-display-topright">&times;</span>'+
			'<h3>Welcome!</h3>'+
			'<p>Hello, you are using the database managing interface for Det.Belt. You have five buttons on the top of screen. '+
			'They allow you swich between managing operations. Be careful with the red button on top right and have fun!</p>'+
		'</div>'
	);*/
	
	// Footer content
	$("footer").html(
		'<div id="flogo" class="w3-container w3-col w3-half w3-row">'+
			'<a href="http://www.cnrs.fr/" target="_blank" class="w3-margin w3-col" style="width:12.5%">'+
				'<img src="/pic/logo_CNRS.png" alt="CNRS" class="w3-hover-opacity">'+
			'</a>'+
			'<a href="http://ww3.ibcp.fr/mmsb/" target="_blank" class="w3-margin  w3-col" style="width:12.5%">'+
				'<img src="/pic/logo_MMSB.png" alt="MMSB" class="w3-hover-opacity">'+
			'</a>'+
			'<a href="https://www.univ-lyon1.fr/" target="_blank" class="w3-margin  w3-col" style="width:12.5%">'+
				'<img src="/pic/logo_UCBL.png" alt="UCBL" class="w3-hover-opacity">'+
			'</a>'+
			'<a href="https://www.bioinfo-lyon.fr/" target="_blank" class="w3-margin  w3-col" style="width:12.5%">'+
				'<img src="/pic/logo_BI.png" alt="Bioinfo@Lyon" class="w3-hover-opacity">'+
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
	$("footer").css({"position": "relative", "right": "0", "bottom": "0", "left": "0", "padding": "1em"});


	// Contruct columns definition into a list of json for DataTable
	var colfunction = function(){
			let colname = [];
			for (i = 0; i < dbField.length; i++) {
				if (dbField[i]==="Ref"){
					colname[colname.length] = { "data": null, "defaultContent": "<button>See ref</button>" };
				} else {
					colname[colname.length] = { "data": dbField[i] };
				};
			};
			return colname;
		};

	// Buttons for operations on database
	$("#operationsbar").html(
		'<div class="w3-col w3-padding w3-mobile" style="width:20%"><button id="btnbrowse" class="w3-btn w3-round-large w3-ripple w3-block w3-teal">'+
			'<i class="fa fa-table" aria-hidden="true"></i> Browse only</button></div>'+
		'<div class="w3-col w3-padding w3-mobile" style="width:20%"><button id="btnaddDet" class="w3-btn w3-round-large w3-ripple w3-block w3-green">'+
			'<i class="fa fa-plus-circle" aria-hidden="true"></i> Add new detergent</button></div>'+
		'<div class="w3-col w3-padding w3-mobile" style="width:20%"><button id="btnaddCol" class="w3-btn w3-round-large w3-ripple w3-block w3-green">'+
			'<i class="fa fa-plus-square" aria-hidden="true"></i> Add new column</button></div>'+
		'<div class="w3-col w3-padding w3-mobile" style="width:20%"><button id="btnupdate" class="w3-btn w3-round-large w3-ripple w3-block w3-blue">'+
			'<i class="fa fa-pencil-square-o" aria-hidden="true"></i> Update one</button></div>'+
		'<div class="w3-col w3-padding w3-mobile" style="width:20%"><button id="btnremove" class="w3-btn w3-round-large w3-ripple w3-block w3-red">'+
			'<i class="fa fa-trash" aria-hidden="true"></i> Remove one</button></div>'
	);
	$("#btnaddDet").prop('disabled',true);
	$("#btnaddCol").prop('disabled',true);
	$("#btnupdate").prop('disabled',true);
	$("#btnremove").prop('disabled',true);

////////////////// ACTIONS ON PAGE //////////////////

	// Alert reference of detergent
	$('#detable tbody').on( 'click', 'button', function () {
		var data = table.row( $(this).parents('tr') ).data();
		alert( data.Ref );
	} );

	// Display the table or reload it
	$("#btnbrowse").click(function(){
		// Check if the table is already build or not yet
		if (table === undefined) {
			// Initialise DataTables with column names
			$("#table").html(
				"<div id='parameters'></div>"+
				"<table id='detable' class='cell-border' cellspacing='0' width='100%''>"+
					"<thead><tr>" + buildTabColumns() + "</tr></thead>"+
					"<tfoot><tr>" +	buildTabColumns() +	"</tr></tfoot>"+
				"</table>"
			);
			
			// Build checkboxs
			let cboxs = "";
			for (i = 0; i < htField.length; i++) {
				cboxs += '<input type="checkbox" id="chk' + ipField[i] + '"> ' + htField[i] + "	";
			};
			$("#parameters").html(cboxs);
			$("#parameters").append("<br><button id='hideCol'>Hide columns</button>");
			$("#hideCol").click(function(){
				listHide = [];
				for (i = 0; i < htField.length; i++) {
					console.log(i,!document.getElementById("chk"+ipField[i]).checked);
					listHide[i] = { "target": [i], "visible": document.getElementById("chk"+ipField[i]).checked};
				};
				console.log(listHide);
				$('#detable').DataTable().ajax.reload();
			});

			// DataTable construction
			table = $('#detable').DataTable( {
				"processing": true,
				"scrollX": true,
				"deferRender": true,
				"responsive": true,
				"ajax": { "url": "/loadTab" },
				"columns": colfunction(),
				"aoColumnDefs": [ {
					"aTargets": [3],
					"fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
						let detColor = "rgb(" + String(sData) + ")"
						$(nTd).html(colorLogo)
						$(nTd).css('color', detColor)
					}
				} ],
				"columnDefs": [{"target": [1], "visible": false}]
			} );
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
					selectedToInput(selectedData);
				}
			} );
			// Enable other operation's buttons
			$("#btnaddDet").prop('disabled',false);
			$("#btnaddCol").prop('disabled',false);
			$("#btnupdate").prop('disabled',false);
			$("#btnremove").prop('disabled',false);
		} else {
			$("#modif").empty();
			$('#detable').DataTable().ajax.reload();
		};
	});

	// Enable field for adding new detergent
	$("#btnaddDet").click(function(){
		$("#modif").empty();
		$("#modif").html(attFields);
		$("#modif").append('<button id="sendnew" class="w3-btn w3-green w3-block w3-ripple">Add new detergent</button>');
		var selectedData = table.row('.selected').data();
		if (selectedData != undefined) {
			selectedToInput(selectedData);
		};
		// Send POST request for new detergent
		$("#sendnew").click(function(){
			$.post("/newDet", formToJSON() );
			console.log(formToJSON());
			let alertName = formToJSON()._id;
			$('#detable').DataTable().ajax.reload();
			$("#modif").empty();
			$("#modif").html(attFields);
			$("#modif").append('<button id="sendnew" class="w3-btn w3-green w3-block w3-ripple">Add new detergent</button>');
			alert(String(alertName) + " was successfully insert to database!");
		});
	});

	// Enable field for removing detergent
	$("#btnremove").click(function(){
		$("#modif").empty();
		$("#modif").html('<button id="sendremove" class="w3-btn w3-red w3-block w3-ripple">Remove selected!</button>');
		var selectedData = table.row('.selected').data();
		if (selectedData === undefined) {
			$("#sendremove").prop('disabled',true);
		} else {
			$("#sendremove").prop('disabled',false);
		};
		//selectedToInput(selectedData);
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
	$("#btnupdate").click(function(){
		$("#modif").empty();
		$("#modif").html(attFields);
		$("#modif").append('<button id="sendupdate" class="w3-btn w3-blue w3-block w3-ripple">Update detergent</button>');
		var selectedData = table.row('.selected').data();
		if (selectedData != undefined) {
			selectedToInput(selectedData);
		};
		// Send POST request for update one detergent
		$("#sendupdate").click(function(){
			let modifiedName = table.row('.selected').data()._id;
			$.post("/updateDet", formToJSON() );
			$('#detable').DataTable().ajax.reload();
			$("#modif").empty();
			$("#modif").html(attFields);
			$("#modif").append('<button id="sendupdate" class="w3-btn w3-blue w3-block w3-ripple">Update detergent</button>');
			alert(modifiedName + " is now up to date!");
		});
	});

} );