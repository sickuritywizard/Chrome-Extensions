document.getElementById("host-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const oldHost = document.getElementById("oldHost").value;
  const newHost = document.getElementById("newHost").value;

  if (oldHost && newHost) {
    // Save the values to Chrome storage
    chrome.storage.sync.set({ oldHost: oldHost, newHost: newHost }, function() {
      alert("Hosts saved successfully!");
    });
  } else {
    alert("Please enter both old and new hosts.");
  }
});
