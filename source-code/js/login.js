// const signUpButton = document.getElementById('signUp');
// const signInButton = document.getElementById('signIn');
// const container = document.getElementById('container');

// signUpButton.addEventListener('click', () => {
//     container.classList.add("right-panel-active");
// });

// signInButton.addEventListener('click', () => {
//     container.classList.remove("right-panel-active");
// });

// call api
let usersApi = fetch('http://localhost:3000/user_details')
    .then(response => response.json())
    .then(users => {
        // create variables
        let userEmailDisplayBlock = document.querySelector('.userEmailDisplayBlock');
        let userPasswordDisplayBlock = document.querySelector('.userPasswordDisplayBlock');
        let userSignInButton = document.querySelector('.signInButton');

        // user handling
        userSignInButton.addEventListener('click', () => {
            if(userEmailDisplayBlock.value === '' || userPasswordDisplayBlock.value === '') {
                alert('Please check again your email and password.');
            }
            else {
                let userLogIn = users.find(user => {
                    return user.user_email === userEmailDisplayBlock.value;
                })
                if(userLogIn.user_role === 'admin') {
                    if(userLogIn.user_password === userPasswordDisplayBlock.value) {
                        // console.log(userLogIn);
                        window.location.href = `./dashboard.html?uid=${userLogIn.user_id}`;
                    }
                    else {
                        alert('Please check again your email and password.');
                    }
                }
                else {
                    alert('You do not have permission to log-in this page.');
                }
            }
        })
    })