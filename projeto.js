var tracker;
        var rhiRed, ghiRed, bhiRed;
        var rloRed, gloRed, bloRed;
        var rhiBlue, ghiBlue, bhiBlue;
        var rloBlue, gloBlue, bloBlue;

        function setTargetRed(r, g, b, range) {
            range = range || 100;
            rhiRed = r + range, rloRed = r - range;
            ghiRed = g + range, gloRed = g - range;
            bhiRed = b + range, bloRed = b - range;
        }

        function setTargetBlue(r, g, b, range) {
            range = range || 100;
            rhiBlue = r + range, rloBlue = r - range;
            ghiBlue = g + range, gloBlue = g - range;
            bhiBlue = b + range, bloBlue = b - range;
        }

        function setup() {
            var capture = createCapture({
                audio: false,
                video: {
                    width: 640,
                    height: 480
                }
            }, function() {
                console.log('capture ready.')
            });

            capture.id('p5video');
            capture.hide();

            setTargetRed(255, 0, 0); // Define a cor vermelha
            setTargetBlue(0, 0, 255); // Define a cor azul

            tracking.ColorTracker.registerColor('red', function(r, g, b) {
                return (r <= rhiRed && r >= rloRed &&
                        g <= ghiRed && g >= gloRed &&
                        b <= bhiRed && b >= bloRed);
            });

            tracking.ColorTracker.registerColor('blue', function(r, g, b) {
                return (r <= rhiBlue && r >= rloBlue &&
                        g <= ghiBlue && g >= gloBlue &&
                        b <= bhiBlue && b >= bloBlue);
            });

            tracker = new tracking.ColorTracker(['red', 'blue']);
            tracker.minDimension = 10;

            tracking.track('#p5video', tracker, { camera: true });

            tracker.on('track', function(event) {
                var canvas = document.getElementById('myCanvas');
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                event.data.forEach(function(rect) {
                    ctx.strokeStyle = rect.color;
                    ctx.lineWidth = 4;
                    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

                    // Define a posição do texto fora do retângulo, à esquerda e acima
                    var textX = rect.x - 50;
                    var textY = rect.y - 16;

                    // Escreve o nome da cor fora do retângulo, à esquerda e acima
                    ctx.font = "16px Arial";
                    ctx.fillStyle = rect.color === 'red' ? 'red' : 'blue';
                    ctx.fillText(rect.color.toUpperCase(), textX, textY);
                });
            });
        }