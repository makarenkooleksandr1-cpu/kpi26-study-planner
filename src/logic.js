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
  const readLiterature = subject.literature ? subject.literature.filter(l => l.isRead) : [];
  
  if (studiedTopics.length === 0 && readLiterature.length === 0) {
    return 'Немає вивчених тем або прочитаної літератури для генерації шпори. Почни підготовку! 📚';
  }
  
  let parts = [];
  
  if (studiedTopics.length > 0) {
    parts.push('📝 ОПОРНІ ТЕМИ ДЛЯ ІСПИТУ:\n' + studiedTopics.map((t, index) => `${index + 1}. ${t.name}`).join('\n'));
  } else {
    parts.push('📝 ОПОРНІ ТЕМИ ДЛЯ ІСПИТУ:\nНемає вивчених тем ⚠️');
  }
  
  if (readLiterature.length > 0) {
    parts.push('📚 ОПРАЦЬОВАНА ЛІТЕРАТУРА (Джерела для доцільного мислення):\n' + readLiterature.map((l, index) => `${index + 1}. 📖 ${l.name}`).join('\n') + '\n\n💡 Пам\'ятай про ці джерела! Згадка авторів та концепцій допоможе структурувати відповіді та мислити ширше під час іспиту!');
  } else if (subject.literature && subject.literature.length > 0) {
    parts.push('📚 ОПРАЦЬОВАНА ЛІТЕРАТУРА:\nНе опрацьовано жодного джерела літератури. Заглянь у книги перед іспитом! 📖');
  }
  
  return parts.join('\n\n');
}
