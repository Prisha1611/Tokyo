// content_script.js

// List of sensitive keywords and input types
const sensitiveKeywords = ["password", "email", "confirm", "address", "phone", "credit card"];
const sensitiveTypes = ["password", "email"];

// Listen for form submission events
document.addEventListener('submit', handleFormSubmission);

// Listen for click events on submit-related buttons
document.addEventListener('click', function(event) {
  const target = event.target;
  const buttonText = target.textContent.toLowerCase();

  if (
    target.tagName === 'BUTTON' &&
    (buttonText.includes('submit') ||
    buttonText.includes('save') ||
    buttonText.includes('sign up') ||
    buttonText.includes('sign in') ||
    buttonText.includes('login'))
  ) {
    handleFormSubmission(event);
  }
});

// Function to check if a form contains sensitive fields
function checkForSensitiveFields(form) {
  const sensitiveFieldsFound = [];

  for (let i = 0; i < form.elements.length; i++) {
    const element = form.elements[i];

    // Check for sensitive keywords in element name (case-insensitive)
    if (sensitiveKeywords.some(keyword => element.name && element.name.toLowerCase().includes(keyword))) {
      sensitiveFieldsFound.push(`Field name containing "${element.name}"`);
    }

    // Check for sensitive input types
    if (sensitiveTypes.includes(element.type)) {
      sensitiveFieldsFound.push(`Field type "${element.type}"`);
    }
  }

  return sensitiveFieldsFound;
}

// Function to handle form submission
function handleFormSubmission(event) {
  const form = event.target.closest('form');
  if (!form) return; // Exit if no form is found

  // Check if the form contains sensitive fields
  const sensitiveFieldsFound = checkForSensitiveFields(form);

  if (sensitiveFieldsFound.length > 0) {
    // Prevent the form from being submitted
    event.preventDefault();

    // Show a custom alert with options and the list of sensitive data types
    const alertMessage = `Warning: This site is trying to collect the following personal and sensitive data:\n\n${sensitiveFieldsFound.join('\n')}\n\nAllow submission?\n\nClick "Cancel" to deny submission or "OK" to allow.`;
    const result = confirm(alertMessage);

    if (result) {
      // User clicked "OK" to allow submission
      form.submit();
    } else {
      // User clicked "Cancel" to deny submission
      // You can add additional functionality here if needed
    }
  }
}

// MutationObserver for automatic detection
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