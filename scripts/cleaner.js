// Function to delete site data (cookies, cache) for a specific domain
export function deleteSiteData(domain) {
  console.log(`🧹 Cleaning data for: ${domain}`);

  // ✅ Remove only cookies & cache (since `history` does NOT support `origins`)
  chrome.browsingData.remove(
    {
      origins: [`https://${domain}`, `http://${domain}`], // Only use for cookies & cache
    },
    {
      cache: true,
      cookies: true,
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error("❌ Error removing cookies/cache:", chrome.runtime.lastError.message);
      } else {
        console.log(`✅ Cleared cookies & cache for ${domain}`);
      }
    }
  );

  // ✅ Manually delete history (because `browsingData.remove()` does NOT support `origins`)
  chrome.history.search({ text: domain, maxResults: 1000 }, (results) => {
    if (results.length === 0) {
      console.log(`⚠️ No history found for ${domain}`);
    } else {
      results.forEach((item) => {
        chrome.history.deleteUrl({ url: item.url }, () => {
          console.log(`🗑️ Deleted from history: ${item.url}`);
        });
      });
    }
  });
}

// Main function to clean websites
export default function cleanWebsites(websites) {
  if (!websites.length) {
    console.warn("⚠️ No websites to clean.");
    return;
  }

  websites.forEach((domain) => {
    deleteSiteData(domain);
  });
}
