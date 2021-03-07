async function main(argv) {
    // This is the default public token. So do not be angry and open issues.
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW5keXB5dGhvbmFwcGRldmVsb3BlciIsImEiOiJja2x5cXJ5ZWgxamM0MnZuNnNrZmh3MmpzIn0.kBiHFpLBNbxite7fpdoWNw';

    let map = (window.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [argv.get("lat"), argv.get("lng")],
        zoom: 18,
    }));

    // Define vertices of the triangle to be rendered in the custom style layer
    var c1;
    var c2;
    var c3;
    var c4;

    map.on("click", (e) => {
        if (c1 == undefined) {
            c1 = mapboxgl.MercatorCoordinate.fromLngLat({
                lng: e.lngLat.lng,
                lat: e.lngLat.lat
            });
        } else if (c2 == undefined) {
            c2 = mapboxgl.MercatorCoordinate.fromLngLat({
                lng: e.lngLat.lng,
                lat: e.lngLat.lat
            });
        } else if (c3 == undefined) {
            c3 = mapboxgl.MercatorCoordinate.fromLngLat({
                lng: e.lngLat.lng,
                lat: e.lngLat.lat
            });
        } else if (c4 == undefined) {
            c4 = mapboxgl.MercatorCoordinate.fromLngLat({
                lng: e.lngLat.lng,
                lat: e.lngLat.lat
            });
        }
    });

    var highlightLayer = {
        id: "highlight",
        type: "custom",

        onAdd: function (_, gl) {

            // Create GLSL source for vertex shader
            var vertexSource =
                '' +
                'uniform mat4 u_matrix;' +
                'attribute vec2 a_pos;' +
                'void main() {' +
                '    gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);' +
                '}';

            // Create GLSL source for fragment shader
            var fragmentSource =
                '' +
                'void main() {' +
                '    gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);' +
                '}';

            // Create a vertex shader
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, vertexSource);
            gl.compileShader(vertexShader);

            // create a fragment shader
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, fragmentSource);
            gl.compileShader(fragmentShader);

            // link the two shaders into a WebGL program
            program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            aPos = gl.getAttribLocation(program, 'a_pos');
        },

        // Method fired on each animation frame
        // https://docs.mapbox.com/mapbox-gl-js/api/#map.event:render
        render: function (gl, matrix) {
            console.log(c1, c2, c3, c4);

            // Create and initialize a WebGLBuffer to store vertex and color data
            buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array([
                    c1.x,
                    c1.y,
                    c2.x,
                    c2.y,
                    c3.x,
                    c3.y,
                    c4.x,
                    c4.y
                ]),
                gl.STATIC_DRAW
            );

            gl.useProgram(program);
            gl.uniformMatrix4fv(
                gl.getUniformLocation(program, 'u_matrix'),
                false,
                matrix
            );
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.enableVertexAttribArray(aPos);
            gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    };

    // Add the custom style layer to the map.
    map.on("load", () => {
        map.addLayer(highlightLayer);
    });
}

let args = new URLSearchParams(window.location.search);
main(args);