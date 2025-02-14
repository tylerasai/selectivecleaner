import cleanWebsites from "./cleaner.js";

const websiteList = document.getElementById("websiteList");
const addButton = document.getElementById("addButton");
const addCurrentTabButton = document.getElementById("addCurrentTabButton");
const cleanButton = document.getElementById("cleanButton");
const addWebsite = document.getElementById("addWebsite");
const viewSavedWebsitesButton = document.getElementById("viewSavedWebsites");
const savedWebsitesNumber = document.getElementById("savedWebsitesNumber"); // Ensure this exists in popup.html

let websites = [];

// Ensure all elements exist before running any logic
if (!websiteList || !addButton || !savedWebsitesNumber) {
  console.error("❌ Missing essential elements in popup.html");
}

// Load saved websites when the popup opens
function loadWebsites() {
  chrome.storage.local.get("savedWebsites", (data) => {
    if (chrome.runtime.lastError) {
      console.error("❌ Error retrieving storage:", chrome.runtime.lastError);
      return;
    }

    websites = data.savedWebsites || [];
    renderList();
    updateWebsiteCount();
  });
}

// Update count dynamically from storage
function updateWebsiteCount() {
  chrome.storage.local.get("savedWebsites", (data) => {
    if (chrome.runtime.lastError) {
      console.error("❌ Error retrieving storage:", chrome.runtime.lastError);
      return;
    }

    console.log("🔄 Updating count. Current websites:", data.savedWebsites ? data.savedWebsites.length : 0);
    if (savedWebsitesNumber) {
      savedWebsitesNumber.textContent = data.savedWebsites ? data.savedWebsites.length : "0";
    }
  });
}

// Listen for storage changes & update count
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.savedWebsites && namespace === "local") {
    updateWebsiteCount();
  }
});

// ✅ Ensure count updates when storage is modified
function updateStorage() {
  chrome.storage.local.set({ savedWebsites: websites }, () => {
    if (chrome.runtime.lastError) {
      console.error("❌ Error saving to storage:", chrome.runtime.lastError);
      return;
    }

    updateWebsiteCount();
  });
}

// Render the list of websites properly
function renderList() {
  if (!websiteList) {
    console.error("❌ Cannot render list: #websiteList is missing in popup.html");
    return;
  }

  websiteList.innerHTML = "";
  websites.forEach((site, index) => {
    const li = document.createElement("li");
    li.textContent = site;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      websites.splice(index, 1);
      updateStorage();
      renderList();
    });

    li.appendChild(removeButton);
    websiteList.appendChild(li);
  });

  updateWebsiteCount();
}

// Open full page when "View Saved Websites" is clicked
viewSavedWebsitesButton.addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("fullpage.html") });
});

// Add a website manually
addButton.addEventListener("click", () => {
  const site = addWebsite.value.trim();
  if (site && !websites.includes(site)) {
    websites.push(site);
    updateStorage();
    renderList();
    addWebsite.value = "";
  }
});

// Add the current active tab's URL
addCurrentTabButton.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab && currentTab.url) {
      const url = new URL(currentTab.url).hostname;
      if (!websites.includes(url)) {
        websites.push(url);
        updateStorage();
        renderList();
      }
    }
  });
});

// Clean the selected websites
cleanButton.addEventListener("click", () => {
  cleanWebsites(websites);
  alert("🧹 Selected websites have been cleaned!");
});

// Ensure count is updated after the popup is opened
loadWebsites();
