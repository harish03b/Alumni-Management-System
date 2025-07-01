// fetch_events.js

document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
});

// Function to fetch events from the server
async function fetchEvents() {
    try {
        const response = await fetch('/api/events');
        if (!response.ok) {
            throw new Error(`An error occurred: ${response.statusText}`);
        }
        const events = await response.json();
        displayEvents(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = `<li>Error loading events. Please try again later.</li>`;
    }
}

// Function to display events in the DOM
function displayEvents(events) {
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = ''; // Clear any existing content

    if (events.length === 0) {
        eventsList.innerHTML = '<li>No upcoming events.</li>';
        return;
    }

    events.forEach(event => {
        const eventItem = document.createElement('li');
        eventItem.classList.add('event-item');

        // Create event container
        const eventContainer = document.createElement('div');
        eventContainer.classList.add('event-container');

        // Event Details
        const eventDetails = document.createElement('div');
        eventDetails.classList.add('event-details');

        const title = document.createElement('h3');
        title.textContent = event.title;

        const type = document.createElement('p');
        type.innerHTML = `<strong>Type:</strong> ${event.type}`;

        const mode = document.createElement('p');
        mode.innerHTML = `<strong>Mode:</strong> ${capitalizeFirstLetter(event.mode)}`;

        const date = document.createElement('p');
        const eventDate = new Date(event.date);
        date.innerHTML = `<strong>Date:</strong> ${eventDate.toLocaleDateString()}`;

        const time = document.createElement('p');
        time.innerHTML = `<strong>Time:</strong> ${event.time}`;

        // Append details to eventDetails
        eventDetails.appendChild(title);
        eventDetails.appendChild(type);
        eventDetails.appendChild(mode);
        eventDetails.appendChild(date);
        eventDetails.appendChild(time);

        // Register Button
        const registerButton = document.createElement('button');
        registerButton.textContent = 'Register';
        registerButton.classList.add('register-btn');
        registerButton.addEventListener('click', () => registerForEvent(event._id));

        // Append details and button to container
        eventContainer.appendChild(eventDetails);
        eventContainer.appendChild(registerButton);

        // Append container to event item
        eventItem.appendChild(eventContainer);

        // Append event item to events list
        eventsList.appendChild(eventItem);
    });
}

// Function to handle registration
function registerForEvent(eventId) {
    // For this example, we'll assume registration is a simple action.
    // In a real-world scenario, you'd likely send a POST request to the server.
    console.log(`Registered for event ID: ${eventId}`);
    showPopup('🎉 Successfully Registered!');
}

// Function to show popup with a custom message
function showPopup(message) {
    const popupModal = document.getElementById('popupModal');
    const popupMessage = document.getElementById('popupMessage');

    popupMessage.textContent = message;
    popupModal.style.display = 'block';
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Event listener to close the popup modal
document.querySelector('.close').addEventListener('click', () => {
    const popupModal = document.getElementById('popupModal');
    popupModal.style.display = 'none';
});

// Event listener to close the popup when clicking outside the modal content
window.addEventListener('click', (event) => {
    const popupModal = document.getElementById('popupModal');
    if (event.target === popupModal) {
        popupModal.style.display = 'none';
    }
});

// fetch_events.js (Updated registerForEvent function)

async function registerForEvent(eventId) {
    // Assume you have the user's ID (e.g., from authentication)
    const userId = getCurrentUserId(); // Implement this function based on your authentication

    if (!userId) {
        alert('Please log in to register for events.');
        return;
    }

    try {
        const response = await fetch('/api/events/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ eventId, userId })
        });

        const result = await response.json();

        if (response.ok) {
            showPopup('🎉 Successfully Registered!');
        } else {
            alert(result.message || 'An error occurred during registration.');
        }
    } catch (error) {
        console.error('Error registering for event:', error);
        alert('An error occurred while registering for the event.');
    }
}

// Placeholder function for getting current user ID
function getCurrentUserId() {
    // Implement this based on your authentication logic
    // For example, retrieve from a global variable, cookie, or localStorage
    return null; // Replace with actual user ID
}
