document.addEventListener("DOMContentLoaded", () => {
    const galleryGrid = document.getElementById("gallery-grid");
    const totalFruits = 175;

    // Small green rounded leaf icon badge content
    const leafIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.277.084a.5.5 0 0 0-.554 0C7.53.152 6.56.556 5.6 1.139 2.508 3.013 0 6.645 0 9.805a4.2 4.2 0 0 0 .584 2.126.5.5 0 0 0 .868-.456A3.2 3.2 0 0 1 1 9.805c0-2.822 2.195-6.182 5.06-7.92.51-.312 1.018-.574 1.49-.785a.5.5 0 0 1 .4.043C9.073 1.5 10.19 1.83 11 2.502c.983.816 1.5 1.94 1.5 3.303 0 1.258-.453 2.593-1.071 3.738-1.077 1.996-2.583 3.42-3.154 3.905-.2.17-.4.57 0 .82.164.103.385.086.513-.032.535-.494 2.112-2.008 3.273-4.16.657-1.222 1.144-2.617 1.144-3.951 0-1.638-.63-3.1-1.89-4.148C10.151 1.05 8.916.48 8.277.084z"/>
    </svg>`;

    // Use a DocumentFragment for performant DOM updates
    const fragment = document.createDocumentFragment();

    // Loop through and create images
    for (let i = 1; i <= totalFruits; i++) {
        const card = document.createElement("div");
        card.className = "fruit-card";

        // Card inner structure.
        // We handle missing images via the onerror attribute, which completely removes the card from DOM,
        // ensuring grid automatically rearranges naturally without any gaps.
        card.innerHTML = `
            <div class="card-badge-left">
                ${leafIcon}
            </div>
            <div class="img-container">
                <img src="f${i}.jpg" alt="Fruit Variety ${i}" class="fruit-img" loading="lazy" onerror="this.closest('.fruit-card').remove();">
            </div>
            <h3 class="fruit-name">Fruit Variety ${i}</h3>
        `;

        fragment.appendChild(card);
    }

    // Append to DOM immediately so initial items show right away.
    galleryGrid.appendChild(fragment);

    // Fade-up Animation Logic with IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px', // slight negative margin guarantees it scrolls up into view a bit before triggering
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add fade-up class to trigger CSS animation
                entry.target.classList.add('fade-up');
                
                // Allow hover CSS scaling once animation completes via custom handling if needed. 
                // Since we use CSS keyframes "forwards" over base style, hover transform applies post-animation cleanly.
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation delay stagger cleanly and observe
    const cards = document.querySelectorAll('.fruit-card');
    cards.forEach((card, index) => {
        // Module 4 aligns well with Desktop's 4-column layout stagger effect (0s, 0.1s, 0.2s, 0.3s)
        const delay = (index % 4) * 0.1;
        card.style.transitionDelay = `${delay}s`;
        
        // Remove animation delay after transition ends, so hovering works without delay issues
        card.addEventListener('transitionend', function(e) {
            if (e.propertyName === 'transform') {
                this.style.transitionDelay = '0s';
            }
        });

        observer.observe(card);
    });
});
