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

  const newSubject = {
    id: crypto.randomUUID(),
    name: nameInput,
    examDate: dateStr,
    difficulty: parseInt(difficultyStr, 10),
    topics: topics
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
    const unstudiedCount = subject.topics.filter(t => !t.isStudied).length;
    const intensity = calculateIntensity(subject.examDate, unstudiedCount);
    
    const card = document.createElement('div');
    card.className = 'glass-card subject-card';
    
    const topicsHtml = subject.topics.map(topic => `
      <li class="topic-item ${topic.isStudied ? 'studied' : ''}" data-subject-id="${subject.id}" data-topic-id="${topic.id}">
        <div class="topic-checkbox"></div>
        <span class="topic-name">${topic.name}</span>
      </li>
    `).join('');

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
      </div>
      <div class="intensity-badge intensity-${intensity.color}">
        ${intensity.status} ${intensity.coefficient > 0 ? `(К=${intensity.coefficient.toFixed(1)})` : ''}
      </div>
      <ul class="topics-list">
        ${topicsHtml}
      </ul>
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
