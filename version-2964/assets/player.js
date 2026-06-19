(function () {
    function initializePlayer(wrapper) {
        var video = wrapper.querySelector('video[data-src]');
        var overlay = wrapper.querySelector('[data-play-overlay]');

        if (!video) {
            return;
        }

        var source = video.getAttribute('data-src');

        function start() {
            if (overlay) {
                overlay.style.display = 'none';
            }

            if (video.dataset.loaded !== 'true') {
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = source;
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: false
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                } else {
                    video.src = source;
                }

                video.dataset.loaded = 'true';
            }

            var playPromise = video.play();
            if (playPromise && playPromise.catch) {
                playPromise.catch(function () {
                    video.controls = true;
                });
            }
        }

        if (overlay) {
            overlay.addEventListener('click', start);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
    }

    document.querySelectorAll('[data-player]').forEach(initializePlayer);
})();
