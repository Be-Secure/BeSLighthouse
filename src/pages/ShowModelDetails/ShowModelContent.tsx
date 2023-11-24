import React from "react";
import { useLocation } from "react-router-dom";

export const spanStyle: any = {
  fontSize: "1rem",
  fontWeight: 700,
  paddingRight: "13px"
};




function ShowModelContent() {
  const location = useLocation();
  const selectedMenu = location.state.selectedMenu;
  const key = Object.keys(selectedMenu);
  return (
    <div>
      <div>
        <h3>{selectedMenu.name}</h3>
        <div style={{ margin: "10px" }}>
          <div>
            Upstream:
            <span> {selectedMenu.dependencies.join(" | ")}</span>
          </div>
          <div>
            Downstream:
            <span></span>
          </div>
          <table
            style={{ width: "100%", maxWidth: "100%", marginBottom: "1rem", backgroundColor: 'transparent' }}
          >
            <tbody>
              {key.map((keyValue) => {
                if (keyValue === "type") return <></>;
                if (keyValue === "created_date" || keyValue === "license") {
                  return (
                    <tr>
                      <td style={{padding: '0.4rem 0.75rem'}}>
                        <div>{keyValue} </div>
                      </td>
                      <td style={{padding: '0.4rem 0.75rem'}}>
                        <div>
                          <p>{selectedMenu[keyValue].value}</p>
                        </div>
                      </td>
                    </tr>
                  );
                }
                if (keyValue === "dependencies") {
                  return (
                    <tr>
                      <td style={{padding: '0.4rem 0.75rem'}}>
                        <div>{keyValue} </div>
                      </td>
                      <td style={{padding: '0.4rem 0.75rem'}}>
                        <div>
                          <p>{selectedMenu[keyValue].join(" | ")}</p>
                        </div>
                      </td>
                    </tr>
                  );
                }
                if (keyValue === "url") {
                  return (
                    <tr>
                      <td style={{padding: '0.4rem 0.75rem'}}>
                        <div>{keyValue} </div>
                      </td>
                      <td style={{padding: '0.4rem 0.75rem'}}>
                        <div>
                          <a
                            href={selectedMenu[keyValue]}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{color: '#587f2f'}}
                          >
                            {selectedMenu[keyValue]}
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr>
                    <td style={{padding: '0.4rem 0.75rem'}}>
                      <div>{keyValue} </div>
                    </td>
                    <td style={{padding: '0.4rem 0.75rem'}}>
                      <div>
                        <p>{selectedMenu[keyValue]}</p>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ShowModelContent;
