import { loadData, saveData, clearData, loadDemoData } from './storage.js';
import { calculateIntensity, sortSubjects, generateCheatSheet } from './logic.js';

let subjects = [];

// DOM Elements
const form = document.getElementById('subject-form');
const examDateInput = document.getElementById('exam-date');
const examDateError = document.getElementById('exam-date-error');
const subjectsContainer = document.getElementById('subjects-container');
const loadDemoBtn = document.getElementById('load-demo-btn');
const clearDataBtn = document.getElementById('clear-data-btn');

// Modal Elements
const modal = document.getElementById('cheat-sheet-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const cheatSheetText = document.getElementById('cheat-sheet-text');
const copyCheatSheetBtn = document.getElementById('copy-cheat-sheet-btn');

// Initialize Application
function init() {
  subjects = loadData();
  renderSubjects();

  // Event Listeners
  form.addEventListener('submit', handleFormSubmit);
  examDateInput.addEventListener('input', () => { examDateError.textContent = ''; });
  
  loadDemoBtn.addEventListener('click', handleLoadDemo);
  clearDataBtn.addEventListener('click', handleClearData);
  
  closeModalBtn.addEventListener('click', closeModal);
  copyCheatSheetBtn.addEventListener('click', copyCheatSheet);
  
  // Close modal on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  const nameInput = document.getElementById('subject-name').value.trim();
  const dateStr = examDateInput.value;
  const difficultyStr = document.getElementById('difficulty').value;
  const topicsStr = document.getElementById('topics-list').value;
  const literatureStr = document.getElementById('literature-list') ? document.getElementById('literature-list').value : '';

  // Validation: Date in past
  const selectedDate = new Date(dateStr);
  selectedDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    examDateError.textContent = 'Дата іспиту не може бути в минулому';
    return;
  }

  // Parse topics
  const topics = topicsStr.split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)
    .map(t => ({
      id: crypto.randomUUID(),
      name: t,
      isStudied: false
    }));

  if (topics.length === 0) {
    alert('Додайте хоча б одну тему');
    return;
  }

  // Parse literature
  const literature = literatureStr.split(',')
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .map(l => ({
      id: crypto.randomUUID(),
      name: l,
      isRead: false
    }));

  const newSubject = {
    id: crypto.randomUUID(),
    name: nameInput,
    examDate: dateStr,
    difficulty: parseInt(difficultyStr, 10),
    topics: topics,
    literature: literature
  };

  subjects.push(newSubject);
  saveData(subjects);
  renderSubjects();
  form.reset();
}

function renderSubjects() {
  subjectsContainer.innerHTML = '';
  
  if (subjects.length === 0) {
    subjectsContainer.innerHTML = `
      <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <p style="color: var(--text-secondary);">Немає запланованих іспитів. Додайте перший предмет!</p>
      </div>
    `;
    return;
  }

  const sorted = sortSubjects([...subjects]);

  sorted.forEach(subject => {
    const totalTopics = subject.topics.length;
    const studiedTopics = subject.topics.filter(t => t.isStudied).length;
    const unstudiedCount = totalTopics - studiedTopics;

    const totalLiterature = subject.literature ? subject.literature.length : 0;
    const readLiterature = subject.literature ? subject.literature.filter(l => l.isRead).length : 0;
    
    const totalItems = totalTopics + totalLiterature;
    const completedItems = studiedTopics + readLiterature;
    const progressPercent = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

    const intensity = calculateIntensity(subject.examDate, unstudiedCount);
    
    const card = document.createElement('div');
    card.className = 'glass-card subject-card';
    
    const topicsHtml = subject.topics.map(topic => `
      <li class="topic-item ${topic.isStudied ? 'studied' : ''}" data-subject-id="${subject.id}" data-topic-id="${topic.id}">
        <div class="topic-checkbox"></div>
        <span class="topic-name">${topic.name}</span>
      </li>
    `).join('');

    const literatureHtml = `
      <div class="literature-section">
        <h4 class="section-subtitle">Література:</h4>
        ${subject.literature && subject.literature.length > 0 ? `
          <ul class="literature-list">
            ${subject.literature.map(item => `
              <li class="literature-item ${item.isRead ? 'read' : ''}" data-subject-id="${subject.id}" data-lit-id="${item.id}">
                <div class="literature-checkbox"></div>
                <span class="literature-name">${item.name}</span>
              </li>
            `).join('')}
          </ul>
        ` : '<p style="font-size: 0.8rem; color: var(--text-secondary); opacity: 0.7;">Не додано</p>'}
      </div>
    `;

    const examDateObj = new Date(subject.examDate);
    const todayObj = new Date();
    examDateObj.setHours(0, 0, 0, 0);
    todayObj.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((examDateObj.getTime() - todayObj.getTime()) / (1000 * 60 * 60 * 24));

    let motivationMsg = '';
    if (progressPercent === 100) {
      motivationMsg = '🎉 Чудова робота! Ти повністю готовий!';
    } else if (diffDays < 0) {
      motivationMsg = '⏰ Іспит вже пройшов!';
    } else if (diffDays === 0) {
      motivationMsg = progressPercent < 50 ? '🚨 Іспит сьогодні! Швидше за матеріали!' : '🔥 Іспит сьогодні! Повтори найважливіше!';
    } else if (diffDays <= 3) {
      motivationMsg = progressPercent < 50 ? '⚠️ До іспиту лічені дні! Максимальна концентрація!' : '🚀 Майже на фініші! Ти все встигнеш!';
    } else if (diffDays <= 7) {
      motivationMsg = progressPercent < 70 ? '⏳ Залишився тиждень! Час прискоритись!' : '👍 Тиждень до іспиту. Темп хороший!';
    } else {
      motivationMsg = progressPercent === 0 ? '🌱 Почни підготовку вже сьогодні, щоб потім не поспішати!' : '🐢 Рухайся в своєму темпі, часу ще достатньо!';
    }

    card.innerHTML = `
      <div class="subject-header">
        <div>
          <h3 class="subject-title">${subject.name}</h3>
          <div class="subject-meta">
            <span>📅 ${new Date(subject.examDate).toLocaleDateString('uk-UA')}</span>
            <span>⭐ Складність: ${subject.difficulty}/5</span>
            <span>📚 Тем: ${subject.topics.length} (Залишилось: ${unstudiedCount})</span>
          </div>
        </div>
        <button class="delete-subject-btn" data-id="${subject.id}" aria-label="Видалити предмет">&times;</button>
      </div>
      <div class="motivation-msg">${motivationMsg}</div>
      <div class="progress-bar-container" title="Прогрес готовності: ${progressPercent}%">
        <div class="progress-fill" style="width: ${progressPercent}%"></div>
      </div>
      <div class="intensity-badge intensity-${intensity.color}">
        ${intensity.status} ${intensity.coefficient > 0 ? `(К=${intensity.coefficient.toFixed(1)})` : ''}
      </div>
      <ul class="topics-list">
        ${topicsHtml}
      </ul>
      ${literatureHtml}
      <button class="btn btn-secondary btn-sm generate-cheat-sheet-btn" data-id="${subject.id}">
        Згенерувати шпору
      </button>
    `;
    
    subjectsContainer.appendChild(card);
  });

  // Attach event listeners for topics
  document.querySelectorAll('.topic-item').forEach(item => {
    item.addEventListener('click', () => toggleTopicStatus(
      item.dataset.subjectId, 
      item.dataset.topicId
    ));
  });

  // Attach event listeners for cheat sheet buttons
  document.querySelectorAll('.generate-cheat-sheet-btn').forEach(btn => {
    btn.addEventListener('click', () => openCheatSheet(btn.dataset.id));
  });

  // Attach event listeners for literature
  document.querySelectorAll('.literature-item').forEach(item => {
    item.addEventListener('click', () => toggleLiteratureStatus(
      item.dataset.subjectId, 
      item.dataset.litId
    ));
  });

  // Attach event listeners for delete buttons
  document.querySelectorAll('.delete-subject-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteSubject(btn.dataset.id));
  });
}

function toggleLiteratureStatus(subjectId, litId) {
  const subject = subjects.find(s => s.id === subjectId);
  if (!subject) return;
  
  if (!subject.literature) return;
  
  const lit = subject.literature.find(l => l.id === litId);
  if (!lit) return;

  lit.isRead = !lit.isRead;
  saveData(subjects);
  renderSubjects();
}

function toggleTopicStatus(subjectId, topicId) {
  const subject = subjects.find(s => s.id === subjectId);
  if (!subject) return;
  
  const topic = subject.topics.find(t => t.id === topicId);
  if (!topic) return;

  topic.isStudied = !topic.isStudied;
  saveData(subjects);
  renderSubjects(); // Re-render to update UI and intensity
}

function deleteSubject(subjectId) {
  if (confirm('Ви впевнені, що хочете видалити цей предмет?')) {
    subjects = subjects.filter(s => s.id !== subjectId);
    saveData(subjects);
    renderSubjects();
  }
}

function handleLoadDemo() {
  subjects = loadDemoData();
  renderSubjects();
}

function handleClearData() {
  if (confirm('Ви впевнені, що хочете видалити всі дані? Це неможливо скасувати.')) {
    clearData();
    subjects = [];
    renderSubjects();
  }
}

function openCheatSheet(subjectId) {
  const subject = subjects.find(s => s.id === subjectId);
  if (!subject) return;
  
  const text = generateCheatSheet(subject);
  cheatSheetText.value = text;
  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
}

function copyCheatSheet() {
  cheatSheetText.select();
  document.execCommand('copy');
  
  const originalText = copyCheatSheetBtn.textContent;
  copyCheatSheetBtn.textContent = 'Скопійовано!';
  setTimeout(() => {
    copyCheatSheetBtn.textContent = originalText;
  }, 2000);
}

// Boot
document.addEventListener('DOMContentLoaded', init);
