

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");


const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");

const signupError = document.getElementById('signup-error');
const loginError = document.getElementById('login-error');

const gotologin = document.getElementById("goto-login");
const gotosignup = document.getElementById("goto-signup");



// when user clicks on sign in button
loginButton.addEventListener('click', (e) => {

    e.preventDefault();


    

    loginButton.style["background-color"] =  "grey" ;
    loginError.style.opacity = 0;
    loginError.innerText = '.';

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    console.log(email);
    console.log(password);
// data gets store in data vaiable
    const data = { email, password };
// sending request from browser to the server '/user/login' route and in turn get back the information whether it's a valid user or not

    const req = new XMLHttpRequest();   

    req.open('POST', '/user/login', true);
    req.setRequestHeader('Content-Type', 'application/json')
    req.send(JSON.stringify(data));

    req.onload = () => {
        if (req.readyState == 4) {
            if (req.status == 200) {
                alert("Successfully Login!!!!");
                console.log(200)
                console.log(req.responseText);


                const resJson = JSON.parse(req.responseText);

                window.location.href = '/user/home';

            }
            else {
                console.log(400)

                console.log(req.responseText);
        
                const resJson = JSON.parse(req.responseText);

                console.log(resJson)

                loginError.style.opacity = 1;
                loginError.innerText = '*' + resJson.error;
            }


            loginButton.style["background-color"] =  "var(--lightfont)" ;
        }   
        
    }

}) 

signupButton.addEventListener('click', (e) => {

    e.preventDefault();


    

    signupButton.style["background-color"] =  "grey" ;
    signupError.style.opacity = 0;
    signupError.innerText = '.';

    
    const name = document.getElementById('signup-name').value;
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    console.log(name);
    console.log(username);
    console.log(email);
    console.log(password);

    const data = { name, username, email, password };

    const req = new XMLHttpRequest();   

    req.open('POST', '/user/signup', true);
    req.setRequestHeader('Content-Type', 'application/json')
    req.send(JSON.stringify(data));

    req.onload = () => {
        if (req.readyState == 4) {
            if (req.status == 201) {
                alert("Successfully Signed Up!!!!");
                console.log(200)
                const resJson = JSON.parse(req.responseText);

                console.log(resJson);

                window.location.href = '/user/home';

            }
            else {
                console.log(409)
        
                const resJson = JSON.parse(req.responseText);

                console.log(resJson)

                signupError.style.opacity = 1;
                signupError.innerText = '*' + resJson.error;
            }


            signupButton.style["background-color"] =  "var(--lightfont)" ;
        }   
        
    }



}) 



gotologin.addEventListener('click', () => {
    loginForm.style.display = 'flex';
    loginForm.style.opacity = 1;

    signupForm.style.display = 'none';
    signupForm.style.opacity = 0;


    signupError.style.opacity = 0;
    signupError.innerText = '.';
}) 

gotosignup.addEventListener('click', () => {
    signupForm.style.display = 'flex';
    signupForm.style.opacity = 1;

    loginForm.style.display = 'none';
    loginForm.style.opacity = 0;

    loginError.style.opacity = 0;
    loginError.innerText = '.';
}) 

