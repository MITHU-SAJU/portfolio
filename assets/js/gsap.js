gsap.registerPlugin(ScrollTrigger);

function initBookProjects() {
    const pages = gsap.utils.toArray("#projects-container > div");

    // Stack order
    gsap.set(pages, {
        zIndex: (i, target, list) => list.length - i
    });

    pages.forEach((page, i) => {
        if (i === pages.length - 1) return;

        gsap.to(page, {
            rotateY: -180,
            ease: "none",
            scrollTrigger: {
                trigger: "#projects",
                start: () => "top+=" + window.innerHeight * i,
                end: () => "top+=" + window.innerHeight * (i + 1),
                scrub: true
            }
        });
    });

    ScrollTrigger.create({
        trigger: "#projects",
        start: "top top",
        end: () => "+=" + window.innerHeight * pages.length,
        pin: true
    });
}