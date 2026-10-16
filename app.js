const app = document.querySelector('#app');
const scrim = document.querySelector('#scrim');
const sheet = document.querySelector('#feelingSheet');
const matchView = document.querySelector('#matchView');
const echoView = document.querySelector('#echoView');
const completeView = document.querySelector('#completeView');
const feelingButtons = [...document.querySelectorAll('[data-feeling]')];
const startMatch = document.querySelector('#startMatch');
const replyInput = document.querySelector('#replyInput');
const sendReply = document.querySelector('#sendReply');
const stepItems = [...document.querySelectorAll('.demo-steps li')];
let selectedFeeling = '';
let matchTimer;

function setStep(index) {
  stepItems.forEach((item, i) => item.classList.toggle('active', i === index));
}

function openSheet() {
  scrim.classList.add('open');
  sheet.classList.add('open');
  setStep(1);
}

function closeSheet() {
  scrim.classList.remove('open');
  sheet.classList.remove('open');
  if (!matchView.classList.contains('open')) setStep(0);
}

document.querySelector('.echo-hint').addEventListener('click', openSheet);
scrim.addEventListener('click', closeSheet);
document.querySelector('[data-close]').addEventListener('click', closeSheet);

feelingButtons.forEach((button) => {
  button.addEventListener('click', () => {
    feelingButtons.forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    selectedFeeling = button.dataset.feeling;
    startMatch.disabled = false;
  });
});

startMatch.addEventListener('click', () => {
  closeSheet();
  matchView.classList.add('open');
  document.querySelector('#feelingCore').textContent = selectedFeeling;
  document.querySelector('#sharedFeeling').textContent = `「${selectedFeeling}」`;
  setStep(2);
  matchTimer = window.setTimeout(() => {
    matchView.classList.remove('open');
    echoView.classList.add('open');
  }, 2600);
});

document.querySelector('[data-cancel]').addEventListener('click', () => {
  window.clearTimeout(matchTimer);
  matchView.classList.remove('open');
  setStep(0);
});

document.querySelectorAll('.quick-replies button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.quick-replies button').forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    replyInput.value = button.textContent;
    sendReply.disabled = false;
  });
});

replyInput.addEventListener('input', () => {
  sendReply.disabled = !replyInput.value.trim();
});

sendReply.addEventListener('click', () => {
  const text = replyInput.value.trim();
  if (!text) return;
  document.querySelector('#sentText').textContent = text;
  localStorage.setItem('echo-last-reply', text);
  echoView.classList.remove('open');
  completeView.classList.add('open');
  setStep(3);
});

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 1600);
}

document.querySelector('#saveEcho').addEventListener('click', (event) => {
  localStorage.setItem('echo-saved', 'true');
  event.currentTarget.textContent = '已收进「回声夹」';
  event.currentTarget.style.background = '#6f7b69';
  showToast('已收进回声夹');
});

function resetDemo() {
  window.clearTimeout(matchTimer);
  [sheet, matchView, echoView, completeView, scrim].forEach((view) => view.classList.remove('open'));
  feelingButtons.forEach((button) => button.classList.remove('selected'));
  document.querySelectorAll('.quick-replies button').forEach((button) => button.classList.remove('selected'));
  selectedFeeling = '';
  startMatch.disabled = true;
  replyInput.value = '';
  sendReply.disabled = true;
  document.querySelector('#saveEcho').textContent = '收进我的「回声夹」';
  document.querySelector('#saveEcho').style.background = '';
  document.querySelector('#noteScroll').scrollTo({ top: 250, behavior: 'smooth' });
  setStep(0);
}

document.querySelector('#resetDemo').addEventListener('click', resetDemo);
document.querySelector('#finishDemo').addEventListener('click', resetDemo);
document.querySelector('#backToNote').addEventListener('click', resetDemo);
document.querySelector('#echoInfo').addEventListener('click', () => showToast('一次、匿名、无需互关的轻关系'));

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') resetDemo();
});

window.addEventListener('load', () => {
  window.setTimeout(() => document.querySelector('#noteScroll').scrollTo({ top: 245, behavior: 'smooth' }), 450);
});
