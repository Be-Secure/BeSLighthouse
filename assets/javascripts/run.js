
function open_home_page()
{
  window.open("../", "_self");
}

function load_data(base_url,id,name)
{
  localStorage["id"] = id;
  localStorage["name"] = name;
  console.log("url:"+base_url+"/bes_version_history");
  window.open(base_url+"/bes_version_history");
  
}
