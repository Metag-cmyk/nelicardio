/**
 * One-time migration of localStorage keys after the ManiRythm → NeliCardio rename.
 * Copies any legacy value to its new key when the new key is still empty, so
 * users keep their theme, language, society, patient state, study deck and exam
 * progress.
 */
const LEGACY_KEYS: [string, string][] = [
  ['manirythm_theme_v1', 'nelicardio_theme_v1'],
  ['manirythm_study_v1', 'nelicardio_study_v1'],
  ['manirythm_lang_v1', 'nelicardio_lang_v1'],
  ['manirythm_society_v1', 'nelicardio_society_v1'],
  ['manirythm_patient_state_v2', 'nelicardio_patient_state_v2'],
  ['manirythm.exam.progress.v1', 'nelicardio.exam.progress.v1'],
];

export function migrateStorageKeys(): void {
  try {
    for (const [legacy, current] of LEGACY_KEYS) {
      const value = localStorage.getItem(legacy);
      if (value !== null && localStorage.getItem(current) === null) {
        localStorage.setItem(current, value);
      }
    }
  } catch {
    /* storage unavailable — nothing to migrate */
  }
}
