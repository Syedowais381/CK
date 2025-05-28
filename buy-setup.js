document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');

    if (!token) {
        // Redirect to login if not authenticated
        window.location.href = 'http://127.0.0.1:8080/index.html';
        return;
    }

    // Update user name in header
    document.getElementById('userName').textContent = userName;

    // Handle logout
    document.querySelector('.logout-btn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'http://127.0.0.1:8080/index.html';
    });

    const kitsContainer = document.getElementById('kits-container');

    // Fetch kits data with the correct URL
    fetch('http://127.0.0.1:8080/kits.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(kits => {
            if (!Array.isArray(kits)) {
                throw new Error('Invalid data format: expected an array');
            }
            console.log('Successfully loaded kits:', kits);
            kits.forEach(kit => {
                const card = createKitCard(kit);
                kitsContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error loading kits:', error);
            kitsContainer.innerHTML = `
                <div class="error-container">
                    <p class="error">Error loading setup packages. Please try again later.</p>
                    <p class="error-details">${error.message}</p>
                </div>
            `;
        });
});

function createKitCard(kit) {
    const card = document.createElement('div');
    card.className = 'kit-card';
    
    card.innerHTML = `
        <div class="kit-content">
            <div class="kit-header">
                <h3>${kit.name}</h3>
                <span class="kit-category">${kit.category}</span>
            </div>
            <ul class="kit-components">
                ${kit.mainComponents.map(component => 
                    `<li>
                        <i class="fas fa-check"></i> 
                        <a href="${component.link}" target="_blank" rel="noopener noreferrer">
                            ${component.name}
                        </a>
                    </li>`
                ).join('')}
            </ul>
            <div class="kit-price">₹${kit.price.toLocaleString()}</div>
            <div class="kit-footer">
                <button class="view-details-btn" onclick="window.location.href='http://127.0.0.1:8080/kit-details.html?id=${kit.id}'">
                    View Details
                </button>
            </div>
        </div>
    `;
    
    return card;
} 