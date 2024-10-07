 /* 切換側邊欄的顯示狀態
 */
 function toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
}

/**
 * 設置頁面標題
 * @param {string} title - 頁面標題
 */
function setPageTitle(title) {
  document.title = title;
  const pageTitleElement = document.getElementById('page-title');
  if (pageTitleElement) {
      pageTitleElement.innerText = title;
  }
}

// 動態設置頁面標題
document.addEventListener("DOMContentLoaded", function() {
  // 加載導航
  fetch('nav.html')
      .then(response => response.text())
      .then(data => {
          document.getElementById('nav-placeholder').innerHTML = data;

          // 在導航加載完成後設置頁面標題
          const titles = {
              "index.html": "首頁",
              "meat_production.html": "肉鬆生產",
              "mix_production.html": "調合生產",
              "packaging.html": "包裝生產",
              "quantitative_processing.html": "定量加工",
              "material_request.html": "領料管理",
              "production.html": "生產管理",
              "search.html": "數據搜尋"
          };

          const currentPage = window.location.pathname.split("/").pop();
          const pageTitle = titles[currentPage] || "未命名頁面";
          const pageTitleElement = document.getElementById('page-title');
          if (pageTitleElement) {
              pageTitleElement.innerText = pageTitle;
          }
      });
});

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