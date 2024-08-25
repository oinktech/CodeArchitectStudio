// 引入 Firebase 庫
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

// Firebase 配置和初始化
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
const storage = getStorage(app);

const defaultAvatarUrl = 'images/default-avatar.png'; // 預設頭像的 URL

// UI 元素
const userInfoDiv = document.getElementById('user-info');
const adminSection = document.getElementById('admin-section');

// 當用戶狀態改變時
onAuthStateChanged(auth, async (user) => {
    if (user) {
        displayUserInfo(user);
        listenForUserProfileChanges(user);

        // 檢查是否為管理員
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.isAdmin) {
                adminSection.style.display = 'block';
            } else {
                adminSection.style.display = 'none';
            }
        }
    } else {
        alert("請先登入！");
        window.location.href = "index.html";
    }
});

const displayUserInfo = (user) => {
    userInfoDiv.innerHTML = `
        <img id="user-avatar" src="${user.photoURL || defaultAvatarUrl}" alt="用戶頭像" style="width:100px;height:100px;">
        <p>用戶名: <span id="display-name">${user.displayName || '未提供'}</span></p>
        <p>電子郵件: ${user.email}</p>
        <p>用戶ID: ${user.uid}</p>
        <p>登入方法: ${user.providerData[0].providerId}</p>
    `;
    document.getElementById('new-username').value = user.displayName || '';
};

const listenForUserProfileChanges = (user) => {
    const userDocRef = doc(firestore, 'users', user.uid);
    onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const displayNameSpan = document.getElementById('display-name');
            displayNameSpan.textContent = userData.displayName || '未提供';
            if (userData.photoURL) {
                document.getElementById('user-avatar').src = userData.photoURL;
            }
        }
    });
};

const updateUserProfile = async (user, updates) => {
    try {
        await updateProfile(user, updates);
        const userDocRef = doc(firestore, 'users', user.uid);
        await setDoc(userDocRef, updates, { merge: true });
        return true;
    } catch (error) {
        console.error('更新用戶資料錯誤:', error);
        return false;
    }
};

const showMessage = (elementId, message) => {
    document.getElementById(elementId).textContent = message;
};

document.getElementById('logout-button').addEventListener('click', () => {
    signOut(auth)
        .then(() => window.location.href = "index.html")
        .catch((error) => console.error('登出錯誤:', error));
});

document.getElementById('update-username-button').addEventListener('click', async () => {
    const newUsername = document.getElementById('new-username').value;
    const user = auth.currentUser;
    if (user) {
        const success = await updateUserProfile(user, { displayName: newUsername });
        showMessage('update-status', success ? '用戶名已更新' : '更新用戶名失敗');
    }
});

document.getElementById('upload-avatar-button').addEventListener('click', async () => {
    const fileInput = document.getElementById('avatar-input');
    const file = fileInput.files[0];
    const user = auth.currentUser;
    if (file && user) {
        try {
            const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);
            await uploadBytes(storageRef, file);
            const photoURL = await getDownloadURL(storageRef);
            const success = await updateUserProfile(user, { photoURL: photoURL });
            showMessage('upload-status', success ? '頭像已上傳並更新' : '上傳頭像失敗');
        } catch (error) {
            console.error('上傳頭像錯誤:', error);
            showMessage('upload-status', '上傳頭像失敗');
        }
    } else {
        showMessage('upload-status', '請選擇圖片');
    }
});

document.getElementById('reset-avatar-button').addEventListener('click', async () => {
    const user = auth.currentUser;
    if (user) {
        const success = await updateUserProfile(user, { photoURL: defaultAvatarUrl });
        showMessage('reset-status', success ? '已恢復預設頭像' : '恢復預設頭像失敗');
        if (success) document.getElementById('user-avatar').src = defaultAvatarUrl;
    }
});
