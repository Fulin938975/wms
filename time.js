document.addEventListener('DOMContentLoaded', function() {
    const templates = {
        T1: `
            <template id="produceT1-template">
                <div id="t1-container" class="timer-component">
                    <div class="form-group horizontal-form-group">
                        <label for="startTimeDisplay1">開始時間:</label>
                        <input type="text" id="startTimeDisplay1" placeholder="輸入 HHMM" onclick="this.select()" onblur="handleManualTimeUpdate('startTimeDisplay1');">
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label>生產時間:</label>
                        <span id="timerDisplay1">00:00</span>
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="endTimeDisplay1">結束時間:</label>
                        <input type="text" id="endTimeDisplay1" placeholder="輸入 HHMM" onclick="this.select()" onblur="handleManualTimeUpdate('endTimeDisplay1');">
                    </div>
                    <button id="timerBtn1" onclick="toggleTimer('1')">
                        <span class="btn-text">開始生產</span>
                    </button>
                </div>
            </template>
        `,
        T2: `
            <template id="produceT2-template">
                <div id="t2-container" class="timer-component">
                    <div class="form-group horizontal-form-group">
                        <label for="startTimeDisplay2">開始時間:</label>
                        <input type="text" id="startTimeDisplay2" placeholder="輸入 HHMM" onclick="this.select()" onblur="handleManualTimeUpdate('startTimeDisplay2');">
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label>生產時間:</label>
                        <span id="timerDisplay2">00:00</span>
                    </div>
                    <div class="form-group horizontal-form-group">
                        <label for="endTimeDisplay2">結束時間:</label>
                        <input type="text" id="endTimeDisplay2" placeholder="輸入 HHMM" onclick="this.select()" onblur="handleManualTimeUpdate('endTimeDisplay2');">
                    </div>
                    <div class="progress-container">
                        <div id="progressBarT2" class="progress-bar-t2"></div>
                    </div>
                    <button id="timerBtn2" onclick="toggleTimer('2')">
                        <span class="btn-text">開始生產</span>
                    </button>
                </div>
            </template>
        `
    };

    Object.values(templates).forEach(template => {
        document.body.insertAdjacentHTML('beforeend', template);
    });

    const defaultCounts = {
        T1: typeof defaultT1Count !== 'undefined' ? defaultT1Count : 0,
        T2: typeof defaultT2Count !== 'undefined' ? defaultT2Count : 0
    };

    Object.keys(defaultCounts).forEach(key => {
        if (defaultCounts[key] > 0 && document.getElementById(`produce${key}-container-wrapper`)) {
            for (let i = 0; i < defaultCounts[key]; i++) {
                const containerId = `produce${key}-container-${i + 1}`;
                const container = document.createElement('div');
                container.id = containerId;
                document.getElementById(`produce${key}-container-wrapper`).appendChild(container);
                addComponent(containerId, `produce${key}-template`);
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
                addComponent(newContainerId, `produce${key}-template`);
            });
        }
    });

    function addComponent(containerId, templateId) {
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
        container.appendChild(clone);
    }

    // 初始化計時器
    function initTimer(timerId) {
        timers[timerId] = {
            running: false,
            elapsedTime: 0,
            startTime: null,
            endTime: null,
            flashing: false, // 初始化閃爍狀態
            soundPlayed: false, // 初始化聲音播放狀態
            wakeLock: null, // 初始化螢幕喚醒鎖
            wakeLockInterval: null // 初始化螢幕喚醒間隔
        };
        manualTimeUpdated[timerId] = false;
    }

    // 初始化 T1 和 T2 計時器
    initTimer('1');
    initTimer('2');
});

// 其他功能保持不變
let timers = {};
let timerIntervals = {};
let manualTimeUpdated = {};
const standardTime = 10000; // 16分鐘   
const maxTime = 15000; // 22分鐘 
const warningTime = 12000; // 設置警告時間為確實的經過時間，例如 12000 毫秒（20 分鐘）
const soundWarningTime = 8000; // 設置聲音警告時間，例如 8000 毫秒（13 分鐘）

// 切換計時器狀態
function toggleTimer(timerId) {
    if (!timers[timerId].running) {
        startTimer(timerId);
    } else {
        endTimer(timerId);
    }
}

// 開始計時
function startTimer(timerId) {
    if (!timers[timerId].running) {
        timers[timerId].running = true;
        timers[timerId].startTime = manualTimeUpdated[timerId] ? parseTime(document.getElementById(`startTimeDisplay${timerId}`).value) : Date.now() - timers[timerId].elapsedTime;
        document.getElementById(`startTimeDisplay${timerId}`).value = getCurrentTime(timers[timerId].startTime);
        timerIntervals[timerId] = setInterval(() => {
            timers[timerId].elapsedTime = Date.now() - timers[timerId].startTime;
            document.getElementById(`timerDisplay${timerId}`).innerText = formatTime(timers[timerId].elapsedTime);
            if (timerId === '2') {
                updateProgressBarT2();
            }
            // 檢查是否達到警告時間
            if (timers[timerId].elapsedTime >= warningTime && !timers[timerId].flashing) {
                console.log('達到警告時間，開始閃爍');
                flashScreen(timerId);
                timers[timerId].flashing = true; // 設置閃爍狀態
            }
            // 檢查是否達到聲音警告時間
            if (timers[timerId].elapsedTime >= soundWarningTime && !timers[timerId].soundPlayed) {
                console.log('達到聲音警告時間，播放聲音');
                playSound();
                timers[timerId].soundPlayed = true; // 設置聲音已播放狀態
            }
            // 檢查是否達到最大時間
            if (timers[timerId].elapsedTime >= maxTime) {
                console.log('達到最大時間');
                playSound();
            }
        }, 1000);
        document.getElementById(`timerBtn${timerId}`).querySelector('.btn-text').innerText = '生產完成';
        manualTimeUpdated[timerId] = false;

        // 啟動螢幕喚醒功能
        startWakeLock(timerId);
    }
}

// 結束計時
function endTimer(timerId) {
    if (timers[timerId].running) {
        timers[timerId].running = false;
        clearInterval(timerIntervals[timerId]);
        document.getElementById(`timerBtn${timerId}`).querySelector('.btn-text').innerText = '已完成';
        document.getElementById(`timerBtn${timerId}`).disabled = true;
        document.getElementById(`timerBtn${timerId}`).style.backgroundColor = 'gray';
        document.getElementById(`endTimeDisplay${timerId}`).value = getCurrentTime(); // 設置結束時間
        stopFlashScreen(timerId); // 按下“生產完成”按鈕時停止畫面閃爍

        // 停止螢幕喚醒功能
        stopWakeLock(timerId);
    }
}

// 畫面閃爍警告
let flashInterval;
function flashScreen(timerId) {
    if (flashInterval) {
        clearInterval(flashInterval);
    }
    let flashCount = 0;
    const button = document.getElementById(`timerBtn${timerId}`);
    flashInterval = setInterval(() => {
        button.style.backgroundColor = (flashCount % 2 === 0) ? 'red' : '';
        flashCount++;
    }, 500); // 每500毫秒閃爍一次
}

// 停止畫面閃爍
function stopFlashScreen(timerId) {
    clearInterval(flashInterval);
    flashInterval = null;
    const button = document.getElementById(`timerBtn${timerId}`);
    button.style.backgroundColor = ''; // 恢復原來的背景顏色
    console.log('停止閃爍');
}

// 播放聲音警告
function playSound() {
    const audio = new Audio('sounds/alert.mp3'); // 替換為你的音頻文件路徑
    audio.play();
}

// 更新進度條 T2
function updateProgressBarT2() {
    const progressBar = document.getElementById('progressBarT2');
    const progress = (timers['2'].elapsedTime / maxTime) * 100; // 使用 maxTime 計算進度百分比
    progressBar.style.width = `${progress}%`;

    if (progress <= 20) {
        progressBar.style.backgroundColor = '#FFED97';
    } else if (progress <= 40) {
        progressBar.style.backgroundColor = '#FFDC35';
    } else if (progress <= 60) {
        progressBar.style.backgroundColor = '#FFAF60';
    } else if (progress <= 70) {
        progressBar.style.backgroundColor = '#FF8000';
    } else if (progress <= 90) {
        progressBar.style.backgroundColor = '#F75000';
    } else {
        progressBar.style.backgroundColor = 'red';
    }
}

// 獲取當前時間，格式為 HH:MM:SS
function getCurrentTime(time = Date.now()) {
    const now = new Date(time);
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// 格式化時間，顯示為 H:MM:SS 或 MM:SS
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return hours > 0 
        ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 解析時間字串為毫秒數
function parseTime(timeStr) {
    const parts = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(parts[0], 10));
    date.setMinutes(parseInt(parts[1], 10));
    date.setSeconds(parseInt(parts[2], 10));
    date.setMilliseconds(0);
    return date.getTime();
}

// 更新生產時間
function updateProductionTime(timerId) {
    const startTimeStr = document.getElementById(`startTimeDisplay${timerId}`).value;
    const endTimeStr = document.getElementById(`endTimeDisplay${timerId}`).value;
    const formattedStartTime = parseManualTime(startTimeStr);
    const formattedEndTime = parseManualTime(endTimeStr);
    if (formattedStartTime && formattedEndTime) {
        const duration = formattedEndTime - formattedStartTime;
        document.getElementById(`timerDisplay${timerId}`).innerText = formatTime(duration);
    }
}

// 解析手動輸入的時間
function parseManualTime(timeStr) {
    timeStr = timeStr.replace(/\s+/g, '');
    if (/^\d{6}$/.test(timeStr)) {
        return parseTime(`${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}:${timeStr.slice(4, 6)}`);
    }
    if (/^\d{4}$/.test(timeStr)) {
        return parseTime(`${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}:00`);
    }
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeStr)) {
        return parseTime(timeStr);
    }
    return null;
}

// 格式化手動輸入的時間，顯示為 HH:MM:SS
function formatManualTime(time) {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}:00`;
}

// 處理手動時間更新
function handleManualTimeUpdate(inputId) {
    const inputElement = document.getElementById(inputId);
    const timeStr = inputElement.value;
    const formattedTime = formatManualTime(parseManualTime(timeStr));
    inputElement.value = formattedTime;
    const timerId = inputId.replace('startTimeDisplay', '').replace('endTimeDisplay', '');
    updateProductionTime(timerId);
}

// 螢幕喚醒功能
async function startWakeLock(timerId) {
    try {
        timers[timerId].wakeLock = await navigator.wakeLock.request('screen');
        console.log('螢幕喚醒已啟動');
        timers[timerId].wakeLockInterval = setInterval(async () => {
            try {
                timers[timerId].wakeLock = await navigator.wakeLock.request('screen');
                console.log('螢幕喚醒已重新啟動');
            } catch (err) {
                console.error('螢幕喚醒重新啟動失敗:', err);
            }
        }, 60000); // 每隔1分鐘重新喚醒一次
    } catch (err) {
        console.error('螢幕喚醒啟動失敗:', err);
    }
}

function stopWakeLock(timerId) {
    if (timers[timerId].wakeLock) {
        timers[timerId].wakeLock.release().then(() => {
            console.log('螢幕喚醒已停止');
        });
        timers[timerId].wakeLock = null;
    }
    if (timers[timerId].wakeLockInterval) {
        clearInterval(timers[timerId].wakeLockInterval);
        timers[timerId].wakeLockInterval = null;
    }
}