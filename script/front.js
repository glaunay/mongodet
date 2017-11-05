$(document).ready(function() {
	// Set the header of page with title
	var getHead = new XMLHttpRequest();
	getHead.onreadystatechange=function() {
	if (this.readyState == 4 && this.status == 200) {
		$("header").html(this.responseText);
		}
	};
	getHead.open("GET", "/getHeader", true);
	getHead.send();
	
	$("#table").html("<table id='detable' class='display' cellspacing='0' width='100%''>"
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

	$('#detable').DataTable( {
		"processing": true,
		"serverSide": false,
		"ajax": "data/det.json",
		"columns": [
			{ "data": "category" },
			{ "data": "name" },
			{ "data": "vol" },
			{ "data": "color" }
		]
	} );
	$("#btn1").click(function(){
		$("#text").append(" <b>Appended text</b>.");
	});
	$("#btn2").click(function(){
		$("#text").empty();
	});
	


} );