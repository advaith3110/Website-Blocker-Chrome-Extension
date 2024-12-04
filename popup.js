const quotes = [
  "Believe in yourself!",
  "Stay focused and never give up.",
  "Success is no accident.",
  "Dream big and dare to fail.",
  "Stay positive, work hard, make it happen."
];

// Display a motivational quote on button click
document.getElementById("getQuote").addEventListener("click", () => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("quoteDisplay").innerText = randomQuote;
});

// Add a website to the blocklist
document.getElementById("addSite").addEventListener("click", () => {
  const siteInput = document.getElementById("siteInput").value.trim();
  if (siteInput) {
    chrome.storage.local.get(["blockedSites"], (data) => {
      const blockedSites = data.blockedSites || [];
      if (!blockedSites.includes(siteInput)) {
        blockedSites.push(siteInput);

        chrome.storage.local.set({ blockedSites }, () => {
          updateRules(blockedSites);
          alert(`Added ${siteInput} to the blocklist`);
          displayBlockedSites(blockedSites);
        });
      } else {
        alert(`${siteInput} is already in the blocklist`);
      }
    });
  } else {
    alert("Please enter a valid website URL");
  }
});

// Update dynamic rules to block websites
function updateRules(blockedSites) {
  const rules = blockedSites.map((site, index) => ({
    id: index + 1,
    priority: 1,
    action: { type: "redirect", redirect: { extensionPath: "/block.html" } },
    condition: { urlFilter: site, resourceTypes: ["main_frame"] }
  }));

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map((_, index) => index + 1),
    addRules: rules
  });
}

// Display the list of blocked sites
function displayBlockedSites(blockedSites) {
  const blockedSitesList = document.getElementById("blockedSitesList");
  blockedSitesList.innerHTML = blockedSites.length
    ? blockedSites.map(site => `<p>${site}</p>`).join("")
    : "No sites blocked yet.";
}

// Load blocked sites when the popup opens
chrome.storage.local.get(["blockedSites"], (data) => {
  displayBlockedSites(data.blockedSites || []);
});
