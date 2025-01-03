document.addEventListener('DOMContentLoaded', function() {
    const templates = {
        
        P4: `
            <template id="pickingP4-template">
                <div class="pickingP4-component">
                    <button type="button" class="remove-button"></button>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP4-item">領料品項:</label>
                        <div class="dropdown">
                            <button class="dropdown-toggle pickingP4-item" type="button">請選擇分類</button>
                            <div class="dropdown-menu"></div>
                        </div>
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP4-quantity">領料數量:</label>
                        <input type="number" class="pickingP4-quantity" name="pickingP4-quantity" value="0" min="0.001" step="0.001">
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP4-weight">領料重量(kg):</label>
                        <input type="number" class="pickingP4-weight" name="pickingP4-weight" value="0" min="0.001" step="0.001">
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
        P2: { 招牌細K: 1,原鬆K: 1, 配料:1},
        P4: { 肉鬆P領料: 1, 肉鬆K領料: 1, 肉乾P領料: 1,肉乾K領料: 1, 厚乾P領料: 1,厚乾K領料: 1,五香K領料: 1,海味K領料: 1}
    };

    const subItems = {
        肉鬆P領料: ['招牌細P:4.2', '原鬆P: 4.2', '特鬆P: 4.2', '營業P: 4.2', '粗鬆P: 3', '全純P: 3'],
        肉鬆K領料: ['招牌細K: 1', '原鬆K: 1', '海鬆K: 1','粗海苔K: 1', '特鬆K: 1', '營業原K: 1','營業海K: 1', '粗鬆K: 1', '全純K: 1', '清脯K: 1', '魚鬆K: 1', '魚脯K: 1'],
        肉乾P領料: ['原QP: 6','黑QP: 6','泰式P','脆片P: 3','厚脆P: 6'], 
        肉乾K領料: ['原QK: 1','黑QK: 1','泰式K: 1','脆片K: 1','厚脆K: 1'],
        厚乾P領料: ['圓燒P: 1.2','原條P: 6','黑條P: 6','原厚P: 6','黑厚P: 6','辣厚P: 6','泰厚P: 6'],
        厚乾K領料: ['圓燒K: 1','原條K: 1','黑條K: 1','原厚K: 1','黑厚K: 1','辣厚K: 1','泰厚K: 1'],
        五香K領料: ['原QP: 6','黑QP: 6','泰式P','脆片P: 3','厚脆P: 6'],
        海味K領料: ['原QP: 6','黑QP: 6','泰式P','脆片P: 3','厚脆P: 6'],
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

    const defaultCounts = {
        P1: typeof defaultP1Count !== 'undefined' ? defaultP1Count : 0,
        P2: typeof defaultP2Count !== 'undefined' ? defaultP2Count : 0,
        P4: typeof defaultP4Count !== 'undefined' ? defaultP4Count : 0
    };

    Object.keys(defaultCounts).forEach(key => {
        if (defaultCounts[key] > 0 && document.getElementById(`picking${key}-container-wrapper`)) {
            for (let i = 0; i < defaultCounts[key]; i++) {
                const containerId = `picking${key}-container-${i + 1}`;
                const container = document.createElement('div');
                container.id = containerId;
                document.getElementById(`picking${key}-container-wrapper`).appendChild(container);
                addComponent(containerId, `picking${key}-template`, itemWeights[key]);
            }
        }
    });

    Object.keys(defaultCounts).forEach(key => {
        const addButton = document.getElementById(`add-picking${key}-button`);
        if (addButton) {
            addButton.addEventListener('click', function() {
                const newContainerId = `picking${key}-container-${document.querySelectorAll(`[id^="picking${key}-container"]`).length + 1}`;
                const newContainer = document.createElement('div');
                newContainer.id = newContainerId;
                document.getElementById(`picking${key}-container-wrapper`).appendChild(newContainer);
                addComponent(newContainerId, `picking${key}-template`, itemWeights[key]);
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

    document.addEventListener('focus', function(event) {
        if (/pickingP4+-(quantity|weight)/.test(event.target.className)) {
            event.target.select();
        }
    }, true);

    
});