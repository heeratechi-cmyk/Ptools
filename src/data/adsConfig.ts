/**
 * Google AdSense Configuration
 * 
 * Replace these values with your actual AdSense Publisher ID and Slot IDs.
 */
export const ADSENSE_CONFIG = {
  enabled: true, // Master switch for ads
  publisherId: "", // Format: ca-pub-XXXXXXXXXXXXXXXX
  slots: {
    'home-top': "", 
    'home-middle': "",
    'home-bottom': "",
    'category-top': "",
    'tool-top': "",
    'tool-after-result': "",
    'content-middle': "",
    'sidebar': "",
  }
};

export type AdVariant = 'horizontal' | 'rectangle' | 'sidebar' | 'auto';
