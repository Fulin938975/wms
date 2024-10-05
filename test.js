好的，以下是針對原始碼問題的修改和改進，並附上中文說明：

原始程式碼在處理一級選單和二級選單的選擇邏輯、重置行為，尤其是在操作裝置上的運作方式，都存在一些問題。

document.addEventListener('DOMContentLoaded', function() {
    // ... (templates, itemWeights, subItems 保持不變)

    function populateSelect(selectElement, items, defaultText) {
        // ... (此函式保持不變)
    }

    function addComponent(containerId, templateId, weights) {
        // ... (查找模板和容器的程式碼保持不變)

        // ... (複製模板和獲取元素的程式碼保持不變)

        const items = Object.keys(weights);
        populateSelect(itemSelect, items, '請選擇分類');

        let isPrimarySelection = true; // 標記是否為一級選單狀態


        itemSelect.addEventListener('change', function() {
            const selectedItem = itemSelect.value;

            if (isPrimarySelection && subItems[selectedItem]) { // 選擇一級選單且有對應的二級選單
                populateSelect(itemSelect, subItems[selectedItem], '請選擇品項');
                itemSelect.size = subItems[selectedItem].length + 1; // 展開二級選單
                isPrimarySelection = false;


                // 行動裝置處理，在 change 事件內
                if (/Mobi|Android/i.test(navigator.userAgent)) {
                    itemSelect.focus(); // 確保在行動裝置上獲得焦點以自動展開
                }

            } else { // 選擇二級選單或直接選擇一級選單
                const selectedValue = itemSelect.value; // 取得選定的值（可能是二級選單的選項）
                const [itemName, weightValue] = selectedValue.split(':'); // 分離品項名稱和重量值
                const numWeightValue = parseFloat(weightValue); // 將重量值轉換為數字


                itemSelect.innerHTML = ''; // 清空選單
                populateSelect(itemSelect, items, '請選擇分類'); // 重新填充一級選單


                if (!isNaN(numWeightValue)) { // 如果選取的是二級選單的選項
                    document.getElementById('result').textContent = `Selected item: ${selectedValue}`; // 顯示結果

                    quantityInput.value = 1;
                    weightInput.value = numWeightValue; // 直接使用解析後的重量值
                }

                itemSelect.size = 1; // 恢復選單大小
                isPrimarySelection = true; // 重置為一級選單狀態


            }
        });



        itemSelect.addEventListener('focus', function() { // 點擊下拉選單時觸發

            if (!isPrimarySelection || !itemSelect.value) { // 如果是二級選單狀態 或 一級選單沒有選取任何值
                populateSelect(itemSelect, items, '請選擇分類'); // 重新填充一級選單
                itemSelect.size = items.length + 1; // 設置選單高度
            }

                isPrimarySelection = true; // 設定為一級選單狀態

        });



        if (/Mobi|Android/i.test(navigator.userAgent)) { // 行動裝置

            itemSelect.addEventListener('focus', function() {
                itemSelect.size = itemSelect.options.length; // 在行動裝置上展開選單
            });

        } else { // 桌面裝置
            itemSelect.addEventListener('blur', function() { // 滑鼠移出選單時觸發
                itemSelect.size = 1; // 恢復選單大小
            });
        }



        // ... (數量/重量輸入框的監聽器保持不變)

        // ... (其他程式碼保持不變)
    }


    // ... (其餘程式碼保持不變 - defaultCounts、新增/移除按鈕、輸入框焦點)
});
內容複製
謹慎使用代碼。
JavaScript

主要變更及說明：

簡化邏輯： 改變事件監聽器現在同時處理二級選單和直接選擇一級選單的情況。

修改重置行為： 重點事件監聽器現在會檢查目前是否顯示二級選單項目或一級選單是否沒有任何價值如果其中任何一個條件為真，它就會清空下拉選單並重設為初始的一級選單選項。

行動改善裝置處理： 用於設定選擇單一大小的行動裝置專用重點監聽器現在是有條件的（在如果這解決了行動裝置上選單可能無法正確填充或意外收合的一些奇怪行為。

透過這些顯示改進，下拉選單現在應該可以按預期配合：展開以二級選項、在選擇二級選項後自動填入再次值、點擊/獲得焦點時正確重置，並提供更好的操作裝置體驗。