// content.js
document.addEventListener('DOMContentLoaded', () => {
  cleanAmazonLinks();

  // Add event listener for all clicks on product links
  document.body.addEventListener('click', function(event) {
    const target = event.target.closest('a[href*="/dp/"]');
    if (target) {
      event.preventDefault();
      const asinMatch = target.href.match(/\/dp\/([A-Z0-9]{10})/i);

      if (asinMatch && asinMatch[1]) {
        const cleanedUrl = "https://www.amazon.com/dp/" + asinMatch[1] + "/";
        window.location.href = cleanedUrl;
      } else {
        window.location.href = target.href;
      }
    }
  });

  // Observe changes to the document to handle dynamically loaded links
  const observer = new MutationObserver(() => {
    cleanAmazonLinks();
  });

  observer.observe(document.body, { childList: true, subtree: true });
});

function cleanAmazonLink() {
  const currentUrl = window.location.href;
  const asinMatch = currentUrl.match(/\/dp\/([A-Z0-9]{10})/i);

  if (asinMatch && asinMatch[1]) {
    const cleanedUrl = "https://www.amazon.com/dp/" + asinMatch[1] + "/";
    history.replaceState({}, document.title, cleanedUrl);
  }
}

function cleanAmazonLinks() {
  const links = document.querySelectorAll('a[href*="/dp/"]');
  links.forEach(link => {
    const asinMatch = link.href.match(/\/dp\/([A-Z0-9]{10})/i);
    if (asinMatch && asinMatch[1]) {
      const cleanedUrl = "https://www.amazon.com/dp/" + asinMatch[1] + "/";
      link.href = cleanedUrl;
    }
  });
}
