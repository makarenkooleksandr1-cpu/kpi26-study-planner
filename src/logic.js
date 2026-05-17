export function calculateIntensity(examDateStr, topicsCount) {
  if (topicsCount === 0) return { coefficient: 0, status: 'Комфортний', color: 'green' };

  const examDate = new Date(examDateStr);
  const today = new Date();
  
  // Set time to midnight for accurate day difference
  examDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = examDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
     // Exam already passed or today
     return { coefficient: 0, status: 'Високе навантаження', color: 'red' };
  }

  const k = diffDays / topicsCount;

  if (k >= 2) {
    return { coefficient: k, status: 'Комфортний', color: 'green' };
  } else if (k >= 1) {
    return { coefficient: k, status: 'Нормальний', color: 'yellow' };
  } else {
    return { coefficient: k, status: 'Високе навантаження', color: 'red' };
  }
}

export function sortSubjects(subjects) {
  return subjects.sort((a, b) => {
    return new Date(a.examDate).getTime() - new Date(b.examDate).getTime();
  });
}

export function generateCheatSheet(subject) {
  const studiedTopics = subject.topics.filter(t => t.isStudied);
  if (studiedTopics.length === 0) return 'Немає вивчених тем для шпори.';
  
  return studiedTopics.map((t, index) => `${index + 1}. ${t.name}`).join('\n');
}
