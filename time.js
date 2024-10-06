let timers = {};
let timerIntervals = {};
let manualTimeUpdated = {};
const standardTime = 10000; // 16分鐘   
const maxTime = 15000; // 22分鐘 
const warningTime = 12000; // 設置警告時間為確實的經過時間，例如 12000 毫秒（20 分鐘）
const soundWarningTime = 20000; // 聲音警告時間，單位為毫秒 (例如 2 分鐘)
let soundInterval; // 用於存儲聲音警告的間隔 ID
let flashInterval;
let wakeLock = null; // 用於存儲螢幕喚醒鎖

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
                flashScreen('timerBtn2'); // 只讓 T2 元件的開始生產按鈕閃爍
                timers[timerId].flashing = true; // 設置閃爍狀態
                requestWakeLock(); // 啟動螢幕喚醒鎖
            }
            // 檢查是否達到聲音警告時間
            if (timers[timerId].elapsedTime >= soundWarningTime && !timers[timerId].soundPlaying) {
                console.log('達到聲音警告時間，播放聲音');
                playSound();
                soundInterval = setInterval(playSound, 5000); // 每5秒播放一次聲音
                timers[timerId].soundPlaying = true; // 設置聲音播放狀態
            }
            // 檢查是否達到最大時間
            if (timers[timerId].elapsedTime >= maxTime) {
                console.log('達到最大時間');
                // 這裡可以添加其他需要在達到最大時間時執行的操作
            }
        }, 1000);
        document.getElementById(`timerBtn${timerId}`).querySelector('.btn-text').innerText = '生產完成';
        manualTimeUpdated[timerId] = false;
    }
}

// 結束計時
function endTimer(timerId) {
    if (timers[timerId].running) {
        timers[timerId].running = false;
        clearInterval(timerIntervals[timerId]);
        clearInterval(soundInterval); // 停止聲音警告的連續播放
        document.getElementById(`endTimeDisplay${timerId}`).value = getCurrentTime(); // 設置結束時間
        stopFlashScreen('timerBtn2'); // 停止 T2 元件的閃爍
        releaseWakeLock(); // 釋放螢幕喚醒鎖
        document.getElementById(`timerBtn${timerId}`).querySelector('.btn-text').innerText = '已完成';
        document.getElementById(`timerBtn${timerId}`).disabled = true;
        document.getElementById(`timerBtn${timerId}`).style.backgroundColor = 'gray';
    }
}

// 畫面閃爍警告
async function requestWakeLock() {
    if ('wakeLock' in navigator) {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('螢幕喚醒鎖已啟動');
            wakeLock.addEventListener('release', () => {
                console.log('螢幕喚醒鎖已釋放');
            });
        } catch (err) {
            console.error(`${err.name}, ${err.message}`);
        }
    } else {
        console.warn('螢幕喚醒鎖 API 不受支援');
        // 提供替代方案或提示
    }
}

function releaseWakeLock() {
    if (wakeLock !== null) {
        wakeLock.release()
            .then(() => {
                wakeLock = null;
                console.log('螢幕喚醒鎖已釋放');
            });
    }
}

function flashScreen(elementId) {
    if (flashInterval) {
        clearInterval(flashInterval);
    }
    let flashCount = 0;
    const flashElement = document.getElementById(elementId); // 獲取特定的閃爍容器
    if (!flashElement) {
        console.error(`找不到 ID 為 ${elementId} 的元素`);
        return;
    }
    flashInterval = setInterval(() => {
        flashElement.style.backgroundColor = (flashCount % 2 === 0) ? 'red' : 'yellow'; // 閃爍背景顏色
        flashCount++;
        console.log(`閃爍次數: ${flashCount}`);
    }, 500); // 每500毫秒閃爍一次
}

// 停止畫面閃爍
function stopFlashScreen(elementId) {
    clearInterval(flashInterval);
    flashInterval = null;
    const flashElement = document.getElementById(elementId); // 獲取特定的閃爍容器
    if (flashElement) {
        flashElement.style.backgroundColor = ''; // 恢復原來的背景顏色
    }
    console.log('停止閃爍');
    releaseWakeLock(); // 釋放螢幕喚醒鎖
}

// 播放聲音警告
function playSound() {
    const audio = new Audio('sounds/xm3020.wav'); // 替換為你的音頻文件路徑
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

// 初始化計時器
function initTimer(timerId) {
    timers[timerId] = {
        running: false,
        elapsedTime: 0,
        startTime: null,
        endTime: null,
        flashing: false, // 初始化閃爍狀態
        soundPlaying: false // 初始化聲音播放狀態
    };
    manualTimeUpdated[timerId] = false;
}

// 初始化 T1 和 T2 計時器
initTimer('1');
initTimer('2');