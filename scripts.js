/**
 * 提交表單數據到 Google Apps Script 網絡應用
 * @param {Event} event - 表單提交事件
 */
async function submitForm(event) {
    // 防止表單的默認提交行為
    event.preventDefault();

    // 獲取表單數據
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    // 發送 POST 請求到 Google Apps Script 網絡應用
    const response = await fetch('https://script.google.com/macros/s/AKfycbwT8bR4l3QxUgmy24EkuDhL6IV6llZzFqckYcizh8zQOfjPv2wZMe3lYM3Ebj1FqlBq9w/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    // 獲取並顯示響應結果
    const result = await response.text();
    alert(result);
}

/**
 * 切換側邊欄的顯示狀態
 */
function toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
}

/**
 * 設置頁面標題
 * @param {string} title - 頁面標題
 */
function setPageTitle(title) {
    document.getElementById('page-title').innerText = title;
    document.title = title;
}

/**
 * 點擊空白處關閉側邊欄
 * @param {Event} event - 點擊事件
 */
function closeSidebarOnClickOutside(event) {
    // 如果點擊的目標不是側邊欄或漢堡菜單，且側邊欄是打開狀態，則關閉側邊欄
    if (!event.target.closest('.sidebar') && !event.target.closest('.hamburger') && document.body.classList.contains('sidebar-open')) {
        document.body.classList.remove('sidebar-open');
    }
}

// 添加點擊事件監聽器到文檔
document.addEventListener('click', closeSidebarOnClickOutside);