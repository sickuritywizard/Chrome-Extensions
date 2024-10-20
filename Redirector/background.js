// When the service worker starts, load the user-defined hosts from storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["oldHost", "newHost"], function(items) {
    const oldHost = items.oldHost || "";
    const newHost = items.newHost || "";

    if (oldHost && newHost) {
      // Register the declarativeNetRequest rule for replacing the host
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1], // Remove any previous rule with id 1
        addRules: [
          {
            "id": 1,
            "priority": 1,
            "action": {
              "type": "redirect",
              "redirect": {
                "transform": {
                  "host": newHost
                }
              }
            },
            "condition": {
              "urlFilter": oldHost,
              "resourceTypes": ["main_frame"]
            }
          }
        ]
      }, function() {
        console.log("Rules updated successfully.");
      });
    }
  });
});

// Watch for changes in the host values and update rules dynamically
chrome.storage.onChanged.addListener((changes) => {
  if (changes.oldHost || changes.newHost) {
    const oldHost = changes.oldHost ? changes.oldHost.newValue : "";
    const newHost = changes.newHost ? changes.newHost.newValue : "";

    if (oldHost && newHost) {
      // Update the declarativeNetRequest rules when hosts are updated
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1],
        addRules: [
          {
            "id": 1,
            "priority": 1,
            "action": {
              "type": "redirect",
              "redirect": {
                "transform": {
                  "host": newHost
                }
              }
            },
            "condition": {
              "urlFilter": oldHost,
              "resourceTypes": ["main_frame"]
            }
          }
        ]
      }, function() {
        console.log("Dynamic rules updated.");
      });
    }
  }
});
