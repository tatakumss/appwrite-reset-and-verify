// Password Reset Configuration
const CONFIG = {
    // Appwrite Settings
    appwrite: {
        endpoint: 'https://nyc.cloud.appwrite.io/v1',
        projectId: '68d4f15b002baad3b7f6'
    },
    
    // App Settings
    app: {
        name: 'PediaHerb',
        logo: '🌿',
        scheme: 'pediaherb://login',
        backText: '← Back to PediaHerb App'
    },
    
    // UI Messages
    messages: {
        success: '🎉 Password updated successfully! You can now login with your new password.',
        invalidLink: '❌ Invalid reset link. Please use the reset link from your email.',
        linkVerified: '✅ Reset link verified! Please create your new password below.',
        redirecting: 'Redirecting to app...'
    }
};

// Initialize Appwrite
const client = new Appwrite.Client()
    .setEndpoint(CONFIG.appwrite.endpoint)
    .setProject(CONFIG.appwrite.projectId);

const account = new Appwrite.Account(client);

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
const secret = urlParams.get('secret');

// Initialize page
window.onload = function() {
    initializeApp();
    
    if (userId && secret) {
        showMessage(CONFIG.messages.linkVerified, 'success');
        document.getElementById('reset-form').classList.remove('hidden');
        setupFormValidation();
    } else {
        showMessage(CONFIG.messages.invalidLink, 'error');
    }
};

// Initialize app with configuration
function initializeApp() {
    document.getElementById('app-logo').textContent = CONFIG.app.logo;
    document.getElementById('app-title').textContent = CONFIG.app.name || 'Password Reset';
    document.getElementById('back-link').textContent = CONFIG.app.backText;
}

// Setup form validation
function setupFormValidation() {
    const newPasswordField = document.getElementById('new-password');
    const confirmPasswordField = document.getElementById('confirm-password');
    
    setTimeout(() => {
        newPasswordField.focus();
        newPasswordField.addEventListener('input', validatePassword);
        confirmPasswordField.addEventListener('input', validatePassword);
    }, 100);
}

// Utility functions
function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.classList.remove('hidden');
}

function hideMessage() {
    document.getElementById('message').classList.add('hidden');
}

function setLoading(isLoading) {
    const button = document.querySelector('.btn');
    const loading = document.getElementById('loading');
    const buttonText = document.getElementById('button-text');
    
    button.disabled = isLoading;
    loading.classList.toggle('hidden', !isLoading);
    buttonText.textContent = isLoading ? 'Updating...' : 'Update Password';
}

// Password validation
function validatePassword() {
    const password = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate length
    const lengthReq = document.getElementById('req-length');
    updateRequirement(lengthReq, password.length >= 8);
    
    // Validate letters and numbers
    const lettersReq = document.getElementById('req-letters');
    updateRequirement(lettersReq, /(?=.*[a-zA-Z])(?=.*\d)/.test(password));
    
    // Validate password match
    const matchReq = document.getElementById('req-match');
    if (confirmPassword.length > 0) {
        updateRequirement(matchReq, password === confirmPassword);
    } else {
        matchReq.classList.remove('valid', 'invalid');
    }
}

function updateRequirement(element, isValid) {
    element.classList.toggle('valid', isValid);
    element.classList.toggle('invalid', !isValid);
}

function isPasswordValid() {
    const password = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    return password.length >= 8 && 
           /(?=.*[a-zA-Z])(?=.*\d)/.test(password) && 
           password === confirmPassword;
}

// Handle password reset form submission
async function handlePasswordReset(event) {
    event.preventDefault();
    
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate form
    if (!isPasswordValid()) {
        showMessage('❌ Please ensure all password requirements are met!', 'error');
        return;
    }
    
    setLoading(true);
    
    try {
        await account.updateRecovery(userId, secret, newPassword, confirmPassword);
        
        showMessage(CONFIG.messages.success, 'success');
        document.getElementById('password-form').reset();
        
        // Redirect after success
        setTimeout(() => {
            showMessage(CONFIG.messages.redirecting, 'info');
            setTimeout(goBack, 1000);
        }, 3000);
        
    } catch (error) {
        console.error('Password reset error:', error);
        showMessage(`❌ ${getErrorMessage(error)}`, 'error');
        setLoading(false);
    }
}

// Get user-friendly error message
function getErrorMessage(error) {
    const errorMap = {
        401: 'The reset link has expired or is invalid. Please request a new one.',
        400: 'Invalid request. Please check your password and try again.',
        429: 'Too many attempts. Please wait a few minutes.',
        500: 'Server error. Please try again later.',
        503: 'Service unavailable. Please try again later.'
    };
    
    return errorMap[error.code] || error.message || 'An unexpected error occurred.';
}

// Handle back navigation
function goBack() {
    const appScheme = CONFIG.app.scheme;
    const fallbackMessage = `Please open the ${CONFIG.app.name} app to login with your new password.`;
    
    // Try to open the mobile app
    if (appScheme) {
        const link = document.createElement('a');
        link.href = appScheme;
        link.style.display = 'none';
        document.body.appendChild(link);
        
        try {
            link.click();
            setTimeout(() => showMessage(fallbackMessage, 'info'), 1000);
        } catch (error) {
            showMessage(fallbackMessage, 'info');
        }
        
        document.body.removeChild(link);
    } else {
        // Fallback to closing window or going back
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.close();
        }
    }
}

// Export for easy customization
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG };
}
