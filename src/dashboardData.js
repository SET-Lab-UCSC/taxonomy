import Papa from "papaparse";

/**
 * Load and parse observations CSV
 */
async function loadObservationsCSV() {
    const basePath = import.meta.env.BASE_URL || '/';
    const fileName = "Taxonomy Observations - Observations.csv";

    // Try different fetch paths
    const paths = [
        `./${fileName}`,
        `${basePath}${fileName}`,
        `/${fileName}`
    ];

    for (const path of paths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                const csvText = await response.text();
                console.log(`✓ Loaded observations from ${path}`);

                const parsed = Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (h) => h.trim()
                });

                return parsed.data;
            }
        } catch (e) {
            continue;
        }
    }

    throw new Error(`Failed to load observations CSV from: ${paths.join(', ')}`);
}

/**
 * Load and parse tasks CSV
 */
async function loadTasksCSV() {
    const basePath = import.meta.env.BASE_URL || '/';
    const fileName = "Taxonomy Observations - Tasks.csv";

    const paths = [
        `./${fileName}`,
        `${basePath}${fileName}`,
        `/${fileName}`
    ];

    for (const path of paths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                const csvText = await response.text();
                console.log(`✓ Loaded tasks from ${path}`);

                const parsed = Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (h) => h.trim()
                });

                return parsed.data;
            }
        } catch (e) {
            continue;
        }
    }

    throw new Error(`Failed to load tasks CSV from: ${paths.join(', ')}`);
}

/**
 * Load and parse inputs CSV
 */
async function loadInputsCSV() {
    const basePath = import.meta.env.BASE_URL || '/';
    const fileName = "Taxonomy Observations - Inputs.csv";

    const paths = [
        `./${fileName}`,
        `${basePath}${fileName}`,
        `/${fileName}`
    ];

    for (const path of paths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                const csvText = await response.text();
                console.log(`✓ Loaded inputs from ${path}`);

                const parsed = Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (h) => h.trim()
                });

                return parsed.data;
            }
        } catch (e) {
            continue;
        }
    }

    throw new Error(`Failed to load inputs CSV from: ${paths.join(', ')}`);
}

/**
 * Load and parse interface elements CSV
 */
async function loadInterfaceElementsCSV() {
    const basePath = import.meta.env.BASE_URL || '/';
    const fileName = "Taxonomy Observations - Interface Elements.csv";

    const paths = [
        `./${fileName}`,
        `${basePath}${fileName}`,
        `/${fileName}`
    ];

    for (const path of paths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                const csvText = await response.text();
                console.log(`✓ Loaded interface elements from ${path}`);

                const parsed = Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (h) => h.trim()
                });

                return parsed.data;
            }
        } catch (e) {
            continue;
        }
    }

    throw new Error(`Failed to load interface elements CSV from: ${paths.join(', ')}`);
}

/**
 * Load and parse feedback CSV
 */
async function loadFeedbackCSV() {
    const basePath = import.meta.env.BASE_URL || '/';
    const fileName = "Taxonomy Observations - Feedback.csv";

    const paths = [
        `./${fileName}`,
        `${basePath}${fileName}`,
        `/${fileName}`
    ];

    for (const path of paths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                const csvText = await response.text();
                console.log(`✓ Loaded feedback from ${path}`);

                const parsed = Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (h) => h.trim()
                });

                return parsed.data;
            }
        } catch (e) {
            continue;
        }
    }

    throw new Error(`Failed to load feedback CSV from: ${paths.join(', ')}`);
}

/**
 * Load and parse interaction techniques CSV
 */
async function loadTechniquesCSV() {
    const basePath = import.meta.env.BASE_URL || '/';
    const fileName = "Taxonomy Observations - Interaction Techniques.csv";

    const paths = [
        `./${fileName}`,
        `${basePath}${fileName}`,
        `/${fileName}`
    ];

    for (const path of paths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                const csvText = await response.text();
                console.log(`✓ Loaded techniques from ${path}`);

                const parsed = Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (h) => h.trim()
                });

                return parsed.data;
            }
        } catch (e) {
            continue;
        }
    }

    throw new Error(`Failed to load techniques CSV from: ${paths.join(', ')}`);
}

/**
 * Get count of unique applications
 */
function countUniqueApplications(observations) {
    const apps = new Set();
    observations.forEach(obs => {
        if (obs.Application && obs.Application.trim()) {
            apps.add(obs.Application.trim());
        }
    });
    return apps.size;
}

/**
 * Get count of unique interaction techniques
 */
function countUniqueTechniques(observations) {
    const techniques = new Set();
    observations.forEach(obs => {
        if (obs.Interaction_Technique && obs.Interaction_Technique.trim()) {
            const techs = obs.Interaction_Technique.split(',').map(t => t.trim()).filter(t => t);
            techs.forEach(t => techniques.add(t));
        }
    });
    return techniques.size;
}

/**
 * Load all technique definitions
 */
function getTechniqueCount(techniques) {
    return techniques.filter(t => t.Interaction_Technique && t.Interaction_Technique.trim()).length;
}

/**
 * Get count of tasks
 */
function getTaskCount(tasks) {
    return tasks.filter(t => t.Tasks && t.Tasks.trim()).length;
}

/**
 * Get count of inputs
 */
function getInputCount(inputs) {
    return inputs.filter(i => i.Inputs && i.Inputs.trim()).length;
}

/**
 * Get count of interface elements
 */
function getInterfaceElementCount(elements) {
    return elements.filter(e => e.Interface_Element && e.Interface_Element.trim()).length;
}

/**
 * Get count of feedback types
 */
function getFeedbackCount(feedback) {
    return feedback.filter(f => f.Feedback && f.Feedback.trim()).length;
}

/**
 * Main dashboard data loader
 */
export async function loadDashboardData() {
    try {
        console.log("Loading dashboard data...");

        const observations = await loadObservationsCSV();
        const techniques = await loadTechniquesCSV();
        const tasks = await loadTasksCSV();
        const inputs = await loadInputsCSV();
        const interfaceElements = await loadInterfaceElementsCSV();
        const feedback = await loadFeedbackCSV();

        console.log(`✓ Data loaded successfully`);

        const appCount = countUniqueApplications(observations);
        const techCount = countUniqueTechniques(observations);
        const allTechniques = getTechniqueCount(techniques);
        const taskCount = getTaskCount(tasks);
        const inputCount = getInputCount(inputs);
        const interfaceCount = getInterfaceElementCount(interfaceElements);
        const feedbackCount = getFeedbackCount(feedback);

        const data = {
            applicationsCount: appCount,
            interactionTechniquesCount: techCount,
            definedTechniquesCount: allTechniques,
            tasksCount: taskCount,
            inputsCount: inputCount,
            interfaceElementsCount: interfaceCount,
            feedbackCount: feedbackCount,
            totalObservations: observations.length
        };

        console.log("Dashboard data:", data);
        return data;
    } catch (error) {
        console.error("Error loading dashboard data:", error);
        return {
            applicationsCount: 0,
            interactionTechniquesCount: 0,
            definedTechniquesCount: 0,
            tasksCount: 0,
            inputsCount: 0,
            interfaceElementsCount: 0,
            feedbackCount: 0,
            totalObservations: 0,
            error: error.message
        };
    }
}
