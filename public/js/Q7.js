// 1)Date and Time
function updateDateTime() {
  var now = new Date();
  var dateTimeStr = now.toLocaleString();
  document.getElementById("datetime").innerHTML = dateTimeStr;
}

// Update the time every second
setInterval(updateDateTime, 1000);
updateDateTime();

//3)Find a dog/cat page
function validateFindForm(event) {
  event.preventDefault(); //The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
  var petType = document.getElementById("petType").value;
  var breed = document.getElementById("breed").value;
  var age = document.getElementById("age").value;
  var gender = document.getElementById("gender").value;
  var errorMessage = "";
  if (!petType || !breed || !age || !gender) {
    errorMessage = "Please fill all the fields";
    document.getElementById("errorMessage").textContent = errorMessage;
  } else {
    document.getElementById("errorMessage").textContent = "";
  }
}


function validateGiveAwayForm(event) {
  event.preventDefault();

  // Get form elements
  var petType = document.getElementById("petType2").value;
  var breed = document.getElementById("breed2").value;
  var age = document.getElementById("age2").value;
  var gender = document.getElementById("gender2").value;
  var name = document.getElementById("ownerName").value;
  var comments = document.getElementById("comments").value;
  var ownerEmail = document.getElementById("ownerEmail").value;
  var errorMessage = "";

  // Validate fields
  if (
    !petType ||
    !breed ||
    !age ||
    !gender ||
    !name ||
    !ownerEmail ||
    !comments
  ) {
    errorMessage = "Please fill all the fields";
  } else if (!checkEmail()) {
    errorMessage = "Invalid email format. Please enter a valid email.";
  }

  // Display error message
  document.getElementById("errorMessage2").textContent = errorMessage;
}

function checkEmail() {
  var email = document.getElementById("ownerEmail");
  //the format of email
  var pos = email.value.search(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  if (pos != 0) {
    return false;
  } else return true;
}
