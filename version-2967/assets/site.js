(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === currentSlide);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var index = Number(dot.getAttribute('data-hero-dot'));
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5800);
  }

  var input = document.querySelector('[data-search-input]');
  var yearFilter = document.querySelector('[data-year-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

  function filterCards() {
    var keyword = input ? input.value.trim().toLowerCase() : '';
    var year = yearFilter ? yearFilter.value : '';

    cards.forEach(function (card) {
      var text = [
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-type'),
        card.getAttribute('data-keywords')
      ].join(' ').toLowerCase();
      var cardYear = card.getAttribute('data-year') || '';
      var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
      var matchesYear = !year || cardYear.indexOf(year) !== -1;
      card.classList.toggle('is-hidden-card', !(matchesKeyword && matchesYear));
    });
  }

  if (input) {
    input.addEventListener('input', filterCards);
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (initialQuery) {
      input.value = initialQuery;
      filterCards();
    }
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', filterCards);
  }
})();
