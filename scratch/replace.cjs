const fs = require('fs');
let c = fs.readFileSync('src/pages/Analytics.tsx', 'utf8');
c = c.replace(/text-white\/(\d+)/g, 'text-black/$1');
c = c.replace(/text-white/g, 'text-black');
c = c.replace(/fill="#FFFFFF"/g, 'fill="#000000"');
c = c.replace(/stroke="#FFFFFF"/g, 'stroke="#000000"');
c = c.replace(/flood-color="#FFFFFF"/g, 'flood-color="#000000"');
fs.writeFileSync('src/pages/Analytics.tsx', c);
