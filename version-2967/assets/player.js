(function () {
  var video = document.querySelector('[data-player-video]');
  var trigger = document.querySelector('[data-player-trigger]');
  var configNode = document.getElementById('player-config');

  if (!video || !trigger || !configNode) {
    return;
  }

  var config = JSON.parse(configNode.textContent || '{}');
  var src = config.src;
  var hlsInstance = null;

  function attachPlayer() {
    if (!src) {
      return;
    }

    if (video.getAttribute('data-loaded') !== 'true') {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
      } else {
        video.src = src;
      }

      video.setAttribute('data-loaded', 'true');
    }

    trigger.classList.add('is-hidden');
    video.setAttribute('controls', 'controls');
    var playAction = video.play();

    if (playAction && typeof playAction.catch === 'function') {
      playAction.catch(function () {});
    }
  }

  trigger.addEventListener('click', attachPlayer);

  Array.prototype.slice.call(document.querySelectorAll('[data-jump-play]')).forEach(function (button) {
    button.addEventListener('click', function () {
      window.setTimeout(attachPlayer, 260);
    });
  });

  video.addEventListener('click', function () {
    if (video.getAttribute('data-loaded') !== 'true') {
      attachPlayer();
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
