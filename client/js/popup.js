// popup.js

document.getElementById('submitBtn').addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Get form values
    const title = document.getElementById('title').value.trim();
    const type = document.getElementById('type').value.trim();
    const mode = document.getElementById('mode').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    // Simple validation
    if (!title || !type || !mode || !date || !time) {
        alert('Please fill in all fields.');
        return;
    }

    // Create event data object
    const eventData = {
        title,
        type,
        mode,
        date,
        time
    };

    try {
        // Send POST request to server
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        const result = await response.json();

        if (response.status === 201) {
            // Show success popup
            document.getElementById('popupMessage').innerText = '🎉 Event Created Successfully!';
            document.getElementById('popupModal').style.display = 'block';

            // Optionally, reset form fields
            document.getElementById('title').value = '';
            document.getElementById('type').value = '';
            document.getElementById('mode').value = 'online';
            document.getElementById('date').value = '';
            document.getElementById('time').value = '';
        } else {
            // Handle errors
            alert(result.message || 'An error occurred while creating the event.');
        }
    } catch (error) {
        console.error('Error submitting event:', error);
        alert('An error occurred while submitting the event.');
    }
});

// Handle popup modal close
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('popupModal').style.display = 'none';
});

// Optional: Close modal when clicking outside the modal content
window.addEventListener('click', (event) => {
    const modal = document.getElementById('popupModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});
