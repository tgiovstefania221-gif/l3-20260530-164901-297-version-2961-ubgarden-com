(function() {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function setupMobileMenu() {
    var button = $(".mobile-menu-button");
    var panel = $(".mobile-panel");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function() {
      var open = panel.classList.toggle("open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function setupBackTop() {
    $all(".back-top").forEach(function(button) {
      button.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  function setupHeroSlider() {
    var slider = $(".hero-slider");
    if (!slider) {
      return;
    }
    var slides = $all(".hero-slide", slider);
    var dots = $all(".hero-dot", slider);
    if (slides.length <= 1) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function() {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function(dot) {
      dot.addEventListener("click", function() {
        show(Number(dot.getAttribute("data-slide")) || 0);
        start();
      });
    });

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    start();
  }

  function setupFilters() {
    var scope = $(".filter-scope");
    if (!scope) {
      return;
    }
    var cards = $all(".movie-card", scope);
    var input = $(".filter-input");
    var typeFilter = $(".type-filter");
    var yearFilter = $(".year-filter");
    var regionFilter = $(".region-filter");
    var empty = $(".empty-state");
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");

    if (query && input) {
      input.value = query;
    }

    function matches(card) {
      var text = normalize([
        card.getAttribute("data-title"),
        card.getAttribute("data-type"),
        card.getAttribute("data-year"),
        card.getAttribute("data-region"),
        card.getAttribute("data-category"),
        card.textContent
      ].join(" "));
      var queryValue = normalize(input && input.value);
      var typeValue = normalize(typeFilter && typeFilter.value);
      var yearValue = normalize(yearFilter && yearFilter.value);
      var regionValue = normalize(regionFilter && regionFilter.value);
      var cardType = normalize(card.getAttribute("data-type"));
      var cardYear = normalize(card.getAttribute("data-year"));
      var cardRegion = normalize(card.getAttribute("data-region"));

      return (!queryValue || text.indexOf(queryValue) !== -1) &&
        (!typeValue || cardType === typeValue) &&
        (!yearValue || cardYear === yearValue) &&
        (!regionValue || cardRegion === regionValue);
    }

    function apply() {
      var visible = 0;
      cards.forEach(function(card) {
        var ok = matches(card);
        card.classList.toggle("hidden", !ok);
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("show", visible === 0);
      }
    }

    [input, typeFilter, yearFilter, regionFilter].forEach(function(control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });

    apply();
  }

  window.bindMoviePlayer = function(source, videoId, overlayId) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    if (!video || !source) {
      return;
    }

    var loaded = false;
    var hls = null;

    function load() {
      if (loaded) {
        return;
      }
      loaded = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function play() {
      load();
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function() {});
      }
    }

    if (overlay) {
      overlay.addEventListener("click", play);
    }

    video.addEventListener("click", function() {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener("play", function() {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    });

    video.addEventListener("ended", function() {
      if (overlay) {
        overlay.classList.remove("is-hidden");
      }
    });

    window.addEventListener("beforeunload", function() {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  };

  document.addEventListener("DOMContentLoaded", function() {
    setupMobileMenu();
    setupBackTop();
    setupHeroSlider();
    setupFilters();
  });
})();
