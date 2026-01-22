const STAFF_ROLES = {
  "iARROWDEATH": "owner",
  "Povess": "owner",
  "ItzJustPato": "moderador",
  "MR_R3X": "maestro",
};

const POINTS_PER_TIER = {
  "HT1": 60, "LT1": 45,
  "RHT1": 60, "RLT1": 45,
  "HT2": 30, "LT2": 20,
  "RHT2": 30, "RLT2": 20,
  "HT3": 10, "LT3": 6,
  "HT4": 4,  "LT4": 3,
  "HT5": 2,  "LT5": 1,
};

function getPointsFromTier(tier) {
  if (!tier) return 0;
  return POINTS_PER_TIER[tier.toUpperCase()] || 0;
}

const rankings = {
  general: [],
  vanilla: [{rank: 0, name: "KeyGlock_", tier: "LT4", region: "NA"}],
  uhc: [
    {rank: 0, name: "Povess", tier: "LT4", region: "NA"},
    {rank: 0, name: "sinconeexion", tier: "LT5", region: "NA"},
    {rank: 0, name: "iARROWDEATH", tier: "HT5", region: "NA"},
  ],
  dia_pot: [
    {rank: 0, name: "KeyGlock_", tier: "HT4", region: "NA"},
    {rank: 0, name: "sinconeexion", tier: "LT5", region: "NA"},
    {rank: 0, name: "Povess", tier: "LT3", region: "NA"},
  ],
  neth_pot: [
    {rank: 0, name: "Povess", tier: "LT4", region: "NA"},
    {rank: 0, name: "sinconeexion", tier: "HT5", region: "NA"},
    {rank: 0, name: "iARROWDEATH", tier: "HT5", region: "NA"},
  ],
  smp: [{rank: 0, name: "sinconeexion", tier: "LT5", region: "NA"}],
  sword: [
    {rank: 0, name: "iARROWDEATH", tier: "HT3", region: "NA"},
    {rank: 0, name: "ItzJustPato", tier: "LT3", region: "NA"},
    {rank: 0, name: "Povess", tier: "HT3", region: "NA"},
    {rank: 0, name: "sinconeexion", tier: "HT4", region: "NA"},
    {rank: 0, name: "KeyGlock_", tier: "LT3", region: "NA"},
    {rank: 0, name: "MR_R3X", tier: "HT3", region: "NA"},
  ],
  axe: [
    {rank: 0, name: "iARROWDEATH", tier: "LT4", region: "NA"},
    {rank: 0, name: "sinconeexion", tier: "HT5", region: "NA"},
    {rank: 0, name: "Povess", tier: "HT5", region: "NA"},
  ],
  mace: [{rank: 0, name: "sinconeexion", tier: "LT5", region: "NA"}],
  minecart: [],
  dia_vanilla: [],
  debuff: [],
  elytra: [],
  speed: [{rank: 1, name: "iARROWDEATH", tier: "HT5", region: "NA"}],
  creeper: [],
  manhunt: [],
  dia_smp: [{rank: 1, name: "ItzJustPato", tier: "LT3", region: "NA"}],
  bow: [
    {rank: 1, name: "iARROWDEATH", tier: "LT3", region: "NA"},
    {rank: 2, name: "sinconeexion", tier: "LT5", region: "NA"},
  ],
  bed: [],
  og_vanilla: [],
  trident: []
};

const playersTotalPoints = {};
Object.entries(rankings).forEach(([mode, modeList]) => {
  if (mode !== 'general') {
    modeList.forEach(player => {
      const name = player.name;
      if (!playersTotalPoints[name]) playersTotalPoints[name] = 0;
      playersTotalPoints[name] += getPointsFromTier(player.tier);
    });
  }
});

const allPlayers = {};
Object.keys(playersTotalPoints).forEach(name => {
  let bestTier = null;
  let region = "?";
  Object.values(rankings).forEach(list => {
    const entry = list.find(p => p.name === name);
    if (entry) region = entry.region || region;
  });
  Object.entries(rankings).forEach(([m, list]) => {
    if (m !== 'general') {
      const entry = list.find(p => p.name === name);
      if (entry && (!bestTier || getPointsFromTier(entry.tier) > getPointsFromTier(bestTier))) {
        bestTier = entry.tier;
      }
    }
  });
  allPlayers[name.toLowerCase()] = { name, tier: bestTier || "?", points: playersTotalPoints[name], region };
});

const buttons = document.querySelectorAll('.category-btn');
const title = document.getElementById('current-mode');
const tbody = document.getElementById('leaderboard-body');
const theadRow = document.querySelector('.leaderboard thead tr');
const searchInput = document.getElementById('player-search');
const searchResults = document.getElementById('search-results');
const modal = document.getElementById('player-modal');
const modalBody = document.getElementById('modal-body');
const visibleText = document.getElementById('player-search-visible');
const searchBox = document.querySelector('.search-box');

const headUrl = player => `https://visage.surgeplay.com/face/128/${player}`;
const fullSkinUrl = player => `https://mc-heads.net/body/${player}/512/3/0/left`;

function getTierClass(tier) {
  if (!tier || tier === "?") return '';
  const match = tier.match(/^([HL]T)(\d+)$/i);
  if (!match) return '';
  const [, type, level] = match;
  return `${type.toLowerCase()} ${type.toLowerCase()}${level}`;
}

function getModeIconPath(mode) {
  const iconMap = {
    vanilla: "content/icons/gamemodes/mctiers/img_vanilla.png",
    uhc: "content/icons/gamemodes/mctiers/img_uhc.png",
    dia_pot: "content/icons/gamemodes/mctiers/img_dia_pot.png",
    neth_pot: "content/icons/gamemodes/mctiers/img_neth_pot.png",
    smp: "content/icons/gamemodes/mctiers/img_smp.png",
    sword: "content/icons/gamemodes/mctiers/img_sword.png",
    axe: "content/icons/gamemodes/mctiers/img_axe.png",
    mace: "content/icons/gamemodes/mctiers/img_mace.png",
    minecart: "content/icons/gamemodes/subtiers/img_minecart.png",
    dia_vanilla: "content/icons/gamemodes/subtiers/img_dia_crystal.png",
    debuff: "content/icons/gamemodes/subtiers/img_debuff.png",
    elytra: "content/icons/gamemodes/subtiers/img_elytra.png",
    speed: "content/icons/gamemodes/subtiers/img_speed.png",
    creeper: "content/icons/gamemodes/subtiers/img_creeper.png",
    manhunt: "content/icons/gamemodes/subtiers/img_manhunt.png",
    dia_smp: "content/icons/gamemodes/subtiers/img_dia_smp.png",
    bow: "content/icons/gamemodes/subtiers/img_bow.png",
    bed: "content/icons/gamemodes/subtiers/img_bed.png",
    og_vanilla: "content/icons/gamemodes/subtiers/img_og_vanilla.png",
    trident: "content/icons/gamemodes/subtiers/img_trident.png",
  };
  return iconMap[mode] || "content/icons/gamemodes/img_general.png";
}

function getPlayerTestedModes(playerName) {
  const tested = [];
  Object.entries(rankings).forEach(([modeKey, list]) => {
    if (modeKey === 'general') return;
    const entry = list.find(p => p.name === playerName);
    if (entry) tested.push({ mode: modeKey, tier: entry.tier || "?" });
  });

  const preferredOrder = [
    'vanilla', 'uhc', 'dia_pot', 'neth_pot', 'smp', 'sword', 'axe', 'mace',
    'minecart', 'dia_vanilla', 'debuff', 'elytra', 'speed', 'creeper',
    'manhunt', 'dia_smp', 'bow', 'bed', 'og_vanilla', 'trident'
  ];

  tested.sort((a, b) => preferredOrder.indexOf(a.mode) - preferredOrder.indexOf(b.mode));
  return tested;
}

function activateButton(mode) {
  buttons.forEach(btn => btn.classList.remove('active'));
  const btn = document.querySelector(`.category-btn[data-mode="${mode}"]`);
  if (btn) btn.classList.add('active');
}

function updateLeaderboard(mode) {
  const wrapper = document.querySelector('.leaderboard-wrapper');
  if (wrapper) wrapper.classList.add('transitioning');

  setTimeout(() => {
    const originalThead = `<th class="rank">#</th><th>Jugador</th><th>Tier</th><th>Puntos</th>`;

    if (mode === "popular") {
      title.textContent = "Modos Más Populares (AKA Más Testeados)";
      theadRow.innerHTML = `<th class="rank">#</th><th>Modo</th><th>Testeados</th><th></th>`;

      const mctiersModes = ['vanilla', 'uhc', 'dia_pot', 'neth_pot', 'smp', 'sword', 'axe', 'mace'];

      const modeCounts = Object.entries(rankings)
        .filter(([key]) => key !== 'general')
        .map(([key, list]) => ({
          modeKey: key,
          displayName: key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          count: list.length
        }))
        .filter(m => m.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 7);

      tbody.innerHTML = modeCounts.length === 0 
        ? `<tr><td colspan="4" style="text-align:center; padding:3rem; color:var(--text-muted);">Aún no hay testeos 😿</td></tr>`
        : '';

      modeCounts.forEach((item, index) => {
        const category = mctiersModes.includes(item.modeKey) ? 'mctiers' : 'subtiers';
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="rank">${index + 1}</td>
          <td style="display: flex; align-items: center; gap: 12px; cursor: pointer; color: var(--accent); font-weight: 500;">
            <img src="content/icons/gamemodes/${category}/img_${item.modeKey}.png" alt="" class="mode-icon">
            ${item.displayName}
          </td>
          <td>${item.count}</td>
          <td></td>
        `;
        row.querySelector('td:nth-child(2)').addEventListener('click', () => {
          activateButton(item.modeKey);
          updateLeaderboard(item.modeKey);
        });
        tbody.appendChild(row);
      });
    } else {
      theadRow.innerHTML = originalThead;
      title.textContent = `Ranking ${mode.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`;

      if (mode === "general") {
        let generalRanking = Object.entries(playersTotalPoints)
          .map(([name, totalPoints]) => {
            let bestTier = null;
            let region = "?";
            Object.values(rankings).forEach(list => {
              const entry = list.find(p => p.name === name);
              if (entry) region = entry.region || region;
            });
            Object.entries(rankings).forEach(([m, list]) => {
              if (m !== 'general') {
                const entry = list.find(p => p.name === name);
                if (entry && (!bestTier || getPointsFromTier(entry.tier) > getPointsFromTier(bestTier))) {
                  bestTier = entry.tier;
                }
              }
            });
            return { name, points: totalPoints, tier: bestTier || "?", region };
          })
          .sort((a, b) => b.points - a.points || a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        if (generalRanking.length > 0) {
          let currentRank = 1;
          generalRanking[0].rank = 1;
          let prevPoints = generalRanking[0].points;
          for (let i = 1; i < generalRanking.length; i++) {
            if (generalRanking[i].points < prevPoints) currentRank += 1;
            generalRanking[i].rank = currentRank;
            prevPoints = generalRanking[i].points;
          }
        }

        tbody.innerHTML = '';
        generalRanking.forEach(player => {
          const rankClass = player.rank === 1 ? 'rank-1' : player.rank === 2 ? 'rank-2' : player.rank === 3 ? 'rank-3' : '';
          const roleClass = STAFF_ROLES[player.name] || '';

          const row = document.createElement('tr');
          row.innerHTML = `
            <td class="rank ${rankClass}">#${player.rank}</td>
            <td>
              <div class="player-cell">
                <img src="${headUrl(player.name)}" alt="${player.name}" class="skin-head" loading="lazy" onerror="this.src='https://visage.surgeplay.com/face/128/steve'">
                <div class="player-info">
                  <span class="player-name ${roleClass}">${player.name}</span>
                  <span class="player-meta">(${player.region || '?'})</span>
                </div>
              </div>
            </td>
            <td class="tier ${getTierClass(player.tier)}">${player.tier}</td>
            <td><strong>${player.points}</strong></td>
          `;
          row.style.cursor = 'pointer';
          row.addEventListener('click', () => showPlayerDetail(player));
          tbody.appendChild(row);
        });
      } else {
        const data = rankings[mode] || [];
        tbody.innerHTML = data.length === 0 
          ? `<tr><td colspan="4" style="text-align:center; padding:3rem; color:var(--text-muted);">Nadie se ha testeado en esta modalidad. 😿</td></tr>`
          : '';

        data.forEach(player => player.points = getPointsFromTier(player.tier));
        data.sort((a, b) => b.points - a.points || a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        if (data.length > 0) {
          let currentRank = 1;
          data[0].rank = 1;
          let prevPoints = data[0].points;
          for (let i = 1; i < data.length; i++) {
            if (data[i].points < prevPoints) currentRank += 1;
            data[i].rank = currentRank;
            prevPoints = data[i].points;
          }
        }

        data.forEach(player => {
          const rankClass = player.rank === 1 ? 'rank-1' : player.rank === 2 ? 'rank-2' : player.rank === 3 ? 'rank-3' : '';
          const roleClass = STAFF_ROLES[player.name] || '';

          const row = document.createElement('tr');
          row.innerHTML = `
            <td class="rank ${rankClass}">#${player.rank}</td>
            <td>
              <div class="player-cell">
                <img src="${headUrl(player.name)}" alt="${player.name}" class="skin-head" loading="lazy" onerror="this.src='https://visage.surgeplay.com/face/128/steve'">
                <div class="player-info">
                  <span class="player-name ${roleClass}">${player.name}</span>
                </div>
              </div>
            </td>
            <td class="tier ${getTierClass(player.tier)}">${player.tier || '?'}</td>
            <td>${player.points || '?'}</td>
          `;
          row.style.cursor = 'pointer';
          row.addEventListener('click', () => showPlayerDetail(player));
          tbody.appendChild(row);
        });
      }
    }

    setTimeout(() => {
      if (wrapper) wrapper.classList.remove('transitioning');
    }, 140);
  }, 140);
}

function showSearchResults(query) {
  if (!query.trim()) {
    searchResults.classList.remove('active');
    return;
  }

  const lowerQuery = query.toLowerCase();
  const results = Object.values(allPlayers).filter(p => p.name.toLowerCase().includes(lowerQuery));

  searchResults.innerHTML = results.length === 0 
    ? `<div class="search-item"><div class="search-info" style="text-align:center;"><span class="search-name">No encontrado</span><div class="search-meta" style="margin-top:0.6rem;">Este usuario no se ha registrado 😿</div></div></div>`
    : '';

  results.forEach(p => {
    const roleClass = STAFF_ROLES[p.name] || '';
    const item = document.createElement('div');
    item.className = 'search-item';
    item.innerHTML = `
      <img src="${headUrl(p.name)}" alt="${p.name}">
      <div class="search-info">
        <span class="search-name ${roleClass}">${p.name}</span>
        <div class="search-meta">Tier: ${p.tier || '?'} • Puntos: ${p.points || '?'}</div>
      </div>
    `;
    item.onclick = () => {
      showPlayerDetail(p);
      searchResults.classList.remove('active');
      searchInput.value = p.name;
      if (visibleText) visibleText.textContent = p.name;
    };
    searchResults.appendChild(item);
  });

  searchResults.classList.add('active');
}

function showPlayerDetail(player) {
  const namemcUrl = `https://namemc.com/profile/${player.name}`;
  const skin3d = fullSkinUrl(player.name);
  const roleClass = STAFF_ROLES[player.name] || '';

  const testedModes = getPlayerTestedModes(player.name);

  let positionText = 'Unranked';
  if (player.points > 0) {
    const generalRanking = Object.entries(playersTotalPoints)
      .map(([name, pts]) => ({ name, points: pts }))
      .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
    
    const rankIndex = generalRanking.findIndex(p => p.name === player.name);
    if (rankIndex !== -1) {
      positionText = `#${rankIndex + 1} (${player.points} pts)`;
    } else {
      positionText = `(${player.points} pts)`;
    }
  }

  let tiersHtml = '<div class="modal-tiers-list">';
  if (testedModes.length === 0) {
    tiersHtml += '<p style="color:var(--text-muted); text-align:center; width:100%; padding:1rem 0;">Unranked</p>';
  } else {
    testedModes.forEach(item => {
      const iconPath = getModeIconPath(item.mode);
      const tierClass = getTierClass(item.tier);
      tiersHtml += `
        <div class="modal-tier-item ${tierClass}">
          <img src="${iconPath}" alt="${item.mode}" class="modal-mode-icon">
          <span class="modal-tier-text">${item.tier}</span>
        </div>
      `;
    });
  }
  tiersHtml += '</div>';

  modalBody.innerHTML = `
    <img src="${skin3d}" alt="Skin de ${player.name}" class="modal-player-skin"
        onerror="this.src='https://mc-heads.net/body/steve/512/3/0/left'">

    <h2 class="modal-player-name ${roleClass}">${player.name}</h2>

    <div class="modal-position">
      Región: <strong>${player.region || '?'}</strong>
    </div>

    <div class="modal-position">
      Posición: <strong>${positionText}</strong>
    </div>

    <div class="modal-tiers-section">
      <h3>Tiers:</h3>
      ${tiersHtml}
    </div>

    <div style="text-align: center; margin-top: 1.5rem;">
      <a href="${namemcUrl}" target="_blank" rel="noopener" class="modal-namemc">
        <img src="content/icons/img_namemc.png" alt="NameMC" class="namemc-icon">
        NameMC →
      </a>
    </div>
  `;

  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('show'), 10);
}

function closeModal() {
  modal.classList.add('closing');
  setTimeout(() => {
    modal.classList.remove('show', 'closing');
    modal.style.display = 'none';
  }, 380);
}

searchInput.dataset.prevLength = "0";

searchInput.addEventListener('input', e => {
  const value = e.target.value;
  const len = value.length;

  if (visibleText) visibleText.textContent = value;

  searchBox.classList.remove('grow', 'shrink');

  searchBox.className = searchBox.className
    .replace(/len-\d+/g, '')
    .replace(/\s+/g, ' ')
    .trim() + ` len-${len}`;

  const prev = parseInt(searchInput.dataset.prevLength || '0', 10);

  if (len > prev) searchBox.classList.add('grow');
  else if (len < prev) searchBox.classList.add('shrink');

  setTimeout(() => searchBox.classList.remove('grow', 'shrink'), 180);

  searchInput.dataset.prevLength = len;

  if (value.trim().length > 0) {
    showSearchResults(value);
  } else {
    searchResults.classList.remove('active');
  }
});

searchInput.addEventListener('focus', () => {
  searchBox.classList.add('focused');
  if (searchInput.value.trim().length > 0) {
    showSearchResults(searchInput.value);
  }
});

searchInput.addEventListener('blur', () => {
  searchBox.classList.remove('focused');
  const currentLen = searchInput.value.length;
  searchBox.className = searchBox.className
    .replace(/len-\d+/g, '')
    .trim() + ` len-${currentLen}`;
});

document.addEventListener('click', e => {
  if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
    searchResults.classList.remove('active');
  }
});

document.querySelector('.close-modal').onclick = closeModal;
modal.onclick = e => {
  if (e.target === modal) closeModal();
};

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    activateButton(btn.dataset.mode);
    updateLeaderboard(btn.dataset.mode);
  });
});

document.querySelectorAll('details').forEach(detailsEl => {
  detailsEl.addEventListener('click', function(e) {
    const summary = e.target.closest('summary');
    if (!summary && e.target !== detailsEl) return;

    e.preventDefault();

    if (detailsEl.open) {
      detailsEl.classList.add('closing');
      setTimeout(() => {
        detailsEl.classList.remove('closing');
        detailsEl.open = false;
      }, 520);
    } else {
      detailsEl.open = true;
      void detailsEl.offsetHeight;
    }
  });

  detailsEl.addEventListener('toggle', () => {
    if (!detailsEl.open) detailsEl.classList.remove('closing');
  });
});

updateLeaderboard('general');