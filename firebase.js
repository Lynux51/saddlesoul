import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const authConfig = {
    apiKey: "AIzaSyAb8qktW0ZqKOFI5_3AiFeNvz7EMhZJc4E",
    authDomain: "saddlesoul.firebaseapp.com",
    projectId: "saddlesoul",
    appId: "1:430485772665:web:931c0871ebb8acba6e77a8"
};

const dbConfig = {
    apiKey: "AIzaSyBlwBLO2e3Wwtk2XqmAkNnpR_T9VVu4GrY",
    authDomain: "buy-horse-info.firebaseapp.com",
    projectId: "buy-horse-info",
    storageBucket: "buy-horse-info.firebasestorage.app",
    messagingSenderId: "388560742976",
    appId: "1:388560742976:web:a5ea6be5419d941ba04da5",
    measurementId: "G-E8Y3LEE7HV"
};

const authApp = initializeApp(authConfig);
const auth = getAuth(authApp);

const dbApp = initializeApp(dbConfig, "buyDbApp");
const db = getFirestore(dbApp);

window.auth = auth;
window.db = db;
window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.signOut = signOut;
window.onAuthStateChanged = onAuthStateChanged;

window.fetchBuyListings = async function () {
    const listingsDiv = document.getElementById('buyListings');
    if (!listingsDiv) return;

    listingsDiv.innerHTML = '<h3>Horse Listings</h3><p>Loading horses...</p>';

    try {
        const snapshot = await getDocs(collection(db, 'sellListings'));

        if (snapshot.empty) {
            listingsDiv.innerHTML = '<h3>Horse Listings</h3><p>No horses available for sale.</p>';
            return;
        }

        listingsDiv.innerHTML = '<h3>Horse Listings</h3>';

        snapshot.forEach(doc => {
            const listing = doc.data();
            const item = document.createElement('div');
            item.className = 'listing-item';
            item.innerHTML = `
                <h4>${listing.name || 'Unnamed horse'}</h4>
                <p><strong>Breed:</strong> ${listing.breed || 'Unknown'}</p>
                <p><strong>Age:</strong> ${listing.age || 'N/A'} years</p>
                <p><strong>Height:</strong> ${listing.height || 'N/A'} hands</p>
                <p><strong>Weight:</strong> ${listing.weight || 'N/A'} kg</p>
                <p><strong>Sire:</strong> ${listing.sire || 'N/A'}</p>
                <p><strong>Dam:</strong> ${listing.dam || 'N/A'}</p>
                <div class="listing-photos">
                    ${(listing.photos || []).map(photo => `<img src="${photo}" alt="Horse photo">`).join('')}
                </div>
            `;
            listingsDiv.appendChild(item);
        });
    } catch (error) {
        listingsDiv.innerHTML = `<h3>Horse Listings</h3><p>Error loading listings: ${error.message}</p>`;
    }
};

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