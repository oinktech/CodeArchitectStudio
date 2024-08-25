import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

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
const storage = getStorage(app);

// 檢查用戶登入狀態和權限
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log('用戶已登入:', user);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.isAdmin) {
                console.log('管理員已登入:', user);
                displayFilesList();
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

// 顯示文件列表
async function displayFilesList() {
    const fileListContainer = document.getElementById('file-list');
    if (fileListContainer) {
        try {
            // 獲取 Firebase Storage 中的文件
            const storageRef = ref(storage, 'y/uploads'); // 替換為你的存儲路徑
            const fileList = await listAll(storageRef);

            if (fileList.items.length === 0) {
                fileListContainer.innerHTML = '<li>沒有找到任何文件</li>';
            } else {
                // 遍歷所有文件並顯示
                for (const itemRef of fileList.items) {
                    const fileName = itemRef.name;
                    const timestamp = itemRef.fullPath; // 假設 fullPath 作為時間戳
                    const url = await getDownloadURL(itemRef);

                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <p>文件名: ${fileName}</p>
                        <p>時間戳: ${timestamp}</p>
                        <p>文件鏈接: <a href="${url}" target="_blank">查看文件</a></p>
                    `;
                    fileListContainer.appendChild(listItem);
                }
            }
        } catch (error) {
            console.error("獲取文件列表時發生錯誤:", error);
            alert("無法獲取文件列表");
        }
    } else {
        console.error("無法找到文件列表容器");
    }
}
