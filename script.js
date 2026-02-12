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

    // No body background toggle needed; hero container handles homepage image
}