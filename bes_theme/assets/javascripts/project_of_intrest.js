function totalProject(main_div_content) {
    const total_project = `
        <div class="css-for-total-project">
            <h2> Total Project Count: ${projectOfIntrestObject.length} </h2>
        </div>
    `
    main_div_content.innerHTML = total_project;
}

function numberOfProject(main_div_content) {
    const create_div = document.createElement("div");
    create_div.className = "css-div-for-table-language-project"
    const languageCountTable = document.createElement("table");
    languageCountTable.setAttribute("id", "languageCountTable");
    languageCountTable.setAttribute("class", "table-css");
    const tableBody = document.createElement('TBODY');
    const html_for_table = `
      <tr>
        <th>Language</th>
        <th>Project Count</th>
      </tr>
      `;
    tableBody.innerHTML = html_for_table;
    let languageCount = {};
    for (let i=0; i<projectOfIntrestObject.length; i++) {
        for (let j=0; j<projectOfIntrestObject[i]["language"].length; j++) {
            if (!languageCount[projectOfIntrestObject[i]["language"][j]]) {
                languageCount[projectOfIntrestObject[i]["language"][j]] = 1;
                continue;
            }
            languageCount[projectOfIntrestObject[i]["language"][j]]++;
        }
    }
    const key = Object.keys(languageCount);
    for (let i=0; i<key.length; i++) {
        const tr = document.createElement('TR');
        const data = `
            <td>${key[i]}</td>
            <td>${languageCount[key[i]]} </td>
        `;
        tr.innerHTML = data;
        tableBody.appendChild(tr);
    }
    
    languageCountTable.appendChild(tableBody);
    create_div.appendChild(languageCountTable);
    main_div_content.appendChild(create_div);
}

function tableForProject() {
    const create_div = document.createElement("div");
    create_div.className = "table-fo-POI-css";
    const table = document.createElement("table");
    table.setAttribute("id", "projectOfIntreat");
    table.setAttribute("class", "table-css");
    const tableBody = document.createElement('TBODY');
    const html_for_table = `
      <tr>
        <th>BeS Tracking Id</th>
        <th>Project Name</th>
        <th>Description</th>
        <th>Git URL</th>
        <th>BeS Tech Stack</th>
      </tr>
      `;
    tableBody.innerHTML = html_for_table;
    for (let i=0; i<projectOfIntrestObject.length; i++) {
        const tr = document.createElement('TR');
        const data = `
            <td>${projectOfIntrestObject[i]["id"]}</td>
            <td>${projectOfIntrestObject[i]["name"]}</td>
            <td>${projectOfIntrestObject[i]["description"]}</td>
            <td><a href=${projectOfIntrestObject[i]["html_url"]} target="_blank"> Click here</a></td>
            <td>${projectOfIntrestObject[i]["language"].join(" ")}</td>
        `;
        tr.innerHTML = data;
        tableBody.appendChild(tr);
    }
    table.appendChild(tableBody);
    create_div.appendChild(table);
    return create_div;
}

function projectOfIntrest() {
    const container_element = document.getElementById("container");
    const main_div_content = document.createElement("div");
    main_div_content.className = "border-div-for-project-of-intrest";
    totalProject(main_div_content);
    numberOfProject(main_div_content);
    const tablePOI = tableForProject();
    container_element.append(main_div_content);
    container_element.appendChild(tablePOI);
}