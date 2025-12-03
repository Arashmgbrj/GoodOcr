
// Toggle between Sign Up and Sign In forms


// Form validation for Sign Up
document.getElementById("sign-up-form").addEventListener("submit", function(event) {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;

    let isValid = true;

    if (username.trim() === "") {
        document.getElementById("username-error").textContent = "Username is required.";
        isValid = false;
    } else {
        document.getElementById("username-error").textContent = "";
    }

    if (email.trim() === "" || !email.includes("@")) {
        document.getElementById("email-error").textContent = "Please enter a valid email.";
        isValid = false;
    } else {
        document.getElementById("email-error").textContent = "";
    }

    if (password.trim() === "" || password.length < 6) {
        document.getElementById("password-error").textContent = "Password must be at least 6 characters.";
        isValid = false;
    } else {
        document.getElementById("password-error").textContent = "";
    }

    if (confirmPassword.trim() === "" || confirmPassword !== password) {
        document.getElementById("confirm-password-error").textContent = "Passwords do not match.";
        isValid = false;
    } else {
        document.getElementById("confirm-password-error").textContent = "";
    }

    if (!isValid) {
        event.preventDefault();
    }
});

// Form validation for Sign In
document.getElementById("sign-in-form").addEventListener("submit", function(event) {
    const email = document.getElementById("login_email").value;
    const password = document.getElementById("login_password").value;

    let isValid = true;

    if (email.trim() === "" || !email.includes("@")) {
        document.getElementById("login-email-error").textContent = "Please enter a valid email.";
        isValid = false;
    } else {
        document.getElementById("login-email-error").textContent = "";
    }

    if (password.trim() === "") {
        document.getElementById("login-password-error").textContent = "Password is required.";
        isValid = false;
    } else {
        document.getElementById("login-password-error").textContent = "";
    }

    if (!isValid) {
        event.preventDefault();
    }
        


});
function Tform(formType) {

    const signUpForm = document.getElementById("sign-up-form");
    const signInForm = document.getElementById("sign-in-form");
    const signUpBtn = document.getElementById("sign-up-btn");
    const signInBtn = document.getElementById("sign-in-btn");

    if (formType === 'sign-up') {
   
        signUpForm.classList.add("active");
        signInForm.classList.remove("active");
        signUpBtn.classList.add("active");
        signInBtn.classList.remove("active");
        
    } else if (formType === 'sign-in') {
   
        signUpForm.classList.remove("active");
        signInForm.classList.add("active");
        signUpBtn.classList.remove("active");
        signInBtn.classList.add("active");
      
    }
}


