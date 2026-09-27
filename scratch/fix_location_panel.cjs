const fs = require('fs');
const path = 'src/components/dashboard/LocationPanel.tsx';
let text = fs.readFileSync(path, 'utf8');

// Replace all occurrences of text-white with text-ink
text = text.replace(/text-white/g, 'text-ink');

fs.writeFileSync(path, text);
console.log('Fixed LocationPanel.tsx');
