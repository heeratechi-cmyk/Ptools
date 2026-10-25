import { 
  FileText, 
  Image as ImageIcon, 
  Code, 
  Type, 
  Calculator, 
  Merge, 
  Split, 
  Minimize2, 
  Maximize2, 
  FilePlus, 
  FileDigit,
  Type as TypeIcon,
  Search,
  Crop,
  Layers,
  Zap,
  Repeat,
  Binary,
  Globe,
  FileCode,
  Hash,
  Percent
} from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  href: string;
  popular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: any;
  href?: string;
}

export const CATEGORIES: Category[] = [
  { id: 'pdf-tools', name: 'PDF Tools', icon: FileText, description: 'Merge, split, compress, and convert PDF documents.' },
  { id: 'image-tools', name: 'Image Tools', icon: ImageIcon, description: 'Resize, compress, and convert images between formats.' },
  { id: 'text-tools', name: 'Text Tools', icon: Type, description: 'Word counters, case converters, and text utilities.' },
  { id: 'developer-tools', name: 'Developer Tools', icon: Code, description: 'JSON formatters, encoders, and code minifiers.' },
  { id: 'calculator-tools', name: 'Calculators', icon: Calculator, description: 'Percentage calculators and unit converters.' },
];

export const TOOLS: Tool[] = [
  // PDF Tools
  { id: 'text-to-pdf', name: 'Text to PDF', description: 'Convert plain text to a PDF document.', icon: TypeIcon, category: 'pdf-tools', href: '/tools/text-to-pdf' },
  { id: 'image-to-pdf', name: 'Image to PDF', description: 'Convert images to a single PDF file.', icon: FilePlus, category: 'pdf-tools', href: '/tools/image-to-pdf', popular: true },
  { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDF files into one.', icon: Merge, category: 'pdf-tools', href: '/tools/merge-pdf', popular: true },
  { id: 'split-pdf', name: 'Split PDF', description: 'Extract pages or split a PDF into parts.', icon: Split, category: 'pdf-tools', href: '/tools/split-pdf' },
  { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce the file size of your PDF documents.', icon: Minimize2, category: 'pdf-tools', href: '/tools/compress-pdf', popular: true },
  { id: 'pdf-watermark', name: 'PDF Watermark', description: 'Add a text watermark to your PDF pages.', icon: Layers, category: 'pdf-tools', href: '/tools/pdf-watermark' },
  { id: 'pdf-page-counter', name: 'PDF Page Counter', description: 'Quickly count the pages in a PDF file.', icon: FileDigit, category: 'pdf-tools', href: '/tools/pdf-page-counter' },

  // Image Tools
  { id: 'image-compressor', name: 'Image Compressor', description: 'Reduce image file size while keeping quality.', icon: Minimize2, category: 'image-tools', href: '/tools/image-compressor', popular: true },
  { id: 'image-resizer', name: 'Image Resizer', description: 'Change dimensions of your images easily.', icon: Maximize2, category: 'image-tools', href: '/tools/image-resizer' },
  { id: 'jpg-to-png', name: 'JPG to PNG', description: 'Convert JPG images to PNG format.', icon: ImageIcon, category: 'image-tools', href: '/tools/jpg-to-png' },
  { id: 'png-to-jpg', name: 'PNG to JPG', description: 'Convert PNG images to JPG format.', icon: ImageIcon, category: 'image-tools', href: '/tools/png-to-jpg' },
  { id: 'webp-converter', name: 'WebP Converter', description: 'Convert images to modern WebP format.', icon: Zap, category: 'image-tools', href: '/tools/webp-converter' },
  { id: 'image-cropper', name: 'Image Cropper', description: 'Crop images to perfect dimensions.', icon: Crop, category: 'image-tools', href: '/tools/image-cropper' },

  // Text Tools
  { id: 'word-counter', name: 'Word Counter', description: 'Count words, characters, and sentences.', icon: TypeIcon, category: 'text-tools', href: '/tools/word-counter' },
  { id: 'case-converter', name: 'Case Converter', description: 'Change text case (UPPER, lower, Sentence).', icon: Repeat, category: 'text-tools', href: '/tools/case-converter' },

  // Developer Tools
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Format and validate JSON code.', icon: FileCode, category: 'developer-tools', href: '/tools/json-formatter', popular: true },
  { id: 'base64-encoder', name: 'Base64 Encoder', description: 'Encode or decode Base64 data.', icon: Binary, category: 'developer-tools', href: '/tools/base64-encoder' },
  { id: 'url-encoder', name: 'URL Encoder', description: 'Encode or decode URL strings.', icon: Globe, category: 'developer-tools', href: '/tools/url-encoder' },
  { id: 'html-formatter', name: 'HTML Formatter', description: 'Beautify and format HTML code.', icon: Code, category: 'developer-tools', href: '/tools/html-formatter' },
  { id: 'css-minifier', name: 'CSS Minifier', description: 'Compress and minify CSS files.', icon: Minimize2, category: 'developer-tools', href: '/tools/css-minifier' },
  { id: 'js-minifier', name: 'JS Minifier', description: 'Compress and minify JavaScript files.', icon: Zap, category: 'developer-tools', href: '/tools/js-minifier' },

  // Calculator Tools
  { id: 'percentage-calculator', name: 'Percentage Calculator', description: 'Calculate percentages easily.', icon: Percent, category: 'calculator-tools', href: '/tools/percentage-calculator' },
];
