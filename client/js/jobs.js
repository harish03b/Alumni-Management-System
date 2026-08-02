document.addEventListener('DOMContentLoaded', () => {
    fetchJobs(); // Fetch jobs when the page loads

    // Event listener for the search button
    document.getElementById('search-button').addEventListener('click', () => {
        const searchTerm = document.getElementById('search-input').value;
        fetchJobs(searchTerm); // Fetch jobs with the search term
    });
});

// Function to fetch job postings from the server
async function fetchJobs(searchTerm = '') {
    try {
        const response = await fetch('/jobs'); // Adjust endpoint if necessary
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const jobs = await response.json();

        // Clear existing job listings
        const tableBody = document.getElementById('jobs-table-body');
        tableBody.innerHTML = '';

        // Filter and display job postings
        const filteredJobs = jobs.filter(job => 
            job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filteredJobs.forEach(job => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${job.jobTitle}</td>
                <td>${job.companyName}</td>
                <td>${job.jobLocation}</td>
                <td>${job.jobDescription}</td>
                <td>${job.contactPerson}</td>
                <td>${job.contactEmail}</td>
               
                <td><button type="button" class="Apply-btn" onclick="window.location.href='jobapply.html'">Apply</button ></td>
              
            `;
            tableBody.appendChild(row);
        });

        // Show message if no jobs are found
        if (filteredJobs.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="6">No jobs found.</td>`;
            tableBody.appendChild(row);
        }
    } catch (error) {
        console.error('Error fetching jobs:', error);
        alert('An error occurred while fetching job listings.');
    }
}
