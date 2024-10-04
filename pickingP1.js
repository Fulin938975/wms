document.addEventListener('DOMContentLoaded', function() {
    const templates = {
        P1: `
            <template id="pickingP1-template">
                <div class="pickingP1-component">
                    <button type="button" class="remove-button"></button>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP1-item">領料品項:</label>
                        <select class="pickingP1-item" name="pickingP1-item"></select>
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP1-quantity">領料數量:</label>
                        <input type="number" class="pickingP1-quantity" name="pickingP1-quantity" value="0" min="0.001" step="0.001">
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP1-weight">領料重量(kg):</label>
                        <input type="number" class="pickingP1-weight" name="pickingP1-weight" value="0" min="0.001" step="0.001">
                    </div>
                </div>
            </template>
        `,
        P2: `
            <template id="pickingP2-template">
                <div class="pickingP2-component">
                    <button type="button" class="remove-button">10</button>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP2-item">領料品項:</label>
                        <select class="pickingP2-item" name="pickingP2-item"></select>
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP2-quantity">領料數量:</label>
                        <input type="number" class="pickingP2-quantity" name="pickingP2-quantity" value="0" min="0.001" step="0.001">
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP2-weight">領料重量(kg):</label>
                        <input type="number" class="pickingP2-weight" name="pickingP2-weight" value="0" min="0.001" step="0.001">
                    </div>
                </div>
            </template>
        `,
        P3: `
            <template id="pickingP3-template">
                <div class="pickingP3-component">
                    <button type="button" class="remove-button">移除</button>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP3-item">領料品項:</label>
                        <select class="pickingP3-item" name="pickingP3-item"></select>
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP3-quantity">領料數量:</label>
                        <input type="number" class="pickingP3-quantity" name="pickingP3-quantity" value="0" min="0.001" step="0.001">
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP3-weight">領料重量(kg):</label>
                        <input type="number" class="pickingP3-weight" name="pickingP3-weight" value="0" min="0.001" step="0.001">
                    </div>
                </div>
            </template>
        `
    };

    Object.values(templates).forEach(template => {
        document.body.insertAdjacentHTML('beforeend', template);
    });

    const itemWeights = {
        P1: { 招牌細P: 4.2, 原鬆P: 4.2, 特鬆P: 4.2, 營業P: 4.2, 粗鬆P: 4.2, 全純P: 4.2 },
        P2: { 招牌細k: 1, 原鬆k: 1, 特鬆k: 1, 營業k: 1, 粗鬆k: 1, 全純k: 1 },
        P3: { 原QP: 6, 黑QP: 6, 泰式P: 6, 脆片P: 3, 厚脆: 6 }
    };

    const subItems = {
        招牌細P: ['招牌細P2: 6', '原鬆P2: 7', '特鬆P2: 2.8', '營業P: 1.2', '粗鬆P: 1.3', '全純P: 2.5'],
        原鬆P: ['招牌細P2: 6', '原鬆P2: 7', '特鬆P2: 2.8', '營業P: 1.2', '粗鬆P: 1.3', '全純P: 2.5'],
    };

    function populateSelect(selectElement, items, defaultText) {
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = defaultText;
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item.split(':')[0]; // 只顯示品項名稱
            selectElement.appendChild(option);
        });
    }

    function addComponent(containerId, templateId, weights) {
        const template = document.getElementById(templateId);
        if (!template) {
            console.error(`${templateId} 模板未找到`);
            return;
        }
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`${containerId} 容器未找到`);
            return;
        }
        const clone = document.importNode(template.content, true);
        const component = clone.querySelector(`.${templateId.split('-')[0]}-component`);

        const itemSelect = component.querySelector(`.${templateId.split('-')[0]}-item`);
        const quantityInput = component.querySelector(`.${templateId.split('-')[0]}-quantity`);
        const weightInput = component.querySelector(`.${templateId.split('-')[0]}-weight`);

        const items = Object.keys(weights);

        populateSelect(itemSelect, items, '請選擇分類');

        let isPrimarySelection = true; // 判斷是否是一級選單狀態

        // 監聽下拉選單的變更事件
        itemSelect.addEventListener('change', function() {
            const selectedItem = itemSelect.value;

            // 如果是選擇了一級選單且有二級選項
            if (isPrimarySelection && subItems[selectedItem]) {
                const subItemsForSelectedItem = subItems[selectedItem];

                // 清空選單並填充二級選單
                itemSelect.innerHTML = '';
                populateSelect(itemSelect, subItemsForSelectedItem, '請選擇品項');

                // 顯示多行，展示二級選單
                itemSelect.size = subItemsForSelectedItem.length + 1;
                isPrimarySelection = false; // 切換到二級選單狀態

                // 在手機上自動展開二級選單
                if (/Mobi|Android/i.test(navigator.userAgent)) {
                    setTimeout(() => {
                        itemSelect.focus();
                        itemSelect.size = subItemsForSelectedItem.length + 1; // 確保展開二級選單
                        itemSelect.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); // 模擬點擊事件
                    }, 100);
                }
            } else if (!isPrimarySelection) {
                // 如果是二級選單的選項，顯示結果
                const resultDiv = document.getElementById('result');
                if (resultDiv) {
                    resultDiv.textContent = `Selected item: ${selectedItem}`;
                }

                // 將選定的二級選項帶入選單框內
                itemSelect.innerHTML = `<option selected value="${selectedItem}">${selectedItem.split(':')[0]}</option>`;
                itemSelect.size = 1; // 重置選單大小
                isPrimarySelection = true; // 重置為一級選單狀態

                // 自動帶入數量與重量比
                quantityInput.value = 1;
                weightInput.value = parseFloat(selectedItem.split(':')[1]);
            }
        });

        // 使用 focus 事件展開選單
        itemSelect.addEventListener('focus', function() {
            if (!isPrimarySelection) {
                // 無論當前狀態如何，點擊時重置回一級選單
                itemSelect.innerHTML = '';
                populateSelect(itemSelect, items, '請選擇分類'); // 填充一級選單
                itemSelect.size = items.length + 1; // 設置適當的欄高
                isPrimarySelection = true; // 切換回一級選單狀態
            } else {
                // 如果已經選定了選項，重置選單
                itemSelect.innerHTML = '';
                populateSelect(itemSelect, items, '請選擇分類');
                itemSelect.size = items.length + 1;
            }
        });

        // 使用 blur 事件縮回選單
        itemSelect.addEventListener('blur', function() {
            itemSelect.size = 1; // 恢復為單行顯示
        });

        // 監聽 quantity 和 weight 輸入的變更事件
        quantityInput.addEventListener('input', function() {
            updateWeight(component, weights);
        });

        weightInput.addEventListener('input', function() {
            updateQuantity(component, weights);
        });

        container.appendChild(clone);
        updateWeight(component, weights);
    }

    function updateWeight(component, weights) {
        const itemSelect = component.querySelector(`.${component.className.split('-')[0]}-item`);
        const quantityInput = component.querySelector(`.${component.className.split('-')[0]}-quantity`);
        const weightInput = component.querySelector(`.${component.className.split('-')[0]}-weight`);

        const selectedItem = itemSelect.value;
        const quantity = parseFloat(quantityInput.value);

        if (weights[selectedItem] !== undefined) {
            weightInput.value = (weights[selectedItem] * quantity).toFixed(3);
        }
    }

    function updateQuantity(component, weights) {
        const itemSelect = component.querySelector(`.${component.className.split('-')[0]}-item`);
        const quantityInput = component.querySelector(`.${component.className.split('-')[0]}-quantity`);
        const weightInput = component.querySelector(`.${component.className.split('-')[0]}-weight`);

        const selectedItem = itemSelect.value;
        const weight = parseFloat(weightInput.value);

        if (weights[selectedItem] !== undefined) {
            quantityInput.value = (weight / weights[selectedItem]).toFixed(3);
        }
    }

    const defaultCounts = {
        P1: 1,
        P2: 1,
        P3: 1
    };

    Object.keys(defaultCounts).forEach(key => {
        for (let i = 0; i < defaultCounts[key]; i++) {
            const containerId = `picking${key}-container-${i + 1}`;
            const container = document.createElement('div');
            container.id = containerId;
            document.getElementById(`picking${key}-container-wrapper`).appendChild(container);
            addComponent(containerId, `picking${key}-template`, itemWeights[key]);
        }
    });

    Object.keys(defaultCounts).forEach(key => {
        document.getElementById(`add-picking${key}-button`).addEventListener('click', function() {
            const newContainerId = `picking${key}-container-${document.querySelectorAll(`[id^="picking${key}-container"]`).length + 1}`;
            const newContainer = document.createElement('div');
            newContainer.id = newContainerId;
            document.getElementById(`picking${key}-container-wrapper`).appendChild(newContainer);
            addComponent(newContainerId, `picking${key}-template`, itemWeights[key]);
        });
    });

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-button')) {
            const component = event.target.closest('[class*="-component"]');
            if (component) {
                component.parentElement.removeChild(component);
            }
        }
    });

    document.addEventListener('focus', function(event) {
        if (/pickingP\d+-(quantity|weight)/.test(event.target.className)) {
            event.target.select();
        }
    }, true);
});