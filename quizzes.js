// Quizzes. `ar: true` on a question or option renders it in Arabic script (right-to-left).
const q = (prompt, options, answer, why, extra = {}) => ({ prompt, options, answer, why, ...extra })

export const quizzes = [
  {
    id: 'qz1', courseId: 'c1', title: 'Letters, vowels and sounds', minutes: 6, pass: 70,
    blurb: 'Check the alphabet and vowel marks from the first two modules.',
    questions: [
      q('How many letters are in the Arabic alphabet?', ['26', '28', '29', '32'], 1, 'The Arabic alphabet has 28 letters.'),
      q('Which direction is Arabic written?', ['Left to right', 'Right to left', 'Top to bottom', 'Either direction'], 1, 'Arabic is written and read from right to left.'),
      q('Which letter is this?', ['Baa', 'Taa', 'Thaa', 'Noon'], 0, 'Baa has a single dot below the line.', { glyph: 'ب' }),
      q('Which letter is this?', ['Jeem', 'Haa', 'Khaa', 'Daal'], 2, 'Khaa has a single dot above, and makes a rough “kh” sound.', { glyph: 'خ' }),
      q('Which short vowel gives the “a” sound, as in بَ?', ['Kasra', 'Damma', 'Fatha', 'Sukoon'], 2, 'Fatha is the small diagonal stroke above the letter, giving “a”.'),
      q('What does the sukoon (ْ) show?', ['A long vowel', 'No vowel after the letter', 'A doubled letter', 'A question'], 1, 'Sukoon marks a letter with no vowel after it.'),
    ],
  },
  {
    id: 'qz2', courseId: 'c2', title: 'High-frequency Qur’anic words', minutes: 6, pass: 70,
    blurb: 'Words you meet in nearly every page of the Qur’an.',
    questions: [
      q('What does الحمد لله mean?', ['All praise belongs to Allah', 'Allah is greatest', 'In the name of Allah', 'Allah forgives'], 0, '“Al-hamdu lillah” means all praise belongs to Allah.', { ar: true }),
      q('What does كِتَاب mean?', ['Pen', 'Book', 'School', 'Door'], 1, 'Kitab means book, from the root ك-ت-ب, “to write”.', { glyph: 'كِتَاب' }),
      q('What does رَبّ mean?', ['Servant', 'Lord and Sustainer', 'Messenger', 'Angel'], 1, 'Rabb means Lord, the one who creates, owns and sustains.', { glyph: 'رَبّ' }),
      q('Which word means “prayer”?', ['صَلَاة', 'زَكَاة', 'صَوْم', 'حَجّ'], 0, 'Salah is prayer. Zakah is charity, sawm is fasting, hajj is pilgrimage.', { optAr: true }),
      q('What does عِلْم mean?', ['Wealth', 'Journey', 'Knowledge', 'Patience'], 2, 'Ilm means knowledge, and it gives this academy its name.', { glyph: 'عِلْم' }),
      q('What does صَبْر mean?', ['Gratitude', 'Fear', 'Hope', 'Patience'], 3, 'Sabr is patience and steadfastness.', { glyph: 'صَبْر' }),
    ],
  },
  {
    id: 'qz3', courseId: 'c3', title: 'Parts of speech and the nominal sentence', minutes: 6, pass: 70,
    blurb: 'Ism, fi‘l, harf, mubtada’ and khabar.',
    questions: [
      q('Arabic words fall into which three categories?', ['Ism, fi‘l, harf', 'Raf‘, nasb, jarr', 'Fa‘il, maf‘ul, hal', 'Mudhakkar, mu’annath, jam‘'], 0, 'Every Arabic word is a noun (ism), a verb (fi‘l) or a particle (harf).'),
      q('What is كَتَبَ?', ['Ism (noun)', 'Fi‘l (verb)', 'Harf (particle)', 'Damir (pronoun)'], 1, 'Kataba, “he wrote”, is a past-tense verb.', { glyph: 'كَتَبَ' }),
      q('What is مِنْ (“from”)?', ['Ism', 'Fi‘l', 'Harf', 'Sifa'], 2, 'Min is a particle, and it puts the noun after it in the jarr case.', { glyph: 'مِنْ' }),
      q('The subject of a nominal sentence is called…', ['Fa‘il', 'Mubtada’', 'Khabar', 'Maf‘ul'], 1, 'The mubtada’ is what the sentence is about, and the khabar tells us about it.'),
      q('In الطَّالِبُ مُجْتَهِدٌ, what is مُجْتَهِدٌ?', ['Mubtada’', 'Khabar', 'Fa‘il', 'Harf'], 1, '“The student is hardworking”: the student is the mubtada’ and “hardworking” is the khabar.', { ar: true }),
      q('A noun ending in a damma is typically in which case?', ['Raf‘ (nominative)', 'Nasb (accusative)', 'Jarr (genitive)', 'Jazm (jussive)'], 0, 'Damma is the usual mark of raf‘ for singular nouns.'),
    ],
  },
  {
    id: 'qz4', courseId: 'c4', title: 'Roots and patterns', minutes: 5, pass: 70,
    blurb: 'The three-letter root system at the heart of Arabic.',
    questions: [
      q('Most Arabic roots have how many letters?', ['Two', 'Three', 'Five', 'Six'], 1, 'The triliteral root is the backbone of Arabic vocabulary.'),
      q('What is the root of كَاتِب and مَكْتُوب?', ['ك ت ب', 'ك ل م', 'ع ل م', 'د ر س'], 0, 'Both words come from ك-ت-ب, the idea of writing.', { optAr: true }),
      q('The pattern فَاعِل usually gives…', ['The place of an action', 'The doer of an action', 'The tool used', 'A command'], 1, 'Fa‘il is the active participle: كَاتِب, “writer”.'),
      q('The pattern مَفْعُول usually gives…', ['The one acted upon', 'The doer', 'The plural', 'The place'], 0, 'Maf‘ul is the passive participle: مَكْتُوب, “written”.'),
    ],
  },
  {
    id: 'qz5', courseId: 'c5', title: 'Greetings and polite phrases', minutes: 5, pass: 70,
    blurb: 'The phrases you will use every day.',
    questions: [
      q('How do you reply to السَّلَامُ عَلَيْكُمْ?', ['صَبَاحُ الخَيْر', 'وَعَلَيْكُمُ السَّلَام', 'شُكْرًا', 'مَعَ السَّلَامَة'], 1, 'The reply is “wa alaykumus-salam”.', { optAr: true }),
      q('What does صَبَاحُ الخَيْر mean?', ['Good evening', 'Good night', 'Good morning', 'Welcome'], 2, 'Sabahul-khayr means good morning.', { glyph: 'صَبَاحُ الخَيْر' }),
      q('What does شُكْرًا mean?', ['Sorry', 'Please', 'Thank you', 'Excuse me'], 2, 'Shukran means thank you.', { glyph: 'شُكْرًا' }),
      q('What does كَيْفَ حَالُك؟ mean?', ['What is your name?', 'How are you?', 'Where are you from?', 'How old are you?'], 1, 'Kayfa haluk? asks “How are you?”', { glyph: 'كَيْفَ حَالُك؟' }),
      q('What does مِنْ فَضْلِك mean?', ['Please', 'Welcome', 'Goodbye', 'Congratulations'], 0, 'Min fadlik means please.', { glyph: 'مِنْ فَضْلِك' }),
      q('What does مَعَ السَّلَامَة mean?', ['Hello', 'Goodbye', 'Thank you', 'Good luck'], 1, 'Ma‘as-salama means “go in peace”, or goodbye.', { glyph: 'مَعَ السَّلَامَة' }),
    ],
  },
]

export const getQuiz = (id) => quizzes.find((x) => x.id === id)

export const resources = [
  { id: 'r1', courseId: 'c1', title: 'Arabic alphabet chart', kind: 'PDF', size: '1.2 MB' },
  { id: 'r2', courseId: 'c1', title: 'Letter-writing practice sheets', kind: 'PDF', size: '2.4 MB' },
  { id: 'r3', courseId: 'c1', title: 'Vowel marks cheat sheet', kind: 'PDF', size: '0.6 MB' },
  { id: 'r4', courseId: 'c2', title: 'Top 100 Qur’anic words', kind: 'PDF', size: '1.1 MB' },
  { id: 'r5', courseId: 'c2', title: 'Surah vocabulary flashcards', kind: 'Flashcards', size: '3.0 MB' },
  { id: 'r6', courseId: 'c3', title: 'Case endings at a glance', kind: 'PDF', size: '0.8 MB' },
  { id: 'r7', courseId: 'c3', title: 'Nominal sentence workbook', kind: 'PDF', size: '2.2 MB' },
  { id: 'r8', courseId: 'c4', title: 'Ten verb forms table', kind: 'PDF', size: '0.9 MB' },
  { id: 'r9', courseId: 'c5', title: 'Everyday phrasebook', kind: 'PDF', size: '1.5 MB' },
  { id: 'r10', courseId: 'c6', title: 'Al-Ajurrumiyyah text with vowels', kind: 'PDF', size: '1.8 MB' },
]

export const letters = [
  ['ا', 'Alif'], ['ب', 'Baa'], ['ت', 'Taa'], ['ث', 'Thaa'], ['ج', 'Jeem'], ['ح', 'Haa'], ['خ', 'Khaa'],
  ['د', 'Daal'], ['ذ', 'Dhaal'], ['ر', 'Raa'], ['ز', 'Zayn'], ['س', 'Seen'], ['ش', 'Sheen'], ['ص', 'Saad'],
  ['ض', 'Daad'], ['ط', 'Ṭaa'], ['ظ', 'Ẓaa'], ['ع', 'ʿAyn'], ['غ', 'Ghayn'], ['ف', 'Faa'], ['ق', 'Qaaf'],
  ['ك', 'Kaaf'], ['ل', 'Laam'], ['م', 'Meem'], ['ن', 'Noon'], ['ه', 'Haa’'], ['و', 'Waaw'], ['ي', 'Yaa'],
]
