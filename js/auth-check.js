// auth-check.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyBT5aMCLRawk4HI9EwAbNpAd-r8fSyis-c",
    authDomain: "login-system-c8935.firebaseapp.com",
    projectId: "login-system-c8935",
    storageBucket: "login-system-c8935.appspot.com",
    messagingSenderId: "279891162362",
    appId: "1:279891162362:web:c6e6eff6d4cb7afb800543"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 通用的用戶狀態檢查函數
export const checkAuthStatus = (redirectUrl = 'index.html') => {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                resolve(user);
            } else {
                alert("請先登入！");
                window.location.href = redirectUrl;
                reject("未登入");
            }
        });
    });
};

// 檢查用戶是否為管理員
export const checkAdminStatus = (redirectUrl = 'index.html') => {
    return checkAuthStatus(redirectUrl).then(async (user) => {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().isAdmin) {
            return user;
        } else {
            alert("您沒有管理員權限");
            window.location.href = redirectUrl;
            throw new Error("非管理員");
        }
    });
};
