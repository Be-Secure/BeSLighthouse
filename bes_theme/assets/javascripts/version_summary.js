
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
    for (let i = 0; i<Object.keys(data).length; i++)
    {
      
      const version_table = document.createElement("TABLE");
      version_table.setAttribute("id", "version_table"+i);
      // let table = "<table id=version_table"+i+">";
      
      const version = document.createElement("p");
      const release_date = document.createElement("p");
      const criticality = document.createElement("p");
      const scorecard = document.createElement("p");
      const cve_table = document.createElement("TABLE");
      const scorecard_button = document.createElement("BUTTON") 
      const codeql_button = document.createElement("BUTTON") 
      
      cve_table.setAttribute("id", "cve_table"+i) // Setting id for each cve table. i is the loop var so each table would have different ids. Hence, we can create different tables for each cve details.
      cve_table.setAttribute("class", "table")
      
      const version_data = document.createTextNode("Version:"+data[i].version);
      const release_date_data = document.createTextNode("Release date:"+data[i].release_date);
      const criticality_data = document.createTextNode("Criticality Score:"+data[i].criticality_score);
      const scorecard_data = document.createTextNode("Scorecard:"+data[i].scorecard);
      const scorecard_button_text = document.createTextNode("Scorecard");
      const codeql_button_text = document.createTextNode("Codeql");
      
      scorecard_button.setAttribute("id", data[i].version);
      scorecard_button.setAttribute("name", "scorecard")
      codeql_button.setAttribute("id", data[i].version);
      codeql_button.setAttribute("name", "codeql")
      // const cve_table_data = document.createTextNode(constructTable("#cve_table", table_data[0]))

      version.appendChild(version_data);
      release_date.appendChild(release_date_data);
      criticality.appendChild(criticality_data);      
      scorecard.appendChild(scorecard_data);    
      scorecard_button.appendChild(scorecard_button_text);  
      codeql_button.appendChild(codeql_button_text);  

      // cve_table.appendChild(cve_table_data)
      
      const element = document.getElementById("version_details");
      
      // element.appendChild(version);
      // element.appendChild(release_date);      
      // element.appendChild(criticality);      
      // element.appendChild(scorecard);
      element.appendChild(version_table);
      let table = "<tr><td><h3>Version : " + data[i].version + "</h3></td></tr>"
      table += "<tr><td>Release date : " + data[i].release_date + "</td></tr>"
      table += "<tr><td>Criticality Score : " + data[i].criticality_score + "</td></tr>"
      table += "<tr><td>Scorecard : " + data[i].scorecard + "</td></tr>"
      document.getElementById("version_table"+i).innerHTML = table;
      element.appendChild(cve_table);
      element.appendChild(scorecard_button);
      element.appendChild(codeql_button);
      
      constructTable('#cve_table'+i, data[i].cve_details);
      cve_table.classList.add("cve_table");

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