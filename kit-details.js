document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const kitId = urlParams.get('id');
    const kitDetailsContainer = document.getElementById('kit-details');

    if (!kitId) {
        kitDetailsContainer.innerHTML = '<p class="error">No kit selected. Please go back and select a kit.</p>';
        return;
    }

    // Fetch kits data
    fetch('kits.json')
        .then(response => response.json())
        .then(kits => {
            const kit = kits.find(k => k.id == kitId);
            
            if (!kit) {
                kitDetailsContainer.innerHTML = '<p class="error">Kit not found. Please go back and select a valid kit.</p>';
                return;
            }

            kitDetailsContainer.innerHTML = `
                <div class="kit-details-card">
                    <div class="kit-details-header">
                        <h2>${kit.name}</h2>
                        <span class="kit-category">${kit.category}</span>
                    </div>
                    <div class="kit-details-content">
                        <div class="kit-description">
                            <h3>Description</h3>
                            <p>${kit.description}</p>
                        </div>
                        <div class="kit-items">
                            <h3>Main Components</h3>
                            <ul>
                                ${kit.mainComponents.map(component => 
                                    `<li>
                                        <i class="fas fa-check"></i>
                                        <a href="${component.link}" target="_blank" rel="noopener noreferrer">
                                            ${component.name}
                                        </a>
                                    </li>`
                                ).join('')}
                            </ul>
                            <h3>All Included Items</h3>
                            <ul>
                                ${kit.allItems.map(item => 
                                    `<li><i class="fas fa-check"></i> ${item}</li>`
                                ).join('')}
                            </ul>
                        </div>
                        <div class="kit-price-section">
                            <h3>Price</h3>
                            <div class="kit-price">₹${kit.price.toLocaleString()}</div>
                            <button class="purchase-btn">Purchase Now</button>
                        </div>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error loading kit details:', error);
            kitDetailsContainer.innerHTML = '<p class="error">Error loading kit details. Please try again later.</p>';
        });
}); 