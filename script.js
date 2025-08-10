// Ferrara's Auto Detailing - Main JavaScript File
// Handles all interactive functionality for the static website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initAnimatedStats();
    initLoadMoreReviews();
    initSatisfactionChart();
    initSmoothScrolling();
});

// Navigation functionality
function initNavigation() {
    const navToggler = document.getElementById('navToggler');
    const navbarNav = document.getElementById('navbarNav');
    
    if (navToggler && navbarNav) {
        navToggler.addEventListener('click', function() {
            navbarNav.classList.toggle('show');
            
            // Toggle hamburger animation
            if (navbarNav.classList.contains('show')) {
                navToggler.classList.remove('collapsed');
            } else {
                navToggler.classList.add('collapsed');
            }
        });

        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) {
                    navbarNav.classList.remove('show');
                    navToggler.classList.add('collapsed');
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggler.contains(e.target) && !navbarNav.contains(e.target)) {
                navbarNav.classList.remove('show');
                navToggler.classList.add('collapsed');
            }
        });
    }

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = 'rgba(8, 8, 8, 0.98)';
                navbar.style.backdropFilter = 'blur(15px)';
            } else {
                navbar.style.backgroundColor = 'rgba(8, 8, 8, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
        }
    });
}

// Animated statistics counters
function initAnimatedStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return;

    const animateCounter = (element, target, duration = 2000) => {
        let current = 0;
        const increment = target / (duration / 16); // 60 FPS
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
            element.classList.add('animate');
        }, 16);
    };

    // Intersection Observer to trigger animation when stats come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                if (target && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    animateCounter(entry.target, target);
                }
            }
        });
    }, {
        threshold: 0.5
    });

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// Load more reviews functionality
function initLoadMoreReviews() {
    const loadMoreBtn = document.getElementById('loadMoreReviews');
    const reviewsContainer = document.getElementById('reviewsContainer');
    
    if (!loadMoreBtn || !reviewsContainer) return;

    // Additional reviews data
    const additionalReviews = [
        {
            name: "Sarah Johnson",
            time: "1 year ago",
            text: "Outstanding service! Nick's attention to detail is incredible. My car hasn't looked this good since I bought it. Professional, reliable, and fairly priced.",
            rating: 5
        },
        {
            name: "Michael Chen",
            time: "1 year ago", 
            text: "Exceptional work on my BMW. Nick went above and beyond to make sure every surface was perfect. Will definitely be using his services regularly.",
            rating: 5
        },
        {
            name: "Lisa Thompson",
            time: "1 year ago",
            text: "Nick is a perfectionist in the best way possible. He spent extra time on stubborn stains and made my interior look brand new. Highly recommend!",
            rating: 5
        },
        {
            name: "David Rodriguez",
            time: "2 years ago",
            text: "Best detailing service in the area! Nick's professionalism and quality of work is unmatched. Fair pricing for premium results.",
            rating: 5
        },
        {
            name: "Jennifer Mills",
            time: "2 years ago",
            text: "Amazing transformation of my car! Nick's mobile service is so convenient and the results speak for themselves. Five stars all the way!",
            rating: 5
        },
        {
            name: "Robert Taylor",
            time: "2 years ago",
            text: "Nick detailed my truck and it looks incredible! His professionalism and attention to every detail is remarkable. Worth every penny.",
            rating: 5
        }
    ];

    let currentIndex = 0;

    loadMoreBtn.addEventListener('click', function() {
        const reviewsToShow = 3; // Show 3 more reviews each time
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < reviewsToShow && currentIndex < additionalReviews.length; i++) {
            const review = additionalReviews[currentIndex];
            const reviewElement = createReviewElement(review);
            fragment.appendChild(reviewElement);
            currentIndex++;
        }

        reviewsContainer.appendChild(fragment);

        // Hide button if no more reviews
        if (currentIndex >= additionalReviews.length) {
            loadMoreBtn.style.display = 'none';
        }

        // Update button text
        const remaining = additionalReviews.length - currentIndex;
        if (remaining > 0) {
            loadMoreBtn.innerHTML = `<i class="fas fa-plus-circle me-2"></i>View ${remaining} More Reviews`;
        }
    });

    function createReviewElement(review) {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-lg-4 col-md-6 mb-4';
        
        const stars = '★'.repeat(review.rating);
        
        colDiv.innerHTML = `
            <div class="review-card">
                <div class="review-header">
                    <div class="stars">
                        ${Array.from({length: review.rating}, () => '<i class="fas fa-star"></i>').join('')}
                    </div>
                    <div class="reviewer-info">
                        <strong>${review.name}</strong>
                        <small class="text-muted">${review.time}</small>
                    </div>
                </div>
                <p class="review-text">"${review.text}"</p>
            </div>
        `;
        
        return colDiv;
    }
}

// Satisfaction chart initialization
function initSatisfactionChart() {
    const chartCanvas = document.getElementById('satisfactionChart');
    
    if (!chartCanvas || typeof Chart === 'undefined') return;

    const ctx = chartCanvas.getContext('2d');
    
    // Chart configuration
    const chartConfig = {
        type: 'doughnut',
        data: {
            labels: ['Excellent (5 Stars)', 'Very Good (4 Stars)', 'Good (3 Stars)', 'Fair (2 Stars)', 'Poor (1 Star)'],
            datasets: [{
                data: [85, 12, 2, 1, 0], // Percentage distribution
                backgroundColor: [
                    '#FFD700', // Gold
                    '#E5E4E2', // Light Gold
                    '#B8860B', // Dark Gold
                    '#808080', // Gray
                    '#404040'  // Dark Gray
                ],
                borderColor: '#080808',
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#E5E4E2',
                        font: {
                            size: 12
                        },
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(8, 8, 8, 0.9)',
                    titleColor: '#FFD700',
                    bodyColor: '#E5E4E2',
                    borderColor: '#FFD700',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            },
            elements: {
                arc: {
                    borderWidth: 2
                }
            },
            animation: {
                animateRotate: true,
                duration: 2000
            }
        }
    };

    // Create chart when it comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !chartCanvas.chart) {
                chartCanvas.chart = new Chart(ctx, chartConfig);
                observer.unobserve(chartCanvas);
            }
        });
    }, {
        threshold: 0.3
    });

    observer.observe(chartCanvas);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Additional utility functions
function fadeInOnScroll() {
    const elements = document.querySelectorAll('.service-card, .review-card, .stat-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Initialize fade-in animations
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(fadeInOnScroll, 500);
});

// Form handling (if contact forms are added later)
function initFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            if (isValid) {
                // In a real implementation, you would send the form data to a server
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                form.reset();
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styling
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Loading animation for images
function initImageLoading() {
    const images = document.querySelectorAll('img[src*="unsplash"]');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
    });
}

// Initialize image loading
document.addEventListener('DOMContentLoaded', initImageLoading);

// Parallax effect for hero section (optional enhancement)
function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    const heroImage = document.querySelector('.hero-image');
    
    if (!heroSection || !heroImage) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const speed = 0.5;
        
        if (scrolled < window.innerHeight) {
            heroImage.style.transform = `translateY(${scrolled * speed}px)`;
        }
    });
}

// Optional: Initialize parallax effect
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth > 768) {
        initParallax();
    }
});

// Performance optimization: Lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Console message for developers
console.log(`
🚗 Ferrara's Auto Detailing Website
Professional auto detailing services in Centerville, OH
Call: +1 937-558-6934
Email: nfferrara9@gmail.com

Website developed with modern web technologies
All interactive features are now active!
`);
