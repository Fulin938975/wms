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
