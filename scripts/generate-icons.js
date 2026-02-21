import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create icons directory
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icon
const generateSVGIcon = (size) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  
  <!-- Car icon -->
  <g transform="translate(${size * 0.2}, ${size * 0.35})">
    <!-- Car body -->
    <path d="M ${size * 0.1} ${size * 0.15} L ${size * 0.15} ${size * 0.05} L ${size * 0.45} ${size * 0.05} L ${size * 0.5} ${size * 0.15} L ${size * 0.55} ${size * 0.15} C ${size * 0.58} ${size * 0.15} ${size * 0.6} ${size * 0.17} ${size * 0.6} ${size * 0.2} L ${size * 0.6} ${size * 0.25} C ${size * 0.6} ${size * 0.28} ${size * 0.58} ${size * 0.3} ${size * 0.55} ${size * 0.3} L ${size * 0.05} ${size * 0.3} C ${size * 0.02} ${size * 0.3} 0 ${size * 0.28} 0 ${size * 0.25} L 0 ${size * 0.2} C 0 ${size * 0.17} ${size * 0.02} ${size * 0.15} ${size * 0.05} ${size * 0.15} Z" 
          fill="white" stroke="white" stroke-width="${size * 0.01}"/>
    
    <!-- Windows -->
    <rect x="${size * 0.17}" y="${size * 0.08}" width="${size * 0.12}" height="${size * 0.06}" rx="${size * 0.01}" fill="url(#grad)" opacity="0.7"/>
    <rect x="${size * 0.31}" y="${size * 0.08}" width="${size * 0.12}" height="${size * 0.06}" rx="${size * 0.01}" fill="url(#grad)" opacity="0.7"/>
    
    <!-- Wheels -->
    <circle cx="${size * 0.12}" cy="${size * 0.3}" r="${size * 0.04}" fill="white"/>
    <circle cx="${size * 0.12}" cy="${size * 0.3}" r="${size * 0.025}" fill="url(#grad)"/>
    <circle cx="${size * 0.48}" cy="${size * 0.3}" r="${size * 0.04}" fill="white"/>
    <circle cx="${size * 0.48}" cy="${size * 0.3}" r="${size * 0.025}" fill="url(#grad)"/>
  </g>
  
  <!-- AI sparkle -->
  <g transform="translate(${size * 0.7}, ${size * 0.25})">
    <path d="M 0 ${-size * 0.06} L ${size * 0.015} ${-size * 0.015} L ${size * 0.06} 0 L ${size * 0.015} ${size * 0.015} L 0 ${size * 0.06} L ${-size * 0.015} ${size * 0.015} L ${-size * 0.06} 0 L ${-size * 0.015} ${-size * 0.015} Z" 
          fill="white" opacity="0.9"/>
  </g>
  <g transform="translate(${size * 0.75}, ${size * 0.35})">
    <path d="M 0 ${-size * 0.04} L ${size * 0.01} ${-size * 0.01} L ${size * 0.04} 0 L ${size * 0.01} ${size * 0.01} L 0 ${size * 0.04} L ${-size * 0.01} ${size * 0.01} L ${-size * 0.04} 0 L ${-size * 0.01} ${-size * 0.01} Z" 
          fill="white" opacity="0.7"/>
  </g>
</svg>`;
};

// Generate PNG from SVG (simplified - in production use sharp or canvas)
const generatePNGIcon = async (size) => {
  const svg = generateSVGIcon(size);
  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svg);
  
  // For actual PNG generation, you'd use a library like sharp:
  // const sharp = require('sharp');
  // await sharp(Buffer.from(svg))
  //   .resize(size, size)
  //   .png()
  //   .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
  
  // For now, we'll create a placeholder that references the SVG
  console.log(`✓ Generated SVG icon: ${size}x${size}`);
  
  // Create a simple PNG placeholder (in production, use proper image generation)
  const pngPlaceholder = `<!-- PNG placeholder for ${size}x${size} - Use the SVG or generate with sharp -->`;
  fs.writeFileSync(
    path.join(iconsDir, `icon-${size}x${size}.png.placeholder`),
    pngPlaceholder
  );
};

// Generate icons
const sizes = [192, 512];

console.log('🎨 Generating PWA icons...\n');

sizes.forEach(size => {
  generatePNGIcon(size);
});

console.log('\n✨ Icon generation complete!');
console.log('\n📝 Note: SVG icons have been generated.');
console.log('   For production, install sharp and uncomment PNG generation:');
console.log('   npm install -D sharp');
console.log('\n   Or use an online tool to convert SVG to PNG:');
console.log('   - https://cloudconvert.com/svg-to-png');
console.log('   - https://svgtopng.com/');
