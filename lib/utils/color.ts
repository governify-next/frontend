// oklch to ensure color consistency with current colors in theme
const oklchToLinearRgb = (l: number, c: number, h: number) => {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const lms = [
    l + 0.3963377774 * a + 0.2158037573 * b,
    l - 0.1055613458 * a - 0.0638541728 * b,
    l - 0.0894841775 * a - 1.291485548 * b,
  ].map((v) => v ** 3);

  return [
    4.0767416621 * lms[0] - 3.3077115913 * lms[1] + 0.2309699292 * lms[2],
    -1.2684380046 * lms[0] + 2.6097574011 * lms[1] - 0.3413193965 * lms[2],
    -0.0041960863 * lms[0] - 0.7034186147 * lms[1] + 1.707614701 * lms[2],
  ];
};

export const HEX_COLOR = /^#[0-9a-f]{6}$/;

export const randomColor = (hue = Math.random() * 360) => {
  const lightness = 0.62 + Math.random() * 0.1;
  let chroma = 0.13 + Math.random() * 0.06;
  let rgb = oklchToLinearRgb(lightness, chroma, hue);

  while (rgb.some((v) => v < 0 || v > 1)) {
    chroma -= 0.005;
    rgb = oklchToLinearRgb(lightness, chroma, hue);
  }

  return `#${rgb
    .map((v) => {
      const srgb = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
      return Math.round(srgb * 255)
        .toString(16)
        .padStart(2, "0");
    })
    .join("")}`;
};
