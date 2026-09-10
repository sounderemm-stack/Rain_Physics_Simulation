const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
uniform sampler2D uStreet;
uniform sampler2D uHeight;
uniform vec2 uTexel;
uniform float uDisplace;
uniform float uSpec;
uniform int uMode;
varying vec2 vUv;

vec2 toGround(vec2 uv) {
  float gz = clamp(uv.y / 0.88, 0.0, 1.0);
  gz = pow(gz, 0.85);
  float persp = mix(1.02, 0.36, gz);
  float gx = 0.5 + (uv.x - 0.5) / max(persp, 0.2);
  return vec2(gx, gz);
}

float sampleH(vec2 g) {
  if (g.x < 0.0 || g.x > 1.0 || g.y < 0.0 || g.y > 1.0) return 0.0;
  float encoded = texture2D(uHeight, g).r;
  return (encoded - 0.5) * 0.284;
}

void main() {
  vec2 uv = vUv;
  vec2 g = toGround(uv);
  float h = sampleH(g);
  float hx = sampleH(g + vec2(uTexel.x, 0.0)) - sampleH(g - vec2(uTexel.x, 0.0));
  float hy = sampleH(g + vec2(0.0, uTexel.y)) - sampleH(g - vec2(0.0, uTexel.y));
  vec3 n = normalize(vec3(-hx * 18.0, -hy * 18.0, 1.0));

  vec2 duv = n.xy * uDisplace * (0.45 + 0.7 * (1.0 - g.y));
  vec2 suv = vec2(uv.x + duv.x, 1.0 - uv.y - duv.y);
  suv = clamp(suv, 0.0, 1.0);
  vec3 street = texture2D(uStreet, suv).rgb;

  if (uMode == 1) {
    float t = h * 6.0 + 0.5;
    vec3 lo = vec3(0.03, 0.05, 0.12);
    vec3 mid = vec3(0.15, 0.55, 0.72);
    vec3 hi = vec3(0.92, 0.9, 0.82);
    vec3 col = mix(lo, mid, clamp(t * 2.0, 0.0, 1.0));
    col = mix(col, hi, clamp(t * 2.0 - 1.0, 0.0, 1.0));
    gl_FragColor = vec4(col, 1.0);
    return;
  }

  vec3 l1 = normalize(vec3(0.45, 0.72, 0.52));
  vec3 l2 = normalize(vec3(-0.55, 0.4, 0.4));
  float spec1 = pow(max(dot(n, l1), 0.0), 48.0);
  float spec2 = pow(max(dot(n, l2), 0.0), 28.0);
  vec3 neon = mix(vec3(0.35, 0.55, 1.0), vec3(1.0, 0.38, 0.62), clamp(uv.x * 1.1, 0.0, 1.0));
  vec3 amber = vec3(1.0, 0.62, 0.28);
  vec3 add = neon * spec1 * uSpec + amber * spec2 * uSpec * 0.55;
  float wet = 1.0 + abs(h) * 1.4;
  vec3 color = street * wet + add;
  if (uMode == 2) {
    color = street * 0.55 + add * 1.4;
    color += vec3(0.1, 0.55, 0.7) * abs(h) * 3.5;
  }
  gl_FragColor = vec4(color, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("shader");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(log || "compile");
  }
  return sh;
}

export class StreetRenderer {
  readonly gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private streetTex: WebGLTexture;
  private heightTex: WebGLTexture;
  private loc: {
    street: WebGLUniformLocation | null;
    height: WebGLUniformLocation | null;
    texel: WebGLUniformLocation | null;
    displace: WebGLUniformLocation | null;
    spec: WebGLUniformLocation | null;
    mode: WebGLUniformLocation | null;
  };
  private cols = 192;
  private rows = 128;
  ready = false;

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    if (!gl) throw new Error("WebGL unavailable");
    this.gl = gl;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!prog) throw new Error("program");
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "aPos");
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog) || "link");
    }
    this.program = prog;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    this.streetTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.streetTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGB,
      1,
      1,
      0,
      gl.RGB,
      gl.UNSIGNED_BYTE,
      new Uint8Array([7, 8, 12]),
    );

    this.heightTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.heightTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.loc = {
      street: gl.getUniformLocation(prog, "uStreet"),
      height: gl.getUniformLocation(prog, "uHeight"),
      texel: gl.getUniformLocation(prog, "uTexel"),
      displace: gl.getUniformLocation(prog, "uDisplace"),
      spec: gl.getUniformLocation(prog, "uSpec"),
      mode: gl.getUniformLocation(prog, "uMode"),
    };

    this.loadStreet();
  }

  private loadStreet() {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const gl = this.gl;
      gl.bindTexture(gl.TEXTURE_2D, this.streetTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      this.ready = true;
    };
    img.src = "/street.jpg";
  }

  resize(width: number, height: number, dpr: number) {
    const gl = this.gl;
    const w = Math.max(1, Math.floor(width * dpr));
    const h = Math.max(1, Math.floor(height * dpr));
    if (gl.canvas.width !== w || gl.canvas.height !== h) {
      gl.canvas.width = w;
      gl.canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
  }

  draw(
    heightBytes: Uint8Array,
    cols: number,
    rows: number,
    mode: number,
    displace: number,
    spec: number,
  ) {
    const gl = this.gl;
    this.cols = cols;
    this.rows = rows;
    gl.bindTexture(gl.TEXTURE_2D, this.heightTex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      cols,
      rows,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      heightBytes,
    );

    gl.useProgram(this.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.streetTex);
    gl.uniform1i(this.loc.street, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.heightTex);
    gl.uniform1i(this.loc.height, 1);
    gl.uniform2f(this.loc.texel, 1 / cols, 1 / rows);
    gl.uniform1f(this.loc.displace, displace);
    gl.uniform1f(this.loc.spec, spec);
    gl.uniform1i(this.loc.mode, mode);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  destroy() {
    const gl = this.gl;
    gl.deleteTexture(this.streetTex);
    gl.deleteTexture(this.heightTex);
    gl.deleteProgram(this.program);
  }
}
