// 定義領料品項及其對應的重量
const itemWeightsP1 = { 招牌細P: 4.2, 原鬆P: 4.2, 特鬆P: 4.2, 營業P: 4.2, 粗鬆P: 4.2, 全純P: 4.2 };

// 定義 populateSelect 函數
function populateSelect(selectElement, items) {
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
    const component = clone.querySelector('.pickingP1-component');

    const itemSelect = component.querySelector('.pickingP1-item');
    const quantityInput = component.querySelector('.pickingP1-quantity');
    const weightInput = component.querySelector('.pickingP1-weight');

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
    const itemSelect = component.querySelector('.pickingP1-item');
    const quantityInput = component.querySelector('.pickingP1-quantity');
    const weightInput = component.querySelector('.pickingP1-weight');

    const selectedItem = itemSelect.value;
    const quantity = parseFloat(quantityInput.value);

    if (weights[selectedItem] !== undefined) {
        weightInput.value = (weights[selectedItem] * quantity).toFixed(3);
    }
}

function updateQuantity(component, weights) {
    const itemSelect = component.querySelector('.pickingP1-item');
    const quantityInput = component.querySelector('.pickingP1-quantity');
    const weightInput = component.querySelector('.pickingP1-weight');

    const selectedItem = itemSelect.value;
    const weight = parseFloat(weightInput.value);

    if (weights[selectedItem] !== undefined) {
        quantityInput.value = (weight / weights[selectedItem]).toFixed(3);
    }
}

// 等待頁面加載後嵌入 PickingP1 的內容
document.addEventListener('DOMContentLoaded', function() {
    const template = `
        <template id="pickingP1-template">
            <div class="pickingP1-component">
                <label for="pickingP1-item">領料品項：</label>
                <select class="pickingP1-item" name="pickingP1-item"></select><br>

                <label for="pickingP1-quantity">領料數量：</label>
                <input type="number" class="pickingP1-quantity" name="pickingP1-quantity" value="0" min="0.001" step="0.001"><br>

                <label for="pickingP1-weight">領料重量(公斤)：</label>
                <input type="number" class="pickingP1-weight" name="pickingP1-weight" value="0" min="0.001" step="0.001"><br>
                <button class="remove-pickingP1-button">刪除</button>
            </div>
        </template>
    `;
    document.body.insertAdjacentHTML('beforeend', template);

    // 動態加載指定數量的 PickingP1 元件
    const pickingP1Containers = document.querySelectorAll('[id^="pickingP1-container"]');
    pickingP1Containers.forEach((container, index) => {
        addComponent(container.id, 'pickingP1-template', itemWeightsP1);
    });

    // 添加按鈕事件處理程序
    document.getElementById('add-pickingP1-button').addEventListener('click', function() {
        const newContainerId = `pickingP1-container-${document.querySelectorAll('[id^="pickingP1-container"]').length + 1}`;
        const newContainer = document.createElement('div');
        newContainer.id = newContainerId;
        document.getElementById('pickingP1-container-wrapper').appendChild(newContainer);
        addComponent(newContainerId, 'pickingP1-template', itemWeightsP1);
    });

    // 添加刪除按鈕事件處理程序
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-pickingP1-button')) {
            const component = event.target.closest('.pickingP1-component');
            if (component) {
                component.parentElement.removeChild(component);
            }
        }
    });
});