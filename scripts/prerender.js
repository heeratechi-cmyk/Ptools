import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

const SITE_DOMAIN = 'https://pixeltools-tau.vercel.app';
const SITE_NAME = 'PixelTools';

const PAGES = [
  {
    path: '/',
    title: 'PixelTools – Free Online PDF, Image & Developer Utilities',
    description: 'Free online tools to convert and compress PDFs, edit images, and format code directly in your browser. Fast, private, no signup.'
  },
  {
    path: '/pdf-tools',
    title: 'Free PDF Tools – Merge, Compress & Convert PDF | PixelTools',
    description: 'Merge, split, compress, and convert PDF documents online for free. Secure browser-based processing with zero uploads.'
  },
  {
    path: '/image-tools',
    title: 'Free Image Tools – Compress, Resize & Convert | PixelTools',
    description: 'Compress, resize, crop, and convert JPG, PNG, and WebP images online for free without losing visual quality.'
  },
  {
    path: '/text-tools',
    title: 'Free Text Tools – Word Counter & Case Converter | PixelTools',
    description: 'Count words and characters, change letter cases, and clean text online. Fast, private text utilities.'
  },
  {
    path: '/developer-tools',
    title: 'Free Developer Tools – JSON, Base64 & Minifiers | PixelTools',
    description: 'Format and validate JSON, minify CSS/JS, and encode or decode Base64 and URLs directly in your browser.'
  },
  {
    path: '/calculator-tools',
    title: 'Free Online Calculators – Percentage & Math | PixelTools',
    description: 'Calculate percentages, discounts, and percentage increases or decreases quickly with free online calculators.'
  },
  {
    path: '/tools/text-to-pdf',
    title: 'Text to PDF Converter – Free Online Tool | PixelTools',
    description: 'Convert plain text and notes into cleanly formatted PDF documents online for free.'
  },
  {
    path: '/tools/image-to-pdf',
    title: 'Image to PDF Converter – JPG & PNG to PDF | PixelTools',
    description: 'Convert JPG, PNG, and image files into a single, high-quality PDF document for free.'
  },
  {
    path: '/tools/merge-pdf',
    title: 'Merge PDF – Combine Multiple PDFs Online | PixelTools',
    description: 'Combine multiple PDF files into one single document in seconds with 100% privacy.'
  },
  {
    path: '/tools/split-pdf',
    title: 'Split PDF – Extract Pages From PDF Online | PixelTools',
    description: 'Extract specific pages or split large PDF files into separate documents for free.'
  },
  {
    path: '/tools/compress-pdf',
    title: 'Compress PDF – Reduce PDF File Size Online | PixelTools',
    description: 'Reduce PDF file size quickly while preserving sharp text and image quality.'
  },
  {
    path: '/tools/pdf-watermark',
    title: 'PDF Watermark – Add Custom Watermarks | PixelTools',
    description: 'Add custom text watermarks to your PDF pages to protect and brand your documents.'
  },
  {
    path: '/tools/pdf-page-counter',
    title: 'PDF Page Counter – Count PDF Pages Online | PixelTools',
    description: 'Quickly count the exact number of pages and inspect metadata of any PDF file.'
  },
  {
    path: '/tools/image-compressor',
    title: 'Image Compressor – Compress JPG, PNG & WebP | PixelTools',
    description: 'Compress JPG, PNG, and WebP images to reduce file size without losing clarity.'
  },
  {
    path: '/tools/image-resizer',
    title: 'Image Resizer – Resize Images Online Free | PixelTools',
    description: 'Resize image dimensions by pixels or percentage easily in your browser.'
  },
  {
    path: '/tools/jpg-to-png',
    title: 'JPG to PNG Converter – Free Online Image Tool | PixelTools',
    description: 'Convert JPG and JPEG images to high-quality PNG format with transparent backgrounds.'
  },
  {
    path: '/tools/png-to-jpg',
    title: 'PNG to JPG Converter – Free Online Image Tool | PixelTools',
    description: 'Convert PNG images to compact JPG format with customizable compression quality.'
  },
  {
    path: '/tools/webp-converter',
    title: 'WebP Converter – Convert Images to WebP | PixelTools',
    description: 'Convert JPG and PNG images to modern, fast-loading WebP format in seconds.'
  },
  {
    path: '/tools/image-cropper',
    title: 'Image Cropper – Crop Photos Online Free | PixelTools',
    description: 'Crop and trim photos to custom dimensions or standard aspect ratios easily.'
  },
  {
    path: '/tools/word-counter',
    title: 'Word Counter – Real-Time Text Statistics | PixelTools',
    description: 'Count words, characters, sentences, paragraphs, and reading time in real time.'
  },
  {
    path: '/tools/case-converter',
    title: 'Case Converter – Change Text Case Online | PixelTools',
    description: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, or sentence case.'
  },
  {
    path: '/tools/json-formatter',
    title: 'JSON Formatter & Validator – Beautify JSON | PixelTools',
    description: 'Format, beautify, validate, and minify JSON data with instant syntax error highlighting.'
  },
  {
    path: '/tools/base64-encoder',
    title: 'Base64 Encoder & Decoder – Free Online | PixelTools',
    description: 'Encode text and files to Base64 or decode Base64 strings back to readable format.'
  },
  {
    path: '/tools/url-encoder',
    title: 'URL Encoder & Decoder – Percent Encoding | PixelTools',
    description: 'Safely encode URLs to percent-encoded format or decode encoded strings instantly.'
  },
  {
    path: '/tools/html-formatter',
    title: 'HTML Formatter – Beautify HTML Code Online | PixelTools',
    description: 'Beautify, indent, and format messy HTML code for clean and readable markup.'
  },
  {
    path: '/tools/css-minifier',
    title: 'CSS Minifier – Compress CSS Code Online | PixelTools',
    description: 'Minify and compress CSS stylesheets to boost page loading speeds and performance.'
  },
  {
    path: '/tools/js-minifier',
    title: 'JS Minifier – Compress JavaScript Online | PixelTools',
    description: 'Compress and minify JavaScript code to reduce bundle size and optimize scripts.'
  },
  {
    path: '/tools/percentage-calculator',
    title: 'Percentage Calculator – Fast Online Math | PixelTools',
    description: 'Calculate percentages, percentage change, markups, and discounts instantly.'
  },
  {
    path: '/about',
    title: 'About Us – Secure Browser Tools Mission | PixelTools',
    description: 'Learn about PixelTools, our commitment to 100% private client-side browser utilities.'
  },
  {
    path: '/contact',
    title: 'Contact Us – Support & Feedback | PixelTools',
    description: 'Contact the PixelTools support team for inquiries, bug reports, and tool suggestions.'
  },
  {
    path: '/privacy',
    title: 'Privacy Policy – Data Protection & Security | PixelTools',
    description: 'Read how PixelTools protects your privacy with 100% local, client-side processing.'
  },
  {
    path: '/terms',
    title: 'Terms of Service – Usage Guidelines | PixelTools',
    description: 'Read the terms of service and conditions for using PixelTools\' free web utilities.'
  },
  {
    path: '/disclaimer',
    title: 'Disclaimer – Usage & Content Accuracy | PixelTools',
    description: 'Legal disclaimer regarding PixelTools utilities, file processing, and accuracy.'
  }
];

function prerender() {
  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('dist/index.html not found! Run vite build first.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(templatePath, 'utf-8');

  console.log(`[SEO Prerender] Generating static HTML for ${PAGES.length} routes...`);

  for (const page of PAGES) {
    const pageCanonical = `${SITE_DOMAIN}${page.path === '/' ? '/' : page.path}`;
    
    let html = baseHtml;

    // Replace Title
    html = html.replace(/<title>.*?<\/title>/i, `<title>${page.title}</title>`);
    
    // Replace Meta Description
    html = html.replace(
      /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="description" content="${page.description}" />`
    );

    // Replace Canonical Link
    html = html.replace(
      /<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/i,
      `<link rel="canonical" href="${pageCanonical}" />`
    );

    // Replace OG Title
    html = html.replace(
      /<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:title" content="${page.title}" />`
    );

    // Replace OG Description
    html = html.replace(
      /<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:description" content="${page.description}" />`
    );

    // Replace OG URL
    html = html.replace(
      /<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:url" content="${pageCanonical}" />`
    );

    // Replace Twitter Title
    html = html.replace(
      /<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="twitter:title" content="${page.title}" />`
    );

    // Replace Twitter Description
    html = html.replace(
      /<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="twitter:description" content="${page.description}" />`
    );

    if (page.path === '/') {
      fs.writeFileSync(templatePath, html, 'utf-8');
      console.log(`  ✓ Written root: /index.html`);
    } else {
      const targetDir = path.join(distDir, page.path.replace(/^\//, ''));
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const targetFile = path.join(targetDir, 'index.html');
      fs.writeFileSync(targetFile, html, 'utf-8');
      console.log(`  ✓ Written ${page.path}/index.html`);
    }
  }

  console.log('[SEO Prerender] Completed successfully!');
}

prerender();
