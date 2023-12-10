// content.js
cleanAmazonLink();

function cleanAmazonLink() {
  var currentUrl = window.location.href;
  var asinMatch = currentUrl.match(/\/dp\/([A-Z0-9]{10})/i);

  if (asinMatch && asinMatch[1]) {
    var cleanedUrl = "https://www.amazon.com/dp/" + asinMatch[1] + "/";
    history.replaceState({}, document.title, cleanedUrl);
  }
}
