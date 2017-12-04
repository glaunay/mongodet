// Request the list of key names from server
fieldname = ""
$.get("/getKeys", function(data){
		fieldname = data;
});

$(document).ready(function() {

	// This document will getting from database in the future
	fieldname = {	"_id" : "fieldname",
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
			"PDB_file",
			"image",
			"SMILES"
		]
	};
	var fieldName = fieldname.inpfield;

	var table = undefined;

	// Logo which show the color of detergent
	var colorLogo = '<i class="fa fa-square" aria-hidden="true"></i>';

	var attFields = function attFields() {
		let code = '<div id="fieldadd">';
		for (i = 0; i < fieldName.length; i++) {
			if (fieldName[i] != 'color') {
				code += '<div class="w3-col l2 m4 w3-padding">'+ fieldName[i] +':<br>'+
					'<input type="text" autocomplete="on" class="w3-input w3-border" id="'+ fieldName[i] +'">'+
					'</div>';
			} else {
				code += '<div class="w3-col l2 m4 w3-padding">'+ fieldName[i] +':<br>'+
					'<input type="color" id="color" value=#808080 style="width:100%">'+
					'</div>';
			}
		};
		code += '</div>';
		return code;
	};

	// Contruct columns definition into a list of json for DataTable
	var colfunction = function(){
		let colname = [];
		for (i = 0; i < fieldName.length; i++) {
			if (fieldName[i]==="ref"){
				colname[colname.length] = { 
					"data": null, 
					"defaultContent": "<button class='w3-button w3-round-xxlarge'>"+
										"<i class='fa fa-eye' aria-hidden='true'></i></button>" };
			} else if (fieldName[i]==="image"){
				colname[colname.length] = { 
					"data": null, 
					"defaultContent": "<button class='w3-button w3-round-xxlarge'>"+
										"<i class='fa fa-eye' aria-hidden='true'></i></button>" };
			} else {
				colname[colname.length] = { "data": fieldName[i] };
			};
		};
		return colname;
	};

	// From https://gist.github.com/lrvick/2080648
	var RGBToHex = function(r,g,b){
		var bin = r << 16 | g << 8 | b;
		return (function(h){
			return new Array(7-h.length).join("0")+h
		})(bin.toString(16).toUpperCase())
	};

	// From https://gist.github.com/lrvick/2080648
	var hexToRGB = function(hex){
		var r = hex >> 16;
		var g = hex >> 8 & 0xFF;
		var b = hex & 0xFF;
		return [r,g,b];
	};

	// Build JSON by getting values from input field
	var formToJSON = function(){
		let jfile = {};
		for (i = 0; i < fieldName.length; i++) {
			let value = eval("$('#" + fieldName[i] + "').val()");
			if (value == ""){
				jfile[String(fieldName[i])] = null;
			} else {
				jfile[String(fieldName[i])] = value;
			};
		};
		jfile.color = hexToRGB("0x"+jfile.color.slice(1));
		return jfile;
	};

	// Build the HTML code for dataTable with column names
	var buildTabColumns = function(){
		let HTML = "";
		for (i = 0; i < fieldName.length; i++) {
			HTML += "<th>" + fieldName[i] + "</th>";
		};
		return HTML;
	}

	var selectedToInput = function(sRow){
		// Data of dertergent when selected
		for (i = 0; i < fieldName.length; i++) {
			let curField = fieldName[i];
			if (curField != "color") {
				$('#'+curField).val(eval('sRow.'+curField));
			} else {
				let curCol = sRow.color
				$('#'+curField).val("#"+RGBToHex(curCol[0],curCol[1],curCol[2]));
			};
		};
	};

////////////////// INITIALIZE PAGE CONTENTS //////////////////

	// Header content
	$("header").html("<h1><br>Detergent Database CRUD Interface</h1>");

	// Subtitle content
	$("#text").html("User-friendly front-end for <a href='http://detbelt.ibcp.fr/' target='_blank'>Det.Belt</a> detergents database");

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
		'<a href="https://www.bioinfo-lyon.fr/" target="_blank" class="w3-col w3-padding w3-center l2">'+
			'<img src="/pic/logo_BI.png" alt="Bioinfo@Lyon" class="w3-hover-opacity" style="max-width:100%">'+
		'</a>'+
		'<a href="http://www.cnrs.fr/" target="_blank" class="w3-col w3-padding w3-center l2 m4">'+
			'<img src="/pic/logo_CNRS.png" alt="CNRS" class="w3-hover-opacity">'+
		'</a>'+
		'<a href="http://ww3.ibcp.fr/mmsb/" target="_blank" class="w3-col w3-padding w3-center l2 m4">'+
			'<img src="/pic/logo_MMSB.png" alt="MMSB" class="w3-hover-opacity">'+
		'</a>'+
		'<a href="https://www.univ-lyon1.fr/" target="_blank" class="w3-col w3-padding w3-center l2 m4">'+
			'<img src="/pic/logo_UCBL.png" alt="UCBL" class="w3-hover-opacity">'+
		'</a>'+
		'<p class="w3-col w3-padding w3-tiny w3-text-white l2 m6" style="vertical-align:middle;">'+
			'Contact :<br>'+
			'<a href="mailto:sebastien.delolme-sabatier@etu.univ-lyon1.fr">Sébastien Delolme-Sabatier</a><br>'+
			'<a href="mailto:caroline.gaud@etu.univ-lyon1.fr">Caroline Gaud</a><br>'+
			'<a href="mailto:shangnong.hu@etu.univ-lyon1.fr">Shangnong Hu</a>'+
		'</p>'+
		'<p class="w3-col w3-padding w3-tiny w3-text-white l2 m6" style="vertical-align:middle;">'+
			'Powered by :<br>'+
			'Node.js - Express.js<br>'+
			'MongoDB<br>'+
			'jQuery - DataTable<br>'+
			'W3-CSS<br>'+
		'</p>');
	$("footer").css({"position": "relative", "right": "0", "bottom": "0", "left": "0", "padding": "1em"});

	// Buttons for operations on database
	$("#operationsbar").html(
		'<div class="w3-col w3-padding w3-mobile l2 m3"><button id="btnbrowse" class="w3-btn w3-round-large w3-ripple w3-block w3-teal">'+
			'<i class="fa fa-table" aria-hidden="true"></i> Browse only</button></div>'+
		'<div class="w3-col w3-padding w3-mobile l2 m3"><button id="btnaddDet" class="w3-btn w3-round-large w3-ripple w3-block w3-green">'+
			'<i class="fa fa-plus-circle" aria-hidden="true"></i> Add new detergent</button></div>'+
		'<div class="w3-col w3-padding w3-mobile l2 m3"><button id="btnaddCol" class="w3-btn w3-round-large w3-ripple w3-block w3-green">'+
			'<i class="fa fa-plus-square" aria-hidden="true"></i> Add new column</button></div>'+
		'<div class="w3-col w3-padding w3-mobile l2 m3"><button id="btnrmCol" class="w3-btn w3-round-large w3-ripple w3-block w3-red">'+
			'<i class="fa fa-plus-square" aria-hidden="true"></i> Remove a column</button></div>'+
		'<div class="w3-col w3-padding w3-mobile l2 m3"><button id="btnupdate" class="w3-btn w3-round-large w3-ripple w3-block w3-blue">'+
			'<i class="fa fa-pencil-square-o" aria-hidden="true"></i> Update one</button></div>'+
		'<div class="w3-col w3-padding w3-mobile l2 m3"><button id="btnremove" class="w3-btn w3-round-large w3-ripple w3-block w3-red">'+
			'<i class="fa fa-trash" aria-hidden="true"></i> Remove one</button></div>'
	);
	$("#btnaddDet").prop('disabled',true);
	$("#btnaddCol").prop('disabled',true);
	$("#btnrmCol").prop('disabled',true);
	$("#btnupdate").prop('disabled',true);
	$("#btnremove").prop('disabled',true);

////////////////// ACTIONS ON PAGE //////////////////

	

	// Display the table or reload it
	$("#btnbrowse").click(function(){
		// Check if the table is already build or not yet
		if (table === undefined) {
			// Initialise DataTables with column names
			$("#table").html(
				"<div id='parameters' class='w3-padding w3-round'></div>"+
				"<table id='detable' class='hover cell-border' cellspacing='0' width='100%''>"+
					"<thead><tr>" + buildTabColumns() + "</tr></thead>"+
					"<tfoot><tr>" +	buildTabColumns() +	"</tr></tfoot>"+
				"</table>"
			);
			
			// Build checkboxs
			let cboxs = "<label id='dispar' class='w3-button w3-border w3-padding-small'>"+
					"Select which columns to display: </label>"+
					"<div id='cboxs' class='w3-border w3-padding w3-row'>";
			for (i = 0; i < fieldName.length; i++) {
				cboxs += '<div class="w3-col l2 m3 s6">'+
						'<input type="checkbox" class="w3-check" id="chk' + fieldName[i] + '"> ' + fieldName[i] + "	"+
						'</div>'
			};
			cboxs += "<div class='w3-col l2 m3 s6'><button class='w3-button w3-small' id='selall'><ins>Select all</ins></button>"+
					"<button class='w3-button w3-small' id='dselall'><ins>Unselect all</ins></button></div>"+
					"<div class='w3-col l2 m3 s6'><button id='hideCol' class='w3-button w3-margin w3-blue w3-small w3-round-xxlarge'>Apply</button></div></div>"
			
			// Build checkboxs into HTML
			$("#parameters").html(cboxs);
			
			// Set the checkboxsfield hidden by default
			$("#cboxs").hide();

			// Toggle the field
			$("#dispar").click(function(){
				$("#cboxs").toggle();
				// Select the boxs correspoding to visible columns
				for (i = 0; i < fieldName.length; i++) {
					document.getElementById("chk"+fieldName[i]).checked = table.column(i).visible();
				};
				$("#selall").click(function(){
					for (i = 0; i < fieldName.length; i++) {
						document.getElementById("chk"+fieldName[i]).checked = true;
					};
				});
				$("#dselall").click(function(){
					for (i = 0; i < fieldName.length; i++) {
						document.getElementById("chk"+fieldName[i]).checked = false;
					};
				});
			});
			
			// Hide selected columns
			$("#hideCol").click(function(){
				for (i = 0; i < fieldName.length; i++) {
					table.column( i ).visible( document.getElementById("chk"+fieldName[i]).checked );
				};
				$("#cboxs").hide();
			});

			// DataTable construction
			table = $('#detable').DataTable( {
				"processing": true,
				"scrollX": true,
				"deferRender": true,
				"responsive": true,
				"searchHighlight": true,
				"ajax": { "url": "/loadTab" },
				"columns": colfunction(),
				"aoColumnDefs": [ {
					"aTargets": [3],
					"fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
						let detColor = "rgb(" + String(sData) + ")"
						$(nTd).html(colorLogo)
						$(nTd).css('color', detColor)
					}
				} ]
			} );

			document.getElementById("table").className += " w3-padding";

			// When a row is selected...
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

					$("#modifupd1").hide();
					$("#modifupd2").show();

					// Data of dertergent when selected
					var selectedData = table.row('.selected').data();
					selectedToInput(selectedData);
				}
			} );

			// Alert reference of detergent
			$('#detable tbody').on( 'click', 'button', function () {
				var data = table.row( $(this).parents('tr') ).data();
				alert( data.ref );
			} );

			// Enable other operation's buttons
			$("#btnaddDet").prop('disabled',false);
			$("#btnaddCol").prop('disabled',false);
			$("#btnrmCol").prop('disabled',false);
			$("#btnupdate").prop('disabled',false);
			$("#btnremove").prop('disabled',false);

			// Init the table with only 4 first columns, corresponding to Category,
			// Name, Volume and Color
			let visCol = ["category","_id","volume","color"]
			for (i = 0; i < fieldName.length; i++) {
				// if current fieldname is in visCol
				if (visCol.indexOf(fieldName[i]) != -1){
					table.column(i).visible(true);
				} else {
					table.column(i).visible(false);
				};
			};
		} else {
			// When the table is already here
			$("#modif").empty();
			$('#detable').DataTable().ajax.reload();
		};
	});

	// Enable field for adding new detergent
	$("#btnaddDet").click(function(){
		document.getElementById("modif").className = "w3-pale-green";
		let submitbtn = '<div class="w3-col l2 m4 w3-padding">'+
			'<br><button id="sendnew" class="w3-btn w3-round w3-green w3-block w3-ripple">'+
			'Add new detergent <i class="fa fa-arrow-right" aria-hidden="true"></i></button>'+
			'</div>';
		$("#modif").empty();
		$("#modif").append(attFields);
		$("#_id").attr('required',true); // to be improved into a function
		$("#modif").append(submitbtn);
		var selectedData = table.row('.selected').data();
		if (selectedData != undefined) {
			selectedToInput(selectedData);
		};
		// Send POST request for new detergent
		$("#sendnew").click(function(){
			$.post("/newDet", formToJSON() );
			let alertName = formToJSON()._id;
			$('#detable').DataTable().ajax.reload();
			$("[autocomplete]").val("");
			alert(String(alertName) + " was successfully insert to database!");
		});
		$("#cboxs").hide();
	});

	// Enable field for removing detergent
	$("#btnremove").click(function(){
		$("#modifupd1").hide();
		$("#modif").empty();
		$("#modif").html('<div class="w3-margin w3-padding w3-bottom w3-center">'+
			'<button id="sendremove" class="w3-btn w3-red w3-ripple w3-round"><b>Remove selected!</b></button>'+
			'</div>');
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
			if (confirm("ATTENTION!\nDid you really want to remove "+deletedName+"?\nThis process is NOT REVERSIBLE!") == true) {
				$.post("/removeDet",table.row('.selected').data());
				$('#detable').DataTable().ajax.reload();
				$("#sendremove").prop('disabled',true);
				alert(deletedName + " was successfully removed from database!");
			} 
		} );
		$("#cboxs").hide();
	});

	// Enable field for updating a detergent
	$("#btnupdate").click(function(){
		document.getElementById("modif").className = "w3-pale-blue";
		$("#modif").empty();
		$("#modif").html("<div id='modifupd1'><h3 class='w3-margin'>Please choose your detergent: </h3><div>");
		$("#modif").append("<div id='modifupd2'></div>");
		$("#modifupd2").html(attFields);
		$("#_id").attr("readonly",true);
		let submitbtn = '<div class="w3-col l2 m4 w3-padding">'+
			'<br><button id="sendupdate" class="w3-btn w3-round w3-blue w3-block w3-ripple">'+
			'Update detergent <i class="fa fa-arrow-right" aria-hidden="true"></i></button>'+
			'</div>';
		$("#modifupd2").append(submitbtn);
		$("#volume").attr("type","number")
		
		/*
		// check number type
		$("#volume").blur(function(){
			if (this.value.search(/[^\d,\.]/g) != -1){
				$(this).addClass('w3-red');
			} else {
				$(this).removeClass('w3-red');
			};
		});
		*/
		
		var selectedData = table.row('.selected').data();
		if (selectedData != undefined) {
			$("#modifupd1").hide();
			$("#modifupd2").show();
			selectedToInput(selectedData);
		} else {
			$("#modifupd1").show();
			$("#modifupd2").hide();
		};

		// Send POST request for update one detergent
		$("#sendupdate").click(function(){
			let modifiedName = table.row('.selected').data()._id;
			console.log(formToJSON());
			//$.post("/updateDet", formToJSON() );
			$('#detable').DataTable().ajax.reload();
			$("[autocomplete]").val("");
			alert(modifiedName + " is now up to date!");
		});
		$("#cboxs").hide();
	});

	$("#btnrmCol").click(function(){
		$("#modifupd1").hide();
		let rmColbtn = '<button id="sendrmcol" class="w3-btn w3-round w3-red w3-ripple">'+
			'Remove column <i class="fa fa-arrow-right" aria-hidden="true"></i></button>';
		document.getElementById("modif").className = "w3-pale-red";
		$("#modif").empty();
		let code = '<h4>Choose one column name to remove: </h4><select name="col">';
		code += '<option value=""> </option>';
		for (i = 0; i < fieldName.length; i++) {
			code += '<option value="'+ fieldName[i] +'"> '+fieldName[i] + " </option>";
		};
		code += '</select>';
		$("#modif").html(code);
		$("#modif").append(rmColbtn);
		
		$("#sendrmcol").click(function(){
			let col = $(":selected")[0].value;
			if (col != ""){
				if (confirm("ATTENTION!\nDid you really want to remove the column "+col+"?\nThis process is NOT REVERSIBLE!") == true) {
					$.post("/removeCol",{"column": col});
					$('#detable').DataTable().ajax.reload();
					alert(col + " column was successfully removed from database!");
				}
			};
		});
	});
} );