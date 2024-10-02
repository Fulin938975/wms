# wms
用於做我的生產計劃草稿

# 上傳更新到git

git上傳 
git status
git add .
git commit -m "提交更改"
git push origin main




# 拉取遠端儲存庫的最新變更
git pull origin main

# 檢查拉取狀態
git status

# 如果有衝突，解決衝突後添加並提交
git add <conflicted-file>
git commit -m "Resolve merge conflict"

不要表頭!!!'Content-Type': 'text/plain'  // 設置內容類型為 text/plain

# 獨立元件選單邏輯宣告
建立一個 PickingP1.HTML 的文件 裡面放置 一組 領料模板跟領料選單和邏輯 都要定義名PickingP1 所有項目 功能都一樣 這個資源 只會有一組元件 等待頁面加載 記住 我會在同一個頁面 分別加載 p1 p2 p3 所以你的定義要確實 並免混用

# 元件宣告
好的，讓我們詳細描述一下我們需要的功能和邏輯：

定義 addComponent 函數：

這個函數接受三個參數：containerId（容器的 ID）、templateId（模板的 ID）和 weights（一個包含品項及其對應重量的對象）。
首先，從 DOM 中獲取模板元素。如果模板未找到，則在控制台中顯示錯誤信息並返回。
接著，從 DOM 中獲取容器元素。如果容器未找到，則在控制台中顯示錯誤信息並返回。
使用 document.importNode 方法克隆模板的內容，並從克隆的內容中選擇 .pickingP1-component 元素。
從 .pickingP1-component 元素中選擇品項下拉選單（itemSelect）、數量輸入框（quantityInput）和重量輸入框（weightInput）。
使用 Object.keys 方法獲取 weights 對象中的所有品項，並將這些品項填充到品項下拉選單中。
為品項下拉選單添加 change 事件監聽器，當選擇的品項改變時，將數量設置為 1，並調用 updateWeight 函數更新重量。
為數量輸入框添加 input 事件監聽器，當數量改變時，調用 updateWeight 函數更新重量。
為重量輸入框添加 input 事件監聽器，當重量改變時，調用 updateQuantity 函數更新數量。
將克隆的 .pickingP1-component 元素添加到容器中。
最後，調用 updateWeight 函數初始化重量。
定義 updateWeight 函數：

這個函數接受兩個參數：component（元件元素）和 weights（一個包含品項及其對應重量的對象）。
從 component 元素中選擇品項下拉選單、數量輸入框和重量輸入框。
獲取當前選擇的品項和數量。
如果選擇的品項在 weights 對象中存在，則計算並更新重量輸入框的值。
定義 updateQuantity 函數：

這個函數接受兩個參數：component（元件元素）和 weights（一個包含品項及其對應重量的對象）。
從 component 元素中選擇品項下拉選單、數量輸入框和重量輸入框。
獲取當前選擇的品項和重量。
如果選擇的品項在 weights 對象中存在，則計算並更新數量輸入框的值。
在 DOMContentLoaded 事件中：

定義一個模板，包含 .pickingP1-component 元素及其內部的品項下拉選單、數量輸入框和重量輸入框。
將模板插入到文檔的末尾。
獲取所有以 pickingP1-container 開頭的容器，並為每個容器調用 addComponent 函數，動態加載指定數量的 PickingP1 元件。
為添加按鈕添加事件監聽器，當按鈕被點擊時，動態創建一個新的容器並添加一個新的 PickingP1 元件。
這樣的描述應該能夠幫助生成相應的代碼。

# 不要表頭

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

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbyVy3CHk_aSEzcvidHRv92vgVZRh0N3Xv1JcBmDywyaJ8Zq0BinhMN9XSHEVpNX5y1opQ/exec', {
      method: 'POST',
      // 移除 Content-Type 表頭
      body: JSON.stringify(formData)  // 將表單數據轉換為 JSON 字符串
    });

    if (response.ok) {
      const result = await response.text();
      alert('提交成功: ' + result);
    } else {
      throw new Error('表單提交失敗，伺服器返回錯誤');
    }
  } catch (error) {
    console.error('提交失敗:', error);
    alert('提交失敗，請稍後再試');
  }
}