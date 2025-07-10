// API Explorer JavaScript
const API_BASE = '/api/v6';

// Quick test functions
async function quickTest(endpoint) {
    const resultDiv = document.getElementById('quick-test-result');
    const responseDiv = resultDiv.querySelector('.response-display');
    
    resultDiv.style.display = 'block';
    responseDiv.textContent = 'Loading...';
    
    let url = '';
    switch(endpoint) {
        case 'health':
            url = '/health';
            break;
        case 'challenges':
            url = `${API_BASE}/challenges?limit=5`;
            break;
        case 'types':
            url = `${API_BASE}/challenges/types`;
            break;
        case 'tracks':
            url = `${API_BASE}/challenges/tracks`;
            break;
    }
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayResponse(responseDiv, response, data);
    } catch (error) {
        displayError(responseDiv, error);
    }
}

// Get challenges with filters
async function getChallenges() {
    const responseDiv = document.getElementById('get-challenges-response');
    const display = responseDiv.querySelector('.response-display');
    
    responseDiv.style.display = 'block';
    display.textContent = 'Loading...';
    
    // Build query parameters
    const params = new URLSearchParams();
    
    const status = document.getElementById('get-status').value;
    const source = document.getElementById('get-source').value;
    const limit = document.getElementById('get-limit').value;
    const search = document.getElementById('get-search').value;
    
    if (status) params.append('status', status);
    if (source) params.append('challengeSource', source);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    
    const url = `${API_BASE}/challenges?${params.toString()}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayResponse(display, response, data);
    } catch (error) {
        displayError(display, error);
    }
}

// Create challenge
async function createChallenge() {
    const responseDiv = document.getElementById('post-challenge-response');
    const display = responseDiv.querySelector('.response-display');
    
    responseDiv.style.display = 'block';
    display.textContent = 'Creating challenge...';
    
    const bodyText = document.getElementById('post-body').value;
    
    try {
        const requestBody = JSON.parse(bodyText);
        
        const response = await fetch(`${API_BASE}/challenges`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        displayResponse(display, response, data);
        
        if (response.ok) {
            showNotification('Challenge created successfully!', 'success');
        }
    } catch (error) {
        if (error instanceof SyntaxError) {
            displayError(display, new Error('Invalid JSON in request body'));
        } else {
            displayError(display, error);
        }
    }
}

// Get challenge by ID
async function getChallengeById() {
    const responseDiv = document.getElementById('get-challenge-response');
    const display = responseDiv.querySelector('.response-display');
    const challengeId = document.getElementById('get-challenge-id').value;
    
    if (!challengeId) {
        showNotification('Please enter a challenge ID', 'warning');
        return;
    }
    
    responseDiv.style.display = 'block';
    display.textContent = 'Loading challenge...';
    
    try {
        const response = await fetch(`${API_BASE}/challenges/${challengeId}`);
        const data = await response.json();
        displayResponse(display, response, data);
    } catch (error) {
        displayError(display, error);
    }
}

// Update challenge
async function updateChallenge() {
    const responseDiv = document.getElementById('patch-challenge-response');
    const display = responseDiv.querySelector('.response-display');
    const challengeId = document.getElementById('patch-challenge-id').value;
    const bodyText = document.getElementById('patch-body').value;
    
    if (!challengeId) {
        showNotification('Please enter a challenge ID', 'warning');
        return;
    }
    
    responseDiv.style.display = 'block';
    display.textContent = 'Updating challenge...';
    
    try {
        const requestBody = JSON.parse(bodyText);
        
        const response = await fetch(`${API_BASE}/challenges/${challengeId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        displayResponse(display, response, data);
        
        if (response.ok) {
            showNotification('Challenge updated successfully!', 'success');
        }
    } catch (error) {
        if (error instanceof SyntaxError) {
            displayError(display, new Error('Invalid JSON in request body'));
        } else {
            displayError(display, error);
        }
    }
}

// Delete challenge
async function deleteChallenge() {
    const challengeId = document.getElementById('delete-challenge-id').value;
    
    if (!challengeId) {
        showNotification('Please enter a challenge ID', 'warning');
        return;
    }
    
    if (!confirm('Are you sure you want to delete this challenge?')) {
        return;
    }
    
    const responseDiv = document.getElementById('delete-challenge-response');
    const display = responseDiv.querySelector('.response-display');
    
    responseDiv.style.display = 'block';
    display.textContent = 'Deleting challenge...';
    
    try {
        const response = await fetch(`${API_BASE}/challenges/${challengeId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        displayResponse(display, response, data);
        
        if (response.ok) {
            showNotification('Challenge deleted successfully!', 'success');
        }
    } catch (error) {
        displayError(display, error);
    }
}

// Get challenge types
async function getChallengeTypes() {
    const responseDiv = document.getElementById('get-types-response');
    const display = responseDiv.querySelector('.response-display');
    
    responseDiv.style.display = 'block';
    display.textContent = 'Loading types...';
    
    try {
        const response = await fetch(`${API_BASE}/challenges/types`);
        const data = await response.json();
        displayResponse(display, response, data);
    } catch (error) {
        displayError(display, error);
    }
}

// Get challenge tracks
async function getChallengeTracks() {
    const responseDiv = document.getElementById('get-tracks-response');
    const display = responseDiv.querySelector('.response-display');
    
    responseDiv.style.display = 'block';
    display.textContent = 'Loading tracks...';
    
    try {
        const response = await fetch(`${API_BASE}/challenges/tracks`);
        const data = await response.json();
        displayResponse(display, response, data);
    } catch (error) {
        displayError(display, error);
    }
}

// Display response with syntax highlighting
function displayResponse(element, response, data) {
    const statusClass = response.ok ? 'status-success' : 'status-error';
    
    element.className = `response-display ${statusClass}`;
    
    const responseText = `HTTP ${response.status} ${response.statusText}
Content-Type: application/json

${JSON.stringify(data, null, 2)}`;
    
    element.textContent = responseText;
    
    // Apply syntax highlighting
    if (window.Prism) {
        element.innerHTML = window.Prism.highlight(responseText, window.Prism.languages.json, 'json');
    }
}

// Display error
function displayError(element, error) {
    element.className = 'response-display status-error';
    element.textContent = `Error: ${error.message}`;
}

// Show notification
function showNotification(message, type = 'info') {
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

// Auto-populate challenge ID fields when a challenge is created
document.addEventListener('DOMContentLoaded', function() {
    // Pre-fill some example values for demo purposes
    const now = new Date();
    const futureDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now
    
    // Update the example dates in the JSON
    const postBody = document.getElementById('post-body');
    if (postBody) {
        const exampleBody = {
            "name": "Build a Modern Web Dashboard",
            "description": "Create an interactive dashboard using React and Node.js with real-time data visualization",
            "type": "Code",
            "track": "Development",
            "challengeSource": "Work Manager",
            "createdBy": "admin",
            "status": "draft",
            "startDate": now.toISOString(),
            "endDate": futureDate.toISOString()
        };
        postBody.value = JSON.stringify(exampleBody, null, 2);
    }
    
    // Set up auto-complete for challenge IDs
    setupChallengeIdAutocomplete();
});

// Setup autocomplete for challenge IDs
async function setupChallengeIdAutocomplete() {
    try {
        const response = await fetch(`${API_BASE}/challenges?limit=10`);
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            const challengeIds = data.data.map(challenge => challenge.id);
            
            // Add datalist for autocomplete
            const datalist = document.createElement('datalist');
            datalist.id = 'challenge-ids';
            
            challengeIds.forEach(id => {
                const option = document.createElement('option');
                option.value = id;
                datalist.appendChild(option);
            });
            
            document.body.appendChild(datalist);
            
            // Connect datalist to input fields
            ['get-challenge-id', 'patch-challenge-id', 'delete-challenge-id'].forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.setAttribute('list', 'challenge-ids');
                    input.placeholder = `e.g., ${challengeIds[0]}`;
                }
            });
        }
    } catch (error) {
        console.log('Could not load challenge IDs for autocomplete');
    }
}