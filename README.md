# Hide X Recommended Tab

This Chrome extension hides the "For you" tab on the X (Twitter) home timeline.  
If "For you" is selected, it automatically switches to "Following".

## File Structure

- `manifest.json`: Chrome extension configuration (Manifest V3)
- `content.js`: Tab detection and hide logic
- `samples/1.html`: Provided HTML sample of X

## Installation (Developer Mode)

1. Open Chrome extensions page: `chrome://extensions/`
2. Turn on "Developer mode" in the top-right corner
3. Click "Load unpacked"
4. Select this directory (the one that contains `manifest.json`)

## Behavior

- Works on `https://x.com/*` and `https://twitter.com/*`
- Hides tabs whose label includes `For you` (including localized variants)
- Applies only when a `Following` tab (including localized variants) is also present
- Watches DOM changes and reapplies on SPA navigation and rerenders
