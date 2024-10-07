document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    // 領料品項對應的生產品項映射（多選項對應）
    const itemMapping = {
        '招牌細P': ['招牌細K'],
        '原鬆P': ['原鬆K'],
        '特鬆P': ['粗海苔K', '特鬆K'],
        '營業P': ['營業原K'],
        '粗鬆P': ['粗鬆K'],
        '全純P': ['全純K']
    };

    // 綁定領料選單的交互邏輯
    function bindPickingEvents() {
        const pickingToggles = document.querySelectorAll('.pickingP1-component .dropdown-toggle');

        pickingToggles.forEach(pickingToggle => {
            const dropdownMenu = pickingToggle.nextElementSibling;

            // 點擊選單按鈕，切換選單顯示狀態
            pickingToggle.addEventListener('click', function() {
                dropdownMenu.classList.toggle('show');
            });

            // 點擊選單項目，選擇項目
            dropdownMenu.addEventListener('click', function(event) {
                if (event.target.classList.contains('dropdown-item') && !event.target.classList.contains('header-item')) {
                    const selectedItem = event.target.textContent;
                    console.log("Picking item selected:", selectedItem);
                    pickingToggle.textContent = selectedItem;

                    // 自動更新生產品項
                    if (itemMapping[selectedItem]) {
                        setProduceItems(itemMapping[selectedItem]);
                    }

                    dropdownMenu.classList.remove('show'); // 關閉選單
                }
            });
        });
    }

    // 通用函數：設置生產品項的值
    function setProduceItems(produceItems) {
        console.log("Setting produce items:", produceItems);
        const produceToggles = document.querySelectorAll('.produceB1-component .dropdown-toggle');

        produceToggles.forEach(produceToggle => {
            const dropdownMenu = produceToggle.nextElementSibling;

            if (dropdownMenu) {
                // 清空舊的選單項目
                dropdownMenu.innerHTML = '';

                // 填充新的生產品項選單
                produceItems.forEach(item => {
                    const option = document.createElement('div');
                    option.className = 'dropdown-item';
                    option.textContent = item;
                    dropdownMenu.appendChild(option);
                });

                // 自動選擇第一個選項作為默認值
                if (produceItems.length > 0) {
                    produceToggle.textContent = produceItems[0];
                    produceToggle.style.backgroundColor = '#ffffff';
                    produceToggle.style.color = '#000000';
                }
            } else {
                console.error("No dropdown menu found for produceB1-item:", produceToggle);
            }
        });
    }

    // 使用 MutationObserver 監控 DOM 變化，確保動態新增的元件可以正確綁定事件
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.classList && (node.classList.contains('pickingP1-component') || node.classList.contains('produceB1-component'))) {
                        console.log("New component added:", node);
                        bindPickingEvents();
                    }
                });
            }
        });
    });

    // 監控整個文檔的變化
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始化：綁定現有的領料和生產選單的交互
    bindPickingEvents();
});

/*--------------------------------------*/

document.addEventListener('DOMContentLoaded', function () {
    // 收集 P1 元件數據
    function getP1Data() {
        const itemElement = document.querySelector('.pickingP1-item');
        const quantityElement = document.querySelector('.pickingP1-quantity');
        const weightElement = document.querySelector('.pickingP1-weight');

        if (!itemElement || !quantityElement || !weightElement) {
            throw new Error('One or more P1 elements are missing');
        }

        return {
            item: itemElement.textContent.trim(),  // 領料品項
            quantity: quantityElement.value.trim(),  // 領料數量
            weight: weightElement.value.trim()  // 領料重量
        };
    }

    // 收集 T2 元件數據
    function getT2Data() {
        const startTimeElement = document.getElementById('startTimeDisplay2');
        const endTimeElement = document.getElementById('endTimeDisplay2');
        const elapsedTimeElement = document.getElementById('timerDisplay2');

        if (!startTimeElement || !endTimeElement || !elapsedTimeElement) {
            throw new Error('One or more T2 elements are missing');
        }

        return {
            startTime: startTimeElement.value.trim(),  // 開始時間
            endTime: endTimeElement.value.trim(),  // 結束時間
            elapsedTime: elapsedTimeElement.textContent.trim()  // 計時時間
        };
    }

    // 收集 B1 元件數據
    function getB1Data() {
        const itemElement = document.querySelector('.produceB1-item');
        const quantityElement = document.querySelector('.produceB1-quantity');
        const weightElement = document.querySelector('.produceB1-weight');

        if (!itemElement || !quantityElement || !weightElement) {
            throw new Error('One or more B1 elements are missing');
        }

        return {
            item: itemElement.textContent.trim(),  // 生產品項
            quantity: quantityElement.value.trim(),  // 生產數量
            weight: weightElement.value.trim()  // 生產重量
        };
    }

    // 收集備註數據
    function getRemarksData() {
        const remarkElement = document.getElementById('remarksInput');

        if (!remarkElement) {
            throw new Error('Remarks element is missing');
        }

        return remarkElement.value.trim();  // 備註
    }

    // 當按下提交按鈕時執行
    document.getElementById('submitButton').addEventListener('click', async function (event) {
        event.preventDefault(); // 防止表單默認提交行為

        try {
            // 獲取 P1, T2, B1 元件的數據
            const p1Data = getP1Data();
            const b1Data = getB1Data();
            const data = {
                'P1動作': '領料', // 領料品項
                P1: p1Data,
                T2: getT2Data(),
                'B1動作': '生產', // 生產品項
                B1: b1Data,
                remarks: getRemarksData()  // 新增備註字段
            };

            // 調試輸出
            console.log('Collected P1 data:', data.P1);
            console.log('Collected T2 data:', data.T2);
            console.log('Collected B1 data:', data.B1);
            console.log('Collected remarks:', data.remarks);


/*--------------------------------------*/


            /*--------------------------------------*/

            // 將數據發送到 Google Apps Script
            await submitData(data);
        } catch (error) {
            console.error('Error collecting form data:', error);
            alert('表單提交失敗，請檢查所有字段是否正確填寫');
        }
    });

    // 定義 submitData 函數
    async function submitData(data) {
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbx6jjTZ-VIu_cO5y92-35OMhMgdL78vn3fkPvKKbgkM9eYvHcC6T__hmp-Fg75mYLngTw/exec', {
                method: 'POST',
                body: JSON.stringify(data)
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

    // 定義 createForm 函數
    function createForm() {
        // 重置 P1 元件
        const p1ItemElement = document.querySelector('.pickingP1-item');
        const p1QuantityElement = document.querySelector('.pickingP1-quantity');
        const p1WeightElement = document.querySelector('.pickingP1-weight');

        if (p1ItemElement) p1ItemElement.textContent = '';
        if (p1QuantityElement) p1QuantityElement.value = '';
        if (p1WeightElement) p1WeightElement.value = '';

        // 重置 T2 元件
        const startTimeElement = document.getElementById('startTimeDisplay2');
        const endTimeElement = document.getElementById('endTimeDisplay2');
        const elapsedTimeElement = document.getElementById('timerDisplay2');

        if (startTimeElement) startTimeElement.value = '';
        if (endTimeElement) endTimeElement.value = '';
        if (elapsedTimeElement) elapsedTimeElement.textContent = '00:00';

        // 重置 B1 元件
        const b1ItemElement = document.querySelector('.produceB1-item');
        const b1QuantityElement = document.querySelector('.produceB1-quantity');
        const b1WeightElement = document.querySelector('.produceB1-weight');

        if (b1ItemElement) b1ItemElement.textContent = '';
        if (b1QuantityElement) b1QuantityElement.value = '';
        if (b1WeightElement) b1WeightElement.value = '';

        // 重置備註字段
        const remarkElement = document.getElementById('remarksInput');
        if (remarkElement) remarkElement.value = '';
    }
});