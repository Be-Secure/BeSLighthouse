## Community Meetup Discussion Notes

---
07 Dec 2023
---
- Connect the BeSecure website directly with Projects of interest (Tracked Projects)
- Have a back button to Be_Secure home page
- VOI page changes
	- Bring in AVID vulnerabilities / or any other ML vulnerability information here
	- Recent additions / updates to POI and VOI , MOI
- MOI page changes
	- Remove all the unknowns
	- Field names should be rendered properly (no underscores)
	- Remove the type column from the table
  - Id to be put as the first column in the MOI table
	- Classify models as LLM and Classic / Deterministic
	- Size fields should be categorised based on the typ of model
	- Revisit the Assessment Summary section. 
	- The model analysis files should be pointing to BeSecure namespace
	- Map the SAST findings to an industry model weakness classification. Or create our own weakness and map it. Later this can be mapped to an industry standard. This gives us credibility
	- Rename the "Model Security" "Attack Graph Emulation". Put a lock for the ones that are not available (Its a paid service)
	- Give an attribution to O31E (Submitted by O31E). Also give attribution to the tools like AIShield
	- Construct a Provenance Id for each model we onboard 
	- Proof of Attestation should be generated using the DICE ID. (Give attribute to DICE ID)
	- We should call out in the visualization that it is a TAVOSS model
	- The Graph view of all MLs should be toggled using button in landing page for MOI
  - Build an Observable like arc graph to showcase the dependencies between POI, VOI and MOI https://observablehq.com/@d3/arc-diagram
	- Link Be-Secure environments and Playbooks to POI, VOI, MOI

---
06 Sep 2023
---
- Use d3 graph to demonstrate the visualization of Project.
- Create a org if possible or display the visualization base on CVE or scorecard
- Use the color code for the Project based on severity.

---
03 Aug 2023
---
- Use the existing advisory-database if there is any.
- TODO: Determind the format to sync-up assessment datastore of different BeS Lab to the public or community.
- Remove besecure tech stack as the tech stack will be affected project.
- Include the env to run the exploit for vulnerability and BeSecure-playbook to run the exploit.

---
25 Jul 2023
---
- follow the naming conversion like osv.dev all the id will identify as the same name across all BeSLab.
- BVF will be the format for exchanging the Vulnerability format along with bes env and bes playbook details.
-  VEX and OVF will be used in exchange for known Vulnerability
-  TODO: To build the visualization of the open-source projects of interest and their VOI there should be utility to generate the required json that will publish as a view risk posture report.
-  The Vulnerability we discover during the fuzzing they will publish the internal datastore of the lab and they have to go through the process of triage and will have to work with CNA before the publish as BVFID.
-  This datastore will be different from Vulnerability-datastore.
-  TODO: publish the format of newly discovered Vulnerabilities like osv.dev or GitHub.

---
20 Jul 2023
---
- VOI detail view
  - ID to be replaced with the package.
  - More line items to be added and map it to the applicable BeS environment and Playbooks.
  - Add an advisory database that is available.
  - Details view how this has been discovered either advisory database or through our BeS community (BeS lab or partner)
  - Add a button for creating issues other TODO: trigger a GitHub action to generate the code for env or playbook.
  - TODO: Link to export VEX (Vulnerability exchange format) or cyclone DX, openSSF, or SPDX (package format).
  - Download Vulnerability details as JSON TODO: Format to support (osv.dev from Google, VEX, and BVF (BeSecure Vulnerability Format)).

- POI page
  - Button for Dashboard on POI page
  - Filter to select the project it should be selected from the list inside POI give the cut-off to max number of projects of interest to support.
  - Use the color coding and shape to represent the project (associated playbook and env for that project).

- Dashboard
  - First, we need the JSON model to use ngo relationship visualization for risk poser or a select set of projects from POI.
  - Save the visualization in the JSON file name of the organization mapping of an organization (search query).

----
07 Jun 2023
----
- Three flavors of BeSLighthouse
   - BeS Community (deployed on GitHub)
     - an aggregator for Bes community members and BeS lab
   - BeS Lab (deployed as a part of BeSLab based on assessment)
     - Just for the user
   - Enterprise (o31e)
     - Specific organization
     - additional plugin (visualization)

-----
25 May 2023
-----
- BeSLighthouse for community and its feature.
- 80% for features and 20% for tech enhancement.
- Vulnerability of interest visualization (VOI) (eg:- osv.dev), project of interest visualization(POI).
- Onboding of project enhancement (still in discussion).
- Taxonomy (open-source tool, BeSenv, and corresponding playbook).
- Visualization data which are generated in lab e:g RT and BT.
- Search for an open-source project or component TAVAS component.
- Third-party SCA tool, standalone enterprise, and community (eg: grafana and kibana) (discussion) in the next call
- Graph (still in discussion).
- BeSLighthouse converts into a single-page application
- BeS community
- BeSLab
- O31E (lab enterprise)