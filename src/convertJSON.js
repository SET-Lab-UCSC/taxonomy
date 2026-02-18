import Papa from "papaparse";

export async function loadObsAsJson() {
    const response = await fetch("./Taxonomy Observations - Obvservations.csv");
    const csvText = await response.text();

    const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
    });

    const jsonObject = parsed.data;
    return jsonObject;
}

export async function loadAppsAsJson() {
    const response = await fetch("./Taxonomy Observations - Applications.csv");
    const csvText = await response.text();

    const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
    });

    const jsonObject = parsed.data;
    return jsonObject;
}

export async function loadFeedAsJson() {
    const response = await fetch("./Taxonomy Observations - Feedback.csv");
    const csvText = await response.text();

    const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
    });

    const jsonObject = parsed.data;
    return jsonObject;
}

export async function loadInputsAsJson() {
    const response = await fetch("./Taxonomy Observations - Inputs.csv");
    const csvText = await response.text();

    const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
    });

    const jsonObject = parsed.data;
    return jsonObject;
}

export async function loadTechAsJson() {
    const response = await fetch("./Taxonomy Observations - Interaction Techniques.csv");
    const csvText = await response.text();

    const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
    });

    const jsonObject = parsed.data;
    return jsonObject;
}

export async function loadFaceAsJson() {
    const response = await fetch("./Taxonomy Observations - Interface Elements.csv");
    const csvText = await response.text();

    const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
    });

    const jsonObject = parsed.data;
    return jsonObject;
}

export async function loadTasksAsJson() {
    const response = await fetch("./Taxonomy Observations - Tasks.csv");
    const csvText = await response.text();

    const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
    });

    const jsonObject = parsed.data;
    return jsonObject;
}



// Example usage
// loadCsvAsJson().then(data => {
//     console.log("JSON Object:", data);
// });