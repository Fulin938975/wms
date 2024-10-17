document.addEventListener('DOMContentLoaded', function() {
    const templates = {
        P2: `
            <template id="pickingP2-template">
                <div class="pickingP2-component">
                    <button type="button" class="remove-button"></button>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP2-item">領料品項:</label>
                        <div class="dropdown">
                            <button class="dropdown-toggle pickingP2-item" type="button">請選擇分類</button>
                            <div class="dropdown-menu"></div>
                        </div>
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
        `
    };

    Object.values(templates).forEach(template => {
        document.body.insertAdjacentHTML('beforeend', template);
    });

    const itemWeights = {
        原鬆K: 1.8,
        招牌細K: 1.2,
        配料: 0
    };

    function populateDropdown(dropdownMenu, items) {
        dropdownMenu.innerHTML = ''; // 清空選單
        items.forEach(item => {
            const option = document.createElement('div');
            option.className = 'dropdown-item';
            option.textContent = item;
            dropdownMenu.appendChild(option);
        });
    }

    function formatInput(input) {
        let value = input.value.replace(/\D/g, ''); // 移除非數字字符

        if (value.length > 3) {
            value = value.slice(0, -3) + '.' + value.slice(-3);
        } else {
            value = '0.' + value.padStart(3, '0');
        }

        input.value = parseFloat(value).toFixed(3); // 確保數字格式化為小數點後三位
    }

    function addComponent(containerId, templateId, weights, defaultItem) {
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

        // 設置初始值
        dropdownToggle.textContent = defaultItem; // 設置為預設選項
        quantityInput.value = weights[defaultItem];
        weightInput.value = weights[defaultItem];

        dropdownToggle.addEventListener('click', function() {
            dropdownMenu.classList.toggle('show');
        });

        dropdownMenu.addEventListener('click', function(event) {
            if (event.target.classList.contains('dropdown-item')) {
                dropdownToggle.textContent = event.target.textContent;
                weightInput.value = weights[event.target.textContent];
                quantityInput.value = weights[event.target.textContent]; // 更新數量
                dropdownMenu.classList.remove('show');
            }
        });

        // 監聽重量輸入的變更事件
        weightInput.addEventListener('input', function() {
            formatInput(weightInput);
            quantityInput.value = weightInput.value; // 更新數量
        });

        // 監聽數量輸入的變更事件
        quantityInput.addEventListener('input', function() {
            formatInput(quantityInput);
            weightInput.value = quantityInput.value; // 更新重量
        });

        // 點擊數量或重量欄位時自動全選
        quantityInput.addEventListener('focus', function() {
            quantityInput.select();
        });

        weightInput.addEventListener('focus', function() {
            weightInput.select();
        });

        container.appendChild(clone);
    }

    const defaultCounts = {
        P2: typeof defaultP2Count !== 'undefined' ? defaultP2Count : 3
    };

    const defaultItems = ['原鬆K', '招牌細K', '配料'];

    Object.keys(defaultCounts).forEach(key => {
        if (defaultCounts[key] > 0 && document.getElementById(`picking${key}-container-wrapper`)) {
            for (let i = 0; i < defaultCounts[key]; i++) {
                const containerId = `picking${key}-container-${i + 1}`;
                const container = document.createElement('div');
                container.id = containerId;
                document.getElementById(`picking${key}-container-wrapper`).appendChild(container);
                addComponent(containerId, `picking${key}-template`, itemWeights, defaultItems[i]);
            }
        }
    });
});