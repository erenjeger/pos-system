// Expose the app's global lexical state to extension modules.
if (typeof state !== 'undefined') window.state = state;

// Load product image/upload enhancement after the app state is available.
(() => {
  const s = document.createElement('script');
  s.src = './product-images.js?v=1';
  s.defer = true;
  document.head.appendChild(s);
})();
