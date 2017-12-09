var NAME_LIST = [];
var table = undefined;
var NECESSARY_VAL = ["_id","category","volume","color"]
var selectedData;


$.get("/getKeys", function(data){
	
	NAME_LIST = data;
});

// Build input field for each column's operations
function attFields() {

	let code = '<div id="fieldadd">';
	for (i = 0; i < NAME_LIST.length; i++) {

		if (NAME_LIST[i] != 'color') {

			code += '<div class="w3-col l2 m4 w3-padding">'+ NAME_LIST[i] +':<br>'+
						'<input type="text" autocomplete="on" class="w3-input w3-border" id="'+ NAME_LIST[i] +'">'+
					'</div>';
		} else {

			code += '<div class="w3-col l2 m4 w3-padding">'+ NAME_LIST[i] +':<br>'+
						'<input type="color" id="color" value=#808080 style="width:100%">'+
					'</div>';
		}
	};
	
	code += '</div>';
	return code;
};



// Contruct columns definition into a list of json for DataTable
function columnDef(){

	let colname = [];
	for (i = 0; i < NAME_LIST.length; i++) {

		// Define 'ref' and 'image' manually for now
		if (NAME_LIST[i]==="ref"){

			colname[colname.length] = { 
				"data": null, 
				"defaultContent": 	"<button class='w3-button w3-round-xxlarge'>"+
										"<i class='fa fa-eye' aria-hidden='true'></i>"+
									"</button>"
			};
		} else if (NAME_LIST[i]==="image"){

			colname[colname.length] = { 
				"data": "img.jpg", 
				"defaultContent": "<p>See image</p>"
			};
		} else {

			colname[colname.length] = { "data": NAME_LIST[i] };
		};
	};
	
	return colname;
};



// From https://gist.github.com/lrvick/2080648
function RGBToHex(r,g,b){

	var bin = r << 16 | g << 8 | b;
	return (function(h){

		return new Array(7-h.length).join("0")+h
	})(bin.toString(16).toUpperCase())
};

// From https://gist.github.com/lrvick/2080648
function hexToRGB(hex){

	var r = hex >> 16;
	var g = hex >> 8 & 0xFF;
	var b = hex & 0xFF;
	return [r,g,b];
};



// Build JSON for AJAX by getting values from input field
function formToJSON(){

	let jfile = {};
	for (i = 0; i < NAME_LIST.length; i++) {

		let value = eval("$('#" + NAME_LIST[i] + "').val()");
		if (value == ""){

			jfile[String(NAME_LIST[i])] = null;
		} else {

			jfile[String(NAME_LIST[i])] = value;
		};
	};

	jfile.color = hexToRGB("0x"+jfile.color.slice(1));
	return jfile;
};



// Build the HTML code for dataTable with column names
function buildTabColumns(){

	let HTML = "";
	for (i = 0; i < NAME_LIST.length; i++) {

		HTML += "<th>" + NAME_LIST[i] + "</th>";
	};
	
	return HTML;
}



// Fill input field by getting selected detergent's values
function selectedToInput(sRow){

	// Data of dertergent when selected
	for (i = 0; i < NAME_LIST.length; i++) {

		let curField = NAME_LIST[i];
		if (curField != "color") {

			$('#'+curField).val(eval('sRow.'+curField));

		} else {

			let curCol = sRow.color
			$('#'+curField).val("#"+RGBToHex(curCol[0],curCol[1],curCol[2]));
		};
	};
};



function buildCheckbox(){

	// Build checkbox for display columns
	let cboxs = "<label id='dispar'>"+
					"Select which columns to display: "+
				"</label>"+
				"<div id='cboxs'>";

	for (i = 0; i < NAME_LIST.length; i++) {

		cboxs += 	'<div class="w3-col l2 m3 s6">'+
						'<input type="checkbox" id="chk' + NAME_LIST[i] + '"> ' + NAME_LIST[i] + "	"+
					'</div>';
	};

	cboxs += 	"<div>"+
					"<button id='selall'>"+
						"<ins>Select all</ins>"+
					"</button>"+
					"<button id='dselall'>"+
						"<ins>Unselect all</ins>"+
					"</button></div>"+
				"<div >"+
					"<button id='hideCol'>Apply</button>"+
				"</div>"+
				"</div>"
	
	// Inject checkboxs into HTML
	$("#parameters").html(cboxs);

	// Set the checkboxsfield hidden by default
	$("#cboxs").hide()

	// CSS setting
	$("#cboxs").addClass('w3-border w3-padding w3-row');
	$("#dispar").addClass('w3-button w3-border w3-padding-small')
	$("#cboxs div").addClass("w3-col l2 m3 s6");
	$("#cboxs input").addClass("w3-check");
	$("#cboxs button").addClass('w3-button w3-small');
	$("#hideCol").addClass('w3-margin w3-blue w3-round-xxlarge');

	// Toggle the display parameters field
	$("#dispar").click(function(){
		
		$("#cboxs").toggle();
		
		// Select the boxs correspoding to visible columns
		for (i = 0; i < NAME_LIST.length; i++) {

			document.getElementById("chk"+NAME_LIST[i]).checked = table.column(i).visible();

		};
	});
	
	$("#selall").click(function(){

		for (i = 0; i < NAME_LIST.length; i++) {

			document.getElementById("chk"+NAME_LIST[i]).checked = true;

		};
	});

	$("#dselall").click(function(){

		for (i = 0; i < NAME_LIST.length; i++) {

			document.getElementById("chk"+NAME_LIST[i]).checked = false;
		};
	});

	// Hide selected columns
	$("#hideCol").click(function(){

		for (i = 0; i < NAME_LIST.length; i++) {

			table.column( i ).visible( $("#chk"+NAME_LIST[i]).prop("checked") );
		};

		$("#cboxs").hide();
	});
};



// Function that combines operations necessary to construct DataTable on HTML
function buildDataTable(){

	// Logo which show the color of detergent
	let colorLogo = '<i class="fa fa-square" aria-hidden="true"></i>';

	let state = typeof(table);

	// Initialise DataTables with column names
	$("#table").empty();
	$("#table").addClass("w3-padding");

	//$("#parameters").empty();
	$("#table").html(
		"<div id='parameters' class='w3-padding w3-round'></div>"+
		"<table id='detable' class='hover cell-border' cellspacing='0' width='100%''>"+
			"<thead><tr>" + buildTabColumns() + "</tr></thead>"+
			"<tfoot><tr>" +	buildTabColumns() +	"</tr></tfoot>"+
		"</table>"
	);

	// DataTable construction
	table = $('#detable').DataTable( {
		"processing": true,
		"scrollX": true,
		"deferRender": true,
		"responsive": true,
		"searchHighlight": true,
		"ajax": { "url": "/loadTab" },
		"columns": columnDef(),
		"aoColumnDefs": [ {
			"aTargets": [NAME_LIST.indexOf("color")],
			"fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {

				let detColor = "rgb(" + String(sData) + ")"
				$(nTd).html(colorLogo)
				$(nTd).css('color', detColor)
			}
		} ]
	} );


	// When a row is selected...
	$('#detable tbody').on( 'click', 'tr', function () {

		if ( $(this).hasClass('selected') ) {

			$(this).removeClass('selected');
			// For removing
			$("#sendremove").prop('disabled',true);
			selectedData = undefined;
			$("#modifupd1").show();
			$("#modifupd2").hide();
		}
		else {

			table.$('tr.selected').removeClass('selected');
			$(this).addClass('selected');
			// For removing
			$("#sendremove").prop('disabled',false);

			$("#modifupd1").hide();
			$("#modifupd2").show();

			// Unable autofill for Add new detergent
			if ($("#sendnew")[0] === undefined){

				// Data of dertergent when selected
				selectedData = table.row('.selected').data();
				selectedToInput(selectedData);
			} else {

				$("[autocomplete]").val("");
				$("[type='color']").val("#808080");
			};
		}
	} );

	// Alert reference of detergent
	$('#detable tbody').on( 'click', 'button', function () {

		let data = table.row( $(this).parents('tr') ).data();
		alert( data.ref );
	} );

	// If table is already builded
	if (state == "undefined"){

		// show only four main columns
		for (i = 0; i < NAME_LIST.length; i++) {

			// if current field name is in visCol
			if (NECESSARY_VAL.indexOf(NAME_LIST[i]) != -1){

				table.column(i).visible(true);
			} else {

				table.column(i).visible(false);
			};
		};
	} else {

		$('#detable').DataTable().ajax.reload();
	};
};

$(document).ready(function() {

////////////////// INITIALIZE PAGE CONTENTS //////////////////

	// Header content
	$("header").html(
		"<h1>"+
			"<br>Detergent Database CRUD Interface"+
		"</h1>")
		.addClass("w3-container w3-blue-grey w3-padding");


	// Subtitle content
	$("#text").html(
		"User-friendly front-end for <a href='http://detbelt.ibcp.fr/' target='_blank'>"+
		"Det.Belt</a> detergents database");


	// Buttons for operations on database
	$("#operationsbar").html(
		'<div class="l4">'+
			'<button id="btnbrowse" class="w3-teal">'+
				'<i class="fa fa-table" aria-hidden="true"></i> Browse only'+
			'</button>'+
		'</div>'+
		'<div class="l2 m3">'+
			'<button id="btnaddDet" class="w3-green">'+
				'<i class="fa fa-plus-circle" aria-hidden="true"></i> Add new detergent'+
			'</button>'+
		'</div>'+
		'<div class="l2 m3">'+
			'<button id="btnrmCol" class="w3-red">'+
				'<i class="fa fa-plus-square" aria-hidden="true"></i> Manage columns'+
			'</button>'+
		'</div>'+
		'<div class="l2 m3">'+
			'<button id="btnupdate" class="w3-blue">'+
				'<i class="fa fa-pencil-square-o" aria-hidden="true"></i> Update detergent'+
			'</button>'+
		'</div>'+
		'<div class="l2 m3">'+
			'<button id="btnremove" class="w3-red">'+
				'<i class="fa fa-trash" aria-hidden="true"></i> Remove detergent'+
			'</button>'+
		'</div>')
		.addClass("w3-container w3-blue-gray w3-row w3-top");
	$("#operationsbar div").addClass("w3-col w3-padding w3-mobile")
	$("#operationsbar button").addClass("w3-btn w3-round-large w3-ripple w3-block")

	// Disable these buttons on page loading
	$("#btnaddDet").prop('disabled',true);
	$("#btnrmCol").prop('disabled',true);
	$("#btnupdate").prop('disabled',true);
	$("#btnremove").prop('disabled',true);


	// Footer content
	$("footer").html(
		'<a href="https://www.bioinfo-lyon.fr/" target="_blank">'+
			'<img src="/pic/logo_BI.png" alt="Bioinfo@Lyon" style="max-width:100%">'+
		'</a>'+
		'<a href="http://www.cnrs.fr/" target="_blank" class="m4">'+
			'<img src="/pic/logo_CNRS.png" alt="CNRS">'+
		'</a>'+
		'<a href="http://ww3.ibcp.fr/mmsb/?lang=en" target="_blank" class="m4">'+
			'<img src="/pic/logo_MMSB.png" alt="MMSB">'+
		'</a>'+
		'<a href="https://www.univ-lyon1.fr/" target="_blank" class="m4">'+
			'<img src="/pic/logo_UCBL.png" alt="UCBL">'+
		'</a>'+
		'<p style="vertical-align:middle;">'+
			'Contact :<br>'+
			'<a href="mailto:sebastien.delolme-sabatier@etu.univ-lyon1.fr">Sébastien Delolme-Sabatier</a><br>'+
			'<a href="mailto:caroline.gaud@etu.univ-lyon1.fr">Caroline Gaud</a><br>'+
			'<a href="mailto:shangnong.hu@etu.univ-lyon1.fr">Shangnong Hu</a>'+
		'</p>'+
		'<p style="vertical-align:middle;">'+
			'Powered by :<br>'+
			'Node.js - Express.js<br>'+
			'MongoDB<br>'+
			'jQuery - DataTable<br>'+
			'W3-CSS<br>'+
			'Font Awesome'+
		'</p>');
	// CSS setting
	$("footer").css({
		"position": "relative",
		"right": "0",
		"bottom": "0",
		"left": "0",
		"padding": "1em"})
		.addClass("w3-container w3-row w3-middle");
	$("footer [target]").addClass("w3-col w3-padding w3-center l2");
	$("footer p").addClass("w3-col w3-padding w3-tiny w3-text-white l2 m6");
	$("footer img").addClass("w3-hover-opacity");


////////////////// ACTIONS ON PAGE //////////////////

	

	// Display the table or reload it
	$("#btnbrowse").click(function(){

		$("#cboxs").hide();

		// Check if the table is already build or not yet
		if (table === undefined) {
			
			buildDataTable();
			buildCheckbox();

			// Enable other operation's buttons at the top
			$("#btnaddDet").prop('disabled',false);
			$("#btnrmCol").prop('disabled',false);
			$("#btnupdate").prop('disabled',false);
			$("#btnremove").prop('disabled',false);
			
		} else {

			// When the table is already here
			$("#modif").empty();
			$('#detable').DataTable().ajax.reload();
		};
		$("#modif").removeClass();
	});

	// Enable field for adding new detergent
	$("#btnaddDet").click(function(){

		let submitbtn =	'<div class="w3-col l2 m4 w3-padding">'+
							'<br>'+
							'<button id="sendnew" class="w3-btn w3-round w3-green w3-block w3-ripple">'+
								'Add new detergent <i class="fa fa-arrow-right" aria-hidden="true"></i>'+
							'</button>'+
						'</div>';
		
		$("#cboxs").hide()
		$("#modif").empty()
			.removeClass()
			.addClass("w3-pale-green")
			.append(
				"Please fill fields on below to prepare your submission. "+
				"Note that the values of <b>_id</b>, <b>volume</b>, <b>color</b> and <b>category</b> are necessary.")
			.append(attFields())
			.append(
				'<div class="w3-col l2 m4 w3-padding">'+
					'<br>'+
					'<button id="btnAddNewAttr">'+
						'<i class="fa fa-plus-square" aria-hidden="true"></i> Add new attribute'+
					'</button>'+
				'</div>')
			.append(submitbtn);

		$("#btnAddNewAttr").addClass("w3-btn w3-round-large w3-ripple w3-block w3-green");
		$("#btnAddNewAttr").click(function(){

			$(this).parents("div:first").empty()
				.removeClass("l2 m4 w3-padding")
				.addClass("l4 m8 w3-border")
				.html(
					'<div class="w3-col l6 w3-padding">'+
						'<b>New attribute name:</b><br>'+
						'<input type="text" autocomplete="on" class="w3-input w3-border" id="new_col">'+
					'</div>'+
					'<div class="w3-col l6 w3-padding">'+
						'<b>Value for new attribute:</b><br>'+
						'<input type="text" autocomplete="on" class="w3-input w3-border" id="new_col_value">'+
					'</div>');
		});

		// Send POST request for new detergent
		$("#sendnew").click(function(){

			let JSON_send = formToJSON();

			// If no new attribute to add
			if ($("#new_col").val() == undefined || $("#new_col").val() == "" || $("#new_col_value").val() == ""){

				$.post("/newDet", JSON_send, function(data){

					if (data === true){

						$('#detable').DataTable().ajax.reload();
						$("[autocomplete]").val("");
						$("[type='color']").val("#808080");
						alert(String(JSON_send._id) + " was successfully insert to database!");
					} else {

						alert(data);
					};
				});
			} else {

				JSON_send[$("#new_col").val()] = $("#new_col_value").val();
				// temporary solution for synchronous get keys
				NAME_LIST.push($("#new_col").val());
				$.post("/newDet", JSON_send, function(data){

					if (data === true){

						$.get("/getKeys", function(data){
	
							NAME_LIST = data;
							alert(
								String(JSON_send._id) + " and the new attribute " +
								String($("#new_col").val()) + " was successfully insert to database!"
							);
							buildDataTable();
							buildCheckbox();
							$("[autocomplete]").val("");
							$("[type='color']").val("#808080");
						});
					} else {

						alert(data);
					};
				});
			};
		});
	});

	// Enable field for removing detergent
	$("#btnremove").click(function(){

		$("#cboxs").hide()
		$("#modifupd1").hide();
		$("#modif").removeClass()
			.addClass("w3-pale-red w3-padding")
			.empty()
			.html('<h3>Please select one detergent on below to delete it:</h3>'+
			'<button id="sendremove" class="w3-btn w3-red w3-ripple w3-round w3-right"><b>Confirm removing</b></button>');

		if (selectedData === undefined) {

			$("#sendremove").prop('disabled',true);
		} else {

			$("#sendremove").prop('disabled',false);
		};

		// Send POST request for removing one detergent
		$('#sendremove').click( function () {

			let deletedName = table.row('.selected').data()._id;

			if (confirm("WARNING!\nDid you really want to remove "+deletedName+"?\nThis process is NOT REVERSIBLE!") == true) {

				$.post("/removeDet",table.row('.selected').data(), function(data){

					if (data === true){

						$('#detable').DataTable().ajax.reload();
						$("#sendremove").prop('disabled',true);
						alert(deletedName + " was successfully removed from database!");
					} else {

						alert(data);
					};
				});
			} 
		} );
	});

	// Enable field for updating a detergent
	$("#btnupdate").click(function(){

		let submitbtn =	'<div class="w3-col l2 m4 w3-padding">'+
							'<br>'+
							'<button id="sendupdate" class="w3-btn w3-round w3-blue w3-block w3-ripple">'+
								'Update detergent <i class="fa fa-arrow-right" aria-hidden="true"></i>'+
							'</button>'+
						'</div>';

		$("#cboxs").hide();
		$("#modif").empty()
			.removeClass()
			.addClass("w3-pale-blue")
			.html(
				"<div id='modifupd1'>"+
					"<h3 class='w3-margin'>Please choose your detergent: </h3>"+
					"<div>")
			.append("<div id='modifupd2'></div>");
		
		$("#modifupd2").html(attFields())
			.append(submitbtn);
		
		$("#_id").attr("readonly",true);

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
			$.post("/updateDet", formToJSON(),function(DATA){

				$.get("/getKeys", function(data){

					NAME_LIST = data;
				}).done(function(){

					$('#detable').DataTable().ajax.reload();
					$("[autocomplete]").val("");
					alert(modifiedName + " is now up to date!");
				});
			});
		});
	});



	$("#btnrmCol").click(function(){

		$("#cboxs").hide()
		$("#modifupd1").hide();
		
		let code = 	'<h3>Choose one column name to remove or update: </h3>'+
					'<div class="w3-col w3-padding l2 m4">'+
						'Column name:<br>'+
						'<select name="col">'+
							'<option value=""> </option>';
		
		for (i = 0; i < NAME_LIST.length; i++) {

			if (["_id","category","color","volume"].indexOf(NAME_LIST[i]) == -1){

				code += '<option value="'+ NAME_LIST[i] +'"> '+NAME_LIST[i] + " </option>";
			};
		};

		code += '</select></div>';

		$("#modif").empty()
			.removeClass()
			.addClass("w3-pale-red w3-row")
			.html(code);
		

		let rmColbtn = 	'<div id="attrcontainer" class="w3-col w3-padding l2 m4">'+
							'<br>'+
							'<button class="w3-button w3-small" id="modifattr"><ins>Update column name</ins></button>'+
						'</div>'+
						'<div class="w3-col w3-padding l2 m4">'+
							'<br>'+
							'<button id="sendrmcol" class="w3-btn w3-round w3-red w3-ripple w3-padding-small">'+
								'Confirm <i class="fa fa-arrow-right" aria-hidden="true"></i>'+
							'</button>'+
						'</div>';

		$("#modif").append(rmColbtn);
		$("#modifattr").click(function(){

			$("#attrcontainer").html('New column name:<br><input type="text" autocomplete="on" class="w3-input w3-border" id="new_attr">');
		});
		

		$("#sendrmcol").click(function(){

			let col = $(":selected")[0].value;
			let newcol = $("#new_attr").val();
			
			$("#cboxs").hide();

			if (col != "" && (newcol == "" || newcol == undefined)){

				if (confirm("WARNING!\nDid you really want to remove the column "+col+"?\nThis process is NOT REVERSIBLE!") == true) {

					$.post("/removeCol",{"column": col},function(DATA){

						$.get("/getKeys", function(data){

							NAME_LIST = data;
						}).done(function(){

							buildDataTable();
							buildCheckbox();
							let code = '<option value=""> </option>';
							
							for (i = 0; i < NAME_LIST.length; i++) {

								if (["_id","category","color","volume"].indexOf(NAME_LIST[i]) == -1){

									code += '<option value="'+ NAME_LIST[i] +'"> '+NAME_LIST[i] + " </option>";
								};
							};

							$("select").html(code);
							alert(col + " column was successfully removed from database!");
						});
					});	
				};
			} else if (col != "" && newcol != "" ){

				if (confirm(
						"WARNING!\nDid you really want to replace the column "+col+
						" by "+newcol+"?\nThis process is NOT REVERSIBLE!") == true) {

					$.post("/modifCol",{"old_column": col, "new_column": newcol}, function(DATA){

						if (DATA === true){

							$.get("/getKeys", function(data){

								NAME_LIST = data;
							}).done(function(){

								buildDataTable();
								buildCheckbox();

								let code = '<option value=""> </option>';
								
								for (i = 0; i < NAME_LIST.length; i++) {

									if (["_id","category","color","volume"].indexOf(NAME_LIST[i]) == -1){

										code += '<option value="'+ NAME_LIST[i] +'"> '+NAME_LIST[i] + " </option>";
									};
								};

								$("select").html(code);
								$("#new_attr").val("");
								alert(col + " was successfully replaced by "+newcol+"!");
							});
						} else {

							alert(DATA);
						};
					});
				};
			};
		});
	});
} );