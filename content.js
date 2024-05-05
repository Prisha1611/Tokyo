function checkForSensitiveFields(form) {
    const sensitiveKeywords = ["password", "email", "confirm", "address", "phone", "credit card"];
    const sensitiveTypes = ["password", "email"]; // Sensitive input types
  
    for (let i = 0; i < form.elements.length; i++) {
      const element = form.elements[i];
      // Check for sensitive keywords in element name (case-insensitive)
      if (sensitiveKeywords.some(keyword => element.name && element.name.toLowerCase().includes(keyword))) {
        return true;
      }
      // Check for sensitive input types
      if (sensitiveTypes.includes(element.type)) {
        return true;
      }
    }
    return false;
  }
  
  // Mutation Observer for automatic detection
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeName === "FORM") {
            checkForSensitiveFields(node); // Check the newly added form
          }
        });
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true }); // Observe body for form additions
  
  // User-triggered scan functionality (optional)
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkForForms") {
      const forms = document.querySelectorAll("form");
      const hasSensitiveForm = forms.some(form => checkForSensitiveFields(form));
      if (hasSensitiveForm) {
        chrome.runtime.sendMessage({ action: "sensitiveFormDetected" });
      }
      sendResponse([]); // No form details sent (optional)
    }
  });
  