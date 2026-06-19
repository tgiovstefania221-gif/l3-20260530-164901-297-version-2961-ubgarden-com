(function () {
  function loadScript(src, callback) {
    var existing = document.querySelector('script[src="' + src + '"]');
    if (existing) {
      existing.addEventListener("load", callback, { once: true });
      if (window.Hls) {
        callback();
      }
      return;
    }

    var script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = callback;
    script.onerror = function () {
      callback(new Error("hls-load-failed"));
    };
    document.head.appendChild(script);
  }

  function playVideo(video, src, button) {
    function startNative() {
      video.src = src;
      video.play().catch(function () {});
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      startNative();
      return;
    }

    function attachWithHls(error) {
      if (!error && window.Hls && window.Hls.isSupported()) {
        if (window.__activeHlsPlayer) {
          window.__activeHlsPlayer.destroy();
        }
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        window.__activeHlsPlayer = hls;
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
        hls.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
          }
        });
      } else {
        startNative();
      }
    }

    if (window.Hls) {
      attachWithHls();
    } else {
      loadScript("https://cdn.jsdelivr.net/npm/hls.js@1.6.15/dist/hls.min.js", attachWithHls);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var video = document.querySelector("#moviePlayer");
    var button = document.querySelector("[data-player-button]");
    if (!video || !button) {
      return;
    }

    button.addEventListener("click", function () {
      var src = button.getAttribute("data-src");
      if (!src) {
        return;
      }
      button.classList.add("is-hidden");
      playVideo(video, src, button);
    });
  });
})();
