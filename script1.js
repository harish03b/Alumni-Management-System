document.addEventListener('DOMContentLoaded', async function() {
    // Fetch all users from the server when the page loads
    await fetchAllUsers();

    // Add event listener for the search form submission
    const form = document.getElementById('location-search-form');
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent form from refreshing the page

        const location = document.getElementById('locationsearch').value;

        try {
            // Send POST request to the back-end with search data
            const response = await fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ locationsearch: location })
            });

            if (response.ok) {
                const searchResults = await response.json();
                clearPreviousResults();

                // Display search results on the page
                if (Array.isArray(searchResults) && searchResults.length > 0) {
                    displaySearchResults(searchResults);
                } else {
                    displayNoResultsMessage();
                }
            } else {
                console.error('Failed to fetch search results');
                displayErrorMessage('No users found in the specified location.');
            }
        } catch (error) {
            console.error('Error:', error);
            displayErrorMessage('Error occurred while fetching search results.');
        }
    });

    // Function to fetch all users
    async function fetchAllUsers() {
        try {
            // Send GET request to fetch all users
            const response = await fetch('/all-users', {
                method: 'GET'
            });

            // Handle response from the server
            if (response.ok) {
                const users = await response.json();
                console.log(users); // Log the fetched users

                // Display all users
                if (users.length > 0) {
                    displayAllUsers(users);
                } else {
                    displayNoResultsMessage();
                }
            } else {
                console.error('Failed to fetch user data');
                displayErrorMessage('Failed to fetch user data.');
            }
        } catch (error) {
            console.error('Error:', error);
            displayErrorMessage('An error occurred while fetching user data.');
        }
    }

    // Function to display all users in the table
    function displayAllUsers(users) {
        const userContainer = document.getElementById('all-users');
        userContainer.innerHTML = ''; // Clear any existing content

        users.forEach(user => {
            const userRow = document.createElement('tr');
            userRow.innerHTML = `
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.userType}</td>
                <td>${user.email}</td>
                <td>${user.address}</td>
            `;
            userContainer.appendChild(userRow);
        });
    }

    // Function to display search results in the table
    function displaySearchResults(results) {
        const userContainer = document.getElementById('all-users');
        userContainer.innerHTML = ''; // Clear any existing content

        results.forEach(user => {
            const userRow = document.createElement('tr');
            userRow.innerHTML = `
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.userType}</td>
                <td>${user.email}</td>
                <td>${user.address}</td>
            `;
            userContainer.appendChild(userRow);
        });
    }

    // Function to clear previous results
    function clearPreviousResults() {
        const userContainer = document.getElementById('all-users');
        userContainer.innerHTML = ''; // Clear any existing content
    }

    // Function to display message when no users are found
    function displayNoResultsMessage() {
        const userContainer = document.getElementById('all-users');
        const noResultsRow = document.createElement('tr');
        noResultsRow.innerHTML = `<td colspan="5" class="no-results">No users found in the database.</td>`;
        userContainer.appendChild(noResultsRow);
    }

    // Function to display an error message
    function displayErrorMessage(message) {
        const userContainer = document.getElementById('all-users');
        const errorRow = document.createElement('tr');
        errorRow.innerHTML = `<td colspan="5" class="error-message">${message}</td>`;
        userContainer.appendChild(errorRow);
    }
});
