let timers = {};
let timerIntervals = {};
let manualTimeUpdated = {};
const standardTime = 60000; // 1分鐘
const maxTime = 90000; // 1.5分鐘

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
        }, 1000);
        document.getElementById(`timerBtn${timerId}`).querySelector('.btn-text').innerText = '生產完成';
        manualTimeUpdated[timerId] = false;
    }
}

// 結束計時
function endTimer(timerId) {
    if (timers[timerId].running) {
        clearInterval(timerIntervals[timerId]);
        timers[timerId].running = false;
        timers[timerId].endTime = Date.now();
        document.getElementById(`endTimeDisplay${timerId}`).value = getCurrentTime(timers[timerId].endTime);
        updateProductionTime(timerId);
        document.getElementById(`timerBtn${timerId}`).disabled = true;
        document.getElementById(`timerBtn${timerId}`).style.backgroundColor = '#ccc';
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

// 初始化計時器
function initTimer(timerId) {
    timers[timerId] = {
        running: false,
        elapsedTime: 0,
        startTime: null,
        endTime: null
    };
    manualTimeUpdated[timerId] = false;
}

// 初始化 T1 和 T2 計時器
initTimer('1');
initTimer('2');