// AI Color Detection using Canvas API
// Analyzes image and returns dominant color name + hex code

const COLOR_MAP = [
  { name: 'Red', hex: '#E50010', rgb: [229, 0, 16] },
  { name: 'Dark Red', hex: '#8B0000', rgb: [139, 0, 0] },
  { name: 'Pink', hex: '#FF69B4', rgb: [255, 105, 180] },
  { name: 'Orange', hex: '#FF6600', rgb: [255, 102, 0] },
  { name: 'Yellow', hex: '#FFD700', rgb: [255, 215, 0] },
  { name: 'Green', hex: '#228B22', rgb: [34, 139, 34] },
  { name: 'Olive', hex: '#808000', rgb: [128, 128, 0] },
  { name: 'Teal', hex: '#008080', rgb: [0, 128, 128] },
  { name: 'Blue', hex: '#0000FF', rgb: [0, 0, 255] },
  { name: 'Navy', hex: '#000080', rgb: [0, 0, 128] },
  { name: 'Sky Blue', hex: '#87CEEB', rgb: [135, 206, 235] },
  { name: 'Purple', hex: '#800080', rgb: [128, 0, 128] },
  { name: 'Lavender', hex: '#E6E6FA', rgb: [230, 230, 250] },
  { name: 'Brown', hex: '#3D1F0D', rgb: [61, 31, 13] },
  { name: 'Tan', hex: '#D2B48C', rgb: [210, 180, 140] },
  { name: 'Beige', hex: '#F5F5DC', rgb: [245, 245, 220] },
  { name: 'White', hex: '#FFFFFF', rgb: [255, 255, 255] },
  { name: 'Light Grey', hex: '#D3D3D3', rgb: [211, 211, 211] },
  { name: 'Grey', hex: '#808080', rgb: [128, 128, 128] },
  { name: 'Dark Grey', hex: '#404040', rgb: [64, 64, 64] },
  { name: 'Black', hex: '#1a1a1a', rgb: [26, 26, 26] },
  { name: 'Maroon', hex: '#800000', rgb: [128, 0, 0] },
  { name: 'Coral', hex: '#FF7F50', rgb: [255, 127, 80] },
  { name: 'Mint', hex: '#98FF98', rgb: [152, 255, 152] },
  { name: 'Cream', hex: '#FFFDD0', rgb: [255, 253, 208] },
];

function colorDistance(rgb1, rgb2) {
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
    Math.pow(rgb1[1] - rgb2[1], 2) +
    Math.pow(rgb1[2] - rgb2[2], 2)
  );
}

function getClosestColorName(r, g, b) {
  let minDist = Infinity;
  let closest = COLOR_MAP[0];
  for (const color of COLOR_MAP) {
    const dist = colorDistance([r, g, b], color.rgb);
    if (dist < minDist) {
      minDist = dist;
      closest = color;
    }
  }
  return closest;
}

export function detectDominantColor(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 50; // sample size
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        // Sample pixels and find dominant color (skip near-white background)
        const colorCounts = {};
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
          if (a < 128) continue; // skip transparent
          // Skip near-white (background)
          if (r > 230 && g > 230 && b > 230) continue;
          // Skip near-black borders
          if (r < 20 && g < 20 && b < 20) continue;

          const color = getClosestColorName(r, g, b);
          colorCounts[color.name] = (colorCounts[color.name] || { count: 0, color }) ;
          colorCounts[color.name].count++;
        }

        // Find most frequent color
        let maxCount = 0;
        let dominant = COLOR_MAP[19]; // default grey
        for (const key in colorCounts) {
          if (colorCounts[key].count > maxCount) {
            maxCount = colorCounts[key].count;
            dominant = colorCounts[key].color;
          }
        }

        resolve({ name: dominant.name, hex: dominant.hex });
      } catch (e) {
        resolve({ name: 'Unknown', hex: '#808080' });
      }
    };
    img.onerror = () => resolve({ name: 'Unknown', hex: '#808080' });
    img.src = imageUrl;
  });
}
