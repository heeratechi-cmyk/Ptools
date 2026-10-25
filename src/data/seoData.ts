export interface PageSEO {
  path: string;
  title: string;
  description: string;
}

export const SITE_DOMAIN = 'https://pixeltools-tau.vercel.app';
export const SITE_NAME = 'PixelTools';

export const PAGE_SEO_REGISTRY: Record<string, PageSEO> = {
  // Home
  '/': {
    path: '/',
    title: 'PixelTools – Free Online PDF, Image & Developer Utilities',
    description: 'Free online tools to convert and compress PDFs, edit images, and format code directly in your browser. Fast, private, no signup.'
  },

  // Category Pages
  '/pdf-tools': {
    path: '/pdf-tools',
    title: 'Free PDF Tools – Merge, Compress & Convert PDF | PixelTools',
    description: 'Merge, split, compress, and convert PDF documents online for free. Secure browser-based processing with zero uploads.'
  },
  '/image-tools': {
    path: '/image-tools',
    title: 'Free Image Tools – Compress, Resize & Convert | PixelTools',
    description: 'Compress, resize, crop, and convert JPG, PNG, and WebP images online for free without losing visual quality.'
  },
  '/text-tools': {
    path: '/text-tools',
    title: 'Free Text Tools – Word Counter & Case Converter | PixelTools',
    description: 'Count words and characters, change letter cases, and clean text online. Fast, private text utilities.'
  },
  '/developer-tools': {
    path: '/developer-tools',
    title: 'Free Developer Tools – JSON, Base64 & Minifiers | PixelTools',
    description: 'Format and validate JSON, minify CSS/JS, and encode or decode Base64 and URLs directly in your browser.'
  },
  '/calculator-tools': {
    path: '/calculator-tools',
    title: 'Free Online Calculators – Percentage & Math | PixelTools',
    description: 'Calculate percentages, discounts, and percentage increases or decreases quickly with free online calculators.'
  },

  // PDF Tools
  '/tools/text-to-pdf': {
    path: '/tools/text-to-pdf',
    title: 'Text to PDF Converter – Free Online Tool | PixelTools',
    description: 'Convert plain text and notes into cleanly formatted PDF documents online for free.'
  },
  '/tools/image-to-pdf': {
    path: '/tools/image-to-pdf',
    title: 'Image to PDF Converter – JPG & PNG to PDF | PixelTools',
    description: 'Convert JPG, PNG, and image files into a single, high-quality PDF document for free.'
  },
  '/tools/merge-pdf': {
    path: '/tools/merge-pdf',
    title: 'Merge PDF – Combine Multiple PDFs Online | PixelTools',
    description: 'Combine multiple PDF files into one single document in seconds with 100% privacy.'
  },
  '/tools/split-pdf': {
    path: '/tools/split-pdf',
    title: 'Split PDF – Extract Pages From PDF Online | PixelTools',
    description: 'Extract specific pages or split large PDF files into separate documents for free.'
  },
  '/tools/compress-pdf': {
    path: '/tools/compress-pdf',
    title: 'Compress PDF – Reduce PDF File Size Online | PixelTools',
    description: 'Reduce PDF file size quickly while preserving sharp text and image quality.'
  },
  '/tools/pdf-watermark': {
    path: '/tools/pdf-watermark',
    title: 'PDF Watermark – Add Custom Watermarks | PixelTools',
    description: 'Add custom text watermarks to your PDF pages to protect and brand your documents.'
  },
  '/tools/pdf-page-counter': {
    path: '/tools/pdf-page-counter',
    title: 'PDF Page Counter – Count PDF Pages Online | PixelTools',
    description: 'Quickly count the exact number of pages and inspect metadata of any PDF file.'
  },

  // Image Tools
  '/tools/image-compressor': {
    path: '/tools/image-compressor',
    title: 'Image Compressor – Compress JPG, PNG & WebP | PixelTools',
    description: 'Compress JPG, PNG, and WebP images to reduce file size without losing clarity.'
  },
  '/tools/image-resizer': {
    path: '/tools/image-resizer',
    title: 'Image Resizer – Resize Images Online Free | PixelTools',
    description: 'Resize image dimensions by pixels or percentage easily in your browser.'
  },
  '/tools/jpg-to-png': {
    path: '/tools/jpg-to-png',
    title: 'JPG to PNG Converter – Free Online Image Tool | PixelTools',
    description: 'Convert JPG and JPEG images to high-quality PNG format with transparent backgrounds.'
  },
  '/tools/png-to-jpg': {
    path: '/tools/png-to-jpg',
    title: 'PNG to JPG Converter – Free Online Image Tool | PixelTools',
    description: 'Convert PNG images to compact JPG format with customizable compression quality.'
  },
  '/tools/webp-converter': {
    path: '/tools/webp-converter',
    title: 'WebP Converter – Convert Images to WebP | PixelTools',
    description: 'Convert JPG and PNG images to modern, fast-loading WebP format in seconds.'
  },
  '/tools/image-cropper': {
    path: '/tools/image-cropper',
    title: 'Image Cropper – Crop Photos Online Free | PixelTools',
    description: 'Crop and trim photos to custom dimensions or standard aspect ratios easily.'
  },

  // Text Tools
  '/tools/word-counter': {
    path: '/tools/word-counter',
    title: 'Word Counter – Real-Time Text Statistics | PixelTools',
    description: 'Count words, characters, sentences, paragraphs, and reading time in real time.'
  },
  '/tools/case-converter': {
    path: '/tools/case-converter',
    title: 'Case Converter – Change Text Case Online | PixelTools',
    description: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, or sentence case.'
  },

  // Developer Tools
  '/tools/json-formatter': {
    path: '/tools/json-formatter',
    title: 'JSON Formatter & Validator – Beautify JSON | PixelTools',
    description: 'Format, beautify, validate, and minify JSON data with instant syntax error highlighting.'
  },
  '/tools/base64-encoder': {
    path: '/tools/base64-encoder',
    title: 'Base64 Encoder & Decoder – Free Online | PixelTools',
    description: 'Encode text and files to Base64 or decode Base64 strings back to readable format.'
  },
  '/tools/url-encoder': {
    path: '/tools/url-encoder',
    title: 'URL Encoder & Decoder – Percent Encoding | PixelTools',
    description: 'Safely encode URLs to percent-encoded format or decode encoded strings instantly.'
  },
  '/tools/html-formatter': {
    path: '/tools/html-formatter',
    title: 'HTML Formatter – Beautify HTML Code Online | PixelTools',
    description: 'Beautify, indent, and format messy HTML code for clean and readable markup.'
  },
  '/tools/css-minifier': {
    path: '/tools/css-minifier',
    title: 'CSS Minifier – Compress CSS Code Online | PixelTools',
    description: 'Minify and compress CSS stylesheets to boost page loading speeds and performance.'
  },
  '/tools/js-minifier': {
    path: '/tools/js-minifier',
    title: 'JS Minifier – Compress JavaScript Online | PixelTools',
    description: 'Compress and minify JavaScript code to reduce bundle size and optimize scripts.'
  },

  // Calculator Tools
  '/tools/percentage-calculator': {
    path: '/tools/percentage-calculator',
    title: 'Percentage Calculator – Fast Online Math | PixelTools',
    description: 'Calculate percentages, percentage change, markups, and discounts instantly.'
  },

  // Company & Legal Pages
  '/about': {
    path: '/about',
    title: 'About Us – Secure Browser Tools Mission | PixelTools',
    description: 'Learn about PixelTools, our commitment to 100% private client-side browser utilities.'
  },
  '/contact': {
    path: '/contact',
    title: 'Contact Us – Support & Feedback | PixelTools',
    description: 'Contact the PixelTools support team for inquiries, bug reports, and tool suggestions.'
  },
  '/privacy': {
    path: '/privacy',
    title: 'Privacy Policy – Data Protection & Security | PixelTools',
    description: 'Read how PixelTools protects your privacy with 100% local, client-side processing.'
  },
  '/terms': {
    path: '/terms',
    title: 'Terms of Service – Usage Guidelines | PixelTools',
    description: 'Read the terms of service and conditions for using PixelTools\' free web utilities.'
  },
  '/disclaimer': {
    path: '/disclaimer',
    title: 'Disclaimer – Usage & Content Accuracy | PixelTools',
    description: 'Legal disclaimer regarding PixelTools utilities, file processing, and accuracy.'
  }
};

export function getSEOForPath(pathname: string): PageSEO {
  const normalized = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  return (
    PAGE_SEO_REGISTRY[normalized] || {
      path: normalized,
      title: 'PixelTools – Free Online PDF & Image Tools',
      description: 'Free, fast, and secure online browser utilities for PDF, image, text, and code editing.'
    }
  );
}
