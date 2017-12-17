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

		if (NAME_LIST[i] == 'color') {

			code += '<div class="w3-col l3 m4 w3-padding">'+ NAME_LIST[i] +':<a class="w3-text-red">*</a><br>'+
						'<input type="color" id="color" value=#808080 style="width:100%">'+
					'</div>';

		} else if (NECESSARY_VAL.indexOf(NAME_LIST[i]) != -1){

			code += '<div class="w3-col l3 m4 w3-padding">'+ NAME_LIST[i] +':<a class="w3-text-red">*</a><br>'+
						'<input type="text" autocomplete="on" class="w3-input w3-border" id="'+ NAME_LIST[i] +'">'+
					'</div>';
		} else if (["PDB_file","image"].indexOf(NAME_LIST[i]) != -1){

			code += '<div class="w3-col l3 m4 w3-padding">'+ NAME_LIST[i] +':<br>'+
						'<input type="file" autocomplete="on" id="'+ NAME_LIST[i] +'">'+
					'</div>';
		} else {

			code += '<div class="w3-col l3 m4 w3-padding">'+ NAME_LIST[i] +':<br>'+
						'<input type="text" autocomplete="on" class="w3-input w3-border" id="'+ NAME_LIST[i] +'">'+
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
				"defaultContent": 	"<a class='w3-button ref'>See ref.</a>"
			};
		} else if (NAME_LIST[i]==="image"){

			colname[colname.length] = { 
				"data": "img.jpg", 
				"defaultContent": "<a class='w3-button image'>See image</a>"
			};
		} else if (NAME_LIST[i]==="PDB_file"){

			colname[colname.length] = { 
				"data": null, 
				"defaultContent": "<a class='w3-button pdb'>See PDB file</a>"
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
		if (curField === "color") {

			let curCol = sRow.color
			curField = '#'+curField
			$(curField).val("#"+RGBToHex(curCol[0],curCol[1],curCol[2]));

		} else if (!(curField === "PDB_file" || curField === "image")){

			//curField = "#"+curField
			//document.getElementById(curField).value = String(); 
			$("#"+curField).val(sRow[curField]);
		};
	};
};



// Build checkbox for Hide/Show columns pannel
function buildCheckbox(){

	// Build checkbox for display columns
	let cboxs = "<div style='position:relative;left:35%'>"+
					"<button id='dispar' class='w3-button w3-blue w3-hover-dark-gray w3-ripple w3-round w3-padding-small'>"+
						"Hide/Show columns <i class='fa fa-toggle-on' aria-hidden='true'></i>"+
					"</button>"+
				"</div>"+
				"<div id='cboxs' style='position:absolute;z-index:3'>";

	cboxs += 	"<div class='w3-col l12 m12 w3-row w3-padding'>"+
					"<button class='w3-light-gray w3-margin-bottom w3-col l6 m6 w3-padding-small w3-round' id='selall'>"+
						"Select all"+
					"</button>"+
					"<button class='w3-light-gray w3-margin-bottom w3-col l6 m6 w3-padding-small w3-round' id='dselall'>"+
						"Unselect all"+
					"</button>"+
					
				"</div>"

	for (i = 0; i < NAME_LIST.length; i++) {

		cboxs += 	'<div class="w3-col l2 m3 s6">'+
						'<input type="checkbox" id="chk' + NAME_LIST[i] + '"> ' + NAME_LIST[i] + "	"+
					'</div>';
	};

	cboxs +=	"<div class='w3-col l12 m12 w3-padding'>"+
					"<button id='hideCol'>Apply</button>"+
				"</div>"+
				"</div>"
	
	// Inject checkboxs into HTML
	//$("#detable_wrapper").prepend(cboxs);
	$(cboxs).insertAfter("#detable_length");

	// Set the checkboxsfield hidden by default
	$("#cboxs").hide()

	// CSS setting
	$("#cboxs").addClass('w3-padding w3-row w3-white w3-card-4 w3-round-large');
	$("#dispar").addClass('w3-button w3-border w3-padding-small')
	$("#cboxs div").addClass("w3-col l2 m3 s6");
	$("#cboxs input").addClass("w3-check");
	$("#cboxs button").addClass('w3-button w3-block');
	$("#hideCol").addClass('w3-blue w3-round');

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
	$("#table").empty()
		.removeClass()
		.addClass("w3-padding")
		.html(
			//"<div id='parameters' class='w3-padding w3-round'></div>"+
			"<table id='detable' class='hover cell-border' cellspacing='0' width='100%'>"+
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

		// If already has detergent selected
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
			if ($("#sendupdate")[0] != undefined){

				selectedData = table.row('.selected').data();
				selectedToInput(selectedData);
			} else if (! $("#sendnew").hasClass("firstEntry")){

				$("#sendnew").addClass("firstEntry")
				$("[autocomplete]").val("");
				$("[type='color']").val("#808080");
				selectedData = table.row('.selected').data();
			};
		}
	} );

	// Alert reference of detergent
	$('#detable tbody').on( 'click', '.ref', function () {

		let data = table.row( $(this).parents('tr') ).data();
		$("#modalheader").html("Reference");
		$("#image").html('<p>'+data.ref+'</p>');
		
		document.getElementById('detInfo').style.display='block'
		//alert( data.ref );
	} );

	// Alert image of detergent
	$('#detable tbody').on( 'click', '.image', function () {

		let data = table.row( $(this).parents('tr') ).data();
		$("#modalheader").html("image test");
		$("#image").html('<img src="/img/img.jpg" alt="'+data.image+'">');
		
		document.getElementById('detInfo').style.display='block'
	} );

	$('#detable tbody').on( 'click', '.pdb', function () {

		let data = table.row( $(this).parents('tr') ).data();
		window.open("/pdb/3lPt.pdb", "_blank", "width=600,height=500");
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

function isFloat(str){

	let out = true;
	if (str.search(/[^\.\d]/) != -1 || (str.indexOf(".") != str.lastIndexOf("."))){

		out = false;
	};
	return out
}

function isWord(str){

	let out = true;
	if (str.search(/[^\w\s]/) != -1){

		out = false;
	};
	return out
}

function mandatoryInputCheck(){

	let filled = true;
	for (i = 0; i < NECESSARY_VAL.length; i++) {

		let id = "#"+NECESSARY_VAL[i];

			if ($(id).val()=="" || $(id).hasClass("w3-red")==true) {

				$(id).addClass("w3-red");
				filled = false;
			} else {

				$(id).removeClass("w3-red");
			};
	};
	return filled
}

function inputCheck(){

	for (i = 0; i < NAME_LIST.length; i++){

		if (["volume","molecular_mass","CMC"].indexOf(NAME_LIST[i]) != -1){

			// If need numeric value
			$("#"+NAME_LIST[i]).keyup(function(){

				if (isFloat(this.value)){

					$(this).removeClass("w3-red");
				} else {

					$(this).addClass("w3-red");
				};
			});
		} else if (["color","image","PDB_file","SMILES","complete_name","ref"].indexOf(NAME_LIST[i]) == -1){
			
			// If need alphanumeric but not special characters
			$("#"+NAME_LIST[i]).keyup(function(){

				if (isWord(this.value)){

					$(this).removeClass("w3-red");
				} else {

					$(this).addClass("w3-red");
				};
			});
		};
	};
}

$(document).ready(function() {

////////////////// INITIALIZE PAGE CONTENTS //////////////////

	// Buttons for operations on database
	$(".navbar").append(
		'<a id="home" title="Reload page"><b>Detergent Database CRUD Interface</b></a>'+
		'<a id="btnbrowse" class="w3-button w3-ripple">'+
			'<i class="fa fa-table" aria-hidden="true"></i> '+
			'Load database'+
		'</a>'+
		'<div class="dropdown">'+
			'<button class="dropbtn">'+
				'<i class="fa fa-wrench" aria-hidden="true"></i> '+
				'Manage detergents '+
				'<i class="fa fa-chevron-down"></i>'+
			'</button>'+
			'<div class="dropdown-content">'+
				'<a id="navNewDet" class="w3-btn w3-block w3-ripple">'+
					'<i class="fa fa-plus" aria-hidden="true"></i> Insert new detergent'+
				'</a>'+
				'<a id="navUpdDet" class="w3-btn w3-block w3-ripple">'+
					'<i class="fa fa-pencil-square-o" aria-hidden="true"></i> Update detergent'+
				'</a>'+
				'<a id="navRmvDet" class="w3-btn w3-block w3-ripple">'+
					'<i class="fa fa-trash" aria-hidden="true"></i> Remove detergent'+
				'</a>'+
			'</div>'+
		'</div>'+
		'<a id="navRmvCol" class="w3-button w3-ripple">'+
			'<i class="fa fa-hand-scissors-o" aria-hidden="true"></i> Manage columns'+
		'</a>'+
		'<a id="help" href="/help" target="_blank" class="w3-button w3-ripple w3-right">'+
			'<i class="fa fa-life-ring" aria-hidden="true"></i> Help'+
		'</a>'+
		'<a id="help" href="http://detbelt.ibcp.fr/" target="_blank" class="w3-button w3-ripple w3-right">'+
			'<i class="fa fa-desktop" aria-hidden="true"></i> Det.Belt'+
		'</a>');

	// Disable these buttons on page loading
	$("#navNewDet").addClass('w3-disabled');
	$("#navRmvCol").addClass('w3-disabled');
	$("#navUpdDet").addClass('w3-disabled');
	$("#navRmvDet").addClass('w3-disabled');


	$("#table").html(
		"<h1>Welcome to Detergent Database CRUD Interface!</h1>"+
		"<p>Here is a user-friendly front-end for <a href='http://detbelt.ibcp.fr/' target='_blank'>"+
		"Det.Belt</a> detergents database. You can browse and manage your favorites detergents.</p>"+
		"<p>To begin, please click on the button <b>Load database</b> on the top. Enjoy!</p>"
		).
		addClass("w3-center w3-padding-large w3-padding-64");


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
			'<a href="https://nodejs.org/">Node.js</a> - <a href="http://expressjs.com/">Express.js</a><br>'+
			'<a href="https://www.mongodb.com/">MongoDB</a><br>'+
			'<a href="https://jquery.com/">jQuery</a> - <a href="https://datatables.net/">DataTable</a><br>'+
			'<a href="https://www.w3schools.com/w3css/default.asp">W3.CSS</a><br>'+
			'<a href="http://fontawesome.io/">Font Awesome</a>'+
		'</p>');

	// CSS setting
	$("footer").css({
		"position": "relative",
		"right": "0",
		"bottom": "0",
		"left": "0",
		"padding": "1em"})
		.addClass("w3-container w3-row w3-middle w3-light-gray");
	$("footer [target]").addClass("w3-col w3-padding w3-center l2");
	$("footer p").addClass("w3-col w3-padding w3-tiny l2 m6");
	$("footer img").addClass("w3-hover-opacity");


////////////////// ACTIONS ON PAGE //////////////////


	$("#home").click(function(){
		location.reload();
	});	

	// Display the table or reload it
	$("#btnbrowse").click(function(){

		$("#cboxs").hide();
		selectedData = undefined;

		// Check if the table is already build or not yet
		if (table === undefined) {
			
			buildDataTable();
			buildCheckbox();

			$("#navNewDet").removeClass('w3-disabled');
			//$("#navRmvCol").removeClass('w3-disabled');
			$("#navUpdDet").removeClass('w3-disabled');
			$("#navRmvDet").removeClass('w3-disabled');

			//////// Enable field for adding new detergent ////////
			$("#navNewDet").click(function(){

				let submitbtn =	'<div class="w3-col l3 m4 w3-padding">'+
									'<br>'+
									'<button id="sendnew" class="w3-btn w3-round w3-green w3-block w3-ripple">'+
										'Confirm <i class="fa fa-arrow-right" aria-hidden="true"></i>'+
									'</button>'+
								'</div>';
				
				$("#cboxs").hide()
				$("#modif").empty()
					.removeClass()
					.addClass("w3-pale-green w3-padding")
					.append(
						"<h3>Insert new detergent</h3>"+
						"Please fill fields on below to prepare your submission. ")
					.append(attFields())
					.append(
						'<div class="w3-col l3 m4 w3-padding">'+
							'<br>'+
							'<button id="btnAddNewAttr" disabled>'+
								'<i class="fa fa-plus-square" aria-hidden="true"></i> Add new attribute'+
							'</button>'+
						'</div>')
					.append(submitbtn)
					.append("<div class='w3-col l3 m4 w3-padding w3-small'>"+
								"<br><br>"+
								"<a class='w3-text-red'>*</a> Mandatory values"+
							"</div>");

				$("#btnAddNewAttr").addClass("w3-btn w3-round w3-ripple w3-block w3-green");
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

				inputCheck();

				// Send POST request for new detergent
				$("#sendnew").click(function(){

					if (mandatoryInputCheck()){

						let JSON_send = formToJSON();

						// If no new attribute to add
						if ($("#new_col").val() == undefined || $("#new_col").val() == "" || $("#new_col_value").val() == ""){

							$.post("/newDet", JSON_send, function(data){

								if (data["status"] == "OK_insert"){

									$('#detable').DataTable().ajax.reload();
									$("[autocomplete]").val("");
									$("[type='color']").val("#808080");
									alert(String(JSON_send._id) + " was successfully inserted to database!");
								} else {

									alert("ERROR!\b"+data.data);
								};
							});
						} else {

							JSON_send[$("#new_col").val()] = $("#new_col_value").val();
							// temporary solution for synchronous get keys
							NAME_LIST.push($("#new_col").val());
							$.post("/newDet", JSON_send, function(data){

								if (data["status"] == "OK_insert"){

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

									alert("ERROR!\b"+data.data);
								};
							});
						};
					};
				});
			});
			
			//////// Enable field for updating a detergent ////////
			$("#navUpdDet").click(function(){

				let submitbtn =	'<div class="w3-col l3 m4 w3-padding">'+
									'<br>'+
									'<button id="sendupdate" class="w3-btn w3-round w3-blue w3-block w3-ripple">'+
										'Confirm <i class="fa fa-arrow-right" aria-hidden="true"></i>'+
									'</button>'+
								'</div>';
				selectedData = table.row('.selected').data();

				$("#cboxs").hide();
				$("#modif").empty()
					.removeClass()
					.addClass("w3-pale-blue")
					.html(
						"<div id='modifupd1'>"+
							"<h3>Please choose your detergent: </h3>"+
							"<div>")
					.append("<div id='modifupd2'></div>");
				$("#modifupd1").addClass("w3-padding")
				$("#modifupd2").addClass("w3-padding")
					.html("<h3>Update detergent</h3>")
					.append(attFields())
					.append(submitbtn)
					.append("<div class='w3-col l3 m4 w3-padding w3-small'>"+
								"<br><br>"+
								"<a class='w3-text-red'>*</a> Mandatory values"+
							"</div>");
				
				$("#_id").attr("readonly",true);

				if (selectedData != undefined) {

					$("#modifupd1").hide();
					$("#modifupd2").show();
					selectedToInput(selectedData);
				} else {

					$("#modifupd1").show();
					$("#modifupd2").hide();
				};

				// Start listenning on the right js object
				inputCheck();

				// Send POST request for update one detergent
				$("#sendupdate").click(function(){

					if (mandatoryInputCheck()){

						let modifiedName = table.row('.selected').data()._id;
						$.post("/updateDet", formToJSON(),function(DATA){

							if (DATA["status"] == "OK_modif"){

								$.get("/getKeys", function(data){

									NAME_LIST = data;
								}).done(function(){

									$('#detable').DataTable().ajax.reload();
									$("[autocomplete]").val("");
									alert(modifiedName + " has been up to date!");
								});
							} else {

								alert("ERROR!\b"+DATA.data);
							};
						});
					};
				});
			});

			//////// Enable field for removing detergent ////////
			$("#navRmvDet").click(function(){

				$("#cboxs").hide()
				$("#modifupd1").hide();
				$("#modif").removeClass()
					.addClass("w3-pale-red w3-padding")
					.empty()
					.html('<h3>Remove detergent</h3>'+
						'Please select one detergent on below to delete it:'+
						'<button id="sendremove" class="w3-btn w3-red w3-ripple w3-round w3-right">'+
							'<b>Confirm</b> <i class="fa fa-times" aria-hidden="true"></i>'+
						'</button>');

				selectedData = table.row('.selected').data();
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

							if (data["status"] == "OK_delete"){

								$('#detable').DataTable().ajax.reload();
								$("#sendremove").prop('disabled',true);
								alert(deletedName + " was successfully removed from database!");
							} else {

								alert("ERROR!\b"+data.data);
							};
						});
					} 
				} );
			});

		} else {

			// When the table is already here
			$("#modif").empty();
			$('#detable').DataTable().ajax.reload();
		};
		$("#modif").removeClass();
	});

/*	// To be improved
	$("#navRmvCol").click(function(){

		$("#cboxs").hide()
		$("#modifupd1").hide();
		
		let code = 	'<h3>Choose one column name to remove or update: </h3>'+
					'<div class="w3-col w3-padding l3 m4">'+
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
		

		let rmColbtn = 	'<div id="attrcontainer" class="w3-col w3-padding l3 m4">'+
							'<br>'+
							'<button class="w3-button w3-small" id="modifattr"><ins>Update column name</ins></button>'+
						'</div>'+
						'<div class="w3-col w3-padding l3 m4">'+
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
*/
} );