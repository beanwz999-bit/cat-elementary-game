// SaveSystem for Cat Elementary
// Manages saving and loading game progress in localStorage across 3 profiles

const SAVE_KEY_PREFIX = "cat_elementary_profile_";
const OLD_SAVE_KEY = "cat_elementary_save_v1";

export const SaveSystem = {
  /**
   * Migrate old single-save version to Profile 1 if appropriate
   */
  migrateOldSave() {
    try {
      const oldData = localStorage.getItem(OLD_SAVE_KEY);
      if (oldData) {
        // If Profile 1 is empty, copy it over
        const p1Data = localStorage.getItem(`${SAVE_KEY_PREFIX}1`);
        if (!p1Data) {
          localStorage.setItem(`${SAVE_KEY_PREFIX}1`, oldData);
        }
        // Remove old key so we only migrate once
        localStorage.removeItem(OLD_SAVE_KEY);
      }
    } catch (e) {
      console.error("Migration failed:", e);
    }
  },

  /**
   * Save the game state to localStorage for a profile
   * @param {number} profileIdx - The profile slot index (1, 2, or 3)
   * @param {Object} state - The game state containing players, unlockedGrade, and completedMinigames
   */
  save(profileIdx, state) {
    try {
      const dataStr = JSON.stringify(state);
      localStorage.setItem(`${SAVE_KEY_PREFIX}${profileIdx}`, dataStr);
      return true;
    } catch (e) {
      console.error(`Failed to save game state for profile ${profileIdx}:`, e);
      return false;
    }
  },

  /**
   * Load the game state from localStorage for a profile
   * @param {number} profileIdx - The profile slot index (1, 2, or 3)
   * @returns {Object|null} The saved game state, or null if not found
   */
  load(profileIdx) {
    try {
      this.migrateOldSave(); // Ensure old saves are migrated
      const dataStr = localStorage.getItem(`${SAVE_KEY_PREFIX}${profileIdx}`);
      if (!dataStr) return null;
      return JSON.parse(dataStr);
    } catch (e) {
      console.error(`Failed to load game state for profile ${profileIdx}:`, e);
      return null;
    }
  },

  /**
   * Check if a valid save exists for a profile
   * @param {number} profileIdx - The profile slot index (1, 2, or 3)
   * @returns {boolean}
   */
  hasSave(profileIdx) {
    this.migrateOldSave();
    return localStorage.getItem(`${SAVE_KEY_PREFIX}${profileIdx}`) !== null;
  },

  /**
   * Delete the save game for a profile
   * @param {number} profileIdx - The profile slot index (1, 2, or 3)
   */
  clear(profileIdx) {
    localStorage.removeItem(`${SAVE_KEY_PREFIX}${profileIdx}`);
  },

  /**
   * Validate the save state structure
   * @param {Object} state - The state object to validate
   * @returns {boolean} True if the state structure is valid
   */
  validateState(state) {
    if (!state || typeof state !== "object") return false;
    if (!Array.isArray(state.players)) return false;
    
    for (const player of state.players) {
      if (!player || typeof player !== "object") return false;
      if (typeof player.name !== "string" || !player.name.trim()) return false;
      if (typeof player.breed !== "string" || !player.breed) return false;
      if (typeof player.color !== "string" || !player.color) return false;
    }
    
    if (typeof state.unlockedGrade !== "number" || !Number.isInteger(state.unlockedGrade)) return false;
    if (state.unlockedGrade < 0 || state.unlockedGrade > 6) return false;
    
    if (!state.completedPuzzles || typeof state.completedPuzzles !== "object" || Array.isArray(state.completedPuzzles)) return false;
    for (const key in state.completedPuzzles) {
      if (!Array.isArray(state.completedPuzzles[key])) return false;
      for (const val of state.completedPuzzles[key]) {
        if (typeof val !== "string") return false;
      }
    }
    
    return true;
  }
};
export default SaveSystem;
