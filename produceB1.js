document.addEventListener('DOMContentLoaded', function() {
    const templates = {
        B1: `
            <template id="produceB1-template">
                <div class="produceB1-component">
                    <button type="button" class="remove-button"></button>
                    <div class="form-group horizontal-form-group">
                        <label for="produceB1-item">生產品項:</label>
                        <div class="dropdown">
                            <button class="dropdown-toggle produceB1-item" type="button">請選擇分類</button>
                            <div class="dropdown-menu"></div>
                        </div>
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="produceB1-quantity">生產數量:</label>
                        <input type="number" class="produceB1-quantity" name="produceB1-quantity" value="0" min="0.001" step="0.001">
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="produceB1-weight">生產重量(kg):</label>
                        <input type="number" class="produceB1-weight" name="produceB1-weight" value="0" min="0.001" step="0.001">
                    </div>
                </div>
            </template>
        `,
        B2: `
            <template id="produceB2-template">
                <div class="produceB2-component">
                    <button type="button" class="remove-button"></button>
                    <div class="form-group horizontal-form-group">
                        <label for="produceB2-item">生產品項:</label>
                        <div class="dropdown">
                            <button class="dropdown-toggle produceB2-item" type="button">請選擇分類</button>
                            <div class="dropdown-menu"></div>
                        </div>
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="produceB2-quantity">生產數量:</label>
                        <input type="number" class="produceB2-quantity" name="produceB2-quantity" value="0" min="0.001" step="0.001">
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="produceB2-weight">生產重量(kg):</label>
                        <input type="number" class="produceB2-weight" name="produceB2-weight" value="0" min="0.001" step="0.001">
                    </div>
                </div>
            </template>
        `,
        B3: `
            <template id="produceB3-template">
                <div class="produceB3-component">
                    <button type="button" class="remove-button"></button>
                    <div class="form-group horizontal-form-group">
                        <label for="produceB3-item">生產品項:</label>
                        <div class="dropdown">
                            <button class="dropdown-toggle produceB3-item" type="button">請選擇分類</button>
                            <div class="dropdown-menu"></div>
                        </div>
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="produceB3-quantity">生產數量:</label>
                        <input type="number" class="produceB3-quantity" name="produceB3-quantity" value="0" min="0.001" step="0.001">
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="produceB3-weight">生產重量(kg):</label>
                        <input type="number" class="produceB3-weight" name="produceB3-weight" value="0" min="0.001" step="0.001">
                    </div>
                </div>
            </template>
        `
    };

    Object.values(templates).forEach(template => {
        document.body.insertAdjacentHTML('beforeend', template);
    });

    const itemWeights = {
        B1: { 肉鬆B生產: 1, },
        B2: { 肉鬆K生產: 1, },
        B3: { 肉乾B生產: 1, 厚乾B生產: 1, 五香B生產: 1, 海味B生產: 1, }
    };

    const subItems = {
        肉鬆B生產: ['招牌細B:4.2', '原鬆B: 4.2', '特鬆B: 4.2', '營業B: 4.2', '粗鬆B: 3', '全純B: 3'],
        肉鬆K生產: ['招牌細K: 1', '原鬆K: 1', '海鬆K: 1','粗海苔K: 1', '特鬆K: 1', '營業原K: 1','營業海K: 1', '粗鬆K: 1', '全純K: 1', '清脯K: 1', '魚鬆K: 1', '魚脯K: 1'],
        肉乾B生產: ['原QB: 6','黑QB: 6','泰式B','脆片B: 3','厚脆B: 6'], 
    };

    function populateDropdown(dropdownMenu, items, isSecondary = false) {
        dropdownMenu.innerHTML = ''; // 清空選單

        if (isSecondary) {
            const headerItem = document.createElement('div');
            headerItem.className = 'dropdown-item header-item';
            headerItem.textContent = '請選擇品項';
            headerItem.style.fontWeight = 'bold';
            headerItem.style.pointerEvents = 'none'; // 使其不可選
            dropdownMenu.appendChild(headerItem); // 添加抬頭
        } else {
            const headerItem = document.createElement('div');
            headerItem.className = 'dropdown-item header-item';
            headerItem.textContent = '請選擇分類品項';
            headerItem.style.fontWeight = 'bold';
            headerItem.style.pointerEvents = 'none'; // 使其不可選
            dropdownMenu.appendChild(headerItem); // 添加抬頭
        }    

        items.forEach(item => {
            const option = document.createElement('div');
            option.className = 'dropdown-item';
            option.textContent = item.split(':')[0]; // 只顯示品項名稱
            option.dataset.value = item;
            dropdownMenu.appendChild(option);
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

        const dropdownToggle = component.querySelector('.dropdown-toggle');
        const dropdownMenu = component.querySelector('.dropdown-menu');
        const quantityInput = component.querySelector(`.${templateId.split('-')[0]}-quantity`);
        const weightInput = component.querySelector(`.${templateId.split('-')[0]}-weight`);

        const items = Object.keys(weights);
        populateDropdown(dropdownMenu, items);

        let isPrimarySelection = true; // 標記是否為一級選單狀態

        dropdownToggle.addEventListener('click', function() {
            if (!isPrimarySelection || dropdownToggle.textContent !== '請選擇分類') {
                // 重置選單
                populateDropdown(dropdownMenu, items);
                isPrimarySelection = true;
                dropdownToggle.textContent = '請選擇分類';
            }
            dropdownMenu.classList.toggle('show');
        });

        dropdownMenu.addEventListener('click', function(event) {
            if (event.target.classList.contains('dropdown-item') && !event.target.classList.contains('header-item')) {
                const selectedItem = event.target.dataset.value;

                if (isPrimarySelection && subItems[selectedItem]) { // 選擇一級選單且有對應的二級選單
                    populateDropdown(dropdownMenu, subItems[selectedItem], true); // 填充二級選單並添加不可選的字段
                    isPrimarySelection = false;
                    dropdownMenu.classList.add('show'); // 立即顯示二級選單
                } else { // 選擇二級選單或直接選擇一級選單
                    const [itemName, weightValue] = selectedItem.split(':'); // 分離品項名稱和重量值
                    const numWeightValue = parseFloat(weightValue); // 將重量值轉換為數字

                    if (!isNaN(numWeightValue)) { // 如果選取的是二級選單的選項
                        dropdownToggle.textContent = itemName; // 顯示選定的品項名稱
                        quantityInput.value = 1;
                        weightInput.value = numWeightValue; // 直接使用解析後的重量值
                    } else { // 如果選取的是一級選單的選項
                        dropdownToggle.textContent = itemName; // 顯示選定的品項名稱
                        quantityInput.value = 1;
                        weightInput.value = weights[selectedItem]; // 使用一級選單的重量值
                    }

                    // 設置選定項目的背景色
                    dropdownToggle.style.backgroundColor = '#ffffff';
                    dropdownToggle.style.color = '#000000';

                    dropdownMenu.classList.remove('show'); // 關閉下拉選單
                    isPrimarySelection = true; // 重置為一級選單狀態
                }
            }
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
        const dropdownToggle = component.querySelector('.dropdown-toggle');
        const quantityInput = component.querySelector(`.${component.className.split('-')[0]}-quantity`);
        const weightInput = component.querySelector(`.${component.className.split('-')[0]}-weight`);

        const selectedItem = dropdownToggle.textContent;
        const quantity = parseFloat(quantityInput.value);

        if (weights[selectedItem] !== undefined) {
            weightInput.value = (weights[selectedItem] * quantity).toFixed(3);
        }
    }

    function updateQuantity(component, weights) {
        const dropdownToggle = component.querySelector('.dropdown-toggle');
        const quantityInput = component.querySelector(`.${component.className.split('-')[0]}-quantity`);
        const weightInput = component.querySelector(`.${component.className.split('-')[0]}-weight`);

        const selectedItem = dropdownToggle.textContent;
        const weight = parseFloat(weightInput.value);

        if (weights[selectedItem] !== undefined) {
            quantityInput.value = (weight / weights[selectedItem]).toFixed(3);
        }
    }

    /*const defaultB1Count = 1; // Define appropriate values
    const defaultB2Count = 1; // Define appropriate values
    const defaultB3Count = 1; // Define appropriate values*/

    const defaultCounts = {
        B1: defaultB1Count,
        B2: defaultB2Count,
        B3: defaultB3Count
    };

    Object.keys(defaultCounts).forEach(key => {
        for (let i = 0; i < defaultCounts[key]; i++) {
            const containerId = `produce${key}-container-${i + 1}`;
            const container = document.createElement('div');
            container.id = containerId;
            document.getElementById(`produce${key}-container-wrapper`).appendChild(container);
            addComponent(containerId, `produce${key}-template`, itemWeights[key]);
        }
    });

    Object.keys(defaultCounts).forEach(key => {
        document.getElementById(`add-produce${key}-button`).addEventListener('click', function() {
            const newContainerId = `produce${key}-container-${document.querySelectorAll(`[id^="produce${key}-container"]`).length + 1}`;
            const newContainer = document.createElement('div');
            newContainer.id = newContainerId;
            document.getElementById(`produce${key}-container-wrapper`).appendChild(newContainer);
            addComponent(newContainerId, `produce${key}-template`, itemWeights[key]);
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
        if (/produceB\d+-(quantity|weight)/.test(event.target.className)) {
            event.target.select();
        }
    }, true);
});