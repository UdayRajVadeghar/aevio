/**
 * Runs before React hydrates so the saved or system theme matches the first paint.
 * Keep in sync with `components/theme-provider.tsx` (storage key + class names).
 */
export const THEME_INIT_SCRIPT = `(function(){try{var k="theme";var d=document.documentElement;var mq=window.matchMedia("(prefers-color-scheme: dark)");function sys(){return mq.matches?"dark":"light"}var stored=localStorage.getItem(k)||"system";var resolved=stored==="system"?sys():stored;if(resolved!=="light"&&resolved!=="dark"){resolved=sys()}d.classList.remove("light","dark");d.classList.add(resolved);d.style.colorScheme=resolved}catch(e){}})();`;
