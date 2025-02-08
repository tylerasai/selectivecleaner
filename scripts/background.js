chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'clean') {
    const { websites } = message;

    websites.forEach((site) => {
      // Clean cookies
      chrome.cookies.getAll({ domain: site }, (cookies) => {
        cookies.forEach((cookie) => {
          chrome.cookies.remove({
            url: `https://${cookie.domain}${cookie.path}`,
            name: cookie.name,
          });
        });
      });

      // Clean history
      chrome.browsingData.remove(
        {
          origins: [`https://${site}`],
        },
        { history: true },
        () => {
          console.log(`History cleaned for ${site}`);
        }
      );
    });

    sendResponse({ message: 'Cleanup completed!' });
  }

  return true; // Keep the message channel open for async response
});
