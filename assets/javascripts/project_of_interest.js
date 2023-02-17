function totalProject(main_div_content, listOfPOI) {
    const total_project = `
        <div class="css-for-total-project">
            <h2>Projects Of Interest: ${listOfPOI.length} </h2>
        </div>
    `
    main_div_content.innerHTML = total_project;
}

function open_bes_version_history(id, name) {
  localStorage["id"] = id;
  localStorage["name"] = name;
  window.open("../../bes_version_history", "_self");
}

function tableForProject(listOfPOI) {
    const create_div = document.createElement("div");
    create_div.className = "table-for-POI-css";
    const table = document.createElement("table");
    table.setAttribute("id", "projectOfIntreat");
    table.setAttribute("class", "table-css");
    const tableBody = document.createElement('TBODY');
    const html_for_table = `
      <tr>
        <th>BeS Id</th>
        <th>Project Name</th>
        <th>Description</th>
        <th>BeS Tech Stack</th>
      </tr>
      `;
    tableBody.innerHTML = html_for_table;
    for (let i=0; i<listOfPOI.length; i++) {
        const tr = document.createElement('TR');
        const data = `
            <td><a href=${listOfPOI[i]["html_url"]} target="_blank"> ${listOfPOI[i]["id"]}</a></td>
            <td><a href='javascript:open_bes_version_history("${listOfPOI[i]["id"]}", "${listOfPOI[i]["name"]}")'> ${listOfPOI[i]["name"]}</a></td>
            <td>${listOfPOI[i]["description"]}</td>
            <td>${listOfPOI[i]["bes_technology_stack"]}</td>
        `;
        tr.innerHTML = data;
        tableBody.appendChild(tr);
    }
    table.appendChild(tableBody);
    create_div.appendChild(table);
    return create_div;
}

function createDivForPieChart(main_div_content, css, id) {
    const parentDiv =document.createElement("div");
    parentDiv.className = css;
    const canvas = document.createElement("canvas");
    canvas.id = id;
    parentDiv.append(canvas)
    main_div_content.appendChild(parentDiv);
}

function pieChart(lableList, dataList, colorList, id, name) {
    const ctx = document.getElementById(id).getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: lableList,
            datasets: [{
                data: dataList,
                backgroundColor: colorList,
                borderWidth: 0.5 ,
                borderColor: '#ddd'
            }]
        },
        options: {
            title: {
                display: true,
                text: name,
                position: 'top',
                fontSize: 16,
                fontColor: '#111',
                padding: 20
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    boxWidth: 20,
                    fontColor: '#111',
                    padding: 15
                }
            },
            tooltips: {
                enabled: false
            },
            plugins: {
                datalabels: {
                    color: '#111',
                    textAlign: 'center',
                    font: {
                        lineHeight: 1.6
                    },
                    formatter: function(value) {
                        return value;
                    }
                }
            }
        }
    });
}

function pieChartForBesTechStack(listOfPOI, id) {
    const BTS = {
        "L&F": {
            backgroundColor: "yellow",
            count: 0
        },
        "DO": {
            backgroundColor: "black",
            count: 0
        },
        "A": {
            backgroundColor: "red",
            count: 0
        },
        "DA": {
            backgroundColor: "#10dbc8",
            count: 0
        },
        "S": {
            backgroundColor: "#6cb6ff",
            count: 0
        }
    }
    for (let i=0; i<listOfPOI.length; i++) {
        BTS[listOfPOI[i]["bes_technology_stack"]].count += 1;
    }
    let key = Object.keys(BTS);
    const lableList = [];
    const dataList = [];
    const colorList = [];
    for (let i=0; i<key.length; i++) {
        if (BTS[key[i]].count === 0) continue;
        lableList.push(key[i]);
        dataList.push(BTS[key[i]].count);
        colorList.push(BTS[key[i]].backgroundColor);
    }
    pieChart(lableList, dataList, colorList, id, 'BeS Tech Stack');
}

function pieChartForPoi(listOfPOI, id) {
    const lableList = [];
    const dataList = [];
    const colorList = [];
    let languageCount = {};
    for (let i=0; i<listOfPOI.length; i++) {
        for (let j=0; j<listOfPOI[i]["language"].length; j++) {
            if (!languageCount[listOfPOI[i]["language"][j]]) {
                languageCount[listOfPOI[i]["language"][j]] = 1;
                continue;
            }
            languageCount[listOfPOI[i]["language"][j]]++;
        }
    }
    const key = Object.keys(languageCount);
    for (let i=0; i<key.length; i++) {
        if (supportedLanguages[key[i].toLocaleLowerCase().trim()]) {
            lableList.push(key[i]);
            dataList.push(languageCount[key[i]]);
            colorList.push(colorForLanguages[key[i]]);
        }
    }
    pieChart(lableList, dataList, colorList, id, "Languages");
}

function projectOfInterest() {
    const container_element = document.getElementById("container");
    const main_div_content = document.createElement("div");
    main_div_content.className = "border-div-for-project-of-intrest";
    const listOfPOI = projectOfInterestObject.items;
    totalProject(main_div_content, listOfPOI);
    createDivForPieChart(main_div_content, "pie-chart-poi-css", "projectOfInterest");
    createDivForPieChart(main_div_content, "pie-chart-css", "myChart");
    const tablePOI = tableForProject(listOfPOI);
    container_element.append(main_div_content);
    container_element.appendChild(tablePOI);
    pieChartForBesTechStack(listOfPOI, "myChart");
    pieChartForPoi(listOfPOI, "projectOfInterest");
}