// Global variables
let challenges = [];
let challengeTypes = [];
let challengeTracks = [];
let charts = {};

// API Base URL
const API_BASE = '/api/v6';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            if (section) {
                showSection(section);
                setActiveNav(this);
            }
        });
    });

    // Create challenge form
    document.getElementById('create-challenge-form').addEventListener('submit', function(e) {
        e.preventDefault();
        createChallenge();
    });

    // Search input
    document.getElementById('search-input').addEventListener('input', debounce(filterChallenges, 300));
    
    // Filter changes
    ['status-filter', 'type-filter', 'source-filter'].forEach(id => {
        document.getElementById(id).addEventListener('change', filterChallenges);
    });
}

// Initialize dashboard
async function initializeDashboard() {
    showLoading(true);
    
    try {
        await Promise.all([
            loadChallenges(),
            loadChallengeTypes(),
            loadChallengeTracks()
        ]);
        
        updateDashboardStats();
        createCharts();
        populateDropdowns();
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showError('Failed to load dashboard data');
    } finally {
        showLoading(false);
    }
}

// Load challenges from API
async function loadChallenges() {
    try {
        const response = await fetch(`${API_BASE}/challenges?limit=100`);
        const data = await response.json();
        challenges = data.data || [];
        return challenges;
    } catch (error) {
        console.error('Error loading challenges:', error);
        return [];
    }
}

// Load challenge types
async function loadChallengeTypes() {
    try {
        const response = await fetch(`${API_BASE}/challenges/types`);
        const data = await response.json();
        challengeTypes = data.data || [];
        return challengeTypes;
    } catch (error) {
        console.error('Error loading challenge types:', error);
        return [];
    }
}

// Load challenge tracks
async function loadChallengeTracks() {
    try {
        const response = await fetch(`${API_BASE}/challenges/tracks`);
        const data = await response.json();
        challengeTracks = data.data || [];
        return challengeTracks;
    } catch (error) {
        console.error('Error loading challenge tracks:', error);
        return [];
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    const stats = calculateStats(challenges);
    
    document.getElementById('total-challenges').textContent = stats.total;
    document.getElementById('active-challenges').textContent = stats.active;
    document.getElementById('completed-challenges').textContent = stats.completed;
    document.getElementById('challenge-sources').textContent = stats.sources;
}

// Calculate statistics
function calculateStats(challengeList) {
    const stats = {
        total: challengeList.length,
        active: challengeList.filter(c => c.status === 'active').length,
        completed: challengeList.filter(c => c.status === 'completed').length,
        draft: challengeList.filter(c => c.status === 'draft').length,
        cancelled: challengeList.filter(c => c.status === 'cancelled').length,
        sources: new Set(challengeList.filter(c => c.challengeSource).map(c => c.challengeSource)).size
    };
    
    return stats;
}

// Create charts
function createCharts() {
    createStatusChart();
    createSourceChart();
    createTypeChart();
    createTrackChart();
}

// Create status distribution chart
function createStatusChart() {
    const ctx = document.getElementById('statusChart').getContext('2d');
    const stats = calculateStats(challenges);
    
    if (charts.status) {
        charts.status.destroy();
    }
    
    charts.status = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Active', 'Draft', 'Completed', 'Cancelled'],
            datasets: [{
                data: [stats.active, stats.draft, stats.completed, stats.cancelled],
                backgroundColor: [
                    '#28a745',
                    '#6c757d',
                    '#007bff',
                    '#dc3545'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

// Create source distribution chart
function createSourceChart() {
    const ctx = document.getElementById('sourceChart').getContext('2d');
    
    const sourceCounts = {};
    challenges.forEach(challenge => {
        const source = challenge.challengeSource || 'No Source';
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });
    
    if (charts.source) {
        charts.source.destroy();
    }
    
    charts.source = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(sourceCounts),
            datasets: [{
                data: Object.values(sourceCounts),
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#f5576c',
                    '#4facfe',
                    '#00f2fe'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Create type distribution chart
function createTypeChart() {
    const ctx = document.getElementById('typeChart').getContext('2d');
    
    const typeCounts = {};
    challenges.forEach(challenge => {
        typeCounts[challenge.type] = (typeCounts[challenge.type] || 0) + 1;
    });
    
    if (charts.type) {
        charts.type.destroy();
    }
    
    charts.type = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(typeCounts),
            datasets: [{
                label: 'Challenges',
                data: Object.values(typeCounts),
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 1,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Create track distribution chart
function createTrackChart() {
    const ctx = document.getElementById('trackChart').getContext('2d');
    
    const trackCounts = {};
    challenges.forEach(challenge => {
        trackCounts[challenge.track] = (trackCounts[challenge.track] || 0) + 1;
    });
    
    if (charts.track) {
        charts.track.destroy();
    }
    
    charts.track = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(trackCounts),
            datasets: [{
                label: 'Challenges',
                data: Object.values(trackCounts),
                backgroundColor: 'rgba(118, 75, 162, 0.8)',
                borderColor: 'rgba(118, 75, 162, 1)',
                borderWidth: 1,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Show section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const section = document.getElementById(`${sectionName}-section`);
    if (section) {
        section.style.display = 'block';
        
        // Load section-specific data
        switch(sectionName) {
            case 'challenges':
                displayChallenges(challenges);
                break;
            case 'analytics':
                // Charts are already created, just ensure they're visible
                setTimeout(() => {
                    Object.values(charts).forEach(chart => {
                        if (chart && chart.resize) chart.resize();
                    });
                }, 100);
                break;
            case 'sources':
                displaySources();
                break;
        }
    }
}

// Set active navigation
function setActiveNav(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Display challenges
function displayChallenges(challengeList) {
    const container = document.getElementById('challenges-list');
    
    if (challengeList.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No challenges found</h4>
                <p class="text-muted">Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }
    
    const challengeCards = challengeList.map(challenge => createChallengeCard(challenge)).join('');
    container.innerHTML = challengeCards;
}

// Create challenge card
function createChallengeCard(challenge) {
    const statusClass = `status-${challenge.status}`;
    const cardClass = challenge.status;
    const sourceTag = challenge.challengeSource ? 
        `<span class="source-tag">${challenge.challengeSource}</span>` : '';
    
    const startDate = challenge.startDate ? 
        new Date(challenge.startDate).toLocaleDateString() : 'Not set';
    const endDate = challenge.endDate ? 
        new Date(challenge.endDate).toLocaleDateString() : 'Not set';
    
    return `
        <div class="col-md-6 col-lg-4">
            <div class="challenge-card ${cardClass} fade-in">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <h5 class="fw-bold mb-0">${challenge.name}</h5>
                    <span class="status-badge ${statusClass}">${challenge.status}</span>
                </div>
                
                <p class="text-muted mb-3">${challenge.description || 'No description'}</p>
                
                <div class="row mb-3">
                    <div class="col-6">
                        <small class="text-muted">Type:</small>
                        <div class="fw-semibold">${challenge.type}</div>
                    </div>
                    <div class="col-6">
                        <small class="text-muted">Track:</small>
                        <div class="fw-semibold">${challenge.track}</div>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-6">
                        <small class="text-muted">Start:</small>
                        <div class="fw-semibold">${startDate}</div>
                    </div>
                    <div class="col-6">
                        <small class="text-muted">End:</small>
                        <div class="fw-semibold">${endDate}</div>
                    </div>
                </div>
                
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        ${sourceTag}
                    </div>
                    <div>
                        <button class="action-btn btn-view" onclick="viewChallenge('${challenge.id}')" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn btn-edit" onclick="editChallenge('${challenge.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn btn-delete" onclick="deleteChallenge('${challenge.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Display sources
function displaySources() {
    const container = document.getElementById('sources-list');
    
    const sourceCounts = {};
    challenges.forEach(challenge => {
        const source = challenge.challengeSource || 'No Source';
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });
    
    const sourceCards = Object.entries(sourceCounts).map(([source, count]) => {
        const icon = getSourceIcon(source);
        return `
            <div class="col-md-6 col-lg-4">
                <div class="stats-card fade-in">
                    <div class="d-flex align-items-center mb-3">
                        <div class="stats-icon primary me-3">
                            <i class="${icon}"></i>
                        </div>
                        <div>
                            <h5 class="fw-bold mb-0">${source}</h5>
                            <p class="text-muted mb-0">${count} challenge${count !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <button class="btn btn-outline-primary btn-sm" onclick="filterBySource('${source}')">
                        View Challenges
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = sourceCards;
}

// Get source icon
function getSourceIcon(source) {
    const iconMap = {
        'Work Manager': 'fas fa-briefcase',
        'Github': 'fab fa-github',
        'Topgear': 'fas fa-cog',
        'Manual Entry': 'fas fa-edit',
        'API Integration': 'fas fa-code',
        'No Source': 'fas fa-question-circle'
    };
    
    return iconMap[source] || 'fas fa-code-branch';
}

// Filter challenges
function filterChallenges() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    const sourceFilter = document.getElementById('source-filter').value;
    
    let filtered = challenges.filter(challenge => {
        const matchesSearch = !searchTerm || 
            challenge.name.toLowerCase().includes(searchTerm) ||
            (challenge.description && challenge.description.toLowerCase().includes(searchTerm));
        
        const matchesStatus = !statusFilter || challenge.status === statusFilter;
        const matchesType = !typeFilter || challenge.type === typeFilter;
        const matchesSource = !sourceFilter || challenge.challengeSource === sourceFilter;
        
        return matchesSearch && matchesStatus && matchesType && matchesSource;
    });
    
    displayChallenges(filtered);
}

// Filter by source
function filterBySource(source) {
    showSection('challenges');
    setActiveNav(document.querySelector('[data-section="challenges"]'));
    
    if (source === 'No Source') {
        document.getElementById('source-filter').value = '';
        const filtered = challenges.filter(c => !c.challengeSource);
        displayChallenges(filtered);
    } else {
        document.getElementById('source-filter').value = source;
        filterChallenges();
    }
}

// Populate dropdowns
function populateDropdowns() {
    // Populate type dropdowns
    const typeSelects = ['type-filter', 'challenge-type'];
    typeSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            challengeTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type.name;
                option.textContent = type.name;
                select.appendChild(option);
            });
        }
    });
    
    // Populate track dropdowns
    const trackSelects = ['challenge-track'];
    trackSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            challengeTracks.forEach(track => {
                const option = document.createElement('option');
                option.value = track.name;
                option.textContent = track.name;
                select.appendChild(option);
            });
        }
    });
    
    // Populate source filter
    const sourceFilter = document.getElementById('source-filter');
    if (sourceFilter) {
        const sources = new Set(challenges.filter(c => c.challengeSource).map(c => c.challengeSource));
        sources.forEach(source => {
            const option = document.createElement('option');
            option.value = source;
            option.textContent = source;
            sourceFilter.appendChild(option);
        });
    }
}

// Create challenge
async function createChallenge() {
    const formData = {
        name: document.getElementById('challenge-name').value,
        description: document.getElementById('challenge-description').value,
        type: document.getElementById('challenge-type').value,
        track: document.getElementById('challenge-track').value,
        challengeSource: document.getElementById('challenge-source').value || null,
        status: document.getElementById('challenge-status').value,
        createdBy: document.getElementById('created-by').value,
        startDate: document.getElementById('start-date').value || null,
        endDate: document.getElementById('end-date').value || null
    };
    
    try {
        const response = await fetch(`${API_BASE}/challenges`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showSuccess('Challenge created successfully!');
            document.getElementById('create-challenge-form').reset();
            await refreshData();
        } else {
            const error = await response.json();
            showError(error.message || 'Failed to create challenge');
        }
    } catch (error) {
        console.error('Error creating challenge:', error);
        showError('Failed to create challenge');
    }
}

// View challenge
async function viewChallenge(id) {
    try {
        const response = await fetch(`${API_BASE}/challenges/${id}`);
        const data = await response.json();
        
        if (response.ok) {
            showChallengeModal(data.data);
        } else {
            showError('Failed to load challenge details');
        }
    } catch (error) {
        console.error('Error loading challenge:', error);
        showError('Failed to load challenge details');
    }
}

// Show challenge modal
function showChallengeModal(challenge) {
    const modalBody = document.getElementById('challenge-modal-body');
    
    const sourceInfo = challenge.challengeSource ? 
        `<p><strong>Source:</strong> <span class="source-tag">${challenge.challengeSource}</span></p>` : 
        '<p><strong>Source:</strong> <span class="text-muted">Not specified</span></p>';
    
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-8">
                <h4>${challenge.name}</h4>
                <p class="text-muted">${challenge.description || 'No description provided'}</p>
                
                <div class="row mb-3">
                    <div class="col-6">
                        <p><strong>Type:</strong> ${challenge.type}</p>
                        <p><strong>Track:</strong> ${challenge.track}</p>
                        <p><strong>Status:</strong> <span class="status-badge status-${challenge.status}">${challenge.status}</span></p>
                    </div>
                    <div class="col-6">
                        <p><strong>Created By:</strong> ${challenge.createdBy}</p>
                        <p><strong>Created:</strong> ${new Date(challenge.created).toLocaleString()}</p>
                        <p><strong>Updated:</strong> ${new Date(challenge.updated).toLocaleString()}</p>
                    </div>
                </div>
                
                ${sourceInfo}
                
                <div class="row">
                    <div class="col-6">
                        <p><strong>Start Date:</strong> ${challenge.startDate ? new Date(challenge.startDate).toLocaleString() : 'Not set'}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>End Date:</strong> ${challenge.endDate ? new Date(challenge.endDate).toLocaleString() : 'Not set'}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="bg-light p-3 rounded">
                    <h6>Quick Actions</h6>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary btn-sm" onclick="editChallenge('${challenge.id}')">
                            <i class="fas fa-edit me-1"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteChallenge('${challenge.id}')">
                            <i class="fas fa-trash me-1"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('challengeModal'));
    modal.show();
}

// Edit challenge (placeholder)
function editChallenge(id) {
    showInfo('Edit functionality coming soon!');
}

// Delete challenge
async function deleteChallenge(id) {
    if (!confirm('Are you sure you want to delete this challenge?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/challenges/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showSuccess('Challenge deleted successfully!');
            await refreshData();
        } else {
            showError('Failed to delete challenge');
        }
    } catch (error) {
        console.error('Error deleting challenge:', error);
        showError('Failed to delete challenge');
    }
}

// Refresh data
async function refreshData() {
    await initializeDashboard();
    showSuccess('Data refreshed successfully!');
}

// Utility functions
function showLoading(show) {
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) {
        spinner.style.display = show ? 'block' : 'none';
    }
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'danger');
}

function showInfo(message) {
    showNotification(message, 'info');
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}