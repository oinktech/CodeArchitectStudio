import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

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

// 顯示用戶界面
function showUserInterface(user) {
    const userMenu = document.getElementById('user-menu');
    userMenu.innerHTML = `
        <img src="${user.photoURL || 'images/default-avatar.png'}" alt="用戶頭像" class="user-avatar">
        <p>用戶名: ${user.displayName || '未知'}</p>
        <p>電子郵件: ${user.email || '未知'}</p>
        <p>登入方法: ${user.providerData[0].providerId}</p>
        <button id="personalinfo-btn">個人資料</button>
        <button id="home-btn">回到首頁</button>
        <button id="logout-button">登出</button>
    `;

    // 設置按鈕事件監聽器
    const personalInfoButton = document.getElementById('personalinfo-btn');
    const homeButton = document.getElementById('home-btn');
    const logoutButton = document.getElementById('logout-button');

    if (personalInfoButton) {
        personalInfoButton.addEventListener('click', () => {
            window.location.href = '../personalinformation.html';
        });
    }

    if (homeButton) {
        homeButton.addEventListener('click', () => {
            window.location.href = '../home.html';
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            signOut(auth)
                .then(() => window.location.href = "index.html")
                .catch((error) => console.error('登出錯誤:', error));
        });
    }
}

// 顯示用戶資訊
function showUserInformation(user) {
    const userInformation = document.getElementById('user-information');
    if (userInformation) {
        userInformation.innerHTML = `
            <img src="${user.photoURL || 'images/default-avatar.png'}" alt="用戶頭像" class="user-avatar">
        `;
    }
}

// 隱藏用戶界面
function hideUserInterface() {
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
        userMenu.innerHTML = ''; // 清空內容
    }
}

// 切換用戶菜單的顯示
document.getElementById('user-menu-toggle').addEventListener('click', function (event) {
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
        userMenu.classList.toggle('show');
        event.stopPropagation(); // 阻止事件冒泡
    }
});

// 點擊外部區域隱藏用戶菜單
document.addEventListener('click', function (event) {
    const userMenu = document.getElementById('user-menu');
    const userMenuButton = document.getElementById('user-menu-toggle');
    
    if (userMenu && userMenuButton && !userMenu.contains(event.target) && !userMenuButton.contains(event.target)) {
        if (userMenu.classList.contains('show')) {
            userMenu.classList.remove('show');
        }
    }
});

// 根據用戶的登入狀態更新界面
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('已登入的用戶:', user);
        showUserInterface(user);
        showUserInformation(user);
    } else {
        console.log('用戶未登入');
        hideUserInterface();
    }
});

// 初始加載時隱藏用戶界面
hideUserInterface();
