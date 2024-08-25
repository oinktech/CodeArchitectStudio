import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

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
const db = getFirestore(app);

// 檢查用戶登入狀態和權限
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log('用戶已登入:', user);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.isAdmin) {
                console.log('管理員已登入:', user);
                displayUserList();
            } else {
                alert("您沒有管理員權限");
                window.location.href = 'index.html';
            }
        } else {
            alert("無法找到用戶數據");
            window.location.href = 'index.html';
        }
    } else {
        alert("請先登入！");
        window.location.href = 'index.html';
    }
});

// 顯示用戶列表
async function displayUserList() {
    const userListContainer = document.getElementById('user-list');
    if (userListContainer) {
        try {
            const usersCollection = collection(db, "users");
            const usersSnapshot = await getDocs(usersCollection);
            if (usersSnapshot.empty) {
                userListContainer.innerHTML = '<li>沒有找到任何用戶</li>';
            } else {
                usersSnapshot.forEach(doc => {
                    const userData = doc.data();
                    console.log('用戶數據:', userData); // 顯示用戶數據
                    const listItem = document.createElement('li');
                    
                    // 檢查 photoURL 和 displayName 是否存在，並顯示對應信息
                    const photoURL = userData.photoURL ? `<img src="${userData.photoURL}" alt="用戶照片" width="50" height="50">` : '';
                    const displayName = userData.displayName || '未命名';
                    
                    listItem.innerHTML = `${photoURL} ${displayName} (${userData.email || '無電子郵件'})`;
                    userListContainer.appendChild(listItem);
                });
            }
        } catch (error) {
            console.error("獲取用戶列表時發生錯誤:", error);
            alert("無法獲取用戶列表");
        }
    } else {
        console.error("無法找到用戶列表容器");
    }
}
