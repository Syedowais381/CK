document.addEventListener('DOMContentLoaded', () => {
    // Cursor light effect
    document.addEventListener('mousemove', (e) => {
        const light = document.body;
        light.style.setProperty('--x', `${e.clientX}px`);
        light.style.setProperty('--y', `${e.clientY}px`);
    });

    // Get user data from localStorage
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');

    // Check if user is logged in
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // Update profile information
    document.getElementById('userName').textContent = userName;
    document.getElementById('profileName').textContent = userName;
    document.getElementById('profileEmail').textContent = userEmail;

    // Set join date (for demo, using current date)
    const joinDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('joinDate').textContent = joinDate;

    // Logout functionality
    document.querySelector('.logout-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            window.location.href = 'index.html';
        }
    });

    // Profile picture functionality
    const changePictureBtn = document.querySelector('.change-picture-btn');
    const removePictureBtn = document.querySelector('.remove-picture-btn');
    const profileImage = document.getElementById('profileImage');
    const profileImageInput = document.getElementById('profileImageInput');

    // Function to create default avatar with initials
    function createDefaultAvatar() {
        const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
        const canvas = document.createElement('canvas');
        canvas.width = 150;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        
        // Draw background
        ctx.fillStyle = '#128C7E';
        ctx.fillRect(0, 0, 150, 150);
        
        // Draw initials
        ctx.fillStyle = 'white';
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, 75, 75);
        
        return canvas.toDataURL();
    }

    // Load saved profile picture from localStorage if exists
    const savedProfilePic = localStorage.getItem('profilePicture');
    if (savedProfilePic) {
        profileImage.src = savedProfilePic;
    } else {
        profileImage.src = createDefaultAvatar();
    }

    // Handle click on change picture button
    changePictureBtn.addEventListener('click', () => {
        profileImageInput.click();
    });

    // Handle remove picture button
    removePictureBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to remove your profile picture?')) {
            localStorage.removeItem('profilePicture');
            profileImage.src = createDefaultAvatar();
            showNotification('Profile picture removed successfully', 'success');
        }
    });

    // Handle file selection
    profileImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                showNotification('Please select an image file', 'error');
                return;
            }

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('Image size should be less than 5MB', 'error');
                return;
            }

            // Create a preview
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImage.src = e.target.result;
                // Save to localStorage
                localStorage.setItem('profilePicture', e.target.result);
                showNotification('Profile picture updated successfully', 'success');
            };
            reader.readAsDataURL(file);
        }
    });

    // Edit Profile Modal
    const editProfileModal = document.getElementById('editProfileModal');
    const editProfileForm = document.getElementById('editProfileForm');
    const closeEditProfileModal = document.querySelector('.close-edit-profile');

    // Show edit profile modal
    document.getElementById('editProfileBtn').addEventListener('click', () => {
        editProfileForm.elements['editName'].value = userName;
        editProfileForm.elements['editEmail'].value = userEmail;
        editProfileModal.style.display = 'block';
    });

    // Close edit profile modal
    closeEditProfileModal.addEventListener('click', () => {
        editProfileModal.style.display = 'none';
    });

    // Handle edit profile form submission
    editProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newName = editProfileForm.elements['editName'].value.trim();
        const newEmail = editProfileForm.elements['editEmail'].value.trim();

        // Validate form
        if (!newName || !newEmail) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(newEmail)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        try {
            // Here you would typically make an API call to update the profile
            // For demo purposes, we'll just update localStorage
            localStorage.setItem('userName', newName);
            localStorage.setItem('userEmail', newEmail);

            // Update UI
            document.getElementById('userName').textContent = newName;
            document.getElementById('profileName').textContent = newName;
            document.getElementById('profileEmail').textContent = newEmail;

            editProfileModal.style.display = 'none';
            showNotification('Profile updated successfully', 'success');
        } catch (error) {
            showNotification('Failed to update profile. Please try again.', 'error');
        }
    });

    // Change Password Modal
    const changePasswordModal = document.getElementById('changePasswordModal');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const closeChangePasswordModal = document.querySelector('.close-change-password');

    // Show change password modal
    document.getElementById('changePasswordBtn').addEventListener('click', () => {
        changePasswordForm.reset();
        changePasswordModal.style.display = 'block';
    });

    // Close change password modal
    closeChangePasswordModal.addEventListener('click', () => {
        changePasswordModal.style.display = 'none';
    });

    // Handle change password form submission
    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const currentPassword = changePasswordForm.elements['currentPassword'].value;
        const newPassword = changePasswordForm.elements['newPassword'].value;
        const confirmPassword = changePasswordForm.elements['confirmPassword'].value;

        // Validate form
        if (!currentPassword || !newPassword || !confirmPassword) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (newPassword.length < 8) {
            showNotification('New password must be at least 8 characters long', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showNotification('New passwords do not match', 'error');
            return;
        }

        try {
            // Here you would typically make an API call to change the password
            // For demo purposes, we'll just show a success message
            changePasswordModal.style.display = 'none';
            showNotification('Password changed successfully', 'success');
        } catch (error) {
            showNotification('Failed to change password. Please try again.', 'error');
        }
    });

    // Upgrade Account Modal
    const upgradeAccountModal = document.getElementById('upgradeAccountModal');
    const closeUpgradeAccountModal = document.querySelector('.close-upgrade-account');

    // Show upgrade account modal
    document.getElementById('upgradeAccountBtn').addEventListener('click', () => {
        upgradeAccountModal.style.display = 'block';
    });

    // Close upgrade account modal
    closeUpgradeAccountModal.addEventListener('click', () => {
        upgradeAccountModal.style.display = 'none';
    });

    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Helper function to show notifications
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});