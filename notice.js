/**
 * Freedom College of Excellence
 * notice.js — Shared Notice Popup & Floating Banner
 *
 * - Popup appears after 30 seconds, shown only once per session (localStorage).
 * - Floating banner always visible at bottom-right.
 * - Dismissible with X button.
 * - Matches the website's design system (Navy, Gold, Cream, Teal).
 */
(function () {
    const POPUP_KEY = 'fce_notice_shown';

    /* ───────────────────────────────────────────────
       Inject CSS
    ─────────────────────────────────────────────── */
    const style = document.createElement('style');
    style.textContent = `
        /* ── Overlay ─────────────────────────────── */
        #fce-overlay {
            position: fixed;
            inset: 0;
            background: rgba(8, 24, 46, 0.72);
            backdrop-filter: blur(4px);
            z-index: 9998;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            opacity: 0;
            transition: opacity 0.4s ease;
        }
        #fce-overlay.visible { opacity: 1; }

        /* ── Popup Card ───────────────────────────── */
        #fce-popup {
            background: #FAFAF8;
            border-top: 6px solid #0A1F44;
            border-left: 1px solid #e0ddd6;
            border-right: 1px solid #e0ddd6;
            border-bottom: 1px solid #e0ddd6;
            max-width: 540px;
            width: 100%;
            padding: 2.5rem 2.5rem 2rem;
            position: relative;
            box-shadow: 0 24px 80px rgba(8,24,46,0.28), 0 2px 8px rgba(8,24,46,0.10);
            transform: translateY(20px);
            transition: transform 0.4s ease;
            font-family: 'Lato', sans-serif;
        }
        #fce-overlay.visible #fce-popup { transform: translateY(0); }

        /* Gold accent bar */
        #fce-popup::before {
            content: '';
            display: block;
            width: 48px;
            height: 3px;
            background: #D4AF37;
            margin-bottom: 1.5rem;
        }

        /* Close button */
        #fce-close {
            position: absolute;
            top: 1.1rem;
            right: 1.1rem;
            background: none;
            border: none;
            cursor: pointer;
            color: #5A5A5A;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            transition: background 0.2s, color 0.2s;
            font-size: 1.1rem;
            line-height: 1;
        }
        #fce-close:hover {
            background: #0A1F44;
            color: #D4AF37;
        }
        #fce-close span {
            font-family: 'Material Symbols Outlined', sans-serif;
            font-size: 1.2rem;
        }

        /* Popup label */
        #fce-popup .fce-label {
            font-size: 10px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #1FA2A8;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        /* Popup heading */
        #fce-popup h2 {
            font-family: 'Libre Baskerville', serif;
            color: #0A1F44;
            font-size: 1.4rem;
            font-weight: 700;
            line-height: 1.3;
            margin-bottom: 1rem;
        }

        /* Popup body */
        #fce-popup p {
            font-size: 0.88rem;
            line-height: 1.8;
            color: #5A5A5A;
            margin: 0;
        }

        /* Dismiss button */
        #fce-dismiss {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            margin-top: 1.75rem;
            background: #0A1F44;
            color: #fff;
            border: none;
            padding: 0.65rem 1.5rem;
            font-family: 'Lato', sans-serif;
            font-size: 10px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
        }
        #fce-dismiss:hover {
            background: #D4AF37;
            color: #0A1F44;
        }

        /* ── Floating Banner ─────────────────────── */
        #fce-banner {
            position: fixed;
            bottom: 1.5rem;
            right: 1.5rem;
            z-index: 9997;
            background: #0A1F44;
            color: #fff;
            font-family: 'Lato', sans-serif;
            border-left: 3px solid #D4AF37;
            box-shadow: 0 8px 32px rgba(8,24,46,0.28);
            display: flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.65rem 1rem 0.65rem 0.85rem;
            max-width: 260px;
            cursor: pointer;
            transform: translateY(6px);
            opacity: 0;
            transition: opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s;
        }
        #fce-banner.visible {
            opacity: 1;
            transform: translateY(0);
        }
        #fce-banner:hover {
            background: #D4AF37;
            color: #0A1F44;
        }
        #fce-banner:hover .fce-banner-dot { background: #0A1F44; }
        #fce-banner:hover #fce-banner-close { color: #0A1F44; }

        .fce-banner-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #D4AF37;
            flex-shrink: 0;
            animation: fce-pulse 2s infinite;
        }
        @keyframes fce-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.6); }
            50% { box-shadow: 0 0 0 6px rgba(212,175,55,0); }
        }
        #fce-banner-text {
            font-size: 10px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            font-weight: 700;
            flex: 1;
            line-height: 1.3;
        }


        /* ── Mobile adjustments ──────────────────── */
        @media (max-width: 480px) {
            #fce-popup {
                padding: 2rem 1.25rem 1.5rem;
            }
            #fce-banner {
                bottom: 1rem;
                right: 1rem;
                left: 1rem;
                max-width: unset;
            }
        }
    `;
    document.head.appendChild(style);

    /* ───────────────────────────────────────────────
       Build Popup HTML
    ─────────────────────────────────────────────── */
    function createPopup() {
        const overlay = document.createElement('div');
        overlay.id = 'fce-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'fce-popup-heading');

        overlay.innerHTML = `
            <div id="fce-popup">
                <button id="fce-close" aria-label="Close notice">
                    <span class="material-symbols-outlined">close</span>
                </button>
                <div class="fce-label">Official Notice</div>
                <h2 id="fce-popup-heading">Notice: Website Under Development</h2>
                <p>This website is provided solely for preliminary design and accreditation application purposes. All content herein is in draft form and subject to revision without notice. Information presented may be incomplete, inaccurate, or non-final and shall not be relied upon for any legal, academic, financial, or operational decisions. This site does not constitute a binding representation, offer, or commitment of any kind.</p>
                <button id="fce-dismiss">
                    <span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">check_circle</span>
                    I Understand
                </button>
            </div>
        `;
        document.body.appendChild(overlay);

        // Show with animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => overlay.classList.add('visible'));
        });

        // Store in session so it only shows once
        localStorage.setItem(POPUP_KEY, '1');

        function closePopup() {
            overlay.classList.remove('visible');
            overlay.style.pointerEvents = 'none';
            setTimeout(() => overlay.remove(), 400);
        }

        document.getElementById('fce-close').addEventListener('click', closePopup);
        document.getElementById('fce-dismiss').addEventListener('click', closePopup);

        // Close on overlay click (outside popup)
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closePopup();
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closePopup();
        }, { once: true });
    }

    /* ───────────────────────────────────────────────
       Build Floating Banner HTML
    ─────────────────────────────────────────────── */
    function createBanner() {
        const banner = document.createElement('div');
        banner.id = 'fce-banner';
        banner.setAttribute('role', 'status');
        banner.setAttribute('aria-label', 'Site notice');
        banner.setAttribute('title', 'Click to expand notice');
        banner.innerHTML = `
            <div class="fce-banner-dot"></div>
            <div id="fce-banner-text">Notice: Under Development</div>
        `;
        document.body.appendChild(banner);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => banner.classList.add('visible'));
        });

        // Clicking the banner shows the popup
        banner.addEventListener('click', function (e) {
            if (e.target.id === 'fce-banner-close') return;
            if (!document.getElementById('fce-overlay')) {
                createPopup();
            }
        });


    }

    /* ───────────────────────────────────────────────
       Init
    ─────────────────────────────────────────────── */
    function init() {
        // Always show the floating banner
        createBanner();

        // Show popup after 30 seconds, only once per session
        if (!localStorage.getItem(POPUP_KEY)) {
            setTimeout(createPopup, 30000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
