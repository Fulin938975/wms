
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














// 提交表單數據
async function submitForm(event) {
  const formData = {
    submitTime: new Date().toISOString(),  // 提交時間
    item: document.getElementById('itemSelect').value,  // 領料品項
    weight: document.getElementById('weightInput').value,  // 重量
    quantity: document.getElementById('quantityInput').value,  // 數量
    startTime: document.getElementById('startTimeDisplay').value,  // 開始時間
    endTime: document.getElementById('endTimeDisplay').value,  // 結束時間
    timerValue: document.getElementById('timerDisplay').innerText,  // 計時器顯示的生產時間
    productionItem: document.getElementById('productionItemSelect').value,  // 生產品項
    productionWeight: document.getElementById('productionWeightInput').value,  // 生產重量
    remarks: document.getElementById('remarksInput').value  // 備註
  };

  // 必填欄位檢查
  if (!formData.item) {
    alert('請選擇領料品項');
    return;
  }

  if (isNaN(formData.weight) || formData.weight === '') {
    alert('請輸入有效的領料重量 (KG)');
    return;
  }

  if (isNaN(formData.quantity) || formData.quantity === '') {
    alert('請輸入有效的領料數量 (包)');
    return;
  }

  if (isNaN(formData.productionWeight) || formData.productionWeight === '' || formData.productionWeight <= 0) {
    alert('請輸入有效的生產重量 (KG)');
    return;
  }

  // 確認時間格式正確性
  const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
  if (!timePattern.test(formData.startTime)) {
    alert('開始時間格式不正確，請輸入 HH:MM:SS 格式的時間。');
    document.getElementById('startTimeDisplay').style.borderColor = 'red';
    return;
  } else {
    document.getElementById('startTimeDisplay').style.borderColor = '';
  }

  if (!timePattern.test(formData.endTime)) {
    alert('結束時間格式不正確，請輸入 HH:MM:SS 格式的時間。');
    document.getElementById('endTimeDisplay').style.borderColor = 'red';
    return;
  } else {
    document.getElementById('endTimeDisplay').style.borderColor = '';
  }

  try {
    // 發送 POST 請求到 Google Apps Script 網絡應用
    const response = await fetch('https://script.google.com/macros/s/AKfycbx6jjTZ-VIu_cO5y92-35OMhMgdL78vn3fkPvKKbgkM9eYvHcC6T__hmp-Fg75mYLngTw/exec', {
      method: 'POST',
     
      body: JSON.stringify(formData)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // 獲取並顯示響應結果
    const result = await response.text();
    alert(result);

    // 提交表單成功後，重置表單
    createForm(); // 調用創建新表單的功能來清空表單並重置計時器狀態
  } catch (error) {
    console.error('表單提交失敗:', error);
    alert('表單提交失敗，請稍後再試');
  }
}



// 設置「領料品項」和「生產品項」的對應關係
const itemMapping = {
    '招牌細P': ['招牌細K'],
    '原鬆P': ['原鬆K'],
    '特鬆P': ['粗海苔K', '特鬆K'],
    '營業P': ['營業原K', '營業海K'],
    '粗鬆P': ['粗鬆K'],
    '全純P': ['全純K']
  };
  
  
  // 當「領料品項」選擇變更時，動態更新「生產品項」
  function updateProductionItem() {
    const itemSelect = document.getElementById('itemSelect');
    const productionItemSelect = document.getElementById('productionItemSelect');
   
    // 獲取當前選中的「領料品項」
    const selectedItem = itemSelect.value;
   
    // 根據「領料品項」選擇對應的「生產品項」選項
    const productionItems = itemMapping[selectedItem] || [];
   
    // 清空「生產品項」的選項
    productionItemSelect.innerHTML = '';
  
  
    // 動態添加對應的「生產品項」選項
    productionItems.forEach(function(item, index) {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
     
      // 自動選擇第一項
      if (index === 0) {
        option.selected = true;
      }
  
  
      productionItemSelect.appendChild(option);
    });
  }
  
  
  // 當「領料品項」改變時，觸發更新「生產品項」
  document.getElementById('itemSelect').addEventListener('change', updateProductionItem);
  
  
  // 頁面加載時，根據預設「領料品項」進行初始化
  window.onload = function () {
    loadUserEmail(); // 加載用戶信息
    setInterval(updateDateTime, 1000); // 每秒更新日期時間
    addTimeInputListeners(); // 添加時間輸入框的監聽器
    updateProductionTime(); // 初始化生產時間
    updateProductionItem(); // 初始化時更新「生產品項」
  };
  
  //------------------------------------------------------

  
  
    
  
  