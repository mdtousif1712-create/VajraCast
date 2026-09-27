const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'Reports.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/text-white/g, 'text-black');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Replaced all text-white with text-black in Reports.tsx');
