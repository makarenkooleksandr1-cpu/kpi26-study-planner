import { loadData, saveData, clearData, loadDemoData } from './storage.js';
import { calculateIntensity, sortSubjects, generateCheatSheet } from './logic.js';
function getMotivationMessage(progressPercent, diffDays, subjectId = '') {
  // Deterministic helper to select a message variation based on subjectId
  function getVariation(options) {
    if (!subjectId) return options[0];
    let hash = 0;
    for (let i = 0; i < subjectId.length; i++) {
      hash = subjectId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % options.length;
    return options[idx];
  }

  let msg = '';
  if (progressPercent === 0) {
    msg = getVariation([
      '⚡️ Не будь лінтяєм! Пора стати як губка для вбирання знань! 🧽',
      '🔌 Час підключати мізки! Попереду стільки цікавого, почни зараз! 🧠',
      '💤 Прокидайся від сплячки! Перший крок завжди найважчий, але треба! 🚀',
      '🎬 Старт уже зачекався! Зроби хоча б один клік, і діло піде! 🎯'
    ]);
  } else if (progressPercent < 10) {
    msg = getVariation([
      '💡 Перші кроки зроблені, тримай темп!',
      '🌱 Початок покладено! Головне не зупинятися на старті! ✨',
      '🎯 Перша крапка поставлена! Рухаємось далі дрібними кроками! 🚶',
      '🔋 Заряджено на перші відсотки! Вперед до нових висот! ⚡'
    ]);
  } else if (progressPercent < 20) {
    msg = getVariation([
      '🚀 Ти вже на шляху, продовжуй у тому ж дусі!',
      '📈 Графік повзе вгору! Ти великий молодець, не збавляй обертів! 🏎️',
      '👟 Розігрів завершено! Попереду чудова дистанція, біжимо далі! 🏃',
      '🌟 Гарна динаміка! Маленькими кроками до великої перемоги! 🏆'
    ]);
  } else if (progressPercent < 30) {
    msg = getVariation([
      '🌱 Знання ростуть, ти розквітаєш!',
      '🍀 Паростки знань уже пробиваються, поливай їх наполегливістю! 💧',
      '🌿 Прогрес стає все помітнішим! Ти робиш неймовірну роботу! 💫',
      '🪴 Крок за кроком ти будуєш міцну базу знань! Так тримати! 🧱'
    ]);
  } else if (progressPercent < 40) {
    msg = getVariation([
      '🌿 Ти впевнено просуваєшся, не здавайся!',
      '🧭 Курс правильний, вітер попутний! Рухаємось далі! ⛵',
      '💎 Твої зусилля починають перетворюватись на міцні знання! 🔨',
      '💪 Понад третину вже подужав! Ти сильніший, ніж думаєш! 🦾'
    ]);
  } else if (progressPercent < 50) {
    msg = getVariation([
      '🌳 Пускаєш глибоке коріння в матеріал, тримайся міцно! 🌲',
      '🔥 Вогонь знань уже розгорівся, підкидай ще дрів! 🪵',
      '⚡️ Енергія зашкалює! Ти майже дістався до половини матеріалу! 🧗',
      '📈 Стрілка впевнено йде вгору! Твоя продуктивність на висоті! 🌟'
    ]);
  } else if (progressPercent < 60) {
    msg = getVariation([
      '🔥 Більше половини подолано! Ти справжня блискавка успіху! ⚡',
      '🎯 Екватор пройдено! Тепер дорога йде тільки під гірку! 🎢',
      '🛡️ Ти вже перетнув позначку 50%! Неймовірна стійкість! 💪',
      '🌟 Переломний момент пройдено! Рухаємось до фіналу! 🚀'
    ]);
  } else if (progressPercent < 70) {
    msg = getVariation([
      '🌞 Ти сяєш, як сонце над матеріалом!',
      '✨ Твої знання випромінюють впевненість! Продовжуй сяяти! ☀️',
      '🌈 Горизонт стає все яснішим! Ти на правильному шляху! 🔭',
      '💡 Світла голова! Вже дві третини матеріалу майже твої! 🧠'
    ]);
  } else if (progressPercent < 80) {
    msg = getVariation([
      '🏅 Майже фінішна пряма! Ти вже знаєш набагато більше, ніж учора!',
      '🏃 Фініш уже на горизонті! Дивись, скільки всього ти вже знаєш! 🌟',
      '🎖️ Чудовий прогрес! Результат твоїх зусиль вражає! 🚀',
      '👑 Ти стаєш справжнім господарем цієї теми! Ще трохи! 🏰'
    ]);
  } else if (progressPercent < 90) {
    msg = getVariation([
      '🚀 Залишилися лічені деталі! Зберись, ти вже майже експерт!',
      '🎯 Останній ривок перед тріумфом! Ти вже на голову вище за всіх! 🎓',
      '💥 Залишились дрібниці! Збери всю волю в кулак, ти майже прийшов! 🏁',
      '💎 Твої знання майже ідеально відшліфовані! Неймовірна робота! 🔮'
    ]);
  } else if (progressPercent < 100) {
    msg = getVariation([
      '🎉 Блискуче! Ти майже готовий розірвати цей іспит!',
      '🎆 Фантастично! Тільки крихітний крок відділяє тебе від абсолютного успіху! 🚀',
      '🦖 Ти перетворився на справжнього монстра підготовки! Лишився один штрих! ✍️',
      '🥳 Практично ідеально! Твій викладач буде в приємному шоці! 💫'
    ]);
  } else {
    msg = getVariation([
      '🏆 Вітаю! Ти повністю готовий розірвати цей іспит!',
      '👑 Абсолютний тріумф! Ти знаєш абсолютно все, що потрібно! 🌟',
      '🎓 Рівень: Магістр Підготовки! Сміливо йди за своєю заслуженою п\'ятіркою! 💯',
      '⚔️ Повний бойовий комплект зібрано! Іспит не має жодних шансів! 🛡️'
    ]);
  }

  // Time pressure modifiers
  if (diffDays < 0 && progressPercent < 100) {
    msg = getVariation([
      '⏰ Іспит вже позаду... Сподіваємось, знання все одно знадобляться!',
      '⏳ Час вийшов... Але вчитися ніколи не пізно, правда? 🤷‍♂️',
      '⌛ Календар каже, що іспит пройшов. Сподіваємось на твій успіх! 🍀'
    ]);
  } else if (diffDays === 0 && progressPercent < 100) {
    const prefix = getVariation([
      '🚨 ІСПИТ СЬОГОДНІ! ',
      '💣 ГОДИНА Ч! ІСПИТ СЬОГОДНІ! ',
      '📢 ДЕНЬ ІСПИТУ НАСТАВ! '
    ]);
    msg = prefix + msg;
  } else if (diffDays <= 3 && progressPercent < 70) {
    const prefix = getVariation([
      '⚠️ ЧАСУ ОБМАЛЬ! ',
      '⏳ ГОДИННИК ТІКАЄ! ',
      '🌪️ ТЕМПИ НА МАКСИМУМ! '
    ]);
    msg = prefix + msg;
  }
  return msg;
}


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

    let motivationMsg = getMotivationMessage(progressPercent, diffDays, subject.id);

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

function isSubjectFullyCompleted(subject) {
  const totalTopics = subject.topics.length;
  const studiedTopics = subject.topics.filter(t => t.isStudied).length;
  const totalLiterature = subject.literature ? subject.literature.length : 0;
  const readLiterature = subject.literature ? subject.literature.filter(l => l.isRead).length : 0;
  
  const totalItems = totalTopics + totalLiterature;
  const completedItems = studiedTopics + readLiterature;
  
  return totalItems > 0 && completedItems === totalItems;
}

function triggerCelebration() {
  if (typeof confetti === 'function') {
    // Multi-burst canvas confetti
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      // Left side burst
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 }
      });
      // Right side burst
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
    
    // Central huge burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

function toggleLiteratureStatus(subjectId, litId) {
  const subject = subjects.find(s => s.id === subjectId);
  if (!subject) return;
  
  if (!subject.literature) return;
  
  const lit = subject.literature.find(l => l.id === litId);
  if (!lit) return;

  const wasCompleted = isSubjectFullyCompleted(subject);

  lit.isRead = !lit.isRead;
  
  const isCompleted = isSubjectFullyCompleted(subject);
  if (isCompleted && !wasCompleted) {
    triggerCelebration();
  }

  saveData(subjects);
  renderSubjects();
}

function toggleTopicStatus(subjectId, topicId) {
  const subject = subjects.find(s => s.id === subjectId);
  if (!subject) return;
  
  const topic = subject.topics.find(t => t.id === topicId);
  if (!topic) return;

  const wasCompleted = isSubjectFullyCompleted(subject);

  topic.isStudied = !topic.isStudied;

  const isCompleted = isSubjectFullyCompleted(subject);
  if (isCompleted && !wasCompleted) {
    triggerCelebration();
  }

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
