/**
 * Narayana Consulting Services LLP
 * Main JavaScript File
 * 
 * Features:
 * - Smooth scroll navigation
 * - Scroll reveal animations
 * - Sticky navigation with glassmorphism
 * - Mobile menu toggle
 * - Form validation and mailto submission
 * - Performance optimizations
 */

// ===================================
// Configuration
// ===================================

const config = {
    emailTo: 'narayanaconsultingservicesllp@gmail.com',
    scrollRevealThreshold: 0.1,
    navScrollThreshold: 100,
    debounceDelay: 100
};

// ===================================
// Utility Functions
// ===================================

/**
 * Debounce function to limit event handler calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// ===================================
// Navigation Functions
// ===================================

/**
 * Handle sticky navigation on scroll
 */
function handleStickyNav() {
    const navbar = document.getElementById('navbar');
    
    if (window.scrollY > config.navScrollThreshold) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

/**
 * Smooth scroll to section
 */
function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (target) {
        const navHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = target.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Handle navigation link clicks
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            smoothScrollTo(targetId);
            
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (!mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        });
    });
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    
    mobileMenu.classList.toggle('hidden');
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
}

/**
 * Setup mobile menu button
 */
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}

// ===================================
// Scroll Reveal Animations
// ===================================

/**
 * Initialize Intersection Observer for scroll reveal
 */
function setupScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: config.scrollRevealThreshold,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Stop observing once revealed
                }
            });
        }, observerOptions);
        
        revealElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        revealElements.forEach(element => {
            element.classList.add('revealed');
        });
    }
}

// ===================================
// Form Handling
// ===================================

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show error message for form field
 */
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    
    // Remove existing error message if any
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    field.classList.add('error');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
}

/**
 * Clear field error
 */
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = field.parentElement.querySelector('.error-message');
    
    field.classList.remove('error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

/**
 * Clear all form errors
 */
function clearAllErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    const errorFields = document.querySelectorAll('.error');
    
    errorMessages.forEach(msg => msg.remove());
    errorFields.forEach(field => field.classList.remove('error'));
}

/**
 * Validate form
 */
function validateForm(formData) {
    let isValid = true;
    clearAllErrors();
    
    // Validate name
    if (!formData.name || formData.name.trim().length === 0) {
        showFieldError('name', 'Please enter your name');
        isValid = false;
    }
    
    // Validate email
    if (!formData.email || formData.email.trim().length === 0) {
        showFieldError('email', 'Please enter your email address');
        isValid = false;
    } else if (!isValidEmail(formData.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message
    if (!formData.message || formData.message.trim().length === 0) {
        showFieldError('message', 'Please enter a message');
        isValid = false;
    } else if (formData.message.trim().length < 10) {
        showFieldError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Generate mailto link from form data
 */
function generateMailtoLink(formData) {
    const subject = `Contact Form Submission from ${formData.name}`;
    const body = `
Name: ${formData.name}
Email: ${formData.email}
${formData.company ? `Company: ${formData.company}` : ''}

Message:
${formData.message}

---
This message was sent via the Narayana Consulting Services website contact form.
    `.trim();
    
    const mailtoLink = `mailto:${config.emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return mailtoLink;
}

/**
 * Show success message
 */
function showSuccessMessage(form) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = 'Your email client will open shortly. If it doesn\'t, please email us directly at ' + config.emailTo;
    
    form.appendChild(successDiv);
    
    // Remove success message after 10 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 10000);
}

/**
 * Handle form submission
 */
function setupContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            company: document.getElementById('company').value,
            message: document.getElementById('message').value
        };
        
        // Validate form
        if (!validateForm(formData)) {
            // Scroll to first error
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }
        
        // Generate mailto link
        const mailtoLink = generateMailtoLink(formData);
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        showSuccessMessage(form);
        
        // Reset form after a delay
        setTimeout(() => {
            form.reset();
            clearAllErrors();
        }, 1000);
    });
    
    // Clear error on input
    const formFields = form.querySelectorAll('input, textarea');
    formFields.forEach(field => {
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                clearFieldError(field.id);
            }
        });
    });
}

// ===================================
// Performance Optimizations
// ===================================

/**
 * Lazy load images
 */
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ===================================
// Initialize Everything
// ===================================

/**
 * Initialize all functionality when DOM is ready
 */
function init() {
    // Setup navigation
    setupNavigation();
    setupMobileMenu();
    
    // Setup scroll effects
    const debouncedHandleStickyNav = debounce(handleStickyNav, config.debounceDelay);
    window.addEventListener('scroll', debouncedHandleStickyNav);
    
    // Initial nav state
    handleStickyNav();
    
    // Setup scroll reveal animations
    setupScrollReveal();
    
    // Setup contact form
    setupContactForm();
    
    // Setup lazy loading
    setupLazyLoading();
    
    // Add smooth scroll behavior to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (!anchor.classList.contains('nav-link') && !anchor.classList.contains('mobile-nav-link')) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId !== '#') {
                    smoothScrollTo(targetId);
                }
            });
        }
    });
    
    console.log('🕉️ Narayana Consulting Services website initialized successfully');
}

// ===================================
// Event Listeners
// ===================================

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - can pause animations if needed
    } else {
        // Page is visible again
    }
});

// Handle window resize (debounced)
const debouncedResize = debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 768) {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        const closeIcon = document.getElementById('close-icon');
        
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    }
}, config.debounceDelay);

window.addEventListener('resize', debouncedResize);

// ===================================
// Export for testing (if needed)
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        validateForm,
        generateMailtoLink
    };
}
