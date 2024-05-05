// Get the consent status from storage
chrome.storage.sync.get('consent', function(data) {
    const consentStatus = data.consent || 'unknown';
    const consentStatusElement = document.getElementById('consentStatus');
    consentStatusElement.textContent = `Consent status: ${consentStatus}`;
  });
  
  // Add event listener to the "Manage Consent" button
  document.getElementById('toggleConsent').addEventListener('click', function() {
    chrome.storage.sync.get('consent', function(data) {
      const currentConsent = data.consent || 'unknown';
      const newConsent = currentConsent === 'true' ? 'false' : 'true';
      chrome.storage.sync.set({ 'consent': newConsent }, function() {
        console.log('Consent status updated to:', newConsent);
        location.reload();
      });
    });
  });