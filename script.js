let totalSeconds = 600;
let timerInterval = null;

const display = document.getElementById("display");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const glitch = document.getElementById("glitch");
const bootScreen = document.getElementById("bootScreen");
const mainUI = document.getElementById("mainUI");

/* Update Display */
function updateDisplay() {
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  display.textContent =
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
}

/* Alarm Burst */
function playAlarmBurst() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  for (let i = 0; i < 5; i++) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(900, audioCtx.currentTime + i * 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(audioCtx.currentTime + i * 0.3);
    oscillator.stop(audioCtx.currentTime + i * 0.3 + 0.2);
  }
}

/* Red Alert */
function triggerRedAlert() {
  document.body.classList.add("red-alert");
  display.classList.add("alert-text");
  glitch.classList.add("glitch-active");
  display.textContent = "SYSTEM FAILURE";
  playAlarmBurst();

  setTimeout(startBootSequence, 3000);
}

/* Boot Sequence */
function startBootSequence() {
  document.body.classList.remove("red-alert");
  glitch.classList.remove("glitch-active");
  display.classList.remove("alert-text");

  mainUI.style.display = "none";
  bootScreen.classList.add("boot-active");

  const bootText = [
    "Initializing system...",
    "Checking memory... OK",
    "Loading kernel modules...",
    "Mounting drives...",
    "Restoring neural interface...",
    "Rebuilding core timer service...",
    "System integrity: STABLE",
    "Reboot complete.",
    "",
    ">> TIMER SYSTEM ONLINE <<",
    ">> THIS IS A JOKE  <<",
  ];

  typeLines(bootText, 0);
}

function typeLines(lines, index) {
  if (index >= lines.length) {
    setTimeout(finishBoot, 2000);
    return;
  }

  let line = lines[index];
  let charIndex = 0;

  let typing = setInterval(() => {
    if (charIndex < line.length) {
      bootScreen.textContent += line.charAt(charIndex);
      charIndex++;
    } else {
      clearInterval(typing);
      bootScreen.textContent += "\n";
      setTimeout(() => typeLines(lines, index + 1), 500);
    }
  }, 40);
}

function finishBoot() {
  bootScreen.classList.remove("boot-active");
  bootScreen.textContent = "";
  mainUI.style.display = "block";
  resetTimer();
}

/* Controls */
function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      updateDisplay();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      triggerRedAlert();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  totalSeconds = 600;

  document.body.classList.remove("red-alert");
  display.classList.remove("alert-text");
  glitch.classList.remove("glitch-active");

  updateDisplay();
}

/* Event Listeners */
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

updateDisplay();
