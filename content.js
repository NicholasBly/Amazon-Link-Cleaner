// content.js
document.addEventListener('DOMContentLoaded', () => {
  cleanAmazonLink();
  cleanAmazonLinks();

  // Add event listener for all clicks on product links and search links
  document.body.addEventListener('click', function(event) {
    const target = event.target.closest('a[href*="/dp/"], a[href*="/s?k="]');
    if (target) {
      event.preventDefault();
      if (target.href.includes('/dp/')) {
        const asinMatch = target.href.match(/\/dp\/([A-Z0-9]{10})/i);
        if (asinMatch && asinMatch[1]) {
          const cleanedUrl = "https://www.amazon.com/dp/" + asinMatch[1] + "/";
          window.location.href = cleanedUrl;
        } else {
          window.location.href = target.href;
        }
      } else if (target.href.includes('/s?k=')) {
        const cleanedUrl = cleanSearchUrl(target.href);
        window.location.href = cleanedUrl;
      }
    }
  });

  // Intercept form submissions to clean search URLs before navigating
  document.addEventListener('submit', function(event) {
    const form = event.target;
    if (form && form.action.includes('/s')) {
      event.preventDefault();
      const formData = new FormData(form);
      const searchParams = new URLSearchParams(formData);
      const query = searchParams.get('k');
      if (query) {
        const cleanedUrl = cleanSearchUrl(form.action + '?' + searchParams.toString());
        window.location.href = cleanedUrl;
      } else {
        form.submit();
      }
    }
  }, true);  // Capture event before it bubbles up

  // Intercept enter key press in the search input field
  document.addEventListener('keydown', function(event) {
    if (event.target.matches('input[type="text"][name="field-keywords"]') && event.key === 'Enter') {
      event.preventDefault();
      const form = event.target.closest('form');
      if (form) {
        const formData = new FormData(form);
        const searchParams = new URLSearchParams(formData);
        const query = searchParams.get('k');
        if (query) {
          const cleanedUrl = cleanSearchUrl(form.action + '?' + searchParams.toString());
          window.location.href = cleanedUrl;
        }
      }
    }
  }, true);  // Capture event before it bubbles up

  // Observe changes to the document to handle dynamically loaded links
  const observer = new MutationObserver(() => {
    cleanAmazonLinks();
  });

  observer.observe(document.body, { childList: true, subtree: true });
});

function cleanAmazonLink() {
  const currentUrl = window.location.href;
  if (currentUrl.includes('/dp/')) {
    const asinMatch = currentUrl.match(/\/dp\/([A-Z0-9]{10})/i);
    if (asinMatch && asinMatch[1]) {
      let cleanedUrl = "https://www.amazon.com/dp/" + asinMatch[1] + "/";
      cleanedUrl = cleanThParameter(cleanedUrl);
      history.replaceState({}, document.title, cleanedUrl);
    }
  } else if (currentUrl.includes('/s?k=')) {
    let cleanedUrl = cleanSearchUrl(currentUrl);
    cleanedUrl = cleanThParameter(cleanedUrl);
    history.replaceState({}, document.title, cleanedUrl);
  }
}

function cleanAmazonLinks() {
  const links = document.querySelectorAll('a[href*="/dp/"], a[href*="/s?k="]');
  links.forEach(link => {
    if (link.href.includes('/dp/')) {
      const asinMatch = link.href.match(/\/dp\/([A-Z0-9]{10})/i);
      if (asinMatch && asinMatch[1]) {
        let cleanedUrl = "https://www.amazon.com/dp/" + asinMatch[1] + "/";
        cleanedUrl = cleanThParameter(cleanedUrl);
        link.href = cleanedUrl;
      }
    } else if (link.href.includes('/s?k=')) {
      let cleanedUrl = cleanSearchUrl(link.href);
      cleanedUrl = cleanThParameter(cleanedUrl);
      link.href = cleanedUrl;
    }
  });
}

function cleanSearchUrl(url) {
  const urlObj = new URL(url);
  const params = urlObj.searchParams;
  params.delete('crid');
  params.delete('sprefix');
  params.delete('ref');
  return urlObj.origin + urlObj.pathname + '?' + params.toString().replace(/&$/, '');
}

function cleanThParameter(url) {
  const urlObj = new URL(url);
  urlObj.searchParams.delete('th');
  return urlObj.toString();
}
