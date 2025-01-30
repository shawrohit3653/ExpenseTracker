const formHeading = document.getElementById('formHeading');
const formButton = document.getElementById('formButton');
const toggleForm = document.getElementById('toggleForm');
const signupFields = document.getElementById('signupFields');
const confirmPasswordField = document.getElementById('confirmPasswordField');

const passwordField = document.getElementById('password');
const confirmPasswordFieldInput = document.getElementById('cpass');

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

toggleForm.addEventListener('click', () => {
    if (formHeading.textContent === 'Sign Up') {
        formHeading.textContent = 'Login';
        formButton.textContent = 'Login';
        toggleForm.textContent = 'Sign Up';
        signupFields.classList.add('hidden');
        confirmPasswordField.classList.add('hidden');
    } else {
        formHeading.textContent = 'Sign Up';
        formButton.textContent = 'Register';
        toggleForm.textContent = 'Login';
        signupFields.classList.remove('hidden');
        confirmPasswordField.classList.remove('hidden');
    }
});

formButton.addEventListener('click', (event) => {
    event.preventDefault();

    if (formHeading.textContent === 'Sign Up') {
        if (!validatePassword(passwordField.value)) {
            alert(
                'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.'
            );
            return;
        }

        if (passwordField.value !== confirmPasswordFieldInput.value) {
            alert('Passwords do not match.');
            return;
        }

        localStorage.setItem('email', document.getElementById('email').value);
        localStorage.setItem('password', passwordField.value);

        alert('Registration Successful!');
        formHeading.textContent = 'Login';
        formButton.textContent = 'Login';
        toggleForm.textContent = 'Sign Up';
        signupFields.classList.add('hidden');
        confirmPasswordField.classList.add('hidden');
    } else {
        const savedEmail = localStorage.getItem('email');
        const savedPassword = localStorage.getItem('password');

        if (
            document.getElementById('email').value === savedEmail &&
            passwordField.value === savedPassword
        ) {
            alert('Login Successful!');
            window.location.href = 'homepage.html';
        } else {
            alert('Invalid email or password.');
        }
    }
});
