# wms
用於做我的生產計劃草稿



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

# 元件宣告
現在做一個個 領料的元件

領料元件

領料品項: 下拉選單 領料包數: 數量框 領料重量 數量框

下拉選單內容 招牌細P 原鬆P 特鬆P 營業P 粗鬆P 全純P

下拉選單內容 對應 重量 招牌細P=4.2 原鬆P=4.2 特鬆P=4.2 營業P=4.2 粗鬆P=3 全純P=3

下拉選單 選定後 預設 帶入 包數 值 1 ，預設帶入 對應品項 重量

包數跟重量的比例 為固定 例如 招牌細P 1:4.2 全純P1:3，當有手動輸入時，自動交互運算，如 招牌細P 自帶包數1重量4.2 當手動修改時，包數改2重量 自帶運算8.2 當改重量2.1包數自帶運算0.5

# component 分段
明白了，你希望在 component.js 中分別定義兩個段落，分別是肉鬆P1的選單和邏輯以及肉鬆P2的選單和邏輯。
# 加載宣告
首頁 index.html：引入模板文件和 JavaScript 文件，並且可以根據需要動態加載不同的選單邏輯。selectedLogic 變數用來選擇要加載的邏輯（P1 或 P2）。loadMenuLogic 函數用來動態加載 component.js 文件，並在加載完成後調用 addComponent 函數。
這樣，你就可以在 index.html 中靈活地選擇加載不同的選單邏輯，方便在不同的場景中使用不同的選單和邏輯。希望這些信息對你有所幫助！

# 調用宣告
選單邏輯文件 component.js：包含了 P1 和 P2 的選單及其對應的邏輯。每個邏輯都有自己的函數，如 populateSelectP1 和 populateSelectP2，以及 addComponentP1 和 addComponentP2。
首頁 index.html：引入模板文件和 JavaScript 文件，並且可以根據需要動態加載不同的選單邏輯。selectedLogic 變數用來選擇要加載的邏輯（P1 或 P2）。loadMenuLogic 函數用來動態加載 component.js 文件，並在加載完成後調用對應的 addComponentP1 或 addComponentP2 函數。
這樣可以確保在加載 component.js 文件後，對應的 addComponentP1 或 addComponentP2 函數已經被定義並可以正常調用。希望這些信息對你有所幫助！

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