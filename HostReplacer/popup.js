document.addEventListener('DOMContentLoaded', function () {
  // Load and display saved hosts
  loadHosts();

  document.getElementById('host-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const oldHost = document.getElementById('oldHost').value;
    const newHost = document.getElementById('newHost').value;

    if (oldHost && newHost) {
      chrome.storage.sync.get({ hostPairs: [] }, function (result) {
        const hostPairs = result.hostPairs;
        hostPairs.push({ oldHost, newHost });

        // Save updated host pairs
        chrome.storage.sync.set({ hostPairs }, function () {
          document.getElementById('oldHost').value = '';
          document.getElementById('newHost').value = '';
          showMessage('Hosts saved successfully!', 'success');
          loadHosts(); // Reload the host list
        });
      });
    } else {
      showMessage('Please enter both old and new hosts.', 'error');
    }
  });

  // Load and display saved host pairs
  function loadHosts() {
    const hostList = document.getElementById('hosts');
    hostList.innerHTML = '';

    chrome.storage.sync.get({ hostPairs: [] }, function (result) {
      const hostPairs = result.hostPairs;

      hostPairs.forEach((pair, index) => {
        const hostItem = document.createElement('div');
        hostItem.classList.add('host-item');

        const hostText = document.createElement('span');
        hostText.textContent = `${pair.oldHost} → ${pair.newHost}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function () {
          deleteHost(index);
        });

        hostItem.appendChild(hostText);
        hostItem.appendChild(deleteButton);
        hostList.appendChild(hostItem);
      });
    });
  }

  // Delete a host pair by index
  function deleteHost(index) {
    chrome.storage.sync.get({ hostPairs: [] }, function (result) {
      const hostPairs = result.hostPairs;
      hostPairs.splice(index, 1); // Remove the host at the specified index

      // Save the updated list
      chrome.storage.sync.set({ hostPairs }, function () {
        showMessage('Host deleted successfully!', 'success');
        loadHosts(); // Reload the host list
      });
    });
  }

  // Display success or error messages inline
  function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    if (type === 'success') {
      messageDiv.className = 'success-message';
    } else {
      messageDiv.className = 'error-message';
    }
    // Clear message after 3 seconds
    setTimeout(() => {
      messageDiv.textContent = '';
      messageDiv.className = '';
    }, 3000);
  }
});
