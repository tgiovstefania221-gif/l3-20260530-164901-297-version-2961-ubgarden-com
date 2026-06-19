(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-site-nav]");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        nav.classList.toggle("is-open");
      });
    }

    var slider = document.querySelector("[data-hero-slider]");
    if (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dots button"));
      var prev = slider.querySelector("[data-hero-prev]");
      var next = slider.querySelector("[data-hero-next]");
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === index);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5000);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          start();
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          start();
        });
      }
      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          show(dotIndex);
          start();
        });
      });
      slider.addEventListener("mouseenter", stop);
      slider.addEventListener("mouseleave", start);
      show(0);
      start();
    }

    var filterRoot = document.querySelector("[data-filter-root]");
    if (filterRoot) {
      var input = filterRoot.querySelector("[data-filter-input]");
      var selects = Array.prototype.slice.call(filterRoot.querySelectorAll("[data-filter-select]"));
      var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
      var emptyTip = document.querySelector("[data-empty-tip]");

      function valueOf(name) {
        var select = selects.find(function (item) {
          return item.name === name;
        });
        return select ? select.value : "";
      }

      function applyFilter() {
        var keyword = input ? input.value.trim().toLowerCase() : "";
        var year = valueOf("year");
        var region = valueOf("region");
        var type = valueOf("type");
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.dataset.title,
            card.dataset.region,
            card.dataset.type,
            card.dataset.year,
            card.dataset.genre
          ].join(" ").toLowerCase();
          var matched = true;

          if (keyword && haystack.indexOf(keyword) === -1) {
            matched = false;
          }
          if (year && card.dataset.year !== year) {
            matched = false;
          }
          if (region && card.dataset.region !== region) {
            matched = false;
          }
          if (type && card.dataset.type !== type) {
            matched = false;
          }

          card.classList.toggle("is-filtered-out", !matched);
          if (matched) {
            visible += 1;
          }
        });

        if (emptyTip) {
          emptyTip.classList.toggle("is-visible", visible === 0);
        }
      }

      if (input) {
        input.addEventListener("input", applyFilter);
      }
      selects.forEach(function (select) {
        select.addEventListener("change", applyFilter);
      });
      applyFilter();
    }
  });
})();
