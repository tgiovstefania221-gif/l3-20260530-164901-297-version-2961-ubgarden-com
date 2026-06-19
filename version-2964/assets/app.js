(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    var menuButton = qs('[data-menu-toggle]');
    var mobileNav = qs('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    var heroSlides = qsa('[data-hero-slide]');
    var heroDots = qsa('[data-hero-dot]');
    var heroIndex = 0;

    function setHero(index) {
        if (!heroSlides.length) {
            return;
        }

        heroIndex = (index + heroSlides.length) % heroSlides.length;

        heroSlides.forEach(function (slide, idx) {
            slide.classList.toggle('active', idx === heroIndex);
        });

        heroDots.forEach(function (dot, idx) {
            dot.classList.toggle('active', idx === heroIndex);
        });
    }

    heroDots.forEach(function (dot, idx) {
        dot.addEventListener('click', function () {
            setHero(idx);
        });
    });

    if (heroSlides.length > 1) {
        setInterval(function () {
            setHero(heroIndex + 1);
        }, 5200);
    }

    var filterForm = qs('[data-filter-form]');

    if (filterForm) {
        var cards = qsa('[data-title]');
        var emptyState = qs('[data-empty-state]');
        var searchInput = qs('[data-filter-keyword]');
        var yearSelect = qs('[data-filter-year]');
        var typeSelect = qs('[data-filter-type]');
        var regionSelect = qs('[data-filter-region]');

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function applyFilters() {
            var keyword = normalize(searchInput && searchInput.value);
            var year = normalize(yearSelect && yearSelect.value);
            var type = normalize(typeSelect && typeSelect.value);
            var region = normalize(regionSelect && regionSelect.value);
            var visibleCount = 0;

            cards.forEach(function (card) {
                var text = normalize([
                    card.dataset.title,
                    card.dataset.genre,
                    card.dataset.tags,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.year
                ].join(' '));

                var matched = true;

                if (keyword && text.indexOf(keyword) === -1) {
                    matched = false;
                }

                if (year && normalize(card.dataset.year) !== year) {
                    matched = false;
                }

                if (type && normalize(card.dataset.type) !== type) {
                    matched = false;
                }

                if (region && normalize(card.dataset.region) !== region) {
                    matched = false;
                }

                card.style.display = matched ? '' : 'none';

                if (matched) {
                    visibleCount += 1;
                }
            });

            if (emptyState) {
                emptyState.style.display = visibleCount ? 'none' : 'block';
            }
        }

        filterForm.addEventListener('input', applyFilters);
        filterForm.addEventListener('change', applyFilters);

        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q && searchInput) {
            searchInput.value = q;
        }
        applyFilters();
    }
})();
