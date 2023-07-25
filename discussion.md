-----
Discussion: Date: 5/24/2023
-----
- BeSLighthouse for community and it's feature.
- 80% for feature and 20% tech enhancement.
- Vunerability of interest visualization (VOI) (eg:- osv.dev), project of intrest visualization(POI).
- Onboding of project enhancement (still in discussion).
- Taxonomy (opensource tool, BeSenv and corresponding playbook).
- Visualization data which are generated in lab e:g RT and BT.
- Search for a opensource project or component TAVAS component.
- Third party SCA tool, standalone enterprice and community (eg: grafana and kibana) (discussion) in next call
- Graph (still in discussion).
- BeSLighthouse convert into a single plage application
- BeS community
- BeSLab
- O31E (lab enterprise)


----
6/7/2023
----

- Three flavorus of BeSLighthout
   - BeS Community (deployed on GitHub)
     - aggregator for Bes community member and bes lab
   - BeS Lab (deployed as a part of BeSLab based on assiesment)
     - Just for the user
   - Enterprise (o31e)
     - Specific organization
     - additional plugin (visualization)
       
---
20/07/2023
---

- VOI detail view
  - ID to be replaced with package.
  - More line items to be added map it to the applicable BeS environment and Playbooks.
  - Add advisory database which is available.
  - Details view how this has been discovered either advisory database or through our BeS community (BeS lab or partner)
  - Add button for creating issue other TODO: trigger a github action to generate the code for env or playbook.
  - TODO: Link to export VEX (Vulnerability exchange format) or any of cyclone DX or openSSF or SPDX (package format).
  - Download Vulnerability details as JSON TODO: Format to support (osv.dev from google, VEX and BVF (BeSecure Vulnerability Format)).
- POI page
  - Button for Dashboard in POI page
  - Filter to select the project it should be selected from list inside POI give the cut off to max number of projects of interest to support.
  - Use the color coding and shape to represent the project like (associated playbook and env for that project).
- Dashbord
  - First we need the JSON model to use ngo relationship visualization for risk pouser or a select set of projects from POI.
  - Save the visualization in json file name of the organization mapping of organization (search query).

---
25/07/2023
---
- follow the naming conversion like osv.dev all the id will identify as same name acros all BeSLab.
- BVF will the format for exchanging the vul format along with bes env and bes playbook details.
-  VEX and OVF will be used for exchange for known vul..
-  TODO: To build the vizualization of open-source project of interest and there VOI there shouid be utility to genereated required json that will publish as a view risk pousture report.
-  The vul we discover during the fuzzing they will publish interal datastore of the lab and they have to go through the process of triag and will have to work with cna before the publish as BVFID.
-  This datastore will be different from vul-datastore.
-  TODO: publish the format newly discover the vul like osv.dev or github.
