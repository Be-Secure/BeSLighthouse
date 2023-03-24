
// This function is only used to print scorecard report.
function constructTable(selector, list) {


  console.log("construct table container");
  // Getting the all column names
  var cols = Headers(list, selector);

  // Traversing the JSON data
  for (var i = 0; i < list.length; i++) {
    var row = $('<tr/>');
    for (var colIndex = 0; colIndex < cols.length; colIndex++)
    {
      // console.log("cols:"+cols)

      // if (cols[colIndex] == "documentation") {
      //   continue;
      // }
      var val = list[i][cols[colIndex]];
      
      // console.log("var:" + val);
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

function download_pdf()
{
  window.print()
}

function Headers(list, selector) {
  var columns = [];
  var header = $('<tr/>');
  
  for (var i = 0; i < list.length; i++) {
    var row = list[i];
    for (var k in row) {
      if ($.inArray(k, columns) == -1) {
        console.log("k:"+k);
        if (k == "documentation") {
          continue;
          
        }
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

function print_scorecard_summary(data)
{
  json_data = JSON.stringify(data);
  // console.log(json_data);
  json_object = JSON.parse(json_data);
  var table = "<table>"
  table += "<tr><td>Date : " + json_object.date + "</tr></td>"
  table += "<tr><td>Scorecard version : " + json_object.scorecard.version + "</tr></td>"
  table += "<tr><td>OSSP : " + json_object.repo.name + "</tr></td>"
  table += "<tr><td>Commit : " + json_object.repo.commit + "</tr></td>"
  table += "<tr><td>Score : " + json_object.score + "</tr></td>"    
  table += "</table>"
  document.getElementById("reports").innerHTML = table;
}
function print_scorecard_report(data)
{
  print_scorecard_summary(data);
  document.getElementById("checks_h3").innerHTML = "Checks"

  constructTable('#table', data.checks)
}

function print_codeql_report(data) {


  json_data = JSON.stringify(data);
  // console.log(json_data);
  json_object = JSON.parse(json_data);
  var table = "<table id=table>"
  table += "<tr><th>Description</th><th>Security Severity Level</th><th>Environment</th><th>Message</th><th>Path</th><th>Start Line</th><th>End Line</th></tr>"
  for (let i in json_object) {
    table += "<tr><td>" + json_object[i].rule.description + "</td><td>" + json_object[i].rule.security_severity_level + "</td><td>" + json_object[i].most_recent_instance.environment + "</td><td>" + json_object[i].most_recent_instance.message.text + "</td><td>" + json_object[i].most_recent_instance.location.path + "</td><td>" + json_object[i].most_recent_instance.location.start_line + "</td><td>" + json_object[i].most_recent_instance.location.end_line + "</td></tr>"

  }
      
  table += "</table>"
  document.getElementById("reports").innerHTML = table;
  
}

function print_sonarqube_report(data) {
  json_data = JSON.stringify(data);
  json_object = JSON.parse(json_data);
  print_issues = json_object.issues; // The report has to be printed from issues array.
  console.log("issues:"+ print_issues);
  var table = "<table id=table>"
  table += "<tr><th>Component</th><th>Type</th><th>Message</th><th>Line</th></tr>"
  for (let i in print_issues){
    table += "<tr><td>" + print_issues[i].component + "</td><td>" + print_issues[i].type +"</td><td>" + print_issues[i].message +"</td><td>" + print_issues[i].line +"</td></tr>"
  }
  table += "</table>"
  document.getElementById("reports").innerHTML = table;
}

//print sbom report
function print_sbom_report(data) {
  json_data = JSON.stringify(data);
  json_object = JSON.parse(json_data);
  var table = "<table id=table>"
  table += "<tr><th>Package name</th><th>Version</th><th>Supplier</th><th>Download Location</th><th>License</th></tr>"
  for (let i in json_object.packages) {
   table += "<tr><td>" + json_object.packages[i].name+ "</td><td>" + json_object.packages[i].versionInfo+ "</td><td>" + json_object.packages[i].supplier+ "</td><td>" + json_object.packages[i].downloadLocation+ "</td><td>" + json_object.packages[i].licenseConcluded+ "</td></tr>"
  }  
  table += "</table>"
  document.getElementById("reports").innerHTML = table;
}

function print_fossology_report(data) 
{
  json_data = JSON.stringify(data);
  // console.log(json_data);
  json_object = JSON.parse(json_data);
  var table = "<table id=table>"
  table += "<tr><th>FileName</th><th>License Concluded</th><th>File Copyright Text</th></tr>"
  for (let i in json_object) {
    table += "<tr><td>" + json_object[i].FileName + "</td><td>" + json_object[i].LicenseConcluded + "</td><td>" + json_object[i].FileCopyrightText + "</td></tr>"

  }
      
  table += "</table>"
  document.getElementById("reports").innerHTML = table;
}


function fetch_json()
{
  var url;
  var version = localStorage["version"];
  var ossp_name = localStorage["ossp_name"];
  var report = localStorage["report"];
  console.log(ossp_name);
  console.log("report:"+report);
  if (report == "codeql" || report == "sonarqube") { // The sast reports(codeql, sonarqube, ...) are under sast dir.
    url = 'https://raw.githubusercontent.com/Be-Secure/besecure-assessment-datastore/main/'+ ossp_name + '/' + version + '/sast' + '/' + ossp_name+ '-' + version + '-' + report + '-report.json';  

  } 

  else if (report == "fossology")
  {
    url = 'https://raw.githubusercontent.com/Be-Secure/besecure-assessment-datastore/main/'+ ossp_name + '/' + version + '/license-compliance' + '/' + ossp_name+ '-' + version + '-' + report + '-report.json';
  }

  else {
    url = 'https://raw.githubusercontent.com/Be-Secure/besecure-assessment-datastore/main/'+ ossp_name + '/' + version + '/' + report + '/' + ossp_name+ '-' + version + '-' + report + '-report.json';

  }
  
  console.log("url:"+url);
  
  document.getElementById("report_name").innerHTML = report + " report - " + localStorage["ossp_name"];
  
  fetch(url, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    },
})
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // console.log(data);
    console.log("report:"+report);
    
    if (report == "scorecard") {
     
      print_scorecard_report(data);
    
    } else if (report == "codeql") {
      
      print_codeql_report(data);

    } else if (report == "sonarqube"){
      
      print_sonarqube_report(data);
    
    } else if (report == "fossology"){
      
      print_fossology_report(data);
    }
    else if (report == "sbom"){
      
      print_sbom_report(data);
    }


  })
  .catch(function (err) {
    const p = document.createElement("p");
    const para = document.createTextNode("Assessment report not available at the moment");
    p.appendChild(para)
    div_tag = document.getElementById("reports");
    div_tag.appendChild(p);
    console.dir(err);

  });

}
