import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, signInWithPopup, GithubAuthProvider, GoogleAuthProvider, EmailAuthProvider, onAuthStateChanged, signOut, sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Firebase 初始化配置
const firebaseConfig = {
    apiKey: "AIzaSyBAjN_CHVH0-AmwrhkRWOMrekcbcMNjexE",
    authDomain: "html-fed42.firebaseapp.com",
    projectId: "html-fed42",
    storageBucket: "html-fed42.appspot.com",
    messagingSenderId: "976415952074",
    appId: "1:976415952074:web:7e4ddeffbf9f9c16137833"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const githubProvider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();

// 頁面加載時檢查用戶登錄狀態
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('已登入的用戶:', user);
        showUserInterface(user);
        // 登錄後跳轉到 home.html
        if (window.location.pathname !== '/home.html') {
            window.location.href = "home.html";
        }
    } else {
        console.log('用戶未登入');
        hideUserInterface();
        // 如果當前不是登錄頁面，則跳轉到登錄頁面
        if (window.location.pathname !== '/index.html') {
            window.location.href = "index.html";
        }
    }
});

// 添加 GitHub 登錄按鈕事件監聽器
document.getElementById('github-login-button').addEventListener('click', () => {
    signInWithPopup(auth, githubProvider)
        .then((result) => {
            const user = result.user;
            console.log('用戶資訊:', user);
            window.location.href = "home.html";
        })
        .catch((error) => {
            handleAuthError(error, 'GitHub 登入失敗');
        });
});

// 添加 Google 登錄按鈕事件監聽器
document.getElementById('google-login-button').addEventListener('click', () => {
    signInWithPopup(auth, googleProvider)
        .then((result) => {
            const user = result.user;
            console.log('用戶資訊:', user);
            window.location.href = "home.html";
        })
        .catch((error) => {
            handleAuthError(error, 'Google 登入失敗');
        });
});

// 顯示 Email 登錄表單
document.getElementById('email-login-toggle').addEventListener('click', () => {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
});

// 顯示註冊表單
document.getElementById('signup-toggle').addEventListener('click', () => {
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
});

// 處理登入表單提交
document.getElementById('login-button').addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('用戶資訊:', user);
            window.location.href = "home.html";
        })
        .catch((error) => {
            handleAuthError(error, '登入失敗');
        });
});

// 處理註冊表單提交
document.getElementById('signup-button').addEventListener('click', () => {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('用戶資訊:', user);
            alert('註冊成功！');
            window.location.href = "home.html";
        })
        .catch((error) => {
            handleAuthError(error, '註冊失敗');
        });
});

// 處理忘記密碼鏈接點擊事件
document.getElementById('forgot-password-link').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('forgot-password-form').style.display = 'block';
});

// 處理重置密碼郵件發送
document.getElementById('reset-password-button').addEventListener('click', () => {
    const email = document.getElementById('reset-email').value;
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('重置密碼郵件已發送，請檢查您的郵箱。');
            document.getElementById('forgot-password-form').style.display = 'none';
        })
        .catch((error) => {
            handleAuthError(error, '發送重置郵件時發生錯誤');
        });
});

// 處理取消重置密碼表單顯示
document.getElementById('cancel-reset').addEventListener('click', () => {
    document.getElementById('forgot-password-form').style.display = 'none';
});

// 定義顯示用戶界面的函數
function showUserInterface(user) {
    const userInterface = document.querySelector('.user-interface');
    const userMenu = document.querySelector('.user-menu');
    userInterface.style.display = 'block';
    userMenu.innerHTML = `
        <p>你好, ${user.displayName || '用戶'}</p>
        <p>Email: ${user.email || '未提供'}</p>
        <button id="logout-button">登出</button>
    `;

    // 登出按鈕的事件監聽器
    document.getElementById('logout-button').addEventListener('click', () => {
        signOut(auth).then(() => {
            console.log('已登出');
            hideUserInterface();
            window.location.href = "index.html";
        }).catch((error) => {
            handleAuthError(error, '登出錯誤');
        });
    });
}

// 定義隱藏用戶界面的函數
function hideUserInterface() {
    const userInterface = document.querySelector('.user-interface');
    const userMenu = document.querySelector('.user-menu');
    userInterface.style.display = 'none';
    userMenu.innerHTML = '';
}

// 定義錯誤處理函數
function handleAuthError(error, customMessage) {
    let errorMessage = customMessage || '發生錯誤';
    switch (error.code) {
        case 'auth/invalid-email':
            errorMessage = '無效的電子郵件地址';
            break;
        case 'auth/user-disabled':
            errorMessage = '該用戶帳號已被禁用';
            break;
        case 'auth/user-not-found':
            errorMessage = '用戶不存在';
            break;
        case 'auth/wrong-password':
            errorMessage = '密碼錯誤';
            break;
        case 'auth/email-already-in-use':
            errorMessage = '電子郵件已被使用';
            break;
        case 'auth/weak-password':
            errorMessage = '密碼強度不足';
            break;
        default:
            errorMessage = '未知錯誤，請稍後再試';
            break;
    }
    alert(errorMessage);
}
