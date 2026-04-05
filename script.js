function showPage(pageId) {
    // 1. Find all sections with the class 'page-content'
    const pages = document.querySelectorAll('.page-content');

    // 2. Hide every section
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // 3. Show the specific section that was clicked
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Scroll to top of page
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 4. Update the browser tab title based on the page
    const titles = {
        'home': 'Home - Sabrina Zerlauth',
        'pilates': 'Pilates Coaching',
        'womens-health': "Women's Health"
    };
    document.title = titles[pageId] || 'Home - Sabrina Zerlauth';

    // Hide the header on the homepage, show it on other pages
    const header = document.querySelector('header');
    if (header) {
        if (pageId === 'home') {
            header.classList.add('hidden-on-home');
        } else {
            header.classList.remove('hidden-on-home');
        }
    }

    // Reset scroll indicator visibility when returning home
    if (pageId === 'home') {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.classList.remove('hidden');
        }
    }

    // Update browser history
    const url = pageId === 'home' ? window.location.pathname : `?page=${pageId}`;
    history.pushState({ page: pageId }, '', url);
}

// Handle browser back/forward navigation
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page) {
        showPage(event.state.page);
    } else {
        // Default to home if no state
        showPage('home');
    }
});

// Fade out scroll indicator as user scrolls
window.addEventListener('scroll', function() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const homePage = document.querySelector('#home.active');
    
    if (scrollIndicator && homePage) {
        // Calculate opacity: starts at 1, gradually fades to 0 over 300px
        const opacity = Math.max(0, 1 - (window.scrollY / 300));
        scrollIndicator.style.opacity = opacity;
    }
});

function initHeroCarousel() {
    const heroGallery = document.querySelector('.hero-gallery');
    const heroThumbs = Array.from(document.querySelectorAll('.hero-gallery .hero-thumb'));
    if (!heroGallery || !heroThumbs.length) return;

    let activeIndex = 0;
    heroThumbs.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === 0);
    });

    const rotateTo = (index) => {
        heroThumbs[activeIndex].classList.remove('active');
        activeIndex = (index + heroThumbs.length) % heroThumbs.length;
        heroThumbs[activeIndex].classList.add('active');
        updateIndicators();
    };

    const indicators = Array.from(document.querySelectorAll('.hero-indicator'));

    const updateIndicators = () => {
        indicators.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === activeIndex);
        });
    };

    const rotateNext = () => {
        if (window.innerWidth > 600) return;
        rotateTo(activeIndex + 1);
        updateIndicators();
    };

    let rotateTimer = setInterval(rotateNext, 4500);

    const resetTimer = () => {
        clearInterval(rotateTimer);
        rotateTimer = setInterval(rotateNext, 4500);
    };

    indicators.forEach((dot) => {
        dot.addEventListener('click', () => {
            const targetIndex = Number(dot.dataset.index);
            if (!Number.isNaN(targetIndex)) {
                rotateTo(targetIndex);
                updateIndicators();
                resetTimer();
            }
        });
    });

    let startX = null;
    heroGallery.addEventListener('touchstart', (event) => {
        if (event.touches.length !== 1) return;
        startX = event.touches[0].clientX;
    });

    heroGallery.addEventListener('touchend', (event) => {
        if (startX === null) return;
        const endX = event.changedTouches[0].clientX;
        const deltaX = endX - startX;
        if (Math.abs(deltaX) > 40) {
            if (deltaX < 0) {
                rotateTo(activeIndex + 1);
            } else {
                rotateTo(activeIndex - 1);
            }
            updateIndicators();
            resetTimer();
        }
        startX = null;
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 600) {
            heroThumbs.forEach((thumb) => thumb.classList.remove('active'));
            heroThumbs[0].classList.add('active');
            activeIndex = 0;
        }
    });
}

window.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    if (pageParam && ['home', 'pilates', 'womens-health'].includes(pageParam)) {
        showPage(pageParam);
    } else {
        showPage('home');
    }
    initHeroCarousel();
});