const timeDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const workModeBtn = document.getElementById('work-mode');
const breakModeBtn = document.getElementById('break-mode');
const circle = document.querySelector('.progress-ring__circle');
const body = document.body;
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;
let timeLeft = 25 * 60;
let totalTime = 25 * 60;
let timerId = null;
let isWorkMode = true;
function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const percent = (timeLeft / totalTime) * 100;
  // Invert progress for countdown effect (full to empty)
  // Actually, let's make it go from full to empty.
  // At start (timeLeft == totalTime), percent is 100. offset should be 0.
  // At end (timeLeft == 0), percent is 0. offset should be circumference.
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}
function startTimer() {
  if (timerId) return;
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  timerId = setInterval(() => {
    timeLeft--;
    updateDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerId);
      timerId = null;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      // Optional: Play sound here
      alert(isWorkMode ? "Focus session complete! Take a break." : "Break over! Back to work.");
      resetTimer(); // Or auto-switch? Let's just reset for now.
    }
  }, 1000);
}
function pauseTimer() {
  clearInterval(timerId);
  timerId = null;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}
function resetTimer() {
  pauseTimer();
  timeLeft = isWorkMode ? 25 * 60 : 5 * 60;
  totalTime = timeLeft;
  updateDisplay();
  // Reset circle to full
  circle.style.strokeDashoffset = 0;
}
function switchMode(mode) {
  if (mode === 'work') {
    isWorkMode = true;
    timeLeft = 25 * 60;
    workModeBtn.classList.add('active');
    breakModeBtn.classList.remove('active');
    body.classList.remove('break-mode');
  } else {
    isWorkMode = false;
    timeLeft = 5 * 60;
    workModeBtn.classList.remove('active');
    breakModeBtn.classList.add('active');
    body.classList.add('break-mode');
  }
  totalTime = timeLeft;
  resetTimer();
}
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
workModeBtn.addEventListener('click', () => switchMode('work'));
breakModeBtn.addEventListener('click', () => switchMode('break'));
// Initialize
updateDisplay();
circle.style.strokeDashoffset = 0; // Start full
