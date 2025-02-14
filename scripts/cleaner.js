// Function to delete site data (cookies, cache, history) for a specific domain
export function deleteSiteData(domain) {
  chrome.browsingData.remove(
    {
      origins: [`https://${domain}`],
    },
    {
      cache: true,
      cookies: true,
      history: true,
      formData: true,
      passwords: false, // Do not delete saved passwords
    },
    () => {
      console.log(`✅ Cleared browsing data for ${domain}`);
    }
  );
}

// Main function to clean websites
export default function cleanWebsites(websites) {
  if (!websites.length) {
    console.log("⚠️ No websites to clean.");
    return;
  }

  websites.forEach((domain) => {
    console.log(`🧹 Cleaning data for: ${domain}`);
    deleteSiteData(domain); // Delete all browsing data for this domain
  });
}
