
function validateForm(event) {
    const username = event.target.username.value;
    const password = event.target.password.value;
    const usernameRegex = /^[A-Za-z0-9]+$/;
    const passwordRegex = /^[A-Za-z\d]{4,}$/;
  
    if (!usernameRegex.test(username)) {
      event.preventDefault();
      alert('Username can only contain letters and digits.');
      return false;
    }
  
    if (!passwordRegex.test(password)) {
      event.preventDefault();
      alert('Password must be at least 4 characters long, include at least one letter and one digit.');
      return false;
    }
  
    return true;
  }
  
//   document.addEventListener('DOMContentLoaded', () => {
    var form = document.getElementById('createAccountForm');
    form.addEventListener('submit', validateForm);
//   });
  