/* Kaamelott flashcards — logique d'interface. Les cartes sont chargées depuis data/*.js. */
(() => {
  'use strict';

  const CARDS = Array.isArray(window.KAAMELOTT_CARDS) ? window.KAAMELOTT_CARDS : [];

const state = {
      deck: [],
      index: 0,
      flipped: false
    };

    const els = {
      categoryChecks: document.getElementById('categoryChecks'),
      difficultyChecks: document.getElementById('difficultyChecks'),
      catCount: document.getElementById('catCount'),
      search: document.getElementById('search'),
      allCats: document.getElementById('allCats'),
      noCats: document.getElementById('noCats'),
      shuffle: document.getElementById('shuffleBtn'),
      reset: document.getElementById('resetBtn'),
      visibleCount: document.getElementById('visibleCount'),
      totalCount: document.getElementById('totalCount'),
      position: document.getElementById('position'),
      currentDifficulty: document.getElementById('currentDifficulty'),
      card: document.getElementById('flashcard'),
      cardWrap: document.getElementById('cardWrap'),
      empty: document.getElementById('emptyState'),
      frontMeta: document.getElementById('frontMeta'),
      backMeta: document.getElementById('backMeta'),
      question: document.getElementById('questionText'),
      answer: document.getElementById('answerText'),
      explanation: document.getElementById('explanationText'),
      source: document.getElementById('sourceText'),
      prev: document.getElementById('prevBtn'),
      next: document.getElementById('nextBtn'),
      flip: document.getElementById('flipBtn'),
      random: document.getElementById('randomBtn')
    };

    const categories = [...new Set(CARDS.map(card => card.category))].sort((a,b) => a.localeCompare(b, 'fr'));
    const difficulties = ['Facile', 'Moyen', 'Difficile'];

    function escapeHtml(str) {
      return String(str).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[char]));
    }

    function renderChecks() {
      els.categoryChecks.innerHTML = categories.map(cat => `
        <label class="check"><input type="checkbox" name="category" value="${escapeHtml(cat)}" checked> <span>${escapeHtml(cat)}</span></label>
      `).join('');
      els.difficultyChecks.innerHTML = difficulties.map(diff => `
        <label class="check"><input type="checkbox" name="difficulty" value="${escapeHtml(diff)}"> <span>${escapeHtml(diff)}</span></label>
      `).join('');
      document.querySelectorAll('input[name="category"], input[name="difficulty"]').forEach(input => input.addEventListener('change', applyFilters));
    }

    function selectedValues(name) {
      return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
    }

    function filteredCards() {
      const selectedCategories = selectedValues('category');
      const selectedDifficulties = selectedValues('difficulty');
      const query = els.search.value.trim().toLocaleLowerCase('fr-FR');
      return CARDS.filter(card => {
        if (!selectedCategories.includes(card.category)) return false;
        if (selectedDifficulties.length && !selectedDifficulties.includes(card.difficulty)) return false;
        if (query) {
          const haystack = `${card.question} ${card.answer} ${card.explanation || ''} ${card.category} ${card.difficulty}`.toLocaleLowerCase('fr-FR');
          if (!haystack.includes(query)) return false;
        }
        return true;
      });
    }

    function applyFilters() {
      state.deck = filteredCards();
      state.index = 0;
      state.flipped = false;
      render();
    }

    function setFlipped(value) {
      state.flipped = value;
      els.card.classList.toggle('flipped', state.flipped);
      els.card.setAttribute('aria-pressed', String(state.flipped));
      els.flip.textContent = state.flipped ? 'Voir la question' : 'Retourner';
    }

    function renderMeta(card) {
      return `<span class="pill">${card.category}</span><span class="pill difficulty">${card.difficulty}</span><span class="pill">Question ${card.id}/${CARDS.length}</span>`;
    }

    function render() {
      const hasCards = state.deck.length > 0;
      els.empty.classList.toggle('show', !hasCards);
      els.cardWrap.style.display = hasCards ? 'block' : 'none';
      els.prev.disabled = !hasCards;
      els.next.disabled = !hasCards;
      els.flip.disabled = !hasCards;
      els.random.disabled = !hasCards;
      els.visibleCount.textContent = state.deck.length;
      els.totalCount.textContent = CARDS.length;
      els.catCount.textContent = `${selectedValues('category').length}/${categories.length}`;

      if (!hasCards) {
        els.position.textContent = '0/0';
        els.currentDifficulty.textContent = '—';
        return;
      }

      if (state.index >= state.deck.length) state.index = state.deck.length - 1;
      const card = state.deck[state.index];
      els.position.textContent = `${state.index + 1}/${state.deck.length}`;
      els.currentDifficulty.textContent = card.difficulty;
      els.frontMeta.innerHTML = renderMeta(card);
      els.backMeta.innerHTML = renderMeta(card);
      els.question.textContent = card.question;
      els.answer.textContent = card.answer;
      els.explanation.textContent = card.explanation || '';
      els.source.innerHTML = `<span>Référence :</span><a href="${card.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(card.source)}</a>`;
      setFlipped(false);
    }

    function shuffleDeck() {
      const arr = state.deck.slice();
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      state.deck = arr;
      state.index = 0;
      setFlipped(false);
      render();
    }

    els.search.addEventListener('input', applyFilters);
    els.allCats.addEventListener('click', () => { document.querySelectorAll('input[name="category"]').forEach(input => input.checked = true); applyFilters(); });
    els.noCats.addEventListener('click', () => { document.querySelectorAll('input[name="category"]').forEach(input => input.checked = false); applyFilters(); });
    els.shuffle.addEventListener('click', shuffleDeck);
    els.reset.addEventListener('click', () => {
      els.search.value = '';
      document.querySelectorAll('input[name="category"]').forEach(input => input.checked = true);
      document.querySelectorAll('input[name="difficulty"]').forEach(input => input.checked = false);
      applyFilters();
    });
    els.prev.addEventListener('click', () => { if (!state.deck.length) return; state.index = (state.index - 1 + state.deck.length) % state.deck.length; render(); });
    els.next.addEventListener('click', () => { if (!state.deck.length) return; state.index = (state.index + 1) % state.deck.length; render(); });
    els.random.addEventListener('click', () => { if (!state.deck.length) return; state.index = Math.floor(Math.random() * state.deck.length); render(); });
    els.flip.addEventListener('click', () => setFlipped(!state.flipped));
    els.card.addEventListener('click', () => setFlipped(!state.flipped));
    els.card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setFlipped(!state.flipped);
      }
      if (event.key === 'ArrowRight') els.next.click();
      if (event.key === 'ArrowLeft') els.prev.click();
    });

    renderChecks();
    applyFilters();
})();
