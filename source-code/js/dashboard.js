var xValues2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; new Chart("graph-sales", {
    type: "line", data: {
        labels: xValues2, datasets: [{
            data: [1500, 1600, 1550, 1666, 1770, 1710, 1530, 2210, 3830,
                2478, 2000, 2450], borderColor: "red", fill: true
        }, {
            data: [1600, 1700, 1700, 1900, 2000, 2700, 2000, 3000, 2500, 3500, 3550, 3050],
            borderColor: "green", fill: true
        }]
    }, options: { legend: { display: false } }
});

var xValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
var yValues = [1600, 1700, 1700, 1900, 2000, 2700, 2000, 3000, 2500, 3500, 3550, 3050];

new Chart("graph-growth", {
    type: "line",
    data: {
        labels: xValues,
        datasets: [{
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(0,0,255,1.0)",
            borderColor: "rgba(0,0,255,0.1)",
            data: yValues
        }]
    },
    options: {
        legend: { display: false },
    }
});

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tab");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
openTab(onload, 'home');

function openCmt(evt, cmtTabName) {
    var i, tabCmtContent, tabCmt;
    tabCmtContent = document.getElementsByClassName("tabCmtContent");
    for (i = 0; i < tabCmtContent.length; i++) {
        tabCmtContent[i].style.display = "none";
    }
    tabCmt = document.getElementsByClassName("tabCmt");
    for (i = 0; i < tabCmt.length; i++) {
        tabCmt[i].className = tabCmt[i].className.replace(" active", "");
    }
    document.getElementById(cmtTabName).style.display = "block";
    evt.currentTarget.className += " active";
  }


//   clock
function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('clock').innerHTML =  h + ":" + m + ":" + s;
    setTimeout(startTime, 1000);
  }
  
  function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }

//  table pagination 
$(function() {
	const rowsPerPage = 13;
	const rows = $('#available__table tbody tr');
	const rowsCount = rows.length;
	const pageCount = Math.ceil(rowsCount / rowsPerPage); // avoid decimals
	const numbers = $('#numbers');
	
	// Generate the pagination.
	for (var i = 0; i < pageCount; i++) {
		numbers.append('<li><a href="#">' + (i+1) + '</a></li>');
	}
		
	// Mark the first page link as active.
	$('#numbers li:first-child a').addClass('active');

	// Display the first set of rows.
	displayRows(1);
	
	// On pagination click.
	$('#numbers li a').click(function(e) {
		var $this = $(this);
		
		e.preventDefault();
		
		// Remove the active class from the links.
		$('#numbers li a').removeClass('active');
		
		// Add the active class to the current link.
		$this.addClass('active');
		
		// Show the rows corresponding to the clicked page ID.
		displayRows($this.text());
	});
	
	// Function that displays rows for a specific page.
	function displayRows(index) {
		var start = (index - 1) * rowsPerPage;
		var end = start + rowsPerPage;
		
		// Hide all rows.
		rows.hide();
		
		// Show the proper rows for this page.
		rows.slice(start, end).show();
	}
});