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
                    <button type="button" class="remove-button"></button>
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
        // 依次添加 P3 到 P10 的模板
        P3: `
            <template id="pickingP3-template">
                <div class="pickingP3-component">
                    <button type="button" class="remove-button"></button>
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
        `,
        // 依次添加 P4 到 P10 的模板
        P4: `
            <template id="pickingP4-template">
                <div class="pickingP4-component">
                    <button type="button" class="remove-button"></button>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP4-item">領料品項:</label>
                        <select class="pickingP4-item" name="pickingP4-item"></select>
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
        `,
        P5: `
            <template id="pickingP5-template">
                <div class="pickingP5-component">
                    <button type="button" class="remove-button"></button>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP5-item">領料品項:</label>
                        <select class="pickingP5-item" name="pickingP5-item"></select>
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP5-quantity">領料數量:</label>
                        <input type="number" class="pickingP5-quantity" name="pickingP5-quantity" value="0" min="0.001" step="0.001">
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP5-weight">領料重量(kg):</label>
                        <input type="number" class="pickingP5-weight" name="pickingP5-weight" value="0" min="0.001" step="0.001">
                    </div>
                </div>
            </template>
        `,
        P6: `
            <template id="pickingP6-template">
                <div class="pickingP6-component">
                    <button type="button" class="remove-button"></button>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP6-item">領料品項:</label>
                        <select class="pickingP6-item" name="pickingP6-item"></select>
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP6-quantity">領料數量:</label>
                        <input type="number" class="pickingP6-quantity" name="pickingP6-quantity" value="0" min="0.001" step="0.001">
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP6-weight">領料重量(kg):</label>
                        <input type="number" class="pickingP6-weight" name="pickingP6-weight" value="0" min="0.001" step="0.001">
                    </div>
                </div>
            </template>
        `,
        P7: `
            <template id="pickingP7-template">
                <div class="pickingP7-component">
                    <button type="button" class="remove-button"></button>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP7-item">領料品項:</label>
                        <select class="pickingP7-item" name="pickingP7-item"></select>
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP7-quantity">領料數量:</label>
                        <input type="number" class="pickingP7-quantity" name="pickingP7-quantity" value="0" min="0.001" step="0.001">
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP7-weight">領料重量(kg):</label>
                        <input type="number" class="pickingP7-weight" name="pickingP7-weight" value="0" min="0.001" step="0.001">
                    </div>
                </div>
            </template>
        `,
        P8: `
            <template id="pickingP8-template">
                <div class="pickingP8-component">
                    <button type="button" class="remove-button"></button>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP8-item">領料品項:</label>
                        <select class="pickingP8-item" name="pickingP8-item"></select>
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP8-quantity">領料數量:</label>
                        <input type="number" class="pickingP8-quantity" name="pickingP8-quantity" value="0" min="0.001" step="0.001">
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP8-weight">領料重量(kg):</label>
                        <input type="number" class="pickingP8-weight" name="pickingP8-weight" value="0" min="0.001" step="0.001">
                    </div>
                </div>
            </template>
        `,
        P9: `
            <template id="pickingP9-template">
                <div class="pickingP9-component">
                    <button type="button" class="remove-button"></button>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP9-item">領料品項:</label>
                        <select class="pickingP9-item" name="pickingP9-item"></select>
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP9-quantity">領料數量:</label>
                        <input type="number" class="pickingP9-quantity" name="pickingP9-quantity" value="0" min="0.001" step="0.001">
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP9-weight">領料重量(kg):</label>
                        <input type="number" class="pickingP9-weight" name="pickingP9-weight" value="0" min="0.001" step="0.001">
                    </div>
                </div>
            </template>
        `,
        P10: `
            <template id="pickingP10-template">
                <div class="pickingP10-component">
                    <button type="button" class="remove-button"></button>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP10-item">領料品項:</label>
                        <select class="pickingP10-item" name="pickingP10-item"></select>
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP10-quantity">領料數量:</label>
                        <input type="number" class="pickingP10-quantity" name="pickingP10-quantity" value="0" min="0.001" step="0.001">
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="pickingP10-weight">領料重量(kg):</label>
                        <input type="number" class="pickingP10-weight" name="pickingP10-weight" value="0" min="0.001" step="0.001">
                    </div>
                </div>
            </template>
        `
    };

    Object.values(templates).forEach(template => {
        document.body.insertAdjacentHTML('beforeend', template);
    });

    const defaultCounts = {
        P1: defaultP1Count,
        P2: defaultP2Count,
        P3: defaultP3Count,
        P4: defaultP4Count,
        P5: defaultP5Count,
        P6: defaultP6Count,
        P7: defaultP7Count,
        P8: defaultP8Count,
        P9: defaultP9Count,
        P10: defaultP10Count
    };

        // 定義領料品項及其對應的重量
        const itemWeights = {
            P1: { 招牌細P: 4.2, 原鬆P: 4.2, 特鬆P: 4.2, 營業P: 4.2, 粗鬆P: 4.2, 全純P: 4.2 },
            P2: { 招牌細k: 1, 原鬆k: 1, 特鬆k: 1, 營業k: 1, 粗鬆k: 1, 全純k: 1 },
            P3: { 原QP: 6, 黑QP: 6, 泰式P: 6 , 脆片P: 3, 厚脆: 6, },
            P4: { 原QK: 1, 黑QK: 1, 泰式K: 1, 脆片K: 1, 厚脆K: 1 },
            P5: { 圓燒P: 1.2, 原條P: 6, 黑條P: 6, 原厚P: 6, 黑厚P: 6, 辣厚P: 6,泰厚P: 6, },
            P6: { 圓燒K: 1, 原條K: 1, 黑條K: 1, 原厚K: 1, 黑厚K: 1, 辣厚K: 1, 泰厚K: 1 },
            P7: { 品項M: 4.0, 品項N: 4.5, 品項O: 5.0 },
            P8: { 品項P: 6.0, 品項Q: 6.5, 品項R: 7.0 },
            P9: { 品項S: 8.0, 品項T: 8.5, 品項U: 9.0 },
            P10: { 品項V: 10.0, 品項W: 10.5, 品項X: 11.0 }
        };
    
        // 定義 populateSelect 函數
        function populateSelect(selectElement, items) {
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                selectElement.appendChild(option);
            });
        }

        // 定義 populateSelect 函數
function populateSelect(selectElement, items) {
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '請選擇品項';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);

    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        selectElement.appendChild(option);
    });
}
    
        // 定義 addComponent 函數
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
    
            populateSelect(itemSelect, items);
    
            itemSelect.addEventListener('change', function() {
                quantityInput.value = 1;
                updateWeight(component, weights);
            });
    
            quantityInput.addEventListener('input', function() {
                updateWeight(component, weights);
            });
    
            weightInput.addEventListener('input', function() {
                updateQuantity(component, weights);
            });
    
            container.appendChild(clone);
    
            // 初始化
            updateWeight(component, weights);
        }
    
        // 定義 updateWeight 和 updateQuantity 函數
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
    
        // 預設添加指定數量的領料元件
        Object.keys(defaultCounts).forEach(key => {
            for (let i = 0; i < defaultCounts[key]; i++) {
                const containerId = `picking${key}-container-${i + 1}`;
                const container = document.createElement('div');
                container.id = containerId;
                document.getElementById(`picking${key}-container-wrapper`).appendChild(container);
                addComponent(containerId, `picking${key}-template`, itemWeights[key]);
            }
        });
    
        // 添加按鈕事件處理程序
        Object.keys(defaultCounts).forEach(key => {
            document.getElementById(`add-picking${key}-button`).addEventListener('click', function() {
                const newContainerId = `picking${key}-container-${document.querySelectorAll(`[id^="picking${key}-container"]`).length + 1}`;
                const newContainer = document.createElement('div');
                newContainer.id = newContainerId;
                document.getElementById(`picking${key}-container-wrapper`).appendChild(newContainer);
                addComponent(newContainerId, `picking${key}-template`, itemWeights[key]);
            });
        });
    
        // 添加刪除按鈕事件處理程序
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('remove-button')) {
                const component = event.target.closest('[class*="-component"]');
                if (component) {
                    component.parentElement.removeChild(component);
                }
            }
        });
    });

// 添加點擊全選功能
document.addEventListener('focus', function(event) {
    if (/pickingP\d+-(quantity|weight)/.test(event.target.className)) {
        event.target.select();
    }
}, true);