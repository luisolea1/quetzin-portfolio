// M05: ensanchamiento lateral de la demo, referido al centro del viewport.
export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  uniform vec2 uViewport;
  uniform float uBend;
  uniform float uEdgeStart;

  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    float screenY = 0.5 - world.y / uViewport.y;
    float edge = smoothstep(uEdgeStart, 1.0, screenY);
    world.x *= 1.0 + uBend * edge * edge;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uImage;
  uniform vec2 uUvScale;
  uniform vec2 uUvOffset;
  uniform vec2 uBoxSize;
  uniform float uRadius;

  void main() {
    vec2 imageUv = vUv * uUvScale + uUvOffset;
    vec2 halfSize = uBoxSize * 0.5;
    float radius = min(uRadius, min(halfSize.x, halfSize.y));
    vec2 q = abs((vUv - 0.5) * uBoxSize) - halfSize + radius;
    float distanceToEdge = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
    float mask = 1.0 - smoothstep(-0.75, 0.75, distanceToEdge);
    gl_FragColor = texture2D(uImage, imageUv);
    gl_FragColor.a *= mask;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
