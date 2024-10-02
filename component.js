// component.js

// 假設這些變數在某處已經定義
const itemWeightsP1 = { 招牌細P: 4.2, 原鬆P: 4.2, 特鬆P: 4.2, 營業P: 4.2, 粗鬆P: 4.2, 全純P: 4.2 };
const itemWeightsP2 = { 招牌細K: 4.2, 原鬆K: 4.2, 海鬆K: 4.2, 特鬆K: 4.2, 粗海K: 4.2, 營業K: 4.2, 營業海K: 4.2, 粗鬆K: 4.2, 全純K: 4.2 };
const itemWeightsG1 = { 招牌細K: 1, 原鬆K: 1, 海鬆K: 1, 特鬆K: 1, 粗海K: 1, 營業K: 1, 營業海K: 1, 粗鬆K: 1, 全純K: 1 };
const itemWeightsG2 = { 招牌細L: 1, 原鬆L: 1, 海鬆L: 1, 特鬆L: 1, 粗海L: 1, 營業L: 1, 營業海L: 1, 粗鬆L: 1, 全純L: 1 };

// 定義 populateSelectP1 函數
function populateSelectP1(selectElement, items) {
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        selectElement.appendChild(option);
    });
}

// 定義 populateSelectG1 函數
function populateSelectG1(selectElement, items) {
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        selectElement.appendChild(option);
    });
}

// 定義 populateSelectG2 函數
function populateSelectG2(selectElement, items) {
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        selectElement.appendChild(option);
    });
}

// 定義 addComponentP1 函數
function addComponentP1() {
    const template = document.getElementById('component-templateP1');
    if (!template) {
        console.error('component-templateP1 模板未找到');
        return;
    }
    const container = document.getElementById('components-container');
    const clone = document.importNode(template.content, true);
    const component = clone.querySelector('.component');

    const itemSelect = component.querySelector('.item');
    const quantityInput = component.querySelector('.quantity');
    const weightInput = component.querySelector('.weight');

    const weights = itemWeightsP1;
    const items = Object.keys(weights);

    populateSelectP1(itemSelect, items);

    itemSelect.addEventListener('change', function() {
        quantityInput.value = 1;
        updateWeightP1(component, weights);
    });

    quantityInput.addEventListener('input', function() {
        updateWeightP1(component, weights);
    });

    weightInput.addEventListener('input', function() {
        updateQuantityP1(component, weights);
    });

    container.appendChild(clone);

    // 初始化
    updateWeightP1(component, weights);
}

// 定義 addComponentP2 函數
function addComponentP2() {
    const template = document.getElementById('component-templateP2');
    if (!template) {
        console.error('component-templateP1 模板未找到');
        return;
    }
    const container = document.getElementById('components-container');
    const clone = document.importNode(template.content, true);
    const component = clone.querySelector('.component');

    const itemSelect = component.querySelector('.item');
    const quantityInput = component.querySelector('.quantity');
    const weightInput = component.querySelector('.weight');

    const weights = itemWeightsP2;
    const items = Object.keys(weights);

    populateSelectP2(itemSelect, items);

    itemSelect.addEventListener('change', function() {
        quantityInput.value = 1;
        updateWeightP2(component, weights);
    });

    quantityInput.addEventListener('input', function() {
        updateWeightP1(component, weights);
    });

    weightInput.addEventListener('input', function() {
        updateQuantityP2(component, weights);
    });

    container.appendChild(clone);

    // 初始化
    updateWeightP2(component, weights);
}

// 定義 addComponentG1 函數
function addComponentG1() {
    const template = document.getElementById('component-templateG1');
    if (!template) {
        console.error('component-templateG1 模板未找到');
        return;
    }
    const container = document.getElementById('components-container');
    const clone = document.importNode(template.content, true);
    const component = clone.querySelector('.component');

    const itemSelect = component.querySelector('.item');
    const quantityInput = component.querySelector('.quantity');
    const weightInput = component.querySelector('.weight');

    const weights = itemWeightsG1;
    const items = Object.keys(weights);

    populateSelectG1(itemSelect, items);

    itemSelect.addEventListener('change', function() {
        quantityInput.value = 1;
        updateWeightG1(component, weights);
    });

    quantityInput.addEventListener('input', function() {
        updateWeightG1(component, weights);
    });

    weightInput.addEventListener('input', function() {
        updateQuantityG1(component, weights);
    });

    container.appendChild(clone);

    // 初始化
    updateWeightG1(component, weights);
}

// 定義 addComponentG2 函數
function addComponentG2() {
    const template = document.getElementById('component-templateG2');
    if (!template) {
        console.error('component-templateG2 模板未找到');
        return;
    }
    const container = document.getElementById('components-container');
    const clone = document.importNode(template.content, true);
    const component = clone.querySelector('.component');

    const itemSelect = component.querySelector('.item');
    const quantityInput = component.querySelector('.quantity');
    const weightInput = component.querySelector('.weight');

    const weights = itemWeightsG2;
    const items = Object.keys(weights);

    populateSelectG2(itemSelect, items);

    itemSelect.addEventListener('change', function() {
        quantityInput.value = 1;
        updateWeightG2(component, weights);
    });

    quantityInput.addEventListener('input', function() {
        updateWeightG2(component, weights);
    });

    weightInput.addEventListener('input', function() {
        updateQuantityG2(component, weights);
    });

    container.appendChild(clone);

    // 初始化
    updateWeightG2(component, weights);
}