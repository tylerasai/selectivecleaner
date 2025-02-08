// Function to delete cookies for a specific domain
function deleteCookies(domain) {
  chrome.cookies.getAll({ domain }, (cookies) => {
    cookies.forEach((cookie) => {
      const details = {
        url: `https://${cookie.domain}${cookie.path}`,
        name: cookie.name,
      };
      chrome.cookies.remove(details, () => {
        console.log(`Deleted cookie: ${cookie.name} from ${cookie.domain}`);
      });
    });
  });
}

// Function to delete history for a specific domain
function deleteHistory(domain) {
  chrome.history.search({ text: domain, maxResults: 1000 }, (results) => {
    results.forEach((item) => {
      chrome.history.deleteUrl({ url: item.url }, () => {
        console.log(`Deleted URL: ${item.url}`);
      });
    });
  });
}

// Main function to clean websites
function cleanWebsites(websites) {
  websites.forEach((domain) => {
    console.log(`Cleaning data for: ${domain}`);
    deleteCookies(domain); // Cookies deletion
    deleteHistory(domain); // History deletion
  });
}

export { cleanWebsites };
