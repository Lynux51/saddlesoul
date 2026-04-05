import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAb8qktW0ZqKOFI5_3AiFeNvz7EMhZJc4E",
    authDomain: "saddlesoul.firebaseapp.com",
    projectId: "saddlesoul",
    appId: "1:430485772665:web:931c0871ebb8acba6e77a8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ---------------- SIGNUP ---------------- */

window.signupUser = function () {

    let name = document.getElementById("username").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    if (name === "" || phone === "" || email === "" || password === "") {
        alert("Please fill all fields");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {

            let user = userCredential.user;

            localStorage.setItem("name", name);
            localStorage.setItem("phone", phone);

            document.getElementById("navRight").innerHTML =
                `<span id="accountBtn" style="color:#c89b3c;cursor:pointer;">👋 Hi ${name}</span>`;

            document.getElementById("accountBtn")
                .addEventListener("click", openProfile);

            document.getElementById("profileName").innerText = name;
            document.getElementById("profilePhone").innerText = phone;
            document.getElementById("profileEmail").innerText = user.email;

            closeModal();
        })
        .catch((error) => {
            alert(error.message);
        });
};

/* ---------------- LOGIN ---------------- */

window.loginUser = function () {

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
        alert("Please enter email and password");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {

            let user = userCredential.user;
            let savedName = localStorage.getItem("name") || user.email;

            document.getElementById("navRight").innerHTML =
                `<span id="accountBtn" style="color:#c89b3c;cursor:pointer;">👋 Hi ${savedName}</span>`;

            document.getElementById("accountBtn")
                .addEventListener("click", openProfile);

            document.getElementById("profileName").innerText = localStorage.getItem("name");
            document.getElementById("profilePhone").innerText = localStorage.getItem("phone");
            document.getElementById("profileEmail").innerText = user.email;

            closeModal();
        })
        .catch((error) => {
            alert(error.message);
        });
};

/* ---------------- LOGOUT ---------------- */

window.logoutUser = function () {

    signOut(auth)
        .then(() => {

            document.getElementById("navRight").innerHTML =
                `<button class="login-btn" onclick="openLogin()">Login</button>
                 <button class="signup-btn" onclick="openSignup()">Sign Up</button>`;

            document.getElementById("profileBox").style.display = "none";
        })
        .catch((error) => {
            alert(error.message);
        });
};

/* ---------------- SESSION ---------------- */

onAuthStateChanged(auth, (user) => {
    if (user) {
        let savedName = localStorage.getItem("name") || user.email;

        document.getElementById("navRight").innerHTML =
            `<span id="accountBtn" style="color:#c89b3c;cursor:pointer;">👋 Hi ${savedName}</span>`;

        document.getElementById("accountBtn")
            .addEventListener("click", openProfile);

        document.getElementById("profileName").innerText = localStorage.getItem("name");
        document.getElementById("profilePhone").innerText = localStorage.getItem("phone");
        document.getElementById("profileEmail").innerText = user.email;
    }
});