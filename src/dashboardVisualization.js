import Chart from 'chart.js/auto';

let chartInstances = [];

/**
 * Render applications and techniques visualizations
 */
export function renderDashboard(data) {
    renderApplicationsCard(data.applicationsCount);
    renderTechniquesCard(data.interactionTechniquesCount);
    renderObservationsCard(data.totalObservations);
    renderTasksCard(data.tasksCount);
    renderInputsCard(data.inputsCount);
    renderInterfaceElementsCard(data.interfaceElementsCount);
    renderFeedbackCard(data.feedbackCount);
}

/**
 * Create applications metric card
 */
function renderApplicationsCard(count) {
    const container = document.getElementById('applications-metric');
    if (!container) return;

    container.innerHTML = `
        <div class="metric-card">
            <div class="metric-number">${count}</div>
            <div class="metric-label">Applications Covered</div>
            <div class="metric-description">Unique VR applications with documented interactions</div>
        </div>
    `;
}

/**
 * Create interaction techniques metric card
 */
function renderTechniquesCard(count) {
    const container = document.getElementById('techniques-metric');
    if (!container) return;
    container.innerHTML = `
        <div class="metric-card">
            <div class="metric-number">${count}</div>
            <div class="metric-label">Interaction Techniques</div>
            <div class="metric-description">Distinct interaction methods identified</div>
        </div>
    `;
}

/**
 * Create observations metric card
 */
function renderObservationsCard(count) {
    const container = document.getElementById('observations-metric');
    if (!container) return;

    container.innerHTML = `
        <div class="metric-card">
            <div class="metric-number">${count}</div>
            <div class="metric-label">Total Observations</div>
            <div class="metric-description">Interactions documented to date</div>
        </div>
    `;
}
function renderTasksCard(count) {
    const container = document.getElementById('tasks-metric');
    if (!container) return;

    container.innerHTML = `
        <div class="metric-card">
            <div class="metric-number">${count}</div>
            <div class="metric-label">Tasks</div>
            <div class="metric-description">Unique tasks taxonomy items</div>
        </div>
    `;
}

function renderInputsCard(count) {
    const container = document.getElementById('inputs-metric');
    if (!container) return;

    container.innerHTML = `
        <div class="metric-card">
            <div class="metric-number">${count}</div>
            <div class="metric-label">Inputs</div>
            <div class="metric-description">Unique inputs taxonomy items</div>
        </div>
    `;
}

function renderInterfaceElementsCard(count) {
    const container = document.getElementById('interface-elements-metric');
    if (!container) return;

    container.innerHTML = `
        <div class="metric-card">
            <div class="metric-number">${count}</div>
            <div class="metric-label">Interface Elements</div>
            <div class="metric-description">Unique interface elements items</div>
        </div>
    `;
}

function renderFeedbackCard(count) {
    const container = document.getElementById('feedback-metric');
    if (!container) return;

    container.innerHTML = `
        <div class="metric-card">
            <div class="metric-number">${count}</div>
            <div class="metric-label">Feedback</div>
            <div class="metric-description">Unique feedback taxonomy items</div>
        </div>
    `;
}
/**
 * Cleanup charts
 */
export function destroyCharts() {
    chartInstances.forEach(chart => {
        if (chart) chart.destroy();
    });
    chartInstances = [];
}
