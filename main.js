document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const startBtn = document.querySelector('.start-btn');
    const modal = document.getElementById('authModal');
    const closeBtn = document.querySelector('.close-btn');
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    if (token && userName) {
        updateUIForLoggedInUser(userName);
    }

    // Function to show modal
    function showModal() {
        modal.style.display = 'block';
    }

    // Function to hide modal
    function hideModal() {
        modal.style.display = 'none';
    }

    // Function to show login form
    function showLogin() {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    }

    // Function to show signup form
    function showSignup() {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }

    // Event listeners
    loginBtn?.addEventListener('click', () => {
        showModal();
        showLogin();
    });

    signupBtn?.addEventListener('click', () => {
        showModal();
        showSignup();
    });

    closeBtn.addEventListener('click', hideModal);

    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSignup();
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLogin();
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Signup form submission
    signupForm.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = signupForm.querySelector('input[placeholder="Full Name"]').value;
        const email = signupForm.querySelector('input[placeholder="Email"]').value;
        const password = signupForm.querySelector('input[placeholder="Password"]').value;
        const confirmPassword = signupForm.querySelector('input[placeholder="Confirm Password"]').value;

        if (password !== confirmPassword) {
            showNotification('Passwords do not match!', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();
            if (response.ok) {
                showNotification('Signup successful! Please log in.', 'success');
                showLogin();
            } else {
                showNotification(data.error || 'Signup failed', 'error');
            }
        } catch (err) {
            showNotification('Error connecting to server', 'error');
        }
    });

    // Login form submission
    loginForm.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[placeholder="Email"]').value;
        const password = loginForm.querySelector('input[placeholder="Password"]').value;

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                // Store user data in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.name);
                localStorage.setItem('userEmail', email);
                
                // Update UI instead of redirecting
                hideModal();
                updateUIForLoggedInUser(data.name);
                showNotification('Login successful!', 'success');
            } else {
                // Show specific error message for incorrect credentials
                if (response.status === 401) {
                    showNotification('Incorrect email or password', 'error');
                } else {
                    showNotification(data.error || 'Login failed', 'error');
                }
            }
        } catch (err) {
            showNotification('Error connecting to server', 'error');
        }
    });

    // Function to update UI for logged-in user
    function updateUIForLoggedInUser(userName) {
        // Hide login/signup buttons
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        
        // Create and show user profile button
        const authButtons = document.querySelector('.auth-buttons');
        
        // Remove any existing profile button
        const existingProfileBtn = authButtons.querySelector('.user-profile-btn');
        if (existingProfileBtn) {
            existingProfileBtn.remove();
        }

        // Create profile button container
        const userProfileBtn = document.createElement('div');
        userProfileBtn.className = 'user-profile-btn';
        userProfileBtn.innerHTML = `
            <span class="user-greeting">Welcome,</span>
            <span class="user-name">${userName}</span>
            <button class="logout-btn">
                <i class="fas fa-sign-out-alt"></i>
                Logout
            </button>
        `;
        authButtons.appendChild(userProfileBtn);

        // Add click event to profile button
        userProfileBtn.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });

        // Add click event to logout button
        const logoutBtn = userProfileBtn.querySelector('.logout-btn');
        logoutBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent profile navigation
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }

    // Function to show notifications
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    startBtn.addEventListener('click', () => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = 'services.html';
        } else {
            showModal();
            showLogin();
        }
    });

    // Cursor light effect
    document.addEventListener('mousemove', (e) => {
        const light = document.body;
        light.style.setProperty('--x', `${e.clientX}px`);
        light.style.setProperty('--y', `${e.clientY}px`);
    });

    // Load and display kits
    async function loadKits() {
        try {
            const response = await fetch('kits.json');
            const kits = await response.json();
            const kitsContainer = document.getElementById('kitsContainer');
            
            kits.forEach(kit => {
                const kitCard = document.createElement('div');
                kitCard.className = 'kit-card';
                
                // Format price to include currency symbol and commas
                const formattedPrice = new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR'
                }).format(kit.price);
                
                kitCard.innerHTML = `
                    <img src="${kit.image}" alt="${kit.name}" class="kit-image">
                    <div class="kit-content">
                        <h3 class="kit-title">${kit.name}</h3>
                        <p class="kit-price">${formattedPrice}</p>
                        <p class="kit-description">${kit.description}</p>
                        <div class="kit-components">
                            <h4>Main Components:</h4>
                            <ul>
                                ${kit.mainComponents.map(component => 
                                    `<li><a href="${component.link}" target="_blank">${component.name}</a></li>`
                                ).join('')}
                            </ul>
                        </div>
                    </div>
                `;
                
                kitsContainer.appendChild(kitCard);
            });
        } catch (error) {
            console.error('Error loading kits:', error);
        }
    }

    // Load kits when the page loads
    document.addEventListener('DOMContentLoaded', loadKits);
});
