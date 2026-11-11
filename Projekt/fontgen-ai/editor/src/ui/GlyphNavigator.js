/**
 * Glyph Navigator
 * UI for selecting and navigating between glyphs
 */

export class GlyphNavigator {
  constructor(containerId, glyphs = []) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container element with id "${containerId}" not found`);
    }

    this.glyphs = glyphs;
    this.currentIndex = 0;
    this.listeners = [];

    this.render();
    this.attachEventListeners();
  }

  /**
   * Set available glyphs
   */
  setGlyphs(glyphs) {
    this.glyphs = glyphs || [];
    this.currentIndex = 0;
    this.render();
  }

  /**
   * Get current glyph
   */
  getCurrentGlyph() {
    if (this.glyphs.length === 0) return null;
    return this.glyphs[this.currentIndex];
  }

  /**
   * Navigate to specific glyph
   */
  selectGlyph(index) {
    if (index < 0 || index >= this.glyphs.length) {
      return;
    }

    this.currentIndex = index;
    this.render();
    this.emitSelect(this.glyphs[index], index);
  }

  /**
   * Navigate to next glyph
   */
  next() {
    if (this.currentIndex < this.glyphs.length - 1) {
      this.selectGlyph(this.currentIndex + 1);
    }
  }

  /**
   * Navigate to previous glyph
   */
  prev() {
    if (this.currentIndex > 0) {
      this.selectGlyph(this.currentIndex - 1);
    }
  }

  /**
   * Jump to glyph by name
   */
  jumpToGlyph(name) {
    const index = this.glyphs.findIndex(g => g.name === name);
    if (index !== -1) {
      this.selectGlyph(index);
    }
  }

  /**
   * Register select listener
   */
  onSelect(callback) {
    this.listeners.push(callback);
  }

  /**
   * Emit select event
   */
  emitSelect(glyph, index) {
    for (const listener of this.listeners) {
      listener({ glyph, index });
    }
  }

  /**
   * Render navigator UI
   */
  render() {
    this.container.innerHTML = '';
    this.container.className = 'glyph-navigator';

    // Navigation buttons
    const navContainer = document.createElement('div');
    navContainer.className = 'nav-buttons';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← Previous';
    prevBtn.className = 'nav-btn prev-btn';
    prevBtn.disabled = this.currentIndex === 0;
    prevBtn.addEventListener('click', () => this.prev());

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next →';
    nextBtn.className = 'nav-btn next-btn';
    nextBtn.disabled = this.currentIndex === this.glyphs.length - 1;
    nextBtn.addEventListener('click', () => this.next());

    navContainer.appendChild(prevBtn);
    navContainer.appendChild(nextBtn);

    // Current glyph info
    const infoContainer = document.createElement('div');
    infoContainer.className = 'glyph-info';

    if (this.glyphs.length > 0) {
      const current = this.getCurrentGlyph();
      const infoText = document.createElement('span');
      infoText.className = 'glyph-name';
      infoText.textContent = `${current.name} (${this.currentIndex + 1}/${this.glyphs.length})`;

      const unicode = document.createElement('span');
      unicode.className = 'glyph-unicode';
      if (current.unicode) {
        unicode.textContent = `U+${current.unicode.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`;
      }

      infoContainer.appendChild(infoText);
      if (unicode.textContent) {
        infoContainer.appendChild(unicode);
      }
    }

    // Glyph select dropdown
    const selectContainer = document.createElement('div');
    selectContainer.className = 'glyph-select-container';

    const select = document.createElement('select');
    select.className = 'glyph-select';

    for (let i = 0; i < this.glyphs.length; i++) {
      const glyph = this.glyphs[i];
      const option = document.createElement('option');
      option.value = i;
      option.textContent = glyph.name;
      if (i === this.currentIndex) {
        option.selected = true;
      }
      select.appendChild(option);
    }

    select.addEventListener('change', (e) => {
      this.selectGlyph(parseInt(e.target.value));
    });

    selectContainer.appendChild(select);

    // Quick A-Z navigation
    const quickNavContainer = document.createElement('div');
    quickNavContainer.className = 'quick-nav';

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (const letter of alphabet) {
      const btn = document.createElement('button');
      btn.textContent = letter;
      btn.className = 'quick-nav-btn';
      btn.addEventListener('click', () => {
        this.jumpToGlyph(letter);
      });
      quickNavContainer.appendChild(btn);
    }

    this.container.appendChild(navContainer);
    this.container.appendChild(infoContainer);
    this.container.appendChild(selectContainer);
    this.container.appendChild(quickNavContainer);
  }

  /**
   * Attach keyboard shortcuts
   */
  attachEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        this.next();
      } else if (e.key === 'ArrowLeft') {
        this.prev();
      }
    });
  }
}

export default GlyphNavigator;
