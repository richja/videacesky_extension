// Saves options to chrome.storage.sync.
function save_options() {
    var email = document.getElementById('email').value;
    chrome.storage.sync.set({
        defaultEmail: email,
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Nastavení uloženo';
        setTimeout(function() {
            status.textContent = '';
        }, 1500);
    });
}
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        defaultEmail: '',
    }, function(items) {
        document.getElementById('email').value = items.defaultEmail;
    });
}
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click', save_options);