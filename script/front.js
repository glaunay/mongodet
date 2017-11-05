$(document).ready(function() {
	console.log("I'm ready!");
	// Set the header of page with title
	$("header").html("<h1>Detergent Database CRUD Interface </h1>")
	$("#table").html("<table id='example' class='display' cellspacing='0' width='100%''>"
		+"<thead> <tr> <th>Category</th> <th>Name</th> <th>Volum</th>"
		+"<th>Color</th> </tr> </thead> <tfoot> <tr> <th>Category</th>"
		+"<th>Name</th> <th>Volum</th> <th>Color</th> </tr> </tfoot> </table>")
	document.getElementById("text").innerHTML = "Ici y aura du texte explicatif";
	/*
	document.getElementById("table").innerHTML = "<table id='example' class='display' cellspacing='0' width='100%'> <thead> <tr>"
		+"<th>Name</th> <th>Position</th> <th>Office</th> <th>Age</th> <th>Start date</th>"
		+"<th>Salary</th> </tr> </thead> <tfoot> <tr> <th>Name</th> <th>Position</th>"
		+"<th>Office</th> <th>Age</th> <th>Start date</th> <th>Salary</th> </tr> </tfoot>"
		+"<tbody> <tr> <td>Tiger Nixon</td> <td>System Architect</td> <td>Edinburgh</td>"
		+"<td>61</td> <td>2011/04/25</td> <td>$320,800</td> </tr> <tr> <td>Garrett"
		+"Winters</td> <td>Accountant</td> <td>Tokyo</td> <td>63</td> <td>2011/07/25</td>"
		+"<td>$170,750</td> </tr> <tr> <td>Ashton Cox</td> <td>Junior Technical"
		+"Author</td> <td>San Francisco</td> <td>66</td> <td>2009/01/12</td>"
		+"<td>$86,000</td> </tr> <tr> <td>Cedric Kelly</td> <td>Senior Javascript"
		+"Developer</td> <td>Edinburgh</td> <td>22</td> <td>2012/03/29</td>"
		+"<td>$433,060</td> </tr> <tr> <td>Airi Satou</td> <td>Accountant</td>"
		+"<td>Tokyo</td> <td>33</td> <td>2008/11/28</td> <td>$162,700</td> </tr> <tr>"
		+"<td>Brielle Williamson</td> <td>Integration Specialist</td> <td>New York</td>"
		+"<td>61</td> <td>2012/12/02</td> <td>$372,000</td> </tr> </tbody> </table>";
	*/

	$('#example').DataTable( {
		"processing": true,
		"serverSide": true,
		"ajax": "script/getDb.js"
	} );
	$("#btn1").click(function(){
		$("#text").append(" <b>Appended text</b>.");
	});
	$("#btn2").click(function(){
		$("#text").empty();
	});

	// Get json data from server using AJAX request
	console.log("loaddoc");
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange=function() {
	if (this.readyState == 4 && this.status == 200) {
		//document.getElementById("demo").innerHTML = this.responseText;
		console.log(this.responseText);
		}
	};
	xhttp.open("GET", "/data/detergents.json", true);
	xhttp.send();

} );