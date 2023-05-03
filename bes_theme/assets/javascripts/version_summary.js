function vulnsbytypeandyearchart(chart_Id, cve_details) {
  if (cve_details === "Not Available") {
    const cve_details = document.getElementById(chart_Id);
    const changeCssForGraph = document.getElementById(
      "main-div-for-graph-presentation"
    );
    changeCssForGraph.className = "graph-style-cve-not-available-css";
    cve_details.innerHTML = `<h3 class="cve-not-available-css">CVE details are not available at the moment</h3>`;
    return;
  }
  let detail_cve = {};
  for (let i = 0; i < cve_details.length; i++) {
    const key = Object.keys(cve_details[i]);
    for (let j = 0; j < key.length; j++) {
      if (key[j] !== "Year") {
        if (!detail_cve[key[j]]) {
          detail_cve[key[j]] = [];
        }
        if (cve_details[i][key[j]] !== null && cve_details[i][key[j]] !== "") {
          detail_cve[key[j]].push([
            parseInt(cve_details[i]["Year"]),
            cve_details[i][key[j]],
          ]);
        }
      }
    }
  }
  const data = [];
  const vulntypesarray = [];
  const visible_all_field = [];
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
      "#69c",
      "#333",
      "#DB045B",
      "#E04807",
      "#4572A7",
      "#AA4643",
      "#89A54E",
      "#80699B",
      "#3D96AE",
      "#DB843D",
      "#92A8CD",
      "#A47D7C",
      "#B5CA92",
      "#FF9655",
      "#24CBE5",
    ],
    seriesDefaults: {},
    series: visible_all_field,
    title: {
      text: "Vulnerabilities by type & year",
      fontFamily:
        '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
      fontSize: "12px",
      color: "#3E576F",
    },
    axesDefaults: {
      labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
      borderColor: "#4572A7",
    },
    axes: {
      xaxis: {
        label: "Years",
        color: "#3E576F",
        pad: 0,
        min: 1999,
        tickInterval: 1,
      },
      yaxis: {
        label: "# Of Vulns",
        numberTicks: 5,
        min: 0,
        color: "#3E576F",
      },
    },
    legend: {
      show: true,
      location: "s",
      renderer: $.jqplot.EnhancedLegendRenderer,
      placement: "outsideGrid",
      labels: vulntypesarray,
      rendererOptions: {
        seriesToggle: true,
        seriesToggleReplot: { resetAxes: ["yaxis"] },
        numberRows: 5,
        numberColumns: 5,
      },
      border: "1px solid #909090",
      fontFamily:
        '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
      fontSize: "11px",
    },
    highlighter: {
      show: true,
      sizeAdjust: 12,
      useAxesFormatters: false,
      fadeTooltip: false,
      formatString: "%d : %s",
      bringSeriesToFront: true,
      lineWidthAdjust: 10,
    },
  });
}

function open_report(base_url, version, report, project_name) {
  localStorage["version"] = version;
  localStorage["report"] = report;
  localStorage["ossp_name"] = project_name;
  window.open(base_url + "/bes_assessment_reports", "_self");
}

function check_url(id, version, name) {
  if (id == "sonarqube" || id == "codeql") {
    var url =
      "https://raw.githubusercontent.com/Be-Secure/besecure-assessment-datastore/main/" +
      name +
      "/" +
      version +
      "/sast/" +
      name +
      "-" +
      version +
      "-" +
      id +
      "-report.json";
  } else if (id == "fossology") {
    var url =
      "https://raw.githubusercontent.com/Be-Secure/besecure-assessment-datastore/main/" +
      name +
      "/" +
      version +
      "/license-compliance/" +
      name +
      "-" +
      version +
      "-" +
      id +
      "-report.json";
  } else {
    var url =
      "https://raw.githubusercontent.com/Be-Secure/besecure-assessment-datastore/main/" +
      name +
      "/" +
      version +
      "/" +
      id +
      "/" +
      name +
      "-" +
      version +
      "-" +
      id +
      "-report.json";
  }

  fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {})
    .catch(function (err) {
      document.getElementById(id).setAttribute("href", "javascript:void(0)");
      document.getElementById(id).innerHTML = "Not Available";
      document.getElementById(id).classList.add("disabled-link");
    });
}

async function load_version_data(base_url) {
  id = localStorage["id"];
  ossp_name = localStorage["name"];

  const poi = await fetch(
    "https://raw.githubusercontent.com/sudhirverma/besecure-osspoi-datastore/main/OSSP-Master.json",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );
  const poiData = await poi.json();
  const listOfPOI = poiData.items;

  fetch(
    "https://raw.githubusercontent.com/sudhirverma/besecure-osspoi-datastore/main/version_details/" +
      id +
      "-" +
      ossp_name +
      "-Versiondetails.json"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      array = [];
      for (let i = 0; i < Object.keys(data).length; i++) {
        array.push(data[i].version);
      }
      //adding versions to the dropdown list
      var temp = document.getElementById("selectversion");
      for (var i = 0; i < array.length; i++) {
        var opt = array[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        temp.appendChild(el);
      }

      var e = document.getElementById("selectversion");
      function onChange() {
        const container_element = document.getElementById("container");
        const create_hadder_content = document.getElementById("hadder_page");
        const span_for_hadder = document.getElementById("hadder-css-page");
        span_for_hadder.innerText = "BeSLighthouse";
        create_hadder_content.append(span_for_hadder);
        const report_name = document.getElementById("report-name-project");
        const span_name = `<span class="span-report-css">Project: ${ossp_name}</span>`;
        report_name.innerHTML = span_name;

        // For each version of the project, we are creating different tags on the fly.

        // Main div
        const main_div_content = document.getElementById("border-div-css");

        //get selected version from drop down
        var text = e.options[e.selectedIndex].text;
        console.log(text);

        //get i value
        for (let i = 0; i < Object.keys(data).length; i++) {
          if (text == data[i].version) {
            var val = i;
          }
        }
        const releaseData = data[val].release_date;
        const version = data[val].version;
        const scorecard = data[val].scorecard;
        const criticalityScore = data[val].criticality_score;

        for (let i = 0; i < Object.keys(listOfPOI).length; i++) {
          if (listOfPOI[i]["id"] == id) {
            description = listOfPOI[i]["description"];
            bes_tech_stack = listOfPOI[i]["bes_technology_stack"];
          }
        }

        if (data[val].cve_details == "Not Available") {
          vul_count = 0;
        } else {
          for (let i = 0; i < Object.keys(data[val].cve_details).length; i++) {
            if (data[val].cve_details[i].Year == "Total") {
              vul_count = data[val].cve_details[i].No_of_Vulnerabilities;
            }
          }
        }

        const scorecardLink = `<a id="scorecard" href='javascript:open_report("${base_url}","${version}", "scorecard", "${ossp_name}")'>${scorecard}</a>`;

        if (scorecard != "Not Available") {
          // Color coding scorecard scores
          if (scorecard <= 2.5) {
            scorecard_table_td_data = `<span style="background-color:green"; >${scorecardLink}</span>`;
          } else if (scorecard <= 5) {
            scorecard_table_td_data = `<span style="background-color:yellow"; >${scorecardLink}</span>`;
          } else if (scorecard <= 7.5) {
            scorecard_table_td_data = `<span style="background-color:orange"; >${scorecardLink}</span>`;
          } else if (scorecard <= 10) {
            scorecard_table_td_data = `<span style="background-color:red"; >${scorecardLink}</span>`;
          }
        } else {
          scorecard_table_td_data = `<span >${scorecardLink}</span>`;
        }

        if (criticalityScore != "Not Available") {
          if (criticalityScore < 0.5) {
            criticalityScore_table_td_data = `<span style="background-color:green; color:white" >${criticalityScore}</span>`;
          } else if (criticalityScore == 0.5) {
            criticalityScore_table_td_data = `<span style="background-color:yellow" >${criticalityScore}</span>`;
          } else if (criticalityScore > 0.5) {
            criticalityScore_table_td_data = `<span style="background-color:red; color:white" >${criticalityScore}</span>`;
          }
        } else {
          criticalityScore_table_td_data = `<span >${criticalityScore}</span>`;
        }

        //Populating report table
        const id_name = document.getElementById("id_value");
        const id_value = `Tracking ID : ${id}`;
        id_name.innerHTML = id_value;

        const release_name = document.getElementById("release_value");
        const release_value = `Release Date : ${releaseData}`;
        release_name.innerHTML = release_value;

        const project_name = document.getElementById("project_value");
        const project_value = `Project Name : ${ossp_name}`;
        project_name.innerHTML = project_value;

        const tech_name = document.getElementById("tech_value");
        const tech_value = `BesTech Stack : ${bes_tech_stack}`;
        tech_name.innerHTML = tech_value;

        const desc_name = document.getElementById("desc_value");
        const desc_value = `Description : ${description}`;
        desc_name.innerHTML = desc_value;

        const scorecard_name = document.getElementById("scorecard_value");
        const scorecard_value = `Scorecard : ${scorecard_table_td_data}`;
        scorecard_name.innerHTML = scorecard_value;

        const criticality_name = document.getElementById("criticality_value");
        const criticality_value = `Criticality Score : ${criticalityScore_table_td_data}`;
        criticality_name.innerHTML = criticality_value;

        const sonarqube_name = document.getElementById("sonarqube_value");
        const sonarqube_value = `Sonarqube : <a id="sonarqube"; href='javascript:open_report("${base_url}","${version}", "sonarqube", "${ossp_name}")'>Click here</a>`;
        sonarqube_name.innerHTML = sonarqube_value;

        const codeql_name = document.getElementById("codeql_value");
        const codeql_value = `Codeql : <a id="codeql" href='javascript:open_report("${base_url}","${version}", "codeql", "${ossp_name}")'>Click here</a>`;
        codeql_name.innerHTML = codeql_value;

        const sbom_name = document.getElementById("sbom_value");
        const sbom_value = `SBOM : <a id="sbom" href='javascript:open_report("${base_url}","${version}", "sbom", "${ossp_name}")'>Click here</a>`;
        sbom_name.innerHTML = sbom_value;

        const fossology_name = document.getElementById("fossology_value");
        const fossology_value = `Fossology : <a id="fossology" href='javascript:open_value("${base_url}","${version}", "fossology", "${ossp_name}")'>Click here</a>`;
        fossology_name.innerHTML = fossology_value;

        const vul_count_name = document.getElementById("vul_count_value");
        const vul_count_value = `Known Vulnerability Count : ${vul_count}`;
        vul_count_name.innerHTML = vul_count_value;

        // Graph code
        const chart_Id = `bar_chart_vuln_by_type`;
        debugger;
        $(document).ready(function () {
          vulnsbytypeandyearchart(chart_Id, data[val].cve_details);
        });
        check_url("scorecard", version, ossp_name);
        check_url("sonarqube", version, ossp_name);
        check_url("codeql", version, ossp_name);
        check_url("sbom", version, ossp_name);
        check_url("fossology", version, ossp_name);
      }
      e.onchange = onChange;
      onChange();
    })

    .catch(function (err) {
      console.dir(err);
    });
}
