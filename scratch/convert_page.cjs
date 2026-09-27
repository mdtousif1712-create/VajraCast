const fs = require('fs');

const htmlContent = fs.readFileSync('extracted_page1/code.html', 'utf8');

// 1. Extract CSS
const styleMatch = htmlContent.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
if (styleMatch) {
    const css = styleMatch[1].replace(/body\s*{[^}]*}/, ''); // Remove body styles to not mess up global
    fs.appendFileSync('src/index.css', '\n/* Home Page Styles */\n' + css);
}

// 2. Extract Body Content
const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let bodyHtml = bodyMatch ? bodyMatch[1] : '';

// Remove <svg aria-hidden="true" class="inline-defs-container"...
bodyHtml = bodyHtml.replace(/<svg aria-hidden="true" class="inline-defs-container"[\s\S]*?<\/svg>/i, '');

// Remove script tags if any
bodyHtml = bodyHtml.replace(/<script[\s\S]*?<\/script>/gi, '');

// Convert HTML to JSX
// class -> className
let jsx = bodyHtml.replace(/class=/g, 'className=');

// Fix self-closing tags
jsx = jsx.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
jsx = jsx.replace(/<input([^>]*[^\/])>/g, '<input$1 />');
jsx = jsx.replace(/<hr([^>]*[^\/])>/g, '<hr$1 />');
jsx = jsx.replace(/<br([^>]*[^\/])>/g, '<br$1 />');
jsx = jsx.replace(/<meta([^>]*[^\/])>/g, '<meta$1 />');

// Fix SVG attributes (kebab-case to camelCase)
const svgAttrs = [
    'stroke-linecap', 'stroke-width', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset', 
    'fill-rule', 'clip-rule', 'stroke-opacity', 'fill-opacity', 'stop-color', 'stop-opacity'
];

svgAttrs.forEach(attr => {
    const camel = attr.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    const regex = new RegExp(attr + '=', 'gi');
    jsx = jsx.replace(regex, camel + '=');
});

// Remove html comments
jsx = jsx.replace(/<!--[\s\S]*?-->/g, '');

const componentCode = `import React from 'react';

export function Home() {
  return (
    <div className="w-full h-full min-h-screen bg-[#0d1e22] text-slate-100 flex items-center justify-center font-['Plus_Jakarta_Sans'] p-4 md:p-8">
      ${jsx}
    </div>
  );
}
`;

fs.writeFileSync('src/pages/Home.tsx', componentCode);
console.log('Conversion successful!');
