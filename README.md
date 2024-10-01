# wms
用於做我的生產計劃草稿



git上傳 
git status
git add .
git commit -m "提交更改"

不要表頭!!!'Content-Type': 'text/plain'  // 設置內容類型為 text/plain

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