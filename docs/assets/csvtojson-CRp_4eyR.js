import { P as Papa } from "./papaparse.min-DOsBUvb2.js";
async function loadObsAsJson() {
  const response = await fetch("./Taxonomy Observations - Observations.csv");
  const csvText = await response.text();
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });
  const jsonObject = parsed.data;
  return jsonObject;
}
async function loadAppsAsJson() {
  const response = await fetch("./Taxonomy Observations - Applications.csv");
  const csvText = await response.text();
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });
  const jsonObject = parsed.data;
  return jsonObject;
}
async function loadFeedAsJson() {
  const response = await fetch("./Taxonomy Observations - Feedback.csv");
  const csvText = await response.text();
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });
  const jsonObject = parsed.data;
  return jsonObject;
}
async function loadInputsAsJson() {
  const response = await fetch("./Taxonomy Observations - Inputs.csv");
  const csvText = await response.text();
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });
  const jsonObject = parsed.data;
  return jsonObject;
}
async function loadTechAsJson() {
  const response = await fetch("./Taxonomy Observations - Interaction Techniques.csv");
  const csvText = await response.text();
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });
  const jsonObject = parsed.data;
  return jsonObject;
}
async function loadFaceAsJson() {
  const response = await fetch("./Taxonomy Observations - Interface Elements.csv");
  const csvText = await response.text();
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });
  const jsonObject = parsed.data;
  return jsonObject;
}
async function loadTasksAsJson() {
  const response = await fetch("./Taxonomy Observations - Tasks.csv");
  const csvText = await response.text();
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });
  const jsonObject = parsed.data;
  return jsonObject;
}
export {
  loadTasksAsJson as a,
  loadAppsAsJson as b,
  loadFeedAsJson as c,
  loadFaceAsJson as d,
  loadTechAsJson as e,
  loadInputsAsJson as f,
  loadObsAsJson as l
};
//# sourceMappingURL=csvtojson-CRp_4eyR.js.map
