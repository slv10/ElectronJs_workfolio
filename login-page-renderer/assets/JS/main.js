const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const signInAttempted = document.getElementById('sign_In');
const Email = document.querySelector('#registered-email');
const Pass = document.querySelector('#registered-pass');

signUpButton.addEventListener('click', () =>
    container.classList.add('right-panel-active'));

signInButton.addEventListener('click', () =>
    container.classList.remove('right-panel-active'));

signInAttempted.addEventListener('click', (e) => {
    e.preventDefault();
    handleSignIn();
});

ipcRenderer.on('sign-in-successful', () => {
    console.log("logged in");
    alertSuccess('Successfully Logged in');
});

function handleSignIn() {
    console.log('signin clicked');

    if (Email.value === '' || Pass.value === '') {
        //alertError('Please enter Email and Password');
        return;
    }

    ipcRenderer.send('sign-in-attempted', {
        Email: Email.value,
        Pass: Pass.value
    });
}

function alertSuccess(message) {
    Toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: 'green',
            color: 'white',
            textAlign: 'center'
        },
    });
}

function alertError(message) {
    Toastify.toast({
        text: message,
        duration: 4000,
        close: false,
        style: {
            background: 'red',
            color: 'white',
            textAlign: 'center',
        },
    });
}