chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'clean') {
    const { websites } = message;

    // Save cleaned websites to storage
    chrome.storage.local.get({ cleanedWebsites: [] }, function (data) {
      let cleanedWebsites = data.cleanedWebsites || [];

      websites.forEach((site) => {
        if (!cleanedWebsites.includes(site)) {
          cleanedWebsites.push(site);
        }

        // Clean cookies
        chrome.cookies.getAll({ domain: site }, (cookies) => {
          cookies.forEach((cookie) => {
            chrome.cookies.remove({
              url: `https://${cookie.domain}${cookie.path}`,
              name: cookie.name,
            });
          });
        });

        // Clean history, cache, and form data
        chrome.browsingData.remove(
          {
            origins: [`https://${site}`],
          },
          {
            history: true,
            cache: true,
            formData: true,
            passwords: false,
          },
          () => {
            console.log(`History cleaned for ${site}`);
          }
        );
      });

      // Save updated list to storage
      chrome.storage.local.set({ cleanedWebsites }, () => {
        console.log('Updated cleaned websites list:', cleanedWebsites);
      });
    });

    sendResponse({ message: 'Cleanup completed!' });
  }

  return true; // Keep the message channel open for async response
});

// Log storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});


chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "autoClean") {
    chrome.storage.local.get({ savedWebsites: [] }, (data) => {
      data.savedWebsites.forEach((site) => {
        // Clean cookies
        chrome.cookies.getAll({ domain: site }, (cookies) => {
          cookies.forEach((cookie) => {
            chrome.cookies.remove({
              url: `https://${cookie.domain}${cookie.path}`,
              name: cookie.name,
            });
          });
        });

        // Clean browsing data
        chrome.browsingData.remove(
          {
            origins: [`https://${site}`],
          },
          {
            history: true,
            cache: true,
            formData: true,
            passwords: false
          },
          () => {
            console.log(`Auto-clean executed for ${site}`);
          }
        );
      });
    });
  }
});
