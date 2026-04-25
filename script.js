/* ════════════════════════════════════════════════
   MANSOOR HUSSAIN — PORTFOLIO  |  script.js
   Full 3D + Motion Animations Edition
   ════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════
   1. LOADER
══════════════════════════════════════ */
(function initLoader() {
    const loader     = document.getElementById('loader');
    const loaderFill = document.getElementById('loaderFill');
    const loaderText = document.getElementById('loaderText');
    const messages   = ['Loading Experience...', 'Building 3D World...', 'Almost Ready...'];
    let   progress   = 0;
    let   msgIdx     = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 14 + 4;
        if (progress > 100) progress = 100;

        loaderFill.style.width = progress + '%';

        if (progress > 40  && msgIdx === 0) { msgIdx = 1; loaderText.textContent = messages[1]; }
        if (progress > 75  && msgIdx === 1) { msgIdx = 2; loaderText.textContent = messages[2]; }

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('gone');
                document.body.style.overflow = 'auto';
                initPageAnimations();
            }, 400);
        }
    }, 80);

    document.body.style.overflow = 'hidden';
})();

/* ══════════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════════ */
(function initCursor() {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let mx = 0, my = 0;
    let rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
    });

    // Smooth ring follow
    (function followRing() {
        rx += (mx - rx) * 0.1;
        ry += (my - ry) * 0.1;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(followRing);
    })();

    // Hover effect on interactive elements
    const interactiveEls = document.querySelectorAll('a, button, .proj-card, .tilt-scene, .sp');
    interactiveEls.forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        dot.style.opacity  = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
    });
})();

/* ══════════════════════════════════════
   3. PARTICLE / STAR CANVAS
══════════════════════════════════════ */
(function initCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;

    const ctx    = canvas.getContext('2d');
    let   W      = canvas.width  = window.innerWidth;
    let   H      = canvas.height = window.innerHeight;
    let   mouseX = W / 2;
    let   mouseY = H / 2;

    window.addEventListener('resize', () => {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        buildParticles();
    });

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // ── Particles ──
    const PARTICLE_COUNT = 120;
    const particles = [];

    function buildParticles() {
        particles.length = 0;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x:   Math.random() * W,
                y:   Math.random() * H,
                vx:  (Math.random() - 0.5) * 0.3,
                vy:  (Math.random() - 0.5) * 0.3,
                r:   Math.random() * 1.4 + 0.3,
                a:   Math.random(),
                da:  (Math.random() * 0.004 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
                type: Math.random() > 0.7 ? 'green' : 'cyan'
            });
        }
    }

    buildParticles();

    function drawParticles() {
        ctx.clearRect(0, 0, W, H);

        particles.forEach((p, i) => {
            // Twinkle
            p.a += p.da;
            if (p.a > 1 || p.a < 0) p.da *= -1;

            // Drift
            p.x += p.vx;
            p.y += p.vy;

            // Wrap edges
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;

            // Mouse repel (soft)
            const dx   = p.x - mouseX;
            const dy   = p.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = (120 - dist) / 120 * 0.5;
                p.x += (dx / dist) * force;
                p.y += (dy / dist) * force;
            }

            // Draw glow dot
            const color = p.type === 'cyan'
                ? `rgba(0,229,255,${p.a * 0.55})`
                : `rgba(0,255,136,${p.a * 0.45})`;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();

            // Draw connection lines between nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const q  = particles[j];
                const ex = p.x - q.x;
                const ey = p.y - q.y;
                const ed = Math.sqrt(ex * ex + ey * ey);
                if (ed < 90) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(0,229,255,${(1 - ed / 90) * 0.06})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(drawParticles);
    }

    drawParticles();
})();

/* ══════════════════════════════════════
   4. 3D CARD TILT (Mouse-Tracked)
══════════════════════════════════════ */
(function initTilt() {
    const scene = document.getElementById('tiltScene');
    const card  = document.getElementById('tiltCard');
    const shine = document.getElementById('tiltShine');
    if (!scene || !card) return;

    let currentX = 0, currentY = 0;
    let targetX  = 0, targetY  = 0;
    let rafId;

    scene.addEventListener('mousemove', e => {
        const r = scene.getBoundingClientRect();
        const x = (e.clientX - r.left)  / r.width  - 0.5;   // -0.5 to 0.5
        const y = (e.clientY - r.top)   / r.height - 0.5;
        targetX = x * 24;   // max degrees
        targetY = -y * 20;

        // Shine position
        if (shine) {
            shine.style.background =
                `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.1) 0%, transparent 65%)`;
        }
    });

    scene.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
        if (shine) shine.style.background = '';
    });

    function animateTilt() {
        currentX += (targetX - currentX) * 0.09;
        currentY += (targetY - currentY) * 0.09;
        card.style.transform = `rotateY(${currentX}deg) rotateX(${currentY}deg)`;
        rafId = requestAnimationFrame(animateTilt);
    }

    animateTilt();
})();

/* ══════════════════════════════════════
   5. SCROLL REVEAL (IntersectionObserver)
══════════════════════════════════════ */
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger delay based on sibling index
                const siblings = entry.target.parentElement
                    ? [...entry.target.parentElement.querySelectorAll('.reveal')]
                    : [];
                const idx = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = (idx * 0.1) + 's';
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => io.observe(el));
}

/* ══════════════════════════════════════
   6. HEADER SCROLL BEHAVIOUR
══════════════════════════════════════ */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;

        if (y > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide on scroll down, show on scroll up
        if (y > lastScroll && y > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = y;
    }, { passive: true });
}

/* ══════════════════════════════════════
   7. HAMBURGER / MOBILE NAV
══════════════════════════════════════ */
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileNav.classList.toggle('open');
    });
}

function closeMobileNav() {
    document.getElementById('hamburger')?.classList.remove('open');
    document.getElementById('mobileNav')?.classList.remove('open');
}

// Expose to HTML onclick
window.closeMobileNav = closeMobileNav;

/* ══════════════════════════════════════
   8. SMOOTH SCROLL
══════════════════════════════════════ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ══════════════════════════════════════
   9. GALLERY MODAL
══════════════════════════════════════ */
function openGallery(images) {
    const modal     = document.getElementById('galleryModal');
    const container = document.getElementById('modalImages');
    if (!modal || !container) return;

    container.innerHTML = '';

    images.forEach((src, i) => {
        const img       = document.createElement('img');
        img.src         = src;
        img.alt         = 'Portfolio image ' + (i + 1);
        img.loading     = 'lazy';
        img.style.opacity       = '0';
        img.style.transform     = 'translateY(20px)';
        img.style.transition    = `opacity 0.5s ease ${i * 0.15}s, transform 0.5s ease ${i * 0.15}s`;
        container.appendChild(img);

        // Trigger animation after append
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                img.style.opacity   = '1';
                img.style.transform = 'translateY(0)';
            });
        });
    });

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeGallery() {
    const modal = document.getElementById('galleryModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    // reset display
    setTimeout(() => { modal.style.display = ''; }, 10);
}

// Expose to HTML
window.openGallery  = openGallery;
window.closeGallery = closeGallery;

// Close on Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeGallery();
});

/* ══════════════════════════════════════
   10. PROJECT CARD 3D HOVER (per-card tilt)
══════════════════════════════════════ */
function initCardHover() {
    document.querySelectorAll('.proj-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width  - 0.5;
            const y = (e.clientY - r.top)  / r.height - 0.5;
            card.style.transform = `translateY(-10px) scale(1.01) rotateX(${-y * 6}deg) rotateY(${x * 8}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ══════════════════════════════════════
   11. SKILL PILLS MAGNETIC EFFECT
══════════════════════════════════════ */
function initMagnetic() {
    document.querySelectorAll('.sp').forEach(pill => {
        pill.addEventListener('mousemove', e => {
            const r  = pill.getBoundingClientRect();
            const cx = r.left + r.width  / 2;
            const cy = r.top  + r.height / 2;
            const dx = (e.clientX - cx) * 0.3;
            const dy = (e.clientY - cy) * 0.3;
            pill.style.transform = `translate(${dx}px, ${dy}px) scale(1.06)`;
        });
        pill.addEventListener('mouseleave', () => {
            pill.style.transform = '';
        });
    });
}

/* ══════════════════════════════════════
   12. ACTIVE NAV LINK ON SCROLL
══════════════════════════════════════ */
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) {
                current = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + current) {
                link.style.color = 'var(--c-cyan)';
            }
        });
    }, { passive: true });
}

/* ══════════════════════════════════════
   13. PARALLAX on hero shapes
══════════════════════════════════════ */
function initParallax() {
    const shapes = document.querySelectorAll('.shape');
    if (!shapes.length) return;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        shapes.forEach((s, i) => {
            const speed = 0.06 + i * 0.03;
            s.style.transform = `translateY(${y * speed}px)`;
        });
    }, { passive: true });
}

/* ══════════════════════════════════════
   INIT — runs after loader hides
══════════════════════════════════════ */
function initPageAnimations() {
    initScrollReveal();
    initHeader();
    initMobileNav();
    initSmoothScroll();
    initCardHover();
    initMagnetic();
    initActiveNav();
    initParallax();
}
