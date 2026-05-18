const STORAGE_KEY = 'study_planner_data';

export function loadData() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    return rawData ? JSON.parse(rawData) : [];
  } catch (error) {
    console.error('Error loading data from localStorage', error);
    return [];
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage', error);
  }
}

export function clearData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage', error);
  }
}

export function loadDemoData() {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const nextMonth = new Date(today);
  nextMonth.setDate(today.getDate() + 30);

  const demoData = [
    {
      id: crypto.randomUUID(),
      name: 'Вища Математика',
      examDate: nextWeek.toISOString().split('T')[0],
      difficulty: 5,
      topics: [
        { id: crypto.randomUUID(), name: 'Інтеграли', isStudied: true },
        { id: crypto.randomUUID(), name: 'Похідні', isStudied: true },
        { id: crypto.randomUUID(), name: 'Матриці', isStudied: false },
        { id: crypto.randomUUID(), name: 'Ряди', isStudied: false }
      ],
      literature: [
        { id: crypto.randomUUID(), name: 'Дубовик "Вища математика"', isRead: true },
        { id: crypto.randomUUID(), name: 'Конспект лекцій', isRead: false }
      ]
    },
    {
      id: crypto.randomUUID(),
      name: 'Веб-програмування',
      examDate: nextMonth.toISOString().split('T')[0],
      difficulty: 3,
      topics: [
        { id: crypto.randomUUID(), name: 'HTML/CSS', isStudied: true },
        { id: crypto.randomUUID(), name: 'JavaScript', isStudied: false },
        { id: crypto.randomUUID(), name: 'React', isStudied: false }
      ],
      literature: [
        { id: crypto.randomUUID(), name: 'MDN Web Docs', isRead: true },
        { id: crypto.randomUUID(), name: 'React Documentation', isRead: false },
        { id: crypto.randomUUID(), name: 'Курс на Coursera', isRead: false }
      ]
    }
  ];

  saveData(demoData);
  return demoData;
}
