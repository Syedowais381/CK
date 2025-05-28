document.addEventListener('DOMContentLoaded', () => {
    // Cursor light effect
    document.addEventListener('mousemove', (e) => {
        const light = document.body;
        light.style.setProperty('--x', `${e.clientX}px`);
        light.style.setProperty('--y', `${e.clientY}px`);
    });

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

    // Update footer links
    updateFooterLinks();
});

// Handle service selection
function selectService(serviceType) {
    if (serviceType === 'setup') {
        window.location.href = 'http://127.0.0.1:8080/buy-setup.html';
    } else if (serviceType === 'editor') {
        // Handle editor service selection
        console.log('Editor service selected');
        // You can add editor service page redirection here
    }
}

function updateFooterLinks() {
    const footerLinks = document.querySelectorAll('.footer-section ul li a');
    footerLinks.forEach(link => {
        switch(link.textContent.trim()) {
            case 'Home':
                link.href = 'http://127.0.0.1:8080/index.html';
                break;
            case 'Services':
                link.href = 'http://127.0.0.1:8080/services.html';
                break;
            case 'Pricing':
                link.href = 'http://127.0.0.1:8080/buy-setup.html';
                break;
            case 'Contact':
                link.href = '#contact'; // You can add a contact page later
                break;
        }
    });
} 