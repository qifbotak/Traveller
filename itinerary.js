// Import necessary modules
const fs = require('fs');
const path = require('path');

// Define the file path for storing itineraries
const filePath = path.join(__dirname, 'itineraries.txt');

// Initialize the itineraries array by loading from file
let itineraries = [];
loadItineraries();

// Function to load itineraries from a file
function loadItineraries() {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        itineraries = data.split('\n').filter(line => line).map(line => {
            const [name, category] = line.split('|');
            return { name, category };
        });
    } else {
        itineraries = [];
    }
}

// Function to save itineraries to a file
function saveItineraries() {
    const data = itineraries.map(itinerary => `${itinerary.name}|${itinerary.category}`).join('\n');
    fs.writeFileSync(filePath, data, 'utf8');
}

// Function to display itineraries in the HTML list
function displayItineraries(filteredItineraries = itineraries) {
    const list = document.getElementById('itinerary-list');
    list.innerHTML = filteredItineraries.map((itinerary, index) => `
        <li class="itinerary-item">
            <div class="itinerary-details">
                <span class="itinerary-name">${itinerary.name}</span>
                <span class="category-badge">${itinerary.category}</span>
            </div>
            <div class="itinerary-actions">
                <button onclick="editItinerary(${index})" class="edit-btn">Edit</button>
                <button onclick="deleteItinerary(${index})" class="delete-btn">Delete</button>
            </div>
        </li>
    `).join('');
}

// Add a new itinerary
function addItinerary() {
    const input = document.getElementById('itinerary-input');
    const categorySelect = document.getElementById('category-select');
    const itineraryName = input.value;
    const itineraryCategory = categorySelect.value;

    if (itineraryName) {
        const newItinerary = { name: itineraryName, category: itineraryCategory };
        itineraries.push(newItinerary);
        saveItineraries(); // Save to file
        displayItineraries(); // Refresh the list
        input.value = ''; // Clear the input box
    } else {
        alert('Please enter an itinerary.');
    }
}

// Edit an itinerary
function editItinerary(index) {
    const itinerary = itineraries[index];
    document.getElementById('itinerary-input').value = itinerary.name;
    document.getElementById('category-select').value = itinerary.category;

    const addButton = document.querySelector('.btn');
    addButton.innerText = 'Update';
    addButton.onclick = function() {
        updateItinerary(index);
    };
}

// Update an existing itinerary
function updateItinerary(index) {
    const input = document.getElementById('itinerary-input');
    const categorySelect = document.getElementById('category-select');
    const itineraryName = input.value;
    const itineraryCategory = categorySelect.value;

    if (itineraryName) {
        itineraries[index] = { name: itineraryName, category: itineraryCategory };
        saveItineraries(); // Save to file
        displayItineraries(); // Refresh the list
        input.value = ''; // Clear the input box

        const addButton = document.querySelector('.btn');
        addButton.innerText = 'Add';
        addButton.onclick = addItinerary;
    } else {
        alert('Please enter an itinerary.');
    }
}

// Delete an itinerary by index
function deleteItinerary(index) {
    itineraries.splice(index, 1);
    saveItineraries(); // Save to file
    displayItineraries();
}

// Filter itineraries based on search input
function filterItineraries(searchTerm) {
    const filtered = itineraries.filter(itinerary =>
        itinerary.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayItineraries(filtered);
}

// Load itineraries and display them when the page loads
window.onload = () => {
    loadItineraries(); // Load from file on page load
    displayItineraries();
};
