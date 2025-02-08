import { cleanWebsites } from './cleaner.js';

const websiteList = document.getElementById('websiteList');
const addButton = document.getElementById('addButton');
const addCurrentTabButton = document.getElementById('addCurrentTabButton');
const cleanButton = document.getElementById('cleanButton');
const addWebsite = document.getElementById('addWebsite');

let websites = [];

// Render the list of websites
function renderList() {
  websiteList.innerHTML = '';
  websites.forEach((site, index) => {
    const li = document.createElement('li');
    li.textContent = site;
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      websites.splice(index, 1);
      renderList();
    });
    li.appendChild(removeButton);
    websiteList.appendChild(li);
  });
}

// Add a website manually
addButton.addEventListener('click', () => {
  const site = addWebsite.value.trim();
  if (site && !websites.includes(site)) {
    websites.push(site);
    renderList();
    addWebsite.value = '';
  }
});

// Add the current active tab's URL
addCurrentTabButton.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab && currentTab.url) {
      const url = new URL(currentTab.url).hostname; // Extract domain
      if (!websites.includes(url)) {
        websites.push(url);
        renderList();
      }
    }
  });
});

// Clean the selected websites
cleanButton.addEventListener('click', () => {
  cleanWebsites(websites);
  alert('Selected websites have been cleaned!');
});

// Initial render
renderList();
