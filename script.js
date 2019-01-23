// Initially taken from https://www.w3schools.com/howto/howto_js_sort_table.asp, then edited accordingly
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("myTable"); // Table to sort
  switching = true;
  dir = "asc"; //Set the sorting direction

  while (switching) { // Loop until the table is sorted
    switching = false; // No switches done yet
    rows = table.rows;
    for (i = 1; i < (rows.length - 3); i++) { // Loop through table rows, except for first and last ones
      shouldSwitch = false; // No switching needed yet
      // Get elements from current and next row for comparison
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      // Perform the actual comparison based on preferred direction
	  	if (n == 2 || n == 3) { // Column is 'alcohol percentage' or 'amount'   
	        if (dir == "asc") {
	        	var xVal = parseInt(x.innerHTML);
	        	var yVal = parseInt(y.innerHTML);
	      		if (xVal > yVal) { // If swap is needed, set shouldSwitch to true
		        	shouldSwitch = true;
		        	break;
		        }
		  	} else if (dir == "desc") {
	        	var xVal = parseInt(x.innerHTML);
	        	var yVal = parseInt(y.innerHTML);
	        	if (xVal < yVal) { // If swap is needed, set shouldSwitch to true
	          		shouldSwitch = true;
	          		break;
	        	}
	      	}
	  	} else { // Column is 'product name' or 'origin'
		  	if (dir == "asc") {
	      		if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) { // If swap is needed, set shouldSwitch to true
		        	shouldSwitch = true;
		        	break;
		        }
		    } else if (dir == "desc") {
		        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) { // If swap is needed, set shouldSwitch to true
		        	shouldSwitch = true;
		        	break;
		        }
		    }
		}
	}
    if (shouldSwitch) { // If a switch  is needed, execute it, then mark that a switch was done
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]); // Perform the actual switch
      switching = true;
      switchcount ++; // Keep track of amount of switches done
    } else {
      /* If no switching was done && the direction is "asc",
      set direction to "desc" and re-enter the while loop */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function getData() { // Import server data to website and call loadProducts
	$(document).ready(function() { 
		$.ajax({
			method: "GET",
			url: "https://wt.ops.labs.vu.nl/api19/ee78ed6d",
			success: function(data) {
				loadProducts(data);
			},
			error: function() {
				window.alert("Error retrieving data");
			}
		});
	});
}

// This function is called after submitting a new product to the server. It is used to update the table for its new entry
// without having to reload all current entries again, thus saving bandwith at the cost of an extra function in the code
function getNewData() { // Import server data and append last item to table
	$(document).ready(function() { 
		$.ajax({
			method: "GET",
			url: "https://wt.ops.labs.vu.nl/api19/ee78ed6d",
			success: function(data) {
				var table = document.getElementById("myTable");	// Locate table to be extended
				var rows = document.getElementById("myTable").rows.length;
				var row = table.insertRow(rows - 2);			// Create new table row at bottom
				var cell1 = row.insertCell(0);					// Create 5 cells one by one for new row
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);
				var cell4 = row.insertCell(3);
				var cell5 = row.insertCell(4);
		 		cell1.innerHTML = data[data.length - 1].product;	// Move data properties one by one to table cells
		 		cell2.innerHTML = data[data.length - 1].origin;
		 		cell3.innerHTML = data[data.length - 1].best_before_date + "%";
		 		cell4.innerHTML = data[data.length - 1].amount + "l";
				cell5.innerHTML = "<img src=" + data[data.length - 1].image + " /><figcaption>" + data[data.length - 1].product + "</figcaption>";
			},
			error: function() {
				window.alert("Error retrieving data");
			}
		});
	});
}

function resetData() { // Reset server data and clear table
	$(document).ready(function() { 
		$.ajax({
			method: "GET",
			url: "https://wt.ops.labs.vu.nl/api19/ee78ed6d/reset",
			success: function() {
				var rows = document.getElementById("myTable").rows.length;
				for (i = 1; i < rows - 2; i++) {
					document.getElementById("myTable").deleteRow(1);		// Delete table rows containing product data
				}
			},
			error: function() {
				window.alert("Unable to reset, try again.");
			}
		});
	});
}

function loadProducts(data) { // Move imported data to table
	var table = document.getElementById("myTable");	// Locate table to be extended
	for (i = 2; i < data.length; i++) {
		var row = table.insertRow(i - 1);			// Create new table row at bottom
		var cell1 = row.insertCell(0);				// Create 5 cells one by one for new row
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);
		var cell4 = row.insertCell(3);
		var cell5 = row.insertCell(4);
	 	cell1.innerHTML = data[i].product;			// Move data properties one by one to table cells
	 	cell2.innerHTML = data[i].origin;
	 	cell3.innerHTML = data[i].best_before_date + "%";
	 	cell4.innerHTML = data[i].amount + "l";
		cell5.innerHTML = "<img src=" + data[i].image + " /><figcaption>" + data[i].product + "</figcaption>";
	}
}

$(document).ready(function() { 
	$("#mainForm").submit(function() { // Post form input to server
		var formData = $( this ).serializeArray();
		event.preventDefault();
		$.ajax ({
			url: "https://wt.ops.labs.vu.nl/api19/ee78ed6d",
			type: "POST",
			data: formData,
			success: function() {
				getNewData();
			}
		});
		$("#mainForm").trigger("reset");
	});
});