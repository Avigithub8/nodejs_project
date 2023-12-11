function validateForm() {
  var username = document.getElementById("username").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;


  clearValidationMessages();
 

  var isValid = true;


  if (username.trim() === "") {
    displayValidationMessage("username-error", "Please enter a username.");
  
    isValid = false;
  }

  if (email.trim() === "") {
    displayValidationMessage("email-error", "Please enter an email address.");
    isValid = false;
  } else {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      displayValidationMessage("email-error", "Please enter a valid email address.");
      isValid = false;
    }
  }

  if (password.length < 8) {
    displayValidationMessage("password-error", "Password must be at least 8 characters long.");
    isValid = false;
  }

  return isValid;
}

function displayValidationMessage(elementId, message) {
  var errorSpan = document.getElementById(elementId);
  errorSpan.innerHTML = message;
}

function clearValidationMessages() {
  var errorSpans = document.getElementsByClassName("validation-error");
  for (var i = 0; i < errorSpans.length; i++) {
    errorSpans[i].innerHTML = "";
  }
}


