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
        `
    };

    Object.values(templates).forEach(template => {
        document.body.insertAdjacentHTML('beforeend', template);
    });

    const itemWeights = {
        P1: { 招牌細P: 4.2, 原鬆P: 4.2, 特鬆P: 4.2, 營業P: 4.2, 粗鬆P: 4.2, 全純P: 4.2 }
    };

    const subItems = {
        招牌細P: ['招牌細P2: 6', '原鬆P2: 7', '特鬆P2: 2.8', '營業P: 1.2', '粗鬆P: 1.3', '全純P: 2.5'],
        原鬆P: ['招牌細P2: 6', '原鬆P2: 7', '特鬆P2: 2.8', '營業P: 1.2', '粗鬆P: 1.3', '全純P: 2.5']
    };

    function populateSelect(selectElement, items, defaultText) {
        selectElement.innerHTML = ''; // 清空選單
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

                if (!isNaN(numWeightValue)) { // 如果選取的是二級選單的選項
                    document.getElementById('result').textContent = `Selected item: ${selectedValue}`; // 顯示結果

                    quantityInput.value = 1;
                    weightInput.value = numWeightValue; // 直接使用解析後的重量值

                    // 將選定的二級選項帶入選單框內
                    itemSelect.innerHTML = `<option selected value="${selectedValue}">${itemName}</option>`;
                }

                itemSelect.size = 1; // 恢復選單大小
                isPrimarySelection = false; // 保持為二級選單狀態，直到再次點擊選單
            }
        });

        itemSelect.addEventListener('focus', function() { // 點擊下拉選單時觸發
            if (!isPrimarySelection || !itemSelect.value) { // 如果是二級選單狀態 或 一級選單沒有選取任何值
                populateSelect(itemSelect, items, '請選擇分類'); // 重新填充一級選單
                itemSelect.size = items.length + 1; // 設置選單高度
                isPrimarySelection = true; // 設定為一級選單狀態
            }
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
        P1: 1
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