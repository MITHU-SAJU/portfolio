// Initialize AOS Animation
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 100
    });

    // Navbar Active State on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href').includes(current)) {
                li.classList.add('active');
            }
        });
    });

    // Navbar Background Change on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-sm');
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.classList.remove('shadow-sm');
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
});

/* ================== Projects Paper-Turn Carousel ================== */
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('projects-container');
    if (!container) return;

    let slides = [];
    let currentIndex = 0;
    let animating = false;
    const ANIM_DUR = 780; // matches CSS

    function collectSlides() {
        slides = Array.from(container.querySelectorAll(':scope > .col-12'));
        slides.forEach(s => s.classList.add('project-page'));
        if (!slides.length) return;
        // ensure one active
        if (!slides.some(s => s.classList.contains('active'))) {
            slides.forEach(s => s.classList.remove('active', 'enter-right', 'enter-left', 'exit-left', 'exit-right'));
            slides[0].classList.add('active');
            currentIndex = 0;
        }
        adjustContainerHeight(container.querySelector(':scope > .col-12.active'));
    }

    function gotoIndex(nextIndex, dir = 'next') {
        if (animating) return;
        const total = slides.length;
        if (!total) return;
        nextIndex = (nextIndex + total) % total;
        if (nextIndex === currentIndex) return;

        animating = true;
        const current = slides[currentIndex];
        const next = slides[nextIndex];

        // prepare next
        if (dir === 'next') {
            next.classList.add('enter-right');
        } else {
            next.classList.add('enter-left');
        }

        // force layout
        // eslint-disable-next-line no-unused-expressions
        next.getBoundingClientRect();

        // start transition
        next.classList.add('active');
        if (dir === 'next') current.classList.add('exit-left');
        else current.classList.add('exit-right');

        // adjust height immediately to avoid layout jump
        adjustContainerHeight(next);

        // cleanup after animation
        setTimeout(() => {
            current.classList.remove('active', 'exit-left', 'exit-right');
            next.classList.remove('enter-right', 'enter-left');
            // ensure next remains active
            next.classList.add('active');
            currentIndex = nextIndex;
            animating = false;
            adjustContainerHeight(next);
        }, ANIM_DUR + 30);
    }

    // attach arrow handlers
    function attachControls() {
        const nextBtn = document.getElementById('nextProject');
        const prevBtn = document.getElementById('prevProject');
        nextBtn?.addEventListener('click', () => gotoIndex(currentIndex + 1, 'next'));
        prevBtn?.addEventListener('click', () => gotoIndex(currentIndex - 1, 'prev'));
    }

    // keep container height matching active slide
    function adjustContainerHeight(activeSlide) {
        if (!container) return;
        if (!activeSlide) { container.style.height = ''; return; }
        // measure after images load
        const imgs = Array.from(activeSlide.querySelectorAll('img'));
        const setHeight = () => {
            const h = Math.ceil(activeSlide.scrollHeight);
            container.style.height = h + 'px';
        };
        if (!imgs.length) { requestAnimationFrame(setHeight); setTimeout(setHeight, 30); return; }
        let loaded = 0;
        imgs.forEach(img => {
            if (img.complete) loaded++;
            else img.addEventListener('load', () => { loaded++; if (loaded === imgs.length) setHeight(); }, { once: true });
        });
        if (loaded === imgs.length) setHeight();
    }

    // observe dynamic changes
    const mo = new MutationObserver(() => {
        collectSlides();
    });
    mo.observe(container, { childList: true });

    // initial
    collectSlides();
    attachControls();

    // responsive: recalc on resize
    let resizeT;
    window.addEventListener('resize', () => {
        clearTimeout(resizeT);
        resizeT = setTimeout(() => {
            adjustContainerHeight(container.querySelector(':scope > .col-12.active'));
        }, 120);
    });

    // optional: keyboard navigation (left/right)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') gotoIndex(currentIndex + 1, 'next');
        if (e.key === 'ArrowLeft') gotoIndex(currentIndex - 1, 'prev');
    });
});


