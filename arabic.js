// The 28 letters with their names. Joined forms are built with the tatweel (ـ) so they render in any font.
const NON_CONNECTING = new Set(['ا', 'د', 'ذ', 'ر', 'ز', 'و']);
const T = 'ـ';

const LETTERS = [
  ['ا', 'Alif', 'a, long ā'], ['ب', 'Bā’', 'b'], ['ت', 'Tā’', 't'], ['ث', 'Thā’', 'th as in think'],
  ['ج', 'Jīm', 'j'], ['ح', 'Ḥā’', 'a breathy h from the throat'], ['خ', 'Khā’', 'like ch in loch'], ['د', 'Dāl', 'd'],
  ['ذ', 'Dhāl', 'th as in this'], ['ر', 'Rā’', 'a rolled r'], ['ز', 'Zāy', 'z'], ['س', 'Sīn', 's'],
  ['ش', 'Shīn', 'sh'], ['ص', 'Ṣād', 'heavy s'], ['ض', 'Ḍād', 'heavy d'], ['ط', 'Ṭā’', 'heavy t'],
  ['ظ', 'Ẓā’', 'heavy th (as in this)'], ['ع', 'ʿAyn', 'a deep throat sound'], ['غ', 'Ghayn', 'a gargled r'], ['ف', 'Fā’', 'f'],
  ['ق', 'Qāf', 'a deep k from the back of the mouth'], ['ك', 'Kāf', 'k'], ['ل', 'Lām', 'l'], ['م', 'Mīm', 'm'],
  ['ن', 'Nūn', 'n'], ['ه', 'Hā’', 'h'], ['و', 'Wāw', 'w, long ū'], ['ي', 'Yā’', 'y, long ī'],
];

export const ALPHABET = LETTERS.map(([ch, name, sound]) => {
  const stops = NON_CONNECTING.has(ch);
  return {
    ch,
    name,
    sound,
    isolated: ch,
    initial: stops ? ch : ch + T,
    medial: T + ch + (stops ? '' : T),
    final: T + ch,
  };
});

export function speak(text) {
  try {
    if (!('speechSynthesis' in window)) return false;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ar-SA';
    u.rate = 0.7;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    return true;
  } catch {
    return false;
  }
}
