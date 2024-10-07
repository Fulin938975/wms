document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded and parsed");

  // 領料品項對應的生產品項映射
  const itemMapping = {
      '招牌細P': '招牌細K',
      '原鬆P': '原鬆K',
      '特鬆P': '粗海苔K',
      '營業P': '營業原K',
      '粗鬆P': '粗鬆K',
      '全純P': '全純K'
  };

  // 綁定 P1 選單的交互邏輯
  function bindPickingEvents() {
      const pickingToggles = document.querySelectorAll('.pickingP1-component .dropdown-toggle');

      pickingToggles.forEach(pickingToggle => {
          const dropdownMenu = pickingToggle.nextElementSibling;

          if (!dropdownMenu || !dropdownMenu.classList.contains('dropdown-menu')) {
              console.warn("No valid dropdown menu found for picking toggle:", pickingToggle);
              return;
          }

          // 點擊選單按鈕，顯示或隱藏選單
          pickingToggle.addEventListener('click', function() {
              dropdownMenu.classList.toggle('show');
          });

          // 點擊選單項目時進行選擇
          dropdownMenu.addEventListener('click', function(event) {
              if (event.target.classList.contains('dropdown-item')) {
                  const selectedItem = event.target.textContent.trim();
                  console.log("Picking item selected:", selectedItem);
                  pickingToggle.textContent = selectedItem;

                  // 關閉選單
                  dropdownMenu.classList.remove('show');

                  // 立即將對應的值設置到 B2 顯示框內
                  updateB2DisplayValue(selectedItem);
              }
          });
      });
  }

  // 直接將選定的 P1 對應的值顯示到 B2 框內
  function updateB2DisplayValue(selectedP1Item) {
      console.log("Setting B2 value for selected P1 item:", selectedP1Item);

      // 找到所有 B2 元件的顯示框，這裡假設 .produceB2-component 內有一個需要顯示選擇值的 .dropdown-toggle
      const b2Components = document.querySelectorAll('.produceB2-component .dropdown-toggle');

      if (b2Components.length === 0) {
          console.warn("No B2 component found to update. Ensure B2 component is available.");
          return; // 如果沒有找到 B2 元件，直接返回
      }

      // 獲取 P1 選定的對應值
      const correspondingValue = itemMapping[selectedP1Item] || '未選擇';

      // 更新每個 B2 元件的顯示框
      b2Components.forEach(b2Component => {
          b2Component.textContent = correspondingValue;
          console.log("Updated B2 component display to:", correspondingValue);
      });
  }

  // 初始化函數
  function initialize() {
      // 綁定 P1 的交互事件
      bindPickingEvents();
  }

  // 啟動初始化
  initialize();
});
