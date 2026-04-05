/* ---------------- NAVBAR SCROLL EFFECT ---------------- */

window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {
        navbar.style.background = "#000";
    } else {
        navbar.style.background = "rgba(0,0,0,0.85)";
    }
});

/* ---------------- CARD FADE ANIMATION ---------------- */

const cards = document.querySelectorAll(".card");

window.addEventListener("scroll", () => {
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();

        if (rect.top < window.innerHeight - 60) {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }
    });
});

/* ---------------- POPUP CONTROLS ---------------- */

window.openLogin = function () {

    document.getElementById("loginModal").style.display = "flex";

    document.getElementById("formTitle").innerText = "Login";

    document.getElementById("username").style.display = "none";
    document.getElementById("phone").style.display = "none";

    document.getElementById("loginBtn").style.display = "block";
    document.getElementById("signupBtn").style.display = "none";
};

window.openSignup = function () {

    document.getElementById("loginModal").style.display = "flex";

    document.getElementById("formTitle").innerText = "Sign Up";

    document.getElementById("username").style.display = "block";
    document.getElementById("phone").style.display = "block";

    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("signupBtn").style.display = "block";
};

window.closeModal = function () {
    document.getElementById("loginModal").style.display = "none";
};
/*-------------LOADING SCREEN-----------*/
window.addEventListener("load", () => {
    document.getElementById("loader").style.display = "none";
});

/* ---------------- PROFILE DROPDOWN ---------------- */

window.openProfile = function () {

    let box = document.getElementById("profileBox");

    if (box.style.display === "block") {
        box.style.display = "none";
    } else {
        box.style.display = "block";
    }
};

/* ----------------SCROLL BAR ---------------- */
let scrollTimeout;

window.addEventListener("scroll", () => {
    document.body.classList.add("scrolling");

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        document.body.classList.remove("scrolling");
    }, 800);
});

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

            alert("Account created successfully!");

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

            alert("Logged out successfully");
        })
        .catch((error) => {
            alert(error.message);
        });
};

/* ---------------- SESSION LOGIN ---------------- */

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