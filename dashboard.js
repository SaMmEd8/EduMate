// At the top of dashboard.js
const totalNotesStat = document.getElementById('total-notes-stat');
const totalRemindersStat = document.getElementById('total-reminders-stat');
// At the top of dashboard.js, with your other selectors
const aiHelperForm = document.getElementById('ai-helper-form');
const aiTextInput = document.getElementById('ai-text-input');
const aiLoader = document.getElementById('ai-loader');
const aiResultContainer = document.getElementById('ai-result-container');
// Add these at the top of dashboard.js
const reminderForm = document.getElementById('reminder-form');
const remindersContainer = document.getElementById('reminders-container');
// In dashboard.js

// Add this new selector at the top
const notesLoader = document.getElementById('notes-loader');

// Update the loadNotes function
const loadNotes = async () => {
    notesLoader.classList.remove('hidden'); // Show loader
    notesContainer.innerHTML = ''; // Clear notes

    try {
        // ... (your existing fetch logic) ...
        const notes = await response.json();

        // Add this check for when there are no notes
        if (notes.length === 0) {
            notesContainer.innerHTML = '<p>No notes yet. Add one to get started!</p>';
        } else {
            notes.forEach(note => {
                // ... (your existing note rendering logic) ...
            });
        }
    } catch (error) {
        // ... (your existing error handling) ...
    } finally {
        notesLoader.classList.add('hidden'); // Hide loader regardless of outcome
    }
};
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SETUP ---
    const noteForm = document.getElementById('note-form');
    const notesContainer = document.getElementById('notes-container');
    const logoutBtn = document.getElementById('logout-btn');

    // Get the token from localStorage. It's our key to the backend.
    const token = localStorage.getItem('eduMateToken');

    // --- 2. AUTHENTICATION CHECK ---
    // If there is no token, the user is not logged in. Redirect them.
    if (!token) {
        window.location.href = 'login.html';
        return; // Stop the script from running further
    }

    // --- 3. LOAD NOTES FROM SERVER ---
    const loadNotes = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/notes', {
                method: 'GET',
                headers: {
                    // Include the token to prove we are authorized
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                // If token is invalid or expired, server will reject
                throw new Error('Could not fetch notes. Please log in again.');
            }

            const notes = await response.json();
            notesContainer.innerHTML = ''; // Clear existing notes
            notes.forEach(note => {
                const noteElement = document.createElement('div');
                noteElement.classList.add('note-card');
                // Use note._id from the database as the unique identifier
                noteElement.innerHTML = `
                    <h4>${note.title}</h4>
                    <p>${note.content}</p>
                    <button class="delete-btn" data-id="${note._id}">Delete</button>
                `;
                notesContainer.appendChild(noteElement);
            });
        } catch (error) {
            alert(error.message);
            // If fetching fails, it's likely an auth issue, so log out.
            logout();
        }
    };

    // --- 4. ADD A NEW NOTE ---
    noteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-content').value;

        try {
            const response = await fetch('http://localhost:5000/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Authenticate this request
                },
                body: JSON.stringify({ title, content })
            });

            if (!response.ok) throw new Error('Failed to add note.');

            noteForm.reset();
            loadNotes(); // Reload notes from server to show the new one
        } catch (error) {
            alert(error.message);
        }
    });

    // --- 5. DELETE A NOTE ---
    notesContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const noteId = e.target.getAttribute('data-id');
            if (!confirm('Are you sure you want to delete this note?')) return;
            
            try {
                const response = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}` // Authenticate this request
                    }
                });

                if (!response.ok) throw new Error('Failed to delete note.');
                
                loadNotes(); // Reload notes to reflect the deletion
            } catch (error) {
                alert(error.message);
            }
        }
    });
    // --- REMINDERS LOGIC ---

const loadReminders = async () => {
    remindersContainer.innerHTML = ''; // Clear old reminders
    try {
        const res = await fetch('http://localhost:5000/api/reminders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load reminders');

        const reminders = await res.json();
        if (reminders.length === 0) {
            remindersContainer.innerHTML = '<p>No upcoming reminders. Relax!</p>';
        } else {
            reminders.forEach(reminder => {
                const el = document.createElement('div');
                el.classList.add('reminder-item');
                // Format the date for better readability
                const formattedDate = new Date(reminder.dueDate).toLocaleDateString();
                el.innerHTML = `
                    <span>${reminder.title}</span>
                    <span>Due: ${formattedDate}</span>
                    <button class="delete-btn" data-id="${reminder._id}">X</button>
                `;
                remindersContainer.appendChild(el);
            });
        }
    } catch (error) {
        remindersContainer.innerHTML = `<p>${error.message}</p>`;
    }
};

reminderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('reminder-title').value;
    const dueDate = document.getElementById('reminder-dueDate').value;

    try {
        const res = await fetch('http://localhost:5000/api/reminders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, dueDate })
        });
        if (!res.ok) throw new Error('Failed to add reminder');
        reminderForm.reset();
        loadReminders();

    } catch (error) {
        alert(error.message);
    }
});

remindersContainer.addEventListener('click', async (e) => {
     if (e.target.classList.contains('delete-btn')) {
        const reminderId = e.target.getAttribute('data-id');
        try {
            await fetch(`http://localhost:5000/api/reminders/${reminderId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            loadReminders();
        } catch(error) {
            alert('Failed to delete reminder');
        }
    }
});

// --- INITIAL LOAD ---
// Modify the initial load to call both functions
loadNotes();
loadReminders();

// --- AI HELPER LOGIC ---
aiHelperForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const textToSummarize = aiTextInput.value;

    aiLoader.classList.remove('hidden');
    aiResultContainer.innerHTML = '';

    try {
        const res = await fetch('http://localhost:5000/api/ai/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text: textToSummarize })
        });

        if (!res.ok) throw new Error('Failed to get summary from server.');

        const data = await res.json();
        aiResultContainer.innerText = data.summary;

    } catch (error) {
        aiResultContainer.innerText = `Error: ${error.message}`;
    } finally {
        aiLoader.classList.add('hidden');
    }
});
// --- STATS & CHART LOGIC ---
let productivityChart = null; // Variable to hold the chart instance

const loadStats = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load stats');
        const stats = await res.json();

        // Update simple stat cards
        totalNotesStat.textContent = stats.totalNotes;
        totalRemindersStat.textContent = stats.totalReminders;

        // Render the chart
        const ctx = document.getElementById('productivityChart').getContext('2d');

        // Destroy old chart instance if it exists
        if (productivityChart) {
            productivityChart.destroy();
        }

        productivityChart = new Chart(ctx, {
            type: 'bar', // Type of chart
            data: {
                labels: stats.notesChart.labels, // Dates
                datasets: [{
                    label: 'Notes Created',
                    data: stats.notesChart.data, // Number of notes
                    backgroundColor: 'rgba(74, 144, 226, 0.5)',
                    borderColor: 'rgba(74, 144, 226, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 } // Only show whole numbers
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
            }
        });

    } catch (error) {
        console.error('Error loading stats:', error);
    }
};

    
    // --- 6. LOGOUT ---
    const logout = () => {
        localStorage.removeItem('eduMateToken'); // Remove the token
        window.location.href = 'login.html';
    };
    logoutBtn.addEventListener('click', logout);

    // --- INITIAL ACTION ---
    // Load the user's notes as soon as the page loads.
    loadNotes();
    loadReminders();
    loadStats();
});