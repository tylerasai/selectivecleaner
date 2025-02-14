import cleanWebsites from "./cleaner.js";

document.addEventListener("DOMContentLoaded", () => {
  const websiteList = document.getElementById("savedWebsitesList");
  const clearButton = document.getElementById("clearAll");
  const exitButton = document.getElementById("exitPage");
  const cleaningIntervalDropdown = document.getElementById("cleaningInterval");
  const setCleaningButton = document.getElementById("setCleaningInterval");
  const cleanAllSavedButton = document.getElementById("cleanAllSaved");

  if (!websiteList) {
    console.error("❌ Element #savedWebsitesList not found in fullpage.html!");
    return;
  }

  // Load saved websites from Chrome storage
  chrome.storage.local.get({ savedWebsites: [], cleaningInterval: "none" }, (data) => {
    console.log("📂 Loaded websites:", data.savedWebsites); // Debugging log

    // Ensure websiteList is cleared before adding new items
    websiteList.innerHTML = "";

    // Display the list of saved websites
    if (data.savedWebsites.length === 0) {
      websiteList.innerHTML = "<p class='text-gray-500'>No websites saved.</p>";
    } else {
      data.savedWebsites.forEach((site) => {
        const li = document.createElement("li");
        li.textContent = site;

        const removeButton = document.createElement("button");
        removeButton.textContent = "❌";
        removeButton.addEventListener("click", () => {
          removeWebsite(site);
        });

        li.appendChild(removeButton);
        websiteList.appendChild(li);
      });
    }

    // Set the selected cleaning interval
    cleaningIntervalDropdown.value = data.cleaningInterval;
  });

  // Function to remove a website
  function removeWebsite(site) {
    chrome.storage.local.get({ savedWebsites: [] }, (data) => {
      const updatedWebsites = data.savedWebsites.filter((s) => s !== site);
      chrome.storage.local.set({ savedWebsites: updatedWebsites }, () => {
        location.reload();
      });
    });
  }

  // Clear all websites
  clearButton.addEventListener("click", () => {
    chrome.storage.local.set({ savedWebsites: [] }, () => {
      location.reload();
    });
  });

  // Clean browsing data for all saved websites
  cleanAllSavedButton.addEventListener("click", () => {
    chrome.storage.local.get({ savedWebsites: [] }, (data) => {
      if (data.savedWebsites.length === 0) {
        alert("⚠️ No saved websites to clean!");
        return;
      }
      if (confirm("⚠️ Are you sure you want to delete history and cookies for all saved websites?")) {
        cleanWebsites(data.savedWebsites);
        alert("✅ Browsing data cleared for all saved websites!");
      }
    });
  });

  // Close the tab when "Exit" button is clicked
  exitButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.remove(tabs[0].id);
    });
  });

  // Set auto-cleaning interval
  setCleaningButton.addEventListener("click", () => {
    const selectedInterval = cleaningIntervalDropdown.value;
    chrome.storage.local.set({ cleaningInterval: selectedInterval }, () => {
      scheduleCleaning(selectedInterval);
      alert(`✅ Cleaning interval set to: ${selectedInterval}`);
    });
  });

  // Function to schedule cleaning based on the selected interval
  function scheduleCleaning(interval) {
    chrome.alarms.clear("autoClean");

    let periodInMinutes;
    switch (interval) {
      case "5m": periodInMinutes = 5; break;
      case "10m": periodInMinutes = 10; break;
      case "hourly": periodInMinutes = 60; break;
      case "daily": periodInMinutes = 1440; break;
      case "weekly": periodInMinutes = 10080; break;
      case "monthly": periodInMinutes = 43200; break;
      default: return;
    }

    chrome.alarms.create("autoClean", { periodInMinutes });
  }
});
