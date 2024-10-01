
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

// 動態設置頁面標題
document.addEventListener("DOMContentLoaded", function() {
    const pageTitle = document.getElementById("page-title");
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
    pageTitle.textContent = titles[currentPage] || "我的網站";
});


//------肉鬆生產品項時間------//
// 全局變數設置
let timer;
let timerRunning = false;
let elapsedTime = 0;
let startTime = null;
let endTime = null;
let manualTimeUpdated = false; // 標記手動更新時間


// 開始計時
function startTimer() {
  if (!timerRunning) {
    timerRunning = true;
   
    // 設置當前時間為開始時間
    startTime = Date.now();
    document.getElementById('startTimeDisplay').value = getCurrentTime(); // 在開始時間顯示當前時間


    // 如果手動修改了時間，從手動修改的時間開始計時
    startTime = manualTimeUpdated
      ? parseTime(document.getElementById('startTimeDisplay').value)
      : Date.now() - elapsedTime;


    // 每秒更新一次計時器顯示
    timer = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      document.getElementById('timerDisplay').innerText = formatTime(elapsedTime);
    }, 1000);


    // 禁用開始按鈕，3秒後啟用結束按鈕
    document.getElementById('startBtn').disabled = true;
    setTimeout(() => {
      document.getElementById('endBtn').disabled = false; // 直接啟用按鈕，無需提示框
    }, 3000);


    // 如果沒有手動更新時間，設置開始時間為當前時間
    if (!manualTimeUpdated) {
      const currentTime = getCurrentTime();
      document.getElementById('startTimeDisplay').value = currentTime;
    }


    manualTimeUpdated = false; // 重置手動更新狀態
  }
}

/*肉鬆生產*/
// 生產完成後，啟用"生產重量"輸入框監聽，當有正確輸入時，才啟用提交按鈕
function endTimer() {
  if (timerRunning) {
    clearInterval(timer);
    timerRunning = false;


    // 設置結束時間為當前時間，並顯示在結束時間文本框中
    endTime = Date.now();
    document.getElementById('endTimeDisplay').value = getCurrentTime();


    // 更新生產時間顯示
    updateProductionTime();


    // 禁用"生產完成"按鈕，並監聽"生產重量"輸入框
    document.getElementById('endBtn').disabled = true;


    // 啟用"生產重量"輸入框監聽，當用戶輸入正確值後啟用"提交表單"按鈕
    document.getElementById('productionWeightInput').addEventListener('input', function() {
      const productionWeight = document.getElementById('productionWeightInput').value;


      // 確保輸入的是有效的數值，且大於 0
      if (!isNaN(productionWeight) && productionWeight > 0) {
        document.getElementById('submitBtn').disabled = false; // 啟用提交按鈕
      } else {
        document.getElementById('submitBtn').disabled = true;  // 禁用提交按鈕
      }
    });
  }
}


// 確保時間格式為 HH:MM:SS
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}


// 格式化毫秒數為 H:MM:SS 顯示
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);  // 將毫秒轉換為秒
  const hours = Math.floor(totalSeconds / 3600);  // 計算小時數
  const minutes = Math.floor((totalSeconds % 3600) / 60);  // 計算分鐘數
  const seconds = totalSeconds % 60;  // 計算秒數


  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


// 解析手動輸入的時間（支持 HHMMSS, HH:MM:SS, 以及 HHMM 格式）
function parseManualTime(timeStr) {
  // 去除空格
  timeStr = timeStr.replace(/\s+/g, '');


  // 如果是 6 位數字，格式化為 HH:MM:SS
  if (/^\d{6}$/.test(timeStr)) {
    return timeStr.slice(0, 2) + ':' + timeStr.slice(2, 4) + ':' + timeStr.slice(4);
  }


  // 如果是 4 位數字，格式化為 HH:MM:00
  if (/^\d{4}$/.test(timeStr)) {
    return timeStr.slice(0, 2) + ':' + timeStr.slice(2, 4) + ':00';
  }


  // 如果是標準時間格式 HH:MM:SS 或 HH:MM，直接返回
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeStr)) {
    if (timeStr.length === 5) { // 若缺少秒數，補全
      return timeStr + ':00';
    }
    return timeStr;
  }


  // 如果不符合任何格式，返回 null 以便後續處理
  return null;
}


// 解析時間字串為毫秒數
function parseTime(timeStr) {
  const parts = timeStr.split(':');
  const date = new Date();
  date.setHours(parseInt(parts[0], 10));
  date.setMinutes(parseInt(parts[1], 10));
  date.setSeconds(parseInt(parts[2], 10)); // 包含秒數解析
  date.setMilliseconds(0);
  return date.getTime();
}


// 更新生產時間：根據手動輸入的時間更新顯示的生產時間
function updateProductionTime() {
  const startTimeStr = document.getElementById('startTimeDisplay').value;
  const endTimeStr = document.getElementById('endTimeDisplay').value;


  // 只在非空的情況下處理時間格式，避免載入時直接檢查
  const formattedStartTime = parseManualTime(startTimeStr);
  const formattedEndTime = parseManualTime(endTimeStr);


  if (formattedStartTime && formattedEndTime) {
    const startTime = parseTime(formattedStartTime);
    const endTime = parseTime(formattedEndTime);


    let diff = endTime - startTime;
    if (diff < 0) {
      diff += 24 * 60 * 60 * 1000;  // 處理跨午夜的情況
    }


    // 更新計時器顯示
    document.getElementById('timerDisplay').innerText = formatTime(diff);


    // 重置已經過的時間，確保計時器正確運行
    elapsedTime = diff;
    manualTimeUpdated = true; // 標記手動更新狀態


    // 如果計時器正在運行，重新啟動計時器
    if (timerRunning) {
      clearInterval(timer);
      startTimer();  // 重新啟動計時器
    }
  }
}


// 根據領料品項自動填充重量的函數
function setDefaultWeight() {
  const item = document.getElementById('itemSelect').value; // 獲取當前選中的領料品項
  const weightMapping = {
    '招牌細P': 4.2,
    '原鬆P': 4.2,
    '特鬆P': 4.2,
    '營業P': 4.2,
    '粗鬆P': 3.0,
    '全純P': 3.0
  };


  // 根據選擇的項目填充對應的重量
  document.getElementById('weightInput').value = weightMapping[item] || '';
}






// 創建新表單的功能
function createForm() {
  // 停止計時器
  clearInterval(timer);
  timerRunning = false;
  elapsedTime = 0;


  // 重置表單為初始狀態
  document.getElementById('itemSelect').value = ''; // 重置 select 的值
 
  document.getElementById('weightInput').value = ''; // 重量
  document.getElementById('quantityInput').value = 1; // 包數
  document.getElementById('startTimeDisplay').value = ''; // 開始時間
  document.getElementById('endTimeDisplay').value = ''; // 結束時間
  document.getElementById('timerDisplay').innerText = '0:00:00'; // 重置顯示的計時器為 0:00:00
  // 清空「生產品項」選擇
  document.getElementById('productionItemSelect').innerHTML = '<option value="" disabled selected>請選擇品項</option>';


  document.getElementById('productionWeightInput').value = ''; // 生產重量
  document.getElementById('remarksInput').value = ''; // 備註


  // 重置按钮状态
  document.getElementById('startBtn').disabled = false; // 啟用開始生產按鈕
  document.getElementById('endBtn').disabled = true; // 禁用生產完成按鈕
  document.getElementById('submitBtn').disabled = true; // 禁用提交按鈕


  // 重置開始和結束時間
  startTime = null; // 重置 startTime 防止下次使用時為空
  endTime = null;


  // 清除手動更新狀態
  manualTimeUpdated = false;


  alert('已創建新表單');
}


// 提交表單數據
async function submitForm() {
  const formData = {
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
      headers: {
        'Content-Type': 'application/text/plain'
      },
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
  // 更新當前日期時間
  function updateDateTime() {
    const now = new Date();
    const dateString = now.toLocaleString('zh-TW', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    document.getElementById('currentDateTime').innerText = dateString;
  }
  
  
  // 添加事件監聽器：自動全選文本框內的時間，並自動格式化輸入的時間
  function addTimeInputListeners() {
    const timeInputs = ['startTimeDisplay', 'endTimeDisplay'];
    let alertShown = false; // 用來防止重複彈出提示框
  
  
    timeInputs.forEach(function(id) {
      const input = document.getElementById(id);
  
  
      // 聚焦時自動全選
      input.addEventListener('focus', function() {
        input.select();  // 聚焦時全選文本框中的內容
      });
  
  
      // 失去焦點時自動格式化時間
      input.addEventListener('blur', function() {
        const formattedTime = parseManualTime(input.value); // 調用格式化函數
  
  
        if (formattedTime) {
          input.value = formattedTime;  // 格式化為 HH:MM:SS 或 HH:MM:00
          updateProductionTime();  // 手動修改後更新計時器
        } else {
          // 若時間格式無效，只顯示一次提示
          if (!alertShown) {
            alert('時間格式無效，請輸入 HHMM, HHMMSS 或 HH:MM:SS 格式');
            alertShown = true;  // 標記已經顯示過提示
          }
          input.value = ''; // 清空輸入框，避免重複彈出提示
        }
      });
    });
  }

  
    
  
  
    
  
  