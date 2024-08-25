import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBAjN_CHVH0-AmwrhkRWOMrekcbcMNjexE",
    authDomain: "html-fed42.firebaseapp.com",
    projectId: "html-fed42",
    storageBucket: "html-fed42.appspot.com",
    messagingSenderId: "976415952074",
    appId: "1:976415952074:web:7e4ddeffbf9f9c16137833"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('welcome-message').textContent = `恭喜 ${user.displayName || '用戶'} 已成功登入`;
    }
});


export function GoToOriginalCodeVersionPage() {
    window.location.href = '../originalcodeversion.html'; 
}
export function GoToquestionVersionPage() {
    window.location.href = '../question.html'; 
}
export function GoToTeachingPage() {
    window.location.href = '../teaching.html'; 
}
export function GoToUploadPage() {
    window.location.href = '../upload_html_files.html'; 
}

document.getElementById('teaching-btn').addEventListener('click', GoToTeachingPage);
document.getElementById('question-btn').addEventListener('click', GoToquestionVersionPage);
document.getElementById('originalcode-btn').addEventListener('click', GoToOriginalCodeVersionPage);
document.getElementById('upload-btn').addEventListener('click', GoToUploadPage);