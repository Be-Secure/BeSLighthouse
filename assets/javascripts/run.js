
function enabledisable(count)
{
  // var bt = document.getElementById(cve_button);
  console.log("inside enabledisable");
  if (count == 0) {
    document.getElementById("cve_button").disabled = true;
    document.getElementById("cve_unavilable").innerHTML = "CVE details are not available at the moment";
  } else {
    document.getElementById("cve_button").disabled = false;
  }
}


function replace_div() {
  // console.log("replace");
  // var div_data = "<div ><a href='XXX'>XXX</a></div>";
  jQuery('#content').replaceWith(jQuery('#cve_stats'));
  
}

function refreshPage(){
  window.location.reload();
} 

function button_visibility()
{
  console.log("inside visibility")
  var x = document.getElementById('home_button');
  x.style.visibility = 'visible';

}


function constructTable(selector, list) {
	console.log("construct table container");
  // Getting the all column names
  var cols = Headers(list, selector);

  // Traversing the JSON data
  for (var i = 0; i < list.length; i++) {
    var row = $('<tr/>');
    for (var colIndex = 0; colIndex < cols.length; colIndex++)
    {
      var val = list[i][cols[colIndex]];
      
      // If there is any key, which is matching
      // with the column name
      if (val == null) val = "";
        row.append($('<td/>').html(val));
    }
    
    // Adding each row to the table
    $(selector).append(row);
  }
  return row;
}

function Headers(list, selector) {
  var columns = [];
  var header = $('<tr/>');
  
  for (var i = 0; i < list.length; i++) {
    var row = list[i];
    
    for (var k in row) {
      if ($.inArray(k, columns) == -1) {
        columns.push(k);
        
        // Creating the header
        header.append($('<th/>').html(k));
      }
    }
  }
  
  // Appending the header to the table
  $(selector).append(header);
    return columns;
}	


var chart_vulntypeschart;
function vulntypeschart(data){
  // for (var i in data) {
  //   if (data[i].Year == "Total") {
  //     var data_array = [
  //       ["XSS",data[i].XSS],["Http Response Splitting",data[i].Http_Response_Splitting],["Code Execution",data[i].Code_Execution],["Sql Injection",data[i].Sql_Injection],["Gain Information",data[i].Gain_Information],["Denial of Service",data[i].DoS],["Directory Traversal",data[i].Directory_Traversal],["Bypass Something",data[i].Bypass_something],["CSRF",data[i].CSRF],["Gain Privilege",data[i].Gain_Privileges],["File Inclusion",data[i].File_Inclusion],];
      
  //   }
  // }
    var data_array = [["XSS",data[data.length-2].XSS],["Http Response Splitting",data[data.length-2].Http_Response_Splitting],["Code Execution",data[data.length-2].Code_Execution],["Sql Injection",data[data.length-2].Sql_Injection],["Gain Information",data[data.length-2].Gain_Information],["Denial of Service",data[data.length-2].DoS],["Directory Traversal",data[data.length-2].Directory_Traversal],["Bypass Something",data[data.length-2].Bypass_something],["CSRF",data[data.length-2].CSRF],["Gain Privilege",data[data.length-2].Gain_Privileges],["File Inclusion",data[data.length-2].File_Inclusion],["Exploits",data[data.length-2].No_of_exploits]];
    console.log("data_array");
    console.log(data_array);    
    chart_vulntypeschart = jQuery.jqplot ("vulntypeschart", [data_array],
		{
      grid: {
        drawBorder: false, 
        drawGridlines: false,
        background: '#ffffff',
        shadow:false
    },
      title: "% of vulnerabilities",
		  seriesDefaults: {
			// Make this a pie chart.
			renderer: jQuery.jqplot.PieRenderer,
      trendline:{ show:false }, 
      rendererOptions: { 
        showDataLabels: true}
		  },
		  legend: { 
        show:true,
			  location: 'e',
			  placement: 'outsideGrid'
		  },
		  seriesColors: [
			  '#999','#DB045B','#E04807',
			  '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE','#DB843D', '#92A8CD', '#A47D7C', '#B5CA92','#FF9655','#24CBE5'
		  ]
		}

	  );
}

function vulnsbytypeandyearchart(data){
  var chart_vulnsbytypeandyearchart;
	var vuln=[];
  var total_array=[];
  var xss_array=[];
  var hrs_array=[];
  var ec_array=[];
  var sqli_array=[];
  var gi_array=[];
  var dos_array=[];
  var dt_arraay=[];
  var bs_array=[];
  var csrf_array=[];
  var exploits_array=[];
  var gp_array=[];
  var fi_array=[];
	var vulntypesarray=[];
					vulntypesarray.push("Total");

              for (let i = 0; i < data.length-2; i++) {


                 total_array.push([data[i].Year,data[i].No_of_Vulnerabilities]);

              }

                
              
							vulntypesarray.push("XSS");

        for (let i = 0; i < data.length-2; i++) {

         
          xss_array.push([data[i].Year,data[i].XSS]);

        }
							vulntypesarray.push("Http Response Splitting");
              for (let i = 0; i < data.length-2; i++) {

               
                hrs_array.push([data[i].Year,data[i].Http_Response_Splitting]);
      
              }
				//},
							vulntypesarray.push("Execute Code");
              for (let i = 0; i < data.length-2; i++) {

               
               ec_array.push([data[i].Year,data[i].Code_Execution]);
      
              }
							vulntypesarray.push("Sql Injection");
              for (let i = 0; i < data.length-2; i++) {

               
                sqli_array.push([data[i].Year,data[i].Sql_Injection]);
      
              }
							vulntypesarray.push("Gain Information");
              for (let i = 0; i < data.length-2; i++) {

               
                gi_array.push([data[i].Year,data[i].Gain_Information]);
      
              }
							vulntypesarray.push("Denial of Service");
              for (let i = 0; i < data.length-2; i++) {

               
                dos_array.push([data[i].Year,data[i].DoS]);
      
              }
							vulntypesarray.push("Directory Traversal");
              for (let i = 0; i < data.length-2; i++) {

               
                dt_arraay.push([data[i].Year,data[i].Directory_Traversal]);
      
              }
							vulntypesarray.push("Bypass Something");
              for (let i = 0; i < data.length-2; i++) {

               
                bs_array.push([data[i].Year,data[i].Bypass_something]);
      
              }
							vulntypesarray.push("CSRF");
              for (let i = 0; i < data.length-2; i++) {

               
                csrf_array.push([data[i].Year,data[i].CSRF]);
      
              }
							vulntypesarray.push("Exploits");
              for (let i = 0; i < data.length-2; i++) {

               
                 exploits_array.push([data[i].Year,data[i].No_of_exploits]);
      
              }
							vulntypesarray.push("Gain Privilege");
              for (let i = 0; i < data.length-2; i++) {

               
                 gp_array.push([data[i].Year,data[i].Gain_Privileges]);
      
              }
							vulntypesarray.push("File Inclusion");
              for (let i = 0; i < data.length-2; i++) {

               
                fi_array.push([data[i].Year,data[i].File_Inclusion]);
      
              }
				//},
        vuln.push(total_array,xss_array,hrs_array,ec_array,sqli_array,gi_array,dos_array,dt_arraay,bs_array,csrf_array,exploits_array,gp_array,fi_array);
    console.log("vuln:");
		console.log(vuln);	
    console.log("vulntypesarray:");
    console.log(vulntypesarray);
	chart_vulnsbytypeandyearchart = $.jqplot ('vulnsbytypeandyearchart', vuln, {
      seriesColors: [
		  '#69c','#333','#DB045B','#E04807',
		  '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE','#DB843D', '#92A8CD', '#A47D7C', '#B5CA92','#FF9655','#24CBE5'
		  ],
      total: "Vulnerabilities by Type and Year",
		seriesDefaults: {
		},
		series:[
			{show:true, label:"Total"},{show:false, label:"XSS"},{show:false, label:"Http Response Splitting"},{show:true, label:"Execute Code"},{show:false, label:"Sql Injection"},{show:false, label:"Gain Information"},{show:false, label:"Denial of Service"},{show:false, label:"Directory Traversal"},{show:false, label:"Bypass Something"},{show:false, label:"CSRF"},{show:true, label:"Exploits"},{show:false, label:"Gain Privilege"},{show:false, label:"File Inclusion"},		],
	  title:{
			text: 'Vulnerabilities by type & year',
			fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
			fontSize: '12px',
			color: '#3E576F'
	  },
      axesDefaults: {
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
		borderColor: '#4572A7',
      },
      axes: {
        xaxis: {
          label: "Years",
		  color: '#3E576F',
          pad: 0,
		  min:1999,
		  tickInterval: 1
        },
        yaxis: {
          label: "# Of Vulns",
		  numberTicks : 5,
		  min:0 ,
		  color: '#3E576F'
        }
      },
	  legend: {
		  show:true,
		  location: 's',
		  renderer: $.jqplot.EnhancedLegendRenderer,
		  placement: 'outsideGrid',
		  labels: vulntypesarray,
		  rendererOptions:{
			  seriesToggle: true,
			  seriesToggleReplot: {resetAxes:['yaxis']},
			  numberRows: 5,
			  numberColumns: 5
		  },
		  border:'1px solid #909090',
		  fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
		  fontSize: '11px'
	  },
	  highlighter: {
		  show: true,
		  sizeAdjust: 12,
		  fadeTooltip: false,
		  formatString: "%d : %d",
		  bringSeriesToFront:true,
		  lineWidthAdjust:10
	  }
    });

	}

function bar_chart_by_year(data)
{
  var vuln = [];
  var year = [];
  for (let index = 0; index < data.length; index++) {
    year.push(data[index].Year);
    vuln.push(data[index].No_of_Vulnerabilities);
    if (data[index].Year == 2021) {
      break;
    } else {
      continue;
    }
    
  }

  console.log("vuln:"+vuln);
  console.log("year:"+year);

    $.jqplot.config.enablePlugins = true;

    plot1 = $.jqplot('bar_chart_vuln_by_year', [vuln], {
        // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
        animate: !$.jqplot.use_excanvas,
        title: "Vulnerabilities by Year",
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            rendererOptions: {
              barWidth: 15,
           },
            pointLabels: { show: true }
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: year,
                label: "Year"

            },
            yaxis: {
              label: "# of Vulnerabilities"
            }
        },
        highlighter: { show: false },

        legend: {
          show: false,
          location: 'e',
          placement: 'outside'
      },
    });
 
    $('#bar_chart_vuln_by_year').bind('jqplotDataClick', 
        function (ev, seriesIndex, pointIndex, data) {
            $('#info1').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
        }
    );

}
function bar_chart_by_type(data){
  var vuln = [];

  vuln.push(data[data.length-2].XSS,data[data.length-2].Code_Execution,data[data.length-2].Bypass_something,data[data.length-2].Gain_Privileges,data[data.length-2].Sql_Injection,data[data.length-2].Gain_Information,data[data.length-2].CSRF,data[data.length-2].DoS,data[data.length-2].Http_Response_Splitting,data[data.length-2].Directory_Traversal);
  console.log(vuln);

  $.jqplot.config.enablePlugins = true;
    var type = ['XSS', 'Code_Execution', 'Bypass_something', 'Gain_Privileges', 'Sql_Injection', 'Gain_Information', 'CSRF', 'DoS', 'Http_Response_Splitting', 'Directory_Traversal'];
     
    plot1 = $.jqplot('bar_chart_vuln_by_type', [vuln], {
        // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
        animate: !$.jqplot.use_excanvas,
        title: "Vulnerabilities by Type",
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            rendererOptions: {
              barWidth: 15,
           },
            pointLabels: { show: true }
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: type,
                label: "Types of Vulnerabilities"

            },
            yaxis: {
              label: "# of Vulnerabilities"
            }
            
        },
        highlighter: { show: true },

        legend: {
          show: false,
          location: 'e',
          placement: 'outside'
      },
    });
 
    $('#bar_chart_vuln_by_type').bind('jqplotDataClick', 
        function (ev, seriesIndex, pointIndex, data) {
            $('#info1').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
        }
    );


}

function closeSidebar()
{
  console.log("inside close side bar");
  $('.details-template').addClass('hidden').animate({left:"-100%"},255);
}

function closePanel() {
  // foamtree.set("selection", null);
  console.log("inside close panel");
  $("#details").toggleClass("showing", false);
}
function generate_env_table()
{
  document.getElementById("env_table").innerHTML = "<table><tr> <th>Environment Name</th><th>Environment type</th><th> Project version</th><th>Vulnerability exploited</th><th>Exploit details</th><th>Patch availability</th><th>Date of patch published</th> </tr><tr><td>Hello world</td><td></td><td></td><td></td><td></td><td></td><td></td></tr></table>"
}
function load_data(id,name)
{

  document.getElementById("cve_header").innerHTML = "Vulnerability Statistics:"+name;
  // assets/data/OSSPCVE/50-prometheus-CVEdetails.json
  fetch('../assets/data/OSSPCVE/'+id+'-'+name+'-CVEdetails.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log("inside load data");
    constructTable('#table', data);
    vulntypeschart(data);
    vulnsbytypeandyearchart(data);
    // console.log(data.data[0].XSS);
    bar_chart_by_year(data);
    bar_chart_by_type(data);
    replace_div();
    closePanel();
    button_visibility();
    // if (name == "drupal")
    // {
    //   generate_env_table();
    // }
    // closeSidebar();
  })
  .catch(function (err) {
    console.dir(err);
  });


  

}
