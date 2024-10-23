document.addEventListener('DOMContentLoaded', function() {
    const templates = {
        B4: `
            <template id="produceB4-template">
                <div class="produceB4-component">
                    <button type="button" class="remove-button"></button>
                    <div class="form-group horizontal-form-group">
                        <label for="produceB4-item">領料品項:</label>
                        <div class="dropdown">
                            <button class="dropdown-toggle produceB4-item" type="button">請選擇分類</button>
                            <div class="dropdown-menu"></div>
                        </div>
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="produceB4-quantity">領料數量:</label>
                        <input type="number" class="produceB4-quantity" name="produceB4-quantity" value="0" min="0.001" step="0.001">
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="produceB4-weight">領料重量(kg):</label>
                        <input type="number" class="produceB4-weight" name="produceB4-weight" value="0" min="0.001" step="0.001">
                    </div>
                </div>
            </template>
        `
    };

    Object.values(templates).forEach(template => {  
        document.body.insertAdjacentHTML('beforeend', template);    
    });   

    const itemWeights = {
        P1: { 招牌細P:4.2, 原鬆P: 4.2, 特鬆P: 4.2, 營業P: 4.2, 粗鬆P: 3, 全純P: 3 },
        P2: { 招牌細K: 1, 原鬆K: 1, 配料: 1 },
        B4: { 招牌細生產: 4.2, 原鬆生產: 4.2, 海鬆生產: 4.2, 特鬆生產: 4.2, 粗海苔生產: 4.2, 營業原生產: 4.2, 營業海生產: 4.2, 粗鬆生產: 3, 全純生產: 3 }
    };

    const subItems = {
        招牌細生產: ['招牌細K: 1', '招牌細L: 0.4', '招牌細M: 0.3', '招牌細S: 0.2', '招牌細R: 0.1'],
        原鬆生產: ['K: 1', 'L: 0.4', 'M: 0.3', 'S: 0.2', 'R: 0.1'],
        海鬆生產: ['K: 1', 'L: 0.4', 'M: 0.3', 'S: 0.2', 'R: 0.1'],
        特鬆生產: ['K: 1', 'L: 0.4', 'M: 0.3', 'S: 0.2', 'R: 0.1'],
        粗海苔生產: ['K: 1', 'L: 0.4', 'M: 0.3', 'S: 0.2', 'R: 0.1'],
        營業原生產: ['K: 1', 'L: 0.4', 'M: 0.3', 'S: 0.2', 'R: 0.1'],
        營業海生產: ['K: 1', 'L: 0.4', 'M: 0.3', 'S: 0.2', 'R: 0.1'],
        粗鬆生產: ['K: 1', 'L: 0.4', 'M: 0.3', 'S: 0.2', 'R: 0.1'],
        全純生產: ['K: 1', 'L: 0.4', 'M: 0.3', 'S: 0.2', 'R: 0.1']
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

                    // 手動觸發 input 事件來更新對應的值
                    quantityInput.dispatchEvent(new Event('input'));
                    weightInput.dispatchEvent(new Event('input'));
                }
            }
        });

        // 監聽 quantity 和 weight 輸入的變更事件
        quantityInput.addEventListener('input', function() {
            if (document.activeElement === quantityInput) {
                updateWeight(component, weights);
            }
        });

        weightInput.addEventListener('input', function() {
            if (document.activeElement === weightInput) {
                updateQuantity(component, weights);
            }
        });

        // 確保手動修改後數值能觸發對應事件
        quantityInput.addEventListener('blur', function() {
            updateWeight(component, weights);
        });

        weightInput.addEventListener('blur', function() {
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

        if (!isNaN(quantity) && weights[selectedItem] !== undefined) {
            weightInput.value = (weights[selectedItem] * quantity).toFixed(3);
        }
    }

    function updateQuantity(component, weights) {
        const dropdownToggle = component.querySelector('.dropdown-toggle');
        const quantityInput = component.querySelector(`.${component.className.split('-')[0]}-quantity`);
        const weightInput = component.querySelector(`.${component.className.split('-')[0]}-weight`);

        const selectedItem = dropdownToggle.textContent;
        const weight = parseFloat(weightInput.value);

        if (!isNaN(weight) && weights[selectedItem] !== undefined) {
            quantityInput.value = (weight / weights[selectedItem]).toFixed(3);
        }
    }

    const defaultCounts = {
        B4: typeof window.defaultB4Count !== 'undefined' ? window.defaultB4Count : 0
    };

    Object.keys(defaultCounts).forEach(key => {
        if (defaultCounts[key] > 0 && document.getElementById(`produce${key}-container-wrapper`)) {
            for (let i = 0; i < defaultCounts[key]; i++) {
                const containerId = `produce${key}-container-${i + 1}`;
                const container = document.createElement('div');
                container.id = containerId;
                document.getElementById(`produce${key}-container-wrapper`).appendChild(container);
                addComponent(containerId, `produce${key}-template`, itemWeights[key]);
            }
        }
    });

    Object.keys(defaultCounts).forEach(key => {
        const addButton = document.getElementById(`add-produce${key}-button`);
        if (addButton) {
            addButton.addEventListener('click', function() {
                const newContainerId = `produce${key}-container-${document.querySelectorAll(`[id^="produce${key}-container"]`).length + 1}`;
                const newContainer = document.createElement('div');
                newContainer.id = newContainerId;
                document.getElementById(`produce${key}-container-wrapper`).appendChild(newContainer);
                addComponent(newContainerId, `produce${key}-template`, itemWeights[key]);
            });
        }
    });

    document.addEventListener('click', function(event) {    
        if (event.target.classList.contains('remove-button')) {     
            const component = event.target.closest('[class*="-component"]');        
            if (component) {        
                component.parentElement.removeChild(component); 
            }
        }
    });

    document.addEventListener('focus', function(event) { // 點擊數量或重量欄位時自動全選
        if (/produceB4-(quantity|weight)/.test(event.target.className)) {     
            event.target.select();
        }
    }, true);
});