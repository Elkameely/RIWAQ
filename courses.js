// Course catalogue. Lessons are declared as 'Title|minutes|type' and expanded below.
// type: v = recorded video, p = PDF/notes, q = practice sheet. Add `video` (YouTube/Vimeo embed URL) per lesson later.

const expand = (courseId, modules) =>
  modules.map((m, mi) => ({
    id: `${courseId}-m${mi + 1}`,
    title: m.title,
    lessons: m.lessons.map((l, li) => {
      const [title, mins, type] = l.split('|')
      return { id: `${courseId}-m${mi + 1}-l${li + 1}`, title, minutes: +mins, type: type || 'v', video: '' }
    }),
  }))

const raw = [
  {
    id: 'c1',
    slug: 'arabic-foundations',
    title: 'Arabic Foundations',
    arabic: 'أساسيات العربية',
    level: 'Beginner',
    weeks: 8,
    sessionsPerWeek: 2,
    price: 35000,
    tagline: 'Read and write the Arabic alphabet with confidence.',
    description:
      'A gentle, structured start for adults who have never studied Arabic. You will learn every letter in all its forms, the short vowels, and begin reading real words aloud by week three.',
    outcomes: ['Recognise and write all 28 letters in every position', 'Read vowelled words and short sentences aloud', 'Understand sun and moon letters', 'Build a first vocabulary of 150 everyday words'],
    modules: [
      { title: 'The letters and their sounds', lessons: ['Welcome and how Arabic works|18', 'Alif to Thaa: the first five letters|32', 'Jeem to Dhaal: throat and tongue sounds|34', 'Raa to Saad: the middle letters|30', 'Daad to Qaaf: the heavy letters|33', 'Kaaf to Yaa: completing the alphabet|31', 'Alphabet chart and writing sheet|10|p'] },
      { title: 'Joining letters and vowels', lessons: ['Letter forms: initial, medial, final|35', 'Fatha, kasra and damma|28', 'Sukoon and shaddah|27', 'Long vowels and tanween|30', 'Reading practice: words|26|q'] },
      { title: 'First words and sentences', lessons: ['The definite article and sun letters|29', 'Greetings and introductions|27', 'Everyday nouns: home, work, family|31', 'Reading short sentences|28', 'Course review and assessment|20|q'] },
    ],
    quizId: 'qz1',
  },
  {
    id: 'c2',
    slug: 'quranic-arabic-essentials',
    title: 'Qur’anic Arabic Essentials',
    arabic: 'العربية القرآنية',
    level: 'Beginner',
    weeks: 10,
    sessionsPerWeek: 2,
    price: 40000,
    tagline: 'Understand the words you recite most often.',
    description:
      'Learn the high-frequency words that make up a large share of the Qur’an, and see how they behave in the verses you already know. Ideal if you can read Arabic script and want to understand what you read.',
    outcomes: ['Recognise 300 of the most frequent Qur’anic words', 'Understand the structure of short surahs', 'Follow the meaning of the daily prayer', 'Use a root-based dictionary'],
    modules: [
      { title: 'Words you already know', lessons: ['Why the Qur’an repeats: word frequency|22', 'Al-Fatihah word by word|36', 'Particles and pronouns|30', 'Names of Allah in common use|28'] },
      { title: 'Short surahs', lessons: ['Surah Al-Ikhlas and Al-Falaq|32', 'Surah An-Nas and Al-Asr|30', 'Surah Al-Kawthar and Al-Ma‘un|31', 'Vocabulary list: part one|10|p'] },
      { title: 'Verbs and meaning', lessons: ['Past and present verbs|34', 'Commands and prohibitions|29', 'Roots and families of words|33', 'Review and assessment|20|q'] },
    ],
    quizId: 'qz2',
  },
  {
    id: 'c3',
    slug: 'nahw-made-simple',
    title: 'Nahw Made Simple',
    arabic: 'النحو الميسّر',
    level: 'Intermediate',
    weeks: 12,
    sessionsPerWeek: 2,
    price: 45000,
    tagline: 'Arabic grammar, explained step by step in plain English.',
    description:
      'The sentence structure of Arabic taught from first principles: nouns, verbs, particles and the cases that connect them. Every rule is tied to a Qur’anic or everyday example.',
    outcomes: ['Parse any simple Arabic sentence', 'Identify subject, predicate, object and their cases', 'Use idafa and adjective agreement correctly', 'Read classical grammar texts with support'],
    modules: [
      { title: 'The three parts of speech', lessons: ['Ism, fi‘l and harf|28', 'Marks of the noun|31', 'Marks of the verb|27', 'Case endings overview|35'] },
      { title: 'The nominal sentence', lessons: ['Mubtada’ and khabar|33', 'Adjectives and agreement|30', 'Idafa: possessive structures|32', 'Practice sheet: nominal sentences|10|q'] },
      { title: 'The verbal sentence', lessons: ['Fa‘il and maf‘ul bihi|34', 'Prepositions and the jarr case|29', 'Kana and her sisters|31', 'Review and assessment|20|q'] },
    ],
    quizId: 'qz3',
  },
  {
    id: 'c4',
    slug: 'sarf-word-patterns',
    title: 'Sarf: Word Patterns',
    arabic: 'الصرف',
    level: 'Intermediate',
    weeks: 8,
    sessionsPerWeek: 2,
    price: 40000,
    tagline: 'See how one root grows into dozens of words.',
    description:
      'Arabic morphology made visual. Learn the root-and-pattern system so that new words stop being new, and you can guess meanings before opening a dictionary.',
    outcomes: ['Find the root of any word', 'Use the ten verb forms', 'Build active and passive participles', 'Conjugate regular verbs in all persons'],
    modules: [
      { title: 'Roots and patterns', lessons: ['What is a root?|24', 'The pattern fa‘ala|30', 'Active and passive participles|32', 'Root-finding practice|10|q'] },
      { title: 'Verb forms', lessons: ['Forms I to III|34', 'Forms IV to VI|33', 'Forms VII to X|35', 'Conjugation tables|10|p'] },
    ],
    quizId: 'qz4',
  },
  {
    id: 'c5',
    slug: 'arabic-for-professionals',
    title: 'Conversational Arabic for Professionals',
    arabic: 'العربية للمحترفين',
    level: 'Beginner',
    weeks: 8,
    sessionsPerWeek: 2,
    price: 38000,
    tagline: 'Practical speaking for travel, business and community.',
    description:
      'Short, speaking-heavy evenings built around situations adults actually meet: introductions, meetings, travel for Hajj or Umrah, phone calls and polite small talk.',
    outcomes: ['Hold a five-minute introductory conversation', 'Use polite forms and greetings correctly', 'Handle travel and shopping situations', 'Understand slow, clear spoken Arabic'],
    modules: [
      { title: 'Meeting people', lessons: ['Greetings and replies|24', 'Introducing yourself|27', 'Talking about work|29', 'Numbers, time and dates|31'] },
      { title: 'Everyday situations', lessons: ['Asking for directions|26', 'At the market|28', 'Travel and Hajj phrases|30', 'Phrasebook|10|p', 'Role-play review|22|q'] },
    ],
    quizId: 'qz5',
  },
  {
    id: 'c6',
    slug: 'ajurrumiyyah-reading-circle',
    title: 'Al-Ajurrumiyyah Reading Circle',
    arabic: 'متن الآجرومية',
    level: 'Advanced',
    weeks: 14,
    sessionsPerWeek: 1,
    price: 45000,
    tagline: 'Study the classic grammar primer line by line.',
    description:
      'A slow, guided reading of the classic text taught in madrasas for centuries. Memorise key passages, parse each line, and learn how the tradition teaches grammar.',
    outcomes: ['Read the matn with full vowelling', 'Memorise and explain key passages', 'Apply each chapter to new sentences', 'Prepare for further study of classical commentaries'],
    modules: [
      { title: 'Foundations of the text', lessons: ['Introduction to the author and text|26', 'Definition of speech|30', 'Parts of speech|32'] },
      { title: 'Cases and endings', lessons: ['Marks of raf‘|34', 'Marks of nasb|33', 'Marks of jarr and jazm|35', 'Review and assessment|20|q'] },
    ],
    quizId: null,
  },
]

export const courses = raw.map((c) => ({ ...c, modules: expand(c.id, c.modules) }))
export const getCourse = (idOrSlug) => courses.find((c) => c.id === idOrSlug || c.slug === idOrSlug)
export const lessonsOf = (course) => course.modules.flatMap((m) => m.lessons)
export const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']
