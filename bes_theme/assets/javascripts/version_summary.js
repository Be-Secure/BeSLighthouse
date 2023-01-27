
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
function line_graph(data){
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
	chart_vulnsbytypeandyearchart = $.jqplot ('line_chart', vuln, {
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
function open_report(version, report, project_name)
{
  localStorage["version"] = version;
  localStorage["report"] = report;
  localStorage["ossp_name"] = project_name;
  window.open("../../bes_assessment_reports", "_self");
}

function load_version_data()
{
    console.log("called");
    id = localStorage["id"]
    console.log("id:"+id);
    ossp_name = localStorage["name"];
    console.log("name:"+ossp_name);

  fetch('../assets/data/version_details/'+id+'-'+ossp_name+'-Versiondetails.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    
    console.log(data);
    console.log("length:"+data.length);
    console.log("version:"+data[0].version);
    document.getElementById("heading1").innerHTML = "Version Details - " + ossp_name;

    // For each version of the project, we are creating different tags on the fly.
    for (let i = 0; i<Object.keys(data).length; i++)
    {
      
      const version_table = document.createElement("TABLE");
      version_table.setAttribute("id", "version_table"+i);

      const version = document.createElement("p");
      const release_date = document.createElement("p");
      const criticality = document.createElement("p");
      const scorecard = document.createElement("p");
      const cve_table = document.createElement("TABLE");
      const scorecard_button = document.createElement("BUTTON") 
      const codeql_button = document.createElement("BUTTON") 
      const sonarqube_button = document.createElement("BUTTON");
      const div_tag_bar1 = document.createElement("div")
      const div_tag_bar2 = document.createElement("div")
      const line_graph = document.createElement("div");

      cve_table.setAttribute("id", "cve_table"+i) // Setting id for each cve table. i is the loop var so each table would have different ids. Hence, we can create different tables for each cve details.
      cve_table.setAttribute("class", "table")
      div_tag_bar1.setAttribute("id", "bar_chart_vuln_by_type")
      div_tag_bar2.setAttribute("id", "bar_chart_vuln_by_year")
      line_graph.setAttribute("id", "line_chart");
      
      const version_data = document.createTextNode("Version:"+data[i].version);
      const release_date_data = document.createTextNode("Release date:"+data[i].release_date);
      const criticality_data = document.createTextNode("Criticality Score:"+data[i].criticality_score);
      const scorecard_data = document.createTextNode("Scorecard:"+data[i].scorecard);
      const scorecard_button_text = document.createTextNode("Scorecard");
      const codeql_button_text = document.createTextNode("Codeql");
      const sonarqube_button_text = document.createTextNode("Sonarqube")
      
      scorecard_button.setAttribute("id", data[i].version);
      scorecard_button.setAttribute("name", "scorecard")
      codeql_button.setAttribute("id", data[i].version);
      codeql_button.setAttribute("name", "codeql");
      sonarqube_button.setAttribute("id", data[i].version);
      sonarqube_button.setAttribute("name", "sonarqube")

      version.appendChild(version_data);
      release_date.appendChild(release_date_data);
      criticality.appendChild(criticality_data);      
      scorecard.appendChild(scorecard_data);    
      scorecard_button.appendChild(scorecard_button_text);  
      codeql_button.appendChild(codeql_button_text);  
      sonarqube_button.appendChild(sonarqube_button_text);  

      
      const element = document.getElementById("version_details");
      

      element.appendChild(version_table);
      let table = "<tr><td><h3>Version : " + data[i].version + "</h3></td></tr>"
      table += "<tr><td>Release date : " + data[i].release_date + "</td></tr>"
      table += "<tr><td>Criticality Score : " + data[i].criticality_score + "</td></tr>"
      table += "<tr><td>Scorecard : " + data[i].scorecard + "</td></tr>"
      document.getElementById("version_table"+i).innerHTML = table;
      
      // All the above created elements are added into div tag with id version_details. 
      element.appendChild(div_tag_bar1);
      element.appendChild(div_tag_bar2);
      element.appendChild(line_graph);
      element.appendChild(scorecard_button);
      element.appendChild(codeql_button);
      element.appendChild(sonarqube_button);
      
      bar_chart_by_type(data[i].cve_details);
      bar_chart_by_year(data[i].cve_details);
      // line_graph(data[i].cve_details);



      const buttons = document.getElementsByTagName("button");

      const buttonPressed = e => {
        console.log(e.target.id);  // Get ID of Clicked Element
        console.log(e.target.name);
        var version = e.target.id;
        var report = e.target.name;
        open_report(version, report, localStorage["name"]);
      }

      for (let b of buttons) {
        b.addEventListener("click", buttonPressed);
      } 
      
    }
  
  })
  
  .catch(function (err) {
  
    console.dir(err);
  
  });

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