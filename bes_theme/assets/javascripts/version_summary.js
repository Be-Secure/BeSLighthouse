function vulnsbytypeandyearchart(chart_Id, cve_details) {

  if (cve_details === "Not Available") {
    const cve_details = document.getElementById(chart_Id);
    const changeCssForGraph = document.getElementById("main-div-for-graph-presentation");
    changeCssForGraph.className = "graph-style-cve-not-available-css";
    cve_details.innerHTML = `<h3 class="cve-not-available-css">CVE details are not available at the moment</h3>`
    return;
  }
  let detail_cve = {}
  for (let i = 0; i < cve_details.length; i++) {
    const key = Object.keys(cve_details[i]);
    for (let j = 0; j < key.length; j++) {
      if (key[j] !== 'Year') {
        if (!detail_cve[key[j]]) {
          detail_cve[key[j]] = [];
        }
        if (cve_details[i][key[j]] !== null && cve_details[i][key[j]] !== "") {
          detail_cve[key[j]].push([parseInt(cve_details[i]["Year"]), cve_details[i][key[j]]]);
        }
      }
    }
  }
  const data = [];
  const vulntypesarray = [];
  const visible_all_field = []
  const key = Object.keys(detail_cve);
  for (let i = 0; i < key.length; i++) {
    if (detail_cve[key[i]].length === 0) {
      visible_all_field.push({ show: false, label: key[i] });
    } else {
      visible_all_field.push({ show: true, label: key[i] });
    }
    vulntypesarray.push(key[i]);
    data.push(detail_cve[key[i]]);
  }
  $.jqplot(chart_Id, data, {
    seriesColors: [
      '#69c', '#333', '#DB045B', '#E04807',
      '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92', '#FF9655', '#24CBE5'
    ],
    seriesDefaults: {},
    series: visible_all_field,
    title: {
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
        min: 1999,
        tickInterval: 1
      },
      yaxis: {
        label: "# Of Vulns",
        numberTicks: 5,
        min: 0,
        color: '#3E576F'
      }
    },
    legend: {
      show: true,
      location: 's',
      renderer: $.jqplot.EnhancedLegendRenderer,
      placement: 'outsideGrid',
      labels: vulntypesarray,
      rendererOptions: {
        seriesToggle: true,
        seriesToggleReplot: { resetAxes: ['yaxis'] },
        numberRows: 5,
        numberColumns: 5
      },
      border: '1px solid #909090',
      fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
      fontSize: '11px'
    },
    highlighter: {
      show: true,
      sizeAdjust: 12,
      useAxesFormatters: false,
      fadeTooltip: false,
      formatString: "%d : %s",
      bringSeriesToFront: true,
      lineWidthAdjust: 10
    }
  });
}


function open_report(base_url, version, report, project_name) {
  localStorage["version"] = version;
  localStorage["report"] = report;
  localStorage["ossp_name"] = project_name;
  window.open(base_url + "/bes_assessment_reports", "_self");
}

function check_url(id, version, name) {
  console.log("check called");
  // var request = new XMLHttpRequest();  
  if (id == "sonarqube" || id == "codeql") {

    var url = "https://raw.githubusercontent.com/sand-hya/besecure-assessment-datastore/main/" + name + "/" + version + "/sast/" + name + "-" + version + "-" + id + "-report.json"

  }

  else if (id == "fossology") {

    var url = "https://raw.githubusercontent.com/sand-hya/besecure-assessment-datastore/main/" + name + "/" + version + "/license-compliance/" + name + "-" + version + "-" + id + "-report.json"

  }

  else {
    var url = "https://raw.githubusercontent.com/sand-hya/besecure-assessment-datastore/main/" + name + "/" + version + "/" + id + "/" + name + "-" + version + "-" + id + "-report.json"

  }

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



    })
    .catch(function (err) {
      document.getElementById(id).setAttribute('href', 'javascript:void(0)');
      document.getElementById(id).innerHTML = "Not Available"
      document.getElementById(id).classList.add("disabled-link")
    });
}

function load_version_data(base_url) {
  id = localStorage["id"]
  ossp_name = localStorage["name"];

  fetch('https://raw.githubusercontent.com/sand-hya/besecure-osspoi-datastore/besissue/version_details/' + id + '-' + ossp_name + '-Versiondetails.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //container
      const container_element = document.getElementById("container");
      //header for project name
      const create_hadder_content = document.getElementById("hadder_page");
      //report name
      const report_name = document.getElementById("report-name-project");
      const span_name = `<span class="span-report-css">Project: ${ossp_name}</span>`;
      report_name.innerHTML = span_name;
      //border
      const main_div_content = document.getElementById("main-border-div");
      //version drop down
      const version_drop_down_content = document.getElementById("version_drop_down");
      const drop_down_list = document.createElement("select");
      drop_down_list.setAttribute("id", "version_list");
      drop_down_list.setAttribute("class", "version-css");
      //retrieving versions of a project
      array = [];
      for (let i = 0; i<Object.keys(data).length; i++) {
        array.push(data[i].version);
      }      
      //adding versions to the dropdown list
      var temp = document.getElementById("selectversion");
      for(var i = 0; i < array.length; i++) {
        var opt = array[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        temp.appendChild(el);
      }
      //get selected version from drop down
      var e = document.getElementById("selectversion");
      function onChange() {
        var value = e.value;
        var text = e.options[e.selectedIndex].text;
        console.log(value, text);
        alert(value);
        return value;
      }
      e.onchange = onChange;
      onChange();
     
      i=0;
      
      //retrieving report details for selected version
      const releaseData = data[i].release_date;
      const version = data[i].release_date;
      const scorecard = data[i].scorecard;
      const criticalityScore = data[i].criticality_score;
      // Color coding scorecard scores
      const scorecardLink = `<a id="scorecard" href='javascript:open_report("${base_url}","${version}", "scorecard", "${ossp_name}")'>${scorecard}</a>`;
      if (scorecard != "Not Available")
      {
        if (scorecard <= 2.5 ) {
          scorecard_table_td_data = `<td><span style="background-color:green"; class="score-color-css">${scorecardLink}</span></td>`

        } else if (scorecard <= 5 ){
          scorecard_table_td_data = `<td><span style="background-color:yellow"; class="score-color-css">${scorecardLink}</span></td>`
            
        } else if (scorecard <= 7.5 ){
          scorecard_table_td_data = `<td><span style="background-color:orange"; class="score-color-css">${scorecardLink}</span></td>`
         
        } else if (scorecard <= 10 ){
          scorecard_table_td_data = `<td><span style="background-color:red"; class="score-color-css">${scorecardLink}</span></td>`

        } 
      } else
      {
        scorecard_table_td_data=`<td><span class="score-color-css">${scorecardLink}</span></td>`
      }
      // Color coding criticality score scores
      if (criticalityScore != "Not Available")
      {
        if (criticalityScore < 0.5 ) {
          criticalityScore_table_td_data = `<td><span style="background-color:green; color:white" class="score-color-css">${criticalityScore}</span></td>`
          
        } else if (criticalityScore == 0.5 ){
          criticalityScore_table_td_data = `<td><span style="background-color:yellow" class="score-color-css">${criticalityScore}</span></td>`
          
        } else if (criticalityScore > 0.5 ){
          criticalityScore_table_td_data = `<td><span style="background-color:red; color:white" class="score-color-css">${criticalityScore}</span></td>`
          
        } 
      } else
      {
        criticalityScore_table_td_data=`<td><span class="score-color-css">${criticalityScore}</span></td>`
      }

      //creating report table
      const report_table = document.getElementById("version_table");

      
      //graph code
      const div_tag_chat_main = document.getElementById("main-div-for-graph-presentation");
      const chart_Id = `bar_chart_vuln_by_type${i}`;
      const div_tag_for_chat = document.createElement("div");
      div_tag_for_chat.setAttribute("id", chart_Id);
      div_tag_for_chat.style.height = "400px";
      div_tag_chat_main.append(div_tag_for_chat);

      //
      $(document).ready(function() {
        vulnsbytypeandyearchart(chart_Id, data[i].cve_details);
      });
      //check_url("scorecard", version, ossp_name);
      //check_url("sonarqube", version, ossp_name);
      //check_url("codeql", version, ossp_name);
      //check_url("sbom", version, ossp_name);
      //check_url("fossology", version, ossp_name);

    })

    .catch(function (err) {
      console.dir(err);
    });

}
