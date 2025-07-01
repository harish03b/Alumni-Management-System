// Fetch the mentor data when the page loads
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Fetch the mentor data from the backend
        const response = await fetch('http://localhost:2501/mentors');
        const mentors = await response.json();

        // Check if the response is okay
        if (!response.ok) {
            throw new Error('Failed to fetch mentors data');
        }

        // Find the table body in the HTML
        const tableBody = document.querySelector('#mentors-table tbody');

        // Loop through the mentors and create table rows
        mentors.forEach(mentor => {
            const row = document.createElement('tr');

            // Create a table data element for each piece of mentor information
            row.innerHTML = `
                <td>${mentor.fullName}</td>
                <td>${mentor.email}</td>
                <td>${mentor.phone}</td>
                <td>${mentor.graduationYear}</td>
                <td>${mentor.expertise}</td>
                <td>${mentor.mentorshipMethod}</td>
                <td>${mentor.availability}</td>
                <td>${mentor.goals}</td>
                <td>${mentor.comments}</td>
                <td><button type="button" class="register-btn" data-mentor-name="${mentor.fullName}">Register</button></td>
            `;

            // Append the row to the table body
            tableBody.appendChild(row);
        });

        // Add event listeners to the register buttons
        const registerButtons = document.querySelectorAll('.register-btn');
        registerButtons.forEach(button => {
            button.addEventListener('click', function () {
                // Get the mentor's name from the data attribute
                const mentorName = this.getAttribute('data-mentor-name');

                // Display success message when the button is clicked
                alert(`Registration successfully completed for ${mentorName}!`);
            });
        });
    } catch (error) {
        console.error('Error fetching mentor data:', error);
        alert('Failed to load mentor data');
    }
});
