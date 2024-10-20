chrome.runtime.onInstalled.addListener(() => {
  updateHostRules();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.hostPairs) {
    updateHostRules();   // Update rules if hosts change
  }
});

function updateHostRules() {
  chrome.storage.sync.get({ hostPairs: [] }, function(result) {
    const hostPairs = result.hostPairs;
    
    // Remove existing rules
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2, 3, 4, 5]
    }, function() {
      const rules = hostPairs.map((pair, index) => {
        return {
          "id": index + 1,  // Unique ID for each rule
          "priority": 1,
          "action": {
            "type": "redirect",
            "redirect": {
              "transform": {
                "host": pair.newHost
              }
            }
          },
          "condition": {
            "urlFilter": pair.oldHost,
            "resourceTypes": ["main_frame"]
          }
        };
      });

      // Add new rules
      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules
      }, function() {
        console.log("Dynamic rules updated.");
      });
    });
  });
}
