import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js';
import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
} from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js';
import {
  collection,
  documentId,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
} from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';

import { adminAccess, dashboardCollections, firebaseConfig } from './firebase-config.js';

const loginCard = document.getElementById('loginCard');
const unauthorizedCard = document.getElementById('unauthorizedCard');
const dashboardContent = document.getElementById('dashboardContent');
const setupNotice = document.getElementById('setupNotice');
const dashboardErrorNotice = document.getElementById('dashboardErrorNotice');
const dashboardErrorTitle = document.getElementById('dashboardErrorTitle');
const dashboardErrorMessage = document.getElementById('dashboardErrorMessage');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const refreshButton = document.getElementById('refreshButton');
const loginError = document.getElementById('loginError');
const gamesTabButton = document.getElementById('gamesTabButton');
const crashlyticsTabButton = document.getElementById('crashlyticsTabButton');
const modesTabButton = document.getElementById('modesTabButton');
const analyticsTabButton = document.getElementById('analyticsTabButton');
const executiveSummaryTabButton = document.getElementById('executiveSummaryTabButton');
const adsPerformanceTabButton = document.getElementById('adsPerformanceTabButton');
const engagementTabButton = document.getElementById('engagementTabButton');
const qualityTabButton = document.getElementById('qualityTabButton');
const gamesPanel = document.getElementById('gamesPanel');
const crashlyticsPanel = document.getElementById('crashlyticsPanel');
const modesPanel = document.getElementById('modesPanel');
const analyticsPanel = document.getElementById('analyticsPanel');
const executiveSummaryPanel = document.getElementById('executiveSummaryPanel');
const adsPerformancePanel = document.getElementById('adsPerformancePanel');
const engagementPanel = document.getElementById('engagementPanel');
const qualityPanel = document.getElementById('qualityPanel');
const adminEmailValue = document.getElementById('adminEmailValue');
const lastRefreshValue = document.getElementById('lastRefreshValue');
const docsCountValue = document.getElementById('docsCountValue');
const modesAdminEmailValue = document.getElementById('modesAdminEmailValue');
const modesLastRefreshValue = document.getElementById('modesLastRefreshValue');
const modesDocsCountValue = document.getElementById('modesDocsCountValue');
const modesDocsLabel = document.getElementById('modesDocsLabel');
const modesSourceValue = document.getElementById('modesSourceValue');
const analyticsAdminEmailValue = document.getElementById('analyticsAdminEmailValue');
const analyticsLastRefreshValue = document.getElementById('analyticsLastRefreshValue');
const analyticsDocsCountValue = document.getElementById('analyticsDocsCountValue');
const crashAdminEmailValue = document.getElementById('crashAdminEmailValue');
const crashLastRefreshValue = document.getElementById('crashLastRefreshValue');
const crashDocsCountValue = document.getElementById('crashDocsCountValue');
const totalGames = document.getElementById('totalGames');
const bothYesGames = document.getElementById('bothYesGames');
const mixedGames = document.getElementById('mixedGames');
const bothNoGames = document.getElementById('bothNoGames');
const topModeName = document.getElementById('topModeName');
const topModeCount = document.getElementById('topModeCount');
const uniqueModesCount = document.getElementById('uniqueModesCount');
const modeSessionsLabel = document.getElementById('modeSessionsLabel');
const modeSessionsCount = document.getElementById('modeSessionsCount');
const missingModeLabel = document.getElementById('missingModeLabel');
const missingModeCount = document.getElementById('missingModeCount');
const modeBreakdownList = document.getElementById('modeBreakdownList');
const modesTableBody = document.getElementById('modesTableBody');
const modesTableTitle = document.getElementById('modesTableTitle');
const modesTableCountHeader = document.getElementById('modesTableCountHeader');
const modesTableShareHeader = document.getElementById('modesTableShareHeader');
const modesTableDateHeader = document.getElementById('modesTableDateHeader');
const analyticsTotalEventsCount = document.getElementById('analyticsTotalEventsCount');
const analyticsEventTypesCount = document.getElementById('analyticsEventTypesCount');
const analyticsModeOpenCount = document.getElementById('analyticsModeOpenCount');
const analyticsUniqueModesCount = document.getElementById('analyticsUniqueModesCount');
const analyticsHighlightsList = document.getElementById('analyticsHighlightsList');
const analyticsTopEventValue = document.getElementById('analyticsTopEventValue');
const analyticsLatestEventValue = document.getElementById('analyticsLatestEventValue');
const analyticsTableBody = document.getElementById('analyticsTableBody');
const yesCount = document.getElementById('yesCount');
const maybeCount = document.getElementById('maybeCount');
const noCount = document.getElementById('noCount');
const yesBar = document.getElementById('yesBar');
const maybeBar = document.getElementById('maybeBar');
const noBar = document.getElementById('noBar');
const playerAYesCount = document.getElementById('playerAYesCount');
const playerAMaybeCount = document.getElementById('playerAMaybeCount');
const playerANoCount = document.getElementById('playerANoCount');
const playerAYesBar = document.getElementById('playerAYesBar');
const playerAMaybeBar = document.getElementById('playerAMaybeBar');
const playerANoBar = document.getElementById('playerANoBar');
const playerBYesCount = document.getElementById('playerBYesCount');
const playerBMaybeCount = document.getElementById('playerBMaybeCount');
const playerBNoCount = document.getElementById('playerBNoCount');
const playerBYesBar = document.getElementById('playerBYesBar');
const playerBMaybeBar = document.getElementById('playerBMaybeBar');
const playerBNoBar = document.getElementById('playerBNoBar');
const sessionsTableBody = document.getElementById('sessionsTableBody');
const crashIssueCount = document.getElementById('crashIssueCount');
const fatalCrashCount = document.getElementById('fatalCrashCount');
const crashEventCount = document.getElementById('crashEventCount');
const crashUsersCount = document.getElementById('crashUsersCount');
const topCrashesList = document.getElementById('topCrashesList');
const crashGroupsList = document.getElementById('crashGroupsList');
const crashGroupBySelect = document.getElementById('crashGroupBySelect');
const crashGroupSortSelect = document.getElementById('crashGroupSortSelect');
const topCrashValue = document.getElementById('topCrashValue');
const latestCrashValue = document.getElementById('latestCrashValue');
const latestCrashVersionValue = document.getElementById('latestCrashVersionValue');
const crashTableBody = document.getElementById('crashTableBody');

// Executive Summary elements
const summaryDAU = document.getElementById('summaryDAU');
const summaryARPU = document.getElementById('summaryARPU');
const summaryCrashRate = document.getElementById('summaryCrashRate');
const summaryRetention = document.getElementById('summaryRetention');
const revenueTrendChart = document.getElementById('revenueTrendChart');
const summaryAdsPercent = document.getElementById('summaryAdsPercent');
const summaryPurchasePercent = document.getElementById('summaryPurchasePercent');
const summaryIAARevenue = document.getElementById('summaryIAARevenue');
const summaryIAPRevenue = document.getElementById('summaryIAPRevenue');

// Ads Performance elements
const adsImpressions = document.getElementById('adsImpressions');
const adsClicks = document.getElementById('adsClicks');
const adsCTR = document.getElementById('adsCTR');
const adsRevenue = document.getElementById('adsRevenue');
const placementPerformanceList = document.getElementById('placementPerformanceList');
const ecpmTrendChart = document.getElementById('ecpmTrendChart');
const adsPerformanceTableBody = document.getElementById('adsPerformanceTableBody');

// Engagement elements
const engDAU = document.getElementById('engDAU');
const engMAU = document.getElementById('engMAU');
const engAvgSession = document.getElementById('engAvgSession');
const engSessionsPerUser = document.getElementById('engSessionsPerUser');
const retentionD1 = document.getElementById('retentionD1');
const retentionD3 = document.getElementById('retentionD3');
const retentionD7 = document.getElementById('retentionD7');
const retentionD30 = document.getElementById('retentionD30');
const dauTrendChart = document.getElementById('dauTrendChart');
const engagementMetricsTableBody = document.getElementById('engagementMetricsTableBody');

// Quality elements
const qualityCrashRate = document.getElementById('qualityCrashRate');
const qualityFatalCount = document.getElementById('qualityFatalCount');
const qualityLatency = document.getElementById('qualityLatency');
const qualityUsersAffected = document.getElementById('qualityUsersAffected');
const crashTrendChart = document.getElementById('crashTrendChart');
const topIssuesQualityList = document.getElementById('topIssuesQualityList');
const qualityIssuesTableBody = document.getElementById('qualityIssuesTableBody');

const DASHBOARD_STORAGE_KEYS = {
  activeDashboard: 'statapp.activeDashboard',
  crashGroupBy: 'statapp.crashGroupBy',
  crashGroupSort: 'statapp.crashGroupSort',
};

const ALLOWED_DASHBOARDS = new Set(['games', 'modes', 'analytics', 'crashlytics', 'executiveSummary', 'adsPerformance', 'engagement', 'quality']);

let activeDashboard = restoreActiveDashboard();
let crashRowsCache = [];

adminEmailValue.textContent = adminAccess.email;
modesAdminEmailValue.textContent = adminAccess.email;
analyticsAdminEmailValue.textContent = adminAccess.email;
crashAdminEmailValue.textContent = adminAccess.email;

if (!firebaseConfig.appId || firebaseConfig.appId.includes('REPLACE_WITH')) {
  setupNotice.hidden = false;
  loginCard.hidden = true;
  throw new Error('Firebase web app config is incomplete. Fill appId in src/firebase-config.js');
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const googleButtonDefaultHtml =
  loginButton?.innerHTML || 'Zaloguj przez Google';
let loginInProgress = false;

gamesTabButton.addEventListener('click', async () => {
  await switchDashboard('games');
});

crashlyticsTabButton.addEventListener('click', async () => {
  await switchDashboard('crashlytics');
});

modesTabButton.addEventListener('click', async () => {
  await switchDashboard('modes');
});

analyticsTabButton.addEventListener('click', async () => {
  await switchDashboard('analytics');
});

executiveSummaryTabButton.addEventListener('click', async () => {
  await switchDashboard('executiveSummary');
});

adsPerformanceTabButton.addEventListener('click', async () => {
  await switchDashboard('adsPerformance');
});

engagementTabButton.addEventListener('click', async () => {
  await switchDashboard('engagement');
});

qualityTabButton.addEventListener('click', async () => {
  await switchDashboard('quality');
});

crashGroupBySelect?.addEventListener('change', () => {
  savePreference(DASHBOARD_STORAGE_KEYS.crashGroupBy, crashGroupBySelect.value);
  if (activeDashboard === 'crashlytics') {
    renderCrashGroups(crashRowsCache);
  }
});

crashGroupSortSelect?.addEventListener('change', () => {
  savePreference(DASHBOARD_STORAGE_KEYS.crashGroupSort, crashGroupSortSelect.value);
  if (activeDashboard === 'crashlytics') {
    renderCrashGroups(crashRowsCache);
  }
});

restoreCrashGroupPreferences();

function setLoginButtonBusy(isBusy) {
  if (!loginButton) return;
  loginButton.disabled = isBusy;
  loginButton.innerHTML = isBusy
    ? 'Przekierowanie do Google...'
    : googleButtonDefaultHtml;
}

function showAuthError(error) {
  const code = String(error?.code || '').toLowerCase();
  const msg = String(error?.message || error || 'Logowanie nie powiodlo sie.');

  if (
    code.includes('operation-not-allowed') ||
    msg.toLowerCase().includes('operation-not-allowed')
  ) {
    loginError.hidden = false;
    loginError.innerHTML =
      'Google sign-in jest wylaczony w Firebase Authentication. Wlacz go w Firebase Console -> Authentication -> Sign-in method.';
    return;
  }

  if (
    code.includes('unauthorized-domain') ||
    msg.toLowerCase().includes('unauthorized-domain')
  ) {
    loginError.hidden = false;
    loginError.innerHTML =
      'Domena nieautoryzowana w Firebase Auth. Dodaj <strong>36app.pl</strong> i <strong>www.36app.pl</strong> do Authorized domains.';
    return;
  }

  if (code.includes('network-request-failed')) {
    loginError.hidden = false;
    loginError.textContent = 'Brak polaczenia z siecia. Sprobuj ponownie.';
    return;
  }

  loginError.hidden = false;
  loginError.textContent = msg;
}

setLoginButtonBusy(false);

// Process result after Google redirect (required for redirect login flow).
getRedirectResult(auth)
  .catch((error) => {
    showAuthError(error);
  })
  .finally(() => {
    loginInProgress = false;
    setLoginButtonBusy(false);
  });

loginButton.addEventListener('click', async () => {
  if (loginInProgress) return;
  loginInProgress = true;
  loginError.hidden = true;
  setLoginButtonBusy(true);
  try {
    await signInWithRedirect(auth, provider);
    } catch (error) {
    loginInProgress = false;
    setLoginButtonBusy(false);
    showAuthError(error);
    return;
  }
});

logoutButton.addEventListener('click', async () => {
  await signOut(auth);
});

refreshButton.addEventListener('click', async () => {
  await loadDashboard();
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    setState('login');
    return;
  }

  const email = normalizeEmailForAuth(user.email);
  const adminEmail = normalizeEmailForAuth(adminAccess.email);
  if (email !== adminEmail) {
    await signOut(auth);
    setState('login');
    loginError.hidden = false;
    loginError.innerHTML =
      'To konto nie ma dostepu do panelu. Zalogowano jako <strong>' +
      escapeHtml(user.email || '') +
      '</strong>, wymagane konto: <strong>' +
      escapeHtml(adminAccess.email) +
      '</strong>.';
    return;
  }

  setState('dashboard');
  await loadDashboard();
});

function setState(state) {
  loginCard.hidden = state !== 'login';
  unauthorizedCard.hidden = state !== 'unauthorized';
  dashboardContent.hidden = state !== 'dashboard';
  logoutButton.hidden = state !== 'dashboard';
  refreshButton.disabled = state !== 'dashboard';
  if (state === 'dashboard') {
    updateDashboardVisibility();
  }
}

function normalizeEmailForAuth(value) {
  const email = String(value || '').trim().toLowerCase();
  const atIndex = email.indexOf('@');
  if (atIndex <= 0) return email;

  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  if (domain !== 'gmail.com' && domain !== 'googlemail.com') {
    return `${local}@${domain}`;
  }

  const localNoAlias = local.split('+')[0].replace(/\./g, '');
  return `${localNoAlias}@gmail.com`;
}

async function loadDashboard() {
  refreshButton.disabled = true;
  hideDashboardError();

  try {
    if (activeDashboard === 'games') {
      await loadGamesDashboard();
      lastRefreshValue.textContent = new Date().toLocaleString('pl-PL');
    } else if (activeDashboard === 'modes') {
      await loadModesDashboard();
      modesLastRefreshValue.textContent = new Date().toLocaleString('pl-PL');
    } else if (activeDashboard === 'analytics') {
      await loadAnalyticsDashboard();
      analyticsLastRefreshValue.textContent = new Date().toLocaleString('pl-PL');
    } else if (activeDashboard === 'executiveSummary') {
      await loadExecutiveSummary();
    } else if (activeDashboard === 'adsPerformance') {
      await loadAdsPerformance();
    } else if (activeDashboard === 'engagement') {
      await loadEngagementDashboard();
    } else if (activeDashboard === 'quality') {
      await loadQualityDashboard();
    } else {
      await loadCrashlyticsDashboard();
      crashLastRefreshValue.textContent = new Date().toLocaleString('pl-PL');
    }
  } catch (error) {
    showDashboardError(error);

    if (activeDashboard === 'crashlytics') {
      crashRowsCache = [];
      renderCrashStats([]);
      renderTopCrashes([]);
      renderCrashGroups([]);
      renderCrashTable([]);
      crashDocsCountValue.textContent = '0';
    } else if (activeDashboard === 'analytics') {
      renderAnalyticsStats([]);
      renderAnalyticsHighlights([]);
      renderAnalyticsTable([]);
      analyticsDocsCountValue.textContent = '0';
    } else if (activeDashboard === 'modes') {
      renderModeSummary(emptyModeSummary(), {
        sessionDocs: 0,
        modeStatDocs: 0,
        analyticsModeDocs: 0,
      });
      modesDocsCountValue.textContent = '0';
    } else if (activeDashboard === 'games') {
      renderStats([]);
      renderTable([]);
      docsCountValue.textContent = '0';
    } else {
      renderExecutiveSummaryEmpty();
    }
  } finally {
    refreshButton.disabled = false;
  }
}

async function switchDashboard(nextDashboard) {
  if (activeDashboard === nextDashboard) {
    return;
  }

  activeDashboard = nextDashboard;
  savePreference(DASHBOARD_STORAGE_KEYS.activeDashboard, activeDashboard);
  updateDashboardVisibility();

  if (!dashboardContent.hidden) {
    await loadDashboard();
  }
}

function updateDashboardVisibility() {
  const isGames = activeDashboard === 'games';
  const isModes = activeDashboard === 'modes';
  const isAnalytics = activeDashboard === 'analytics';
  const isCrashlytics = activeDashboard === 'crashlytics';
  const isExecutiveSummary = activeDashboard === 'executiveSummary';
  const isAdsPerformance = activeDashboard === 'adsPerformance';
  const isEngagement = activeDashboard === 'engagement';
  const isQuality = activeDashboard === 'quality';

  gamesTabButton.classList.toggle('active', isGames);
  modesTabButton.classList.toggle('active', isModes);
  analyticsTabButton.classList.toggle('active', isAnalytics);
  crashlyticsTabButton.classList.toggle('active', isCrashlytics);
  executiveSummaryTabButton.classList.toggle('active', isExecutiveSummary);
  adsPerformanceTabButton.classList.toggle('active', isAdsPerformance);
  engagementTabButton.classList.toggle('active', isEngagement);
  qualityTabButton.classList.toggle('active', isQuality);

  gamesTabButton.setAttribute('aria-selected', String(isGames));
  modesTabButton.setAttribute('aria-selected', String(isModes));
  analyticsTabButton.setAttribute('aria-selected', String(isAnalytics));
  crashlyticsTabButton.setAttribute('aria-selected', String(isCrashlytics));
  executiveSummaryTabButton.setAttribute('aria-selected', String(isExecutiveSummary));
  adsPerformanceTabButton.setAttribute('aria-selected', String(isAdsPerformance));
  engagementTabButton.setAttribute('aria-selected', String(isEngagement));
  qualityTabButton.setAttribute('aria-selected', String(isQuality));

  gamesPanel.hidden = !isGames;
  modesPanel.hidden = !isModes;
  analyticsPanel.hidden = !isAnalytics;
  crashlyticsPanel.hidden = !isCrashlytics;
  executiveSummaryPanel.hidden = !isExecutiveSummary;
  adsPerformancePanel.hidden = !isAdsPerformance;
  engagementPanel.hidden = !isEngagement;
  qualityPanel.hidden = !isQuality;
}

function showDashboardError(error) {
  dashboardErrorNotice.hidden = false;
  dashboardErrorTitle.textContent = dashboardErrorTitleForActivePanel();
  dashboardErrorMessage.textContent = normalizeDashboardError(error);
}

function dashboardErrorTitleForActivePanel() {
  if (activeDashboard === 'crashlytics') {
    return 'Crashlytics nie zwraca danych';
  }

  if (activeDashboard === 'analytics') {
    return 'Monetyzacja nie zwraca danych';
  }

  if (activeDashboard === 'modes') {
    return 'Tryby gry nie zwracają danych';
  }

  return 'Statystyki gry nie zwracają danych';
}

function hideDashboardError() {
  dashboardErrorNotice.hidden = true;
  dashboardErrorMessage.textContent = '';
}

function normalizeDashboardError(error) {
  const rawMessage = String(error?.message || error || 'Nieznany błąd');
  const normalized = rawMessage.toLowerCase();

  if (normalized.includes('missing or insufficient permissions')) {
    if (activeDashboard === 'analytics') {
      return 'Brakuje reguły odczytu albo kolekcja analytics_events nie istnieje jeszcze w Firestore.';
    }

    if (activeDashboard === 'crashlytics') {
      return 'Brakuje reguły odczytu albo kolekcja crashlytics_reports nie istnieje jeszcze w Firestore.';
    }

    if (activeDashboard === 'modes') {
      return 'Brakuje uprawnień do odczytu kolekcji mode_play_stats, analytics_events i monetization_events albo te kolekcje nie istnieją jeszcze w Firestore.';
    }

    if (activeDashboard === 'analytics') {
      return 'Brakuje reguły odczytu albo kolekcje analytics_events i monetization_events nie istnieją jeszcze w Firestore.';
    }

    return 'Brakuje uprawnień do odczytu kolekcji game_history w Firestore.';
  }

  return rawMessage;
}

async function loadGamesDashboard() {
  const rows = await loadCollectionRows(dashboardCollections.sessions);
  rows.sort((left, right) => getTimestampValue(right.createdAtIso) - getTimestampValue(left.createdAtIso));
  renderStats(rows);
  renderTable(rows);
  docsCountValue.textContent = String(rows.length);
}

async function loadCrashlyticsDashboard() {
  const rawRows = await loadCollectionRows(dashboardCollections.crashlytics);
  const rows = rawRows
    .flatMap((row) => normalizeCrashRows(row.id, row))
    .filter((row) => hasUsefulCrashData(row))
    .sort((left, right) => getTimestampValue(right.lastSeenRaw) - getTimestampValue(left.lastSeenRaw));

  crashRowsCache = rows;

  renderCrashStats(rows);
  renderTopCrashes(rows);
  renderCrashGroups(rows);
  renderCrashTable(rows);
  crashDocsCountValue.textContent = String(rawRows.length);
}

async function loadModesDashboard() {
  let modeSummary = emptyModeSummary();
  let docsCount = 0;
  let modeStatDocs = 0;
  let analyticsModeDocs = 0;

  if (dashboardCollections.modeStats) {
    const modeStatRows = await loadCollectionRows(dashboardCollections.modeStats);
    modeStatDocs = modeStatRows.length;
    const fallbackSummary = summarizeModeStatRows(modeStatRows);

    if (fallbackSummary.modes.length) {
      modeSummary = fallbackSummary;
      docsCount = modeStatRows.length;
    }
  }

  if (!modeSummary.sessionsWithMode && getAnalyticsCollectionCandidates().length) {
    const { rows: analyticsRawRows } = await loadFirstAvailableCollectionRows(getAnalyticsCollectionCandidates());
    const analyticsRows = analyticsRawRows
      .map((row) => normalizeAnalyticsRow(row.id, row))
      .filter((row) => hasUsefulAnalyticsData(row));
    analyticsModeDocs = analyticsRows.filter((row) => isModeAnalyticsRow(row)).length;
    const analyticsSummary = summarizeAnalyticsModeRows(analyticsRows);

    if (analyticsSummary.modes.length) {
      modeSummary = analyticsSummary;
      docsCount = analyticsModeDocs;
    }
  }

  renderModeSummary(modeSummary, {
    sessionDocs: 0,
    modeStatDocs,
    analyticsModeDocs,
  });
  modesDocsCountValue.textContent = String(docsCount);
}

async function loadAnalyticsDashboard() {
  const { rows: rawRows } = await loadFirstAvailableCollectionRows(getAnalyticsCollectionCandidates());
  const rows = aggregateAnalyticsRows(rawRows
    .map((row) => normalizeAnalyticsRow(row.id, row))
    .filter((row) => hasUsefulAnalyticsData(row))
    .filter((row) => isMonetizationEvent(row.eventName)))
    .sort((left, right) => {
      if (right.eventCount !== left.eventCount) {
        return right.eventCount - left.eventCount;
      }

      return getTimestampValue(right.lastSeenRaw) - getTimestampValue(left.lastSeenRaw);
    });

  renderAnalyticsStats(rows);
  renderAnalyticsHighlights(rows);
  renderAnalyticsTable(rows);
  analyticsDocsCountValue.textContent = String(rawRows.length);
}

async function loadFirstAvailableCollectionRows(collectionNames) {
  let firstRows = [];
  let firstCollectionName = '';

  for (const collectionName of collectionNames) {
    const rows = await loadCollectionRows(collectionName);
    if (!firstCollectionName) {
      firstCollectionName = collectionName;
      firstRows = rows;
    }

    if (rows.length) {
      return { collectionName, rows };
    }
  }

  return { collectionName: firstCollectionName, rows: firstRows };
}

function getAnalyticsCollectionCandidates() {
  return [...new Set([
    dashboardCollections.analytics,
    dashboardCollections.analyticsLegacy,
  ].filter(Boolean))];
}

async function loadCollectionRows(collectionName) {
  const rows = [];
  let lastDocumentId = null;

  while (true) {
    const constraints = [orderBy(documentId()), limit(500)];

    if (lastDocumentId !== null) {
      constraints.push(startAfter(lastDocumentId));
    }

    const snapshot = await getDocs(query(collection(db, collectionName), ...constraints));

    if (snapshot.empty) {
      break;
    }

    rows.push(...snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    lastDocumentId = snapshot.docs[snapshot.docs.length - 1].id;

    if (snapshot.docs.length < 500) {
      break;
    }
  }

  return rows;
}

function renderStats(rows) {
  const totals = {
    total: rows.length,
    both_yes: 0,
    mixed: 0,
    both_no: 0,
    yes: 0,
    maybe: 0,
    no: 0,
  };

  const playerA = { yes: 0, maybe: 0, no: 0 };
  const playerB = { yes: 0, maybe: 0, no: 0 };

  for (const row of rows) {
    if (row.finalResult && totals[row.finalResult] !== undefined) {
      totals[row.finalResult] += 1;
    }

    if (row.answerForA && totals[row.answerForA] !== undefined) {
      totals[row.answerForA] += 1;
    }
    if (row.answerForB && totals[row.answerForB] !== undefined) {
      totals[row.answerForB] += 1;
    }

    if (row.answerForA && playerA[row.answerForA] !== undefined) {
      playerA[row.answerForA] += 1;
    }
    if (row.answerForB && playerB[row.answerForB] !== undefined) {
      playerB[row.answerForB] += 1;
    }
  }

  totalGames.textContent = String(totals.total);
  bothYesGames.textContent = String(totals.both_yes);
  mixedGames.textContent = String(totals.mixed);
  bothNoGames.textContent = String(totals.both_no);
  yesCount.textContent = String(totals.yes);
  maybeCount.textContent = String(totals.maybe);
  noCount.textContent = String(totals.no);

  const answersTotal = Math.max(totals.yes + totals.maybe + totals.no, 1);
  yesBar.style.width = `${(totals.yes / answersTotal) * 100}%`;
  maybeBar.style.width = `${(totals.maybe / answersTotal) * 100}%`;
  noBar.style.width = `${(totals.no / answersTotal) * 100}%`;

  const playerATotal = Math.max(playerA.yes + playerA.maybe + playerA.no, 1);
  playerAYesCount.textContent = String(playerA.yes);
  playerAMaybeCount.textContent = String(playerA.maybe);
  playerANoCount.textContent = String(playerA.no);
  playerAYesBar.style.width = `${(playerA.yes / playerATotal) * 100}%`;
  playerAMaybeBar.style.width = `${(playerA.maybe / playerATotal) * 100}%`;
  playerANoBar.style.width = `${(playerA.no / playerATotal) * 100}%`;

  const playerBTotal = Math.max(playerB.yes + playerB.maybe + playerB.no, 1);
  playerBYesCount.textContent = String(playerB.yes);
  playerBMaybeCount.textContent = String(playerB.maybe);
  playerBNoCount.textContent = String(playerB.no);
  playerBYesBar.style.width = `${(playerB.yes / playerBTotal) * 100}%`;
  playerBMaybeBar.style.width = `${(playerB.maybe / playerBTotal) * 100}%`;
  playerBNoBar.style.width = `${(playerB.no / playerBTotal) * 100}%`;
}

function renderModeSummary(modeSummary, diagnostics = {}) {
  const topMode = modeSummary.modes[0];
  const labels = modeSourceLabels(modeSummary.source);
  const countLabel = modeCountLabel(modeSummary.source);

  topModeName.textContent = topMode ? modeLabel(topMode.mode) : '-';
  topModeCount.textContent = topMode ? `${topMode.count} ${countLabel(topMode.count)}` : `0 ${countLabel(0)}`;
  uniqueModesCount.textContent = String(modeSummary.modes.length);
  modeSessionsLabel.textContent = labels.sessionsLabel;
  modeSessionsCount.textContent = String(modeSummary.sessionsWithMode);
  missingModeLabel.textContent = labels.missingLabel;
  missingModeCount.textContent = String(modeSummary.missingMode);
  modesDocsLabel.textContent = labels.docsLabel;
  modesTableTitle.textContent = labels.tableTitle;
  modesTableCountHeader.textContent = labels.tableCountHeader;
  modesTableShareHeader.textContent = labels.tableShareHeader;
  modesTableDateHeader.textContent = labels.tableDateHeader;
  modesSourceValue.textContent = describeModeSource(modeSummary, diagnostics);
  renderModeBreakdown(modeSummary.modes, Math.max(modeSummary.sessionsWithMode, 1), modeSummary.source);
  renderModesTable(modeSummary.modes, Math.max(modeSummary.sessionsWithMode, 1), modeSummary.source);
}

function renderAnalyticsStats(rows) {
  const totals = {
    events: 0,
    paywallViews: 0,
    purchaseSuccesses: 0,
    adTouches: 0,
  };

  let topEvent = null;
  let latestEvent = null;

  for (const row of rows) {
    totals.events += row.eventCount;

    if (row.eventName === 'paywall_view') {
      totals.paywallViews += row.eventCount;
    }

    if (row.eventName === 'purchase_success' || row.eventName === 'purchase_restored') {
      totals.purchaseSuccesses += row.eventCount;
    }

    if (
      row.eventName === 'rewarded_offer_view'
      || row.eventName === 'rewarded_started'
      || row.eventName === 'rewarded_earned'
      || row.eventName === 'rewarded_failed'
      || row.eventName === 'rewarded_skipped'
      || row.eventName === 'interstitial_requested'
      || row.eventName === 'interstitial_shown'
      || row.eventName === 'interstitial_skipped'
    ) {
      totals.adTouches += row.eventCount;
    }

    if (!topEvent || row.eventCount > topEvent.eventCount) {
      topEvent = row;
    }

    if (!latestEvent || getTimestampValue(row.lastSeenRaw) > getTimestampValue(latestEvent.lastSeenRaw)) {
      latestEvent = row;
    }
  }

  analyticsTotalEventsCount.textContent = String(totals.events);
  analyticsEventTypesCount.textContent = String(totals.paywallViews);
  analyticsModeOpenCount.textContent = String(totals.purchaseSuccesses);
  analyticsUniqueModesCount.textContent = String(totals.adTouches);
  analyticsTopEventValue.textContent = topEvent ? analyticsEventLabel(topEvent.eventName) : '-';
  analyticsLatestEventValue.textContent = latestEvent ? formatDate(latestEvent.lastSeenRaw) : '-';
}

function renderAnalyticsHighlights(rows) {
  if (!rows.length) {
    analyticsHighlightsList.innerHTML = '<p class="empty-row">Brak zsynchronizowanych eventów monetyzacji. Ten widok pokazuje tylko dane wyeksportowane do Firestore, nie bezpośredni podgląd Firebase Analytics.</p>';
    return;
  }

  analyticsHighlightsList.innerHTML = rows
    .slice(0, 6)
    .map((row) => {
      const category = analyticsCategory(row.eventName);
      const categoryBadge = renderBadge(category, analyticsCategoryLabel(category));
      const meta = [
        `${row.eventCount} zdarzeń`,
        `${row.userCount} użytk.`,
        analyticsDimensionLabel(row),
      ].filter(Boolean).join(' • ');

      return `
        <article class="crash-item">
          <div class="crash-item-header">
            <strong>${escapeHtml(analyticsEventLabel(row.eventName))}</strong>
            ${categoryBadge}
          </div>
          <p class="crash-item-meta">${escapeHtml(meta)}</p>
          <p class="crash-item-subtitle">${escapeHtml(row.eventName)}</p>
        </article>
      `;
    })
    .join('');
}

function renderAnalyticsTable(rows) {
  if (!rows.length) {
    analyticsTableBody.innerHTML = '<tr><td colspan="5" class="empty-row">Brak danych monetyzacji</td></tr>';
    return;
  }

  analyticsTableBody.innerHTML = rows
    .map((row) => `
      <tr>
        <td>
          <strong>${escapeHtml(analyticsEventLabel(row.eventName))}</strong>
          <div class="table-note">${escapeHtml(row.eventName)}</div>
        </td>
        <td>${escapeHtml(analyticsDimensionLabel(row) || '-')}</td>
        <td>${escapeHtml(String(row.eventCount))}</td>
        <td>${escapeHtml(String(row.userCount))}</td>
        <td>${formatDate(row.lastSeenRaw)}</td>
      </tr>
    `)
    .join('');
}

function summarizeModes(rows) {
  const summaries = new Map();
  let sessionsWithMode = 0;

  for (const row of rows) {
    const mode = normalizeSessionMode(row);
    if (!mode) {
      continue;
    }

    sessionsWithMode += 1;
    const current = summaries.get(mode) || {
      mode,
      count: 0,
      latestRaw: null,
    };

    current.count += 1;
    if (getTimestampValue(row.createdAtIso) > getTimestampValue(current.latestRaw)) {
      current.latestRaw = row.createdAtIso;
    }
    summaries.set(mode, current);
  }

  return {
    modes: [...summaries.values()].sort((left, right) => right.count - left.count),
    sessionsWithMode,
    missingMode: Math.max(rows.length - sessionsWithMode, 0),
    source: 'sessions',
  };
}

function emptyModeSummary() {
  return {
    modes: [],
    sessionsWithMode: 0,
    missingMode: 0,
    source: 'none',
  };
}

function summarizeModeStatRows(rows) {
  const summaries = new Map();
  let sessionsWithMode = 0;
  let analyticsDerived = false;

  for (const row of rows) {
    const mode = normalizeModeStatMode(row);
    const count = resolveModeStatCount(row);

    if (!mode || count <= 0) {
      continue;
    }

    const countType = String(pickValue(row, [
      ['countType'],
      ['metricType'],
    ]) || '').trim().toLowerCase();
    const sourceType = String(pickValue(row, [
      ['sourceType'],
      ['source'],
    ]) || '').trim().toLowerCase();
    if (countType === 'events' || sourceType === 'analytics') {
      analyticsDerived = true;
    }

    sessionsWithMode += count;
    const current = summaries.get(mode) || {
      mode,
      count: 0,
      openCount: 0,
      playCount: 0,
      latestRaw: null,
    };

    current.count += count;

    const rawOpenCount = toNumber(pickValue(row, [['openCount'], ['open_count']])) || 0;
    const rawPlayCount = toNumber(pickValue(row, [['playCount'], ['play_count']])) || 0;
    current.openCount += rawOpenCount;
    current.playCount += rawPlayCount;

    const latestRaw = pickValue(row, [
      ['lastSeen'],
      ['lastPlayedAt'],
      ['lastOpenedAt'],
      ['updatedAt'],
      ['createdAt'],
      ['timestamp'],
      ['syncedAt'],
    ]);

    if (getTimestampValue(latestRaw) > getTimestampValue(current.latestRaw)) {
      current.latestRaw = latestRaw;
    }

    summaries.set(mode, current);
  }

  return {
    modes: [...summaries.values()].sort((left, right) => right.count - left.count),
    sessionsWithMode,
    missingMode: 0,
    source: analyticsDerived ? 'analytics' : 'mode-stats',
  };
}

function summarizeAnalyticsModeRows(rows) {
  const summaries = new Map();
  let eventsWithMode = 0;

  for (const row of rows) {
    if (!isModeAnalyticsRow(row)) {
      continue;
    }

    const mode = normalizeAnalyticsMode(row.parameterValue);
    if (!mode) {
      continue;
    }

    const count = Math.max(row.eventCount, 0);
    if (count <= 0) {
      continue;
    }

    eventsWithMode += count;
    const current = summaries.get(mode) || {
      mode,
      count: 0,
      latestRaw: null,
    };

    current.count += count;
    if (getTimestampValue(row.lastSeenRaw) > getTimestampValue(current.latestRaw)) {
      current.latestRaw = row.lastSeenRaw;
    }

    summaries.set(mode, current);
  }

  return {
    modes: [...summaries.values()].sort((left, right) => right.count - left.count),
    sessionsWithMode: eventsWithMode,
    missingMode: 0,
    source: 'analytics',
  };
}

function renderModeBreakdown(sortedModes, totalSessions, source) {
  if (!sortedModes.length) {
    modeBreakdownList.innerHTML = `<p class="empty-row">${escapeHtml(modeSourceLabels(source).emptyBreakdown)}</p>`;
    return;
  }

  const countLabel = modeCountLabel(source);

  modeBreakdownList.innerHTML = sortedModes
    .slice(0, 6)
    .map((summary) => {
      const percentage = Math.round((summary.count / totalSessions) * 100);
      return `
        <div class="mode-row">
          <div class="mode-row-top">
            <strong>${escapeHtml(modeLabel(summary.mode))}</strong>
            <span>${summary.count} ${countLabel(summary.count)} • ${percentage}%</span>
          </div>
          <div class="answer-meter"><div class="answer-fill mode" style="width: ${percentage}%"></div></div>
        </div>
      `;
    })
    .join('');
}

function renderModesTable(modes, totalSessions, source) {
  if (!modes.length) {
    modesTableBody.innerHTML = `<tr><td colspan="4" class="empty-row">${escapeHtml(modeSourceLabels(source).emptyTable)}</td></tr>`;
    return;
  }

  const countLabel = modeCountLabel(source);
  const isModeStats = source === 'mode-stats';

  modesTableBody.innerHTML = modes
    .map((summary) => {
      if (isModeStats && (summary.openCount > 0 || summary.playCount > 0)) {
        const opens = summary.openCount;
        const plays = summary.playCount;
        const convPct = opens > 0 ? Math.round((plays / opens) * 100) : 0;
        const playsLabel = plays === 1 ? '1 start' : plays < 5 ? `${plays} starty` : `${plays} startów`;
        return `
          <tr>
            <td>${escapeHtml(modeLabel(summary.mode))}</td>
            <td>${opens}</td>
            <td>${convPct}% <span class="cell-sub">(${playsLabel})</span></td>
            <td>${formatDate(summary.latestRaw)}</td>
          </tr>
        `;
      }

      const percentage = Math.round((summary.count / totalSessions) * 100);
      return `
        <tr>
          <td>${escapeHtml(modeLabel(summary.mode))}</td>
          <td>${summary.count} ${countLabel(summary.count)}</td>
          <td>${percentage}%</td>
          <td>${formatDate(summary.latestRaw)}</td>
        </tr>
      `;
    })
    .join('');
}

function normalizeSessionMode(row) {
  const rawMode = pickValue(row, [
    ['mode'],
    ['game_mode'],
    ['gameMode'],
    ['selected_mode'],
    ['selectedMode'],
    ['selected_game_mode'],
    ['selectedGameMode'],
    ['play_mode'],
    ['playMode'],
    ['session_mode'],
    ['sessionMode'],
    ['question_mode'],
    ['questionMode'],
    ['settings', 'mode'],
    ['settings', 'game_mode'],
    ['settings', 'gameMode'],
    ['settings', 'selectedMode'],
    ['settings', 'selected_mode'],
    ['metadata', 'mode'],
    ['metadata', 'gameMode'],
    ['metadata', 'game_mode'],
  ]);

  if (rawMode === undefined || rawMode === null || rawMode === '') {
    return '';
  }

  return String(rawMode).trim().toLowerCase().replace(/\s+/g, '_');
}

function normalizeModeStatMode(row) {
  const rawMode = pickValue(row, [
    ['mode'],
    ['modeId'],
    ['modeName'],
    ['mode_name'],
    ['gameMode'],
    ['game_mode'],
    ['selectedMode'],
    ['selected_mode'],
  ]) || row.id;

  if (rawMode === undefined || rawMode === null || rawMode === '') {
    return '';
  }

  return String(rawMode).trim().toLowerCase().replace(/\s+/g, '_');
}

function resolveModeStatCount(row) {
  const directCount = toNumber(pickValue(row, [
    ['count'],
    ['sessionCount'],
    ['sessions'],
    ['total'],
    ['plays'],
    ['playCount'],
    ['play_count'],
    ['totalCount'],
    ['total_count'],
    ['openCount'],
    ['open_count'],
    ['playOpenCount'],
    ['value'],
  ]));

  if (directCount > 0) {
    return directCount;
  }

  const languageCounts = pickValue(row, [
    ['languageCounts'],
    ['language_counts'],
    ['countsByLanguage'],
  ]);

  if (languageCounts && typeof languageCounts === 'object') {
    const nestedCount = Object.values(languageCounts)
      .reduce((sum, value) => sum + Math.max(toNumber(value), 0), 0);

    if (nestedCount > 0) {
      return nestedCount;
    }
  }

  return 0;
}

function normalizeAnalyticsMode(value) {
  if (value === undefined || value === null || value === '' || value === '(all)') {
    return '';
  }

  return String(value).trim().toLowerCase().replace(/\s+/g, '_');
}

function isModeAnalyticsRow(row) {
  return String(row?.parameterKey || '').toLowerCase() === 'mode'
    && normalizeAnalyticsMode(row?.parameterValue) !== '';
}

function modeLabel(value) {
  const labels = {
    classic: 'Klasyczny',
    normal: 'Klasyczny',
    standard: 'Klasyczny',
    party: 'Imprezowy',
    couple: 'Dla par',
    couples: 'Dla par',
    friends: 'Znajomi',
    family: 'Rodzinny',
    spicy: 'Odważny',
    deep: 'Głębokie rozmowy',
    quick: 'Szybki',
    english: 'Angielski',
    polish: 'Polski',
  };

  return labels[value] || value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function sessionCountLabel(count) {
  if (count === 1) {
    return 'sesja';
  }

  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return 'sesje';
  }

  return 'sesji';
}

function analyticsEventCountLabel(count) {
  if (count === 1) {
    return 'zdarzenie';
  }

  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return 'zdarzenia';
  }

  return 'zdarzeń';
}

function modeCountLabel(source) {
  return source === 'analytics' ? analyticsEventCountLabel : sessionCountLabel;
}

function modeSourceLabels(source) {
  if (source === 'none') {
    return {
      sessionsLabel: 'Rekordy z trybem',
      missingLabel: 'Brak danych',
      docsLabel: 'Pobrane rekordy',
      tableTitle: 'Udział trybów',
      tableCountHeader: 'Wynik',
      tableShareHeader: 'Udział',
      tableDateHeader: 'Ostatnia aktualizacja',
      emptyBreakdown: 'Brak danych o trybach w dostępnych źródłach',
      emptyTable: 'Brak danych o trybach w dostępnych źródłach',
    };
  }

  if (source === 'analytics') {
    return {
      sessionsLabel: 'Zdarzenia z trybem',
      missingLabel: 'Brak w sesjach',
      docsLabel: 'Pobrane wpisy',
      tableTitle: 'Najczęściej wybierane tryby (na podstawie zdarzeń)',
      tableCountHeader: 'Zdarzenia',
      tableShareHeader: 'Udział',
      tableDateHeader: 'Ostatnie zdarzenie',
      emptyBreakdown: 'Brak danych o trybach w zdarzeniach',
      emptyTable: 'Brak danych o trybach w zdarzeniach',
    };
  }

  if (source === 'mode-stats') {
    return {
      sessionsLabel: 'Sesje z trybem',
      missingLabel: 'Brak trybu',
      docsLabel: 'Pobrane podsumowania',
      tableTitle: 'Przejście: otwarcie -> start',
      tableCountHeader: 'Otwarcia',
      tableShareHeader: 'Skuteczność startu',
      tableDateHeader: 'Ostatnia aktualizacja',
      emptyBreakdown: 'Brak danych o trybach w podsumowaniach',
      emptyTable: 'Brak danych o trybach w podsumowaniach',
    };
  }

  return {
    sessionsLabel: 'Sesje z trybem',
    missingLabel: 'Brak trybu',
    docsLabel: 'Pobrane sesje',
    tableTitle: 'Udział trybów w sesjach',
    tableCountHeader: 'Sesje',
    tableShareHeader: 'Udział',
    tableDateHeader: 'Ostatnia sesja',
    emptyBreakdown: 'Brak danych o trybach w pobranych sesjach',
    emptyTable: 'Brak danych o trybach',
  };
}

function describeModeSource(modeSummary, diagnostics = {}) {
  if (modeSummary.source === 'analytics') {
    if (diagnostics.modeStatDocs > 0) {
      return `Podsumowania trybów (${diagnostics.modeStatDocs} wpisów wyliczonych ze zdarzeń)`;
    }

    return `Zdarzenia aplikacji (${diagnostics.analyticsModeDocs || 0} wpisów z informacją o trybie)`;
  }

  if (modeSummary.source === 'mode-stats') {
    return `Podsumowania trybów (${diagnostics.modeStatDocs || 0} wpisów)`;
  }

  return `Brak danych o trybach (podsumowania: ${diagnostics.modeStatDocs || 0}, zdarzenia z trybem: ${diagnostics.analyticsModeDocs || 0})`;
}

function renderCrashStats(rows) {
  const totals = {
    issues: rows.length,
    fatal: 0,
    events: 0,
    users: 0,
  };

  let latestCrash = null;
  let latestVersion = '-';
  let topIssue = null;

  for (const row of rows) {
    totals.events += row.eventCount;
    totals.users += row.affectedUsers;

    if (row.isFatal) {
      totals.fatal += 1;
    }

    if (!topIssue || row.eventCount > topIssue.eventCount) {
      topIssue = row;
    }

    if (!latestCrash || getTimestampValue(row.lastSeenRaw) > getTimestampValue(latestCrash.lastSeenRaw)) {
      latestCrash = row;
      latestVersion = row.appVersion || '-';
    }
  }

  crashIssueCount.textContent = String(totals.issues);
  fatalCrashCount.textContent = String(totals.fatal);
  crashEventCount.textContent = String(totals.events);
  crashUsersCount.textContent = String(totals.users);
  topCrashValue.textContent = topIssue ? truncateText(topIssue.title, 56) : '-';
  latestCrashValue.textContent = latestCrash ? formatDate(latestCrash.lastSeenRaw) : '-';
  latestCrashVersionValue.textContent = latestVersion;
}

function renderTopCrashes(rows) {
  if (!rows.length) {
    topCrashesList.innerHTML = '<p class="empty-row">Brak danych Crashlytics. Dodaj eksport issue do Firestore.</p>';
    return;
  }

  topCrashesList.innerHTML = rows
    .slice()
    .sort((left, right) => right.eventCount - left.eventCount)
    .slice(0, 5)
    .map((row) => {
      const severity = renderBadge(row.isFatal ? 'fatal' : 'nonfatal', row.isFatal ? 'Fatal' : 'Non-fatal');
      const meta = [
        `${row.eventCount} zdarzeń`,
        `${row.affectedUsers} użytk.`,
        row.appVersion || 'wersja -',
        row.environmentLabel,
      ].join(' • ');

      return `
        <article class="crash-item">
          <div class="crash-item-header">
            <strong>${escapeHtml(row.title)}</strong>
            ${severity}
          </div>
          <p class="crash-item-meta">${escapeHtml(meta)}</p>
          <p class="crash-item-subtitle">${escapeHtml(row.issueId)}</p>
          <p class="crash-item-subtitle">${escapeHtml(row.subtitle)}</p>
        </article>
      `;
    })
    .join('');
}

function renderCrashGroups(rows) {
  if (!rows.length) {
    crashGroupsList.innerHTML = '<p class="empty-row">Brak danych do grupowania błędów.</p>';
    return;
  }

  const groupBy = crashGroupBySelect?.value || 'signature';
  const sortBy = crashGroupSortSelect?.value || 'events';
  const groups = summarizeCrashGroups(rows, groupBy)
    .sort((left, right) => compareCrashGroup(left, right, sortBy))
    .slice(0, 8);

  crashGroupsList.innerHTML = groups
    .map((group) => {
      const severityLabel = group.fatalCount > 0
        ? (group.nonFatalCount > 0 ? 'Fatal + non-fatal' : 'Fatal')
        : 'Non-fatal';
      const severityBadge = renderBadge(
        group.fatalCount > 0 ? 'fatal' : 'nonfatal',
        severityLabel,
      );

      const meta = [
        `${group.eventCount} zdarzeń`,
        `${group.affectedUsers} użytk.`,
        `${group.issueCount} zgłoszeń`,
      ].join(' • ');

      const versions = group.versions.length ? group.versions.join(', ') : 'brak wersji';
      const platforms = group.platforms.length ? group.platforms.join(', ') : 'nieznana platforma';
      const groupMeta = crashGroupMeta(groupBy, group);

      return `
        <article class="crash-group-card">
          <div class="crash-item-header">
            <strong>${escapeHtml(group.title)}</strong>
            ${severityBadge}
          </div>
          <p class="crash-item-meta">${escapeHtml(meta)}</p>
          <p class="crash-item-subtitle">${escapeHtml(groupMeta)}</p>
          <p class="crash-item-subtitle">Wersje: ${escapeHtml(versions)}</p>
          <p class="crash-item-subtitle">Platformy: ${escapeHtml(platforms)}</p>
          <p class="crash-item-subtitle">Ostatnio: ${escapeHtml(formatDate(group.lastSeenRaw))}</p>
        </article>
      `;
    })
    .join('');
}

function compareCrashGroup(left, right, sortBy) {
  if (sortBy === 'users') {
    if (right.affectedUsers !== left.affectedUsers) {
      return right.affectedUsers - left.affectedUsers;
    }
    return right.eventCount - left.eventCount;
  }

  if (sortBy === 'latest') {
    const timestampDiff = getTimestampValue(right.lastSeenRaw) - getTimestampValue(left.lastSeenRaw);
    if (timestampDiff !== 0) {
      return timestampDiff;
    }
    return right.eventCount - left.eventCount;
  }

  if (right.eventCount !== left.eventCount) {
    return right.eventCount - left.eventCount;
  }

  return getTimestampValue(right.lastSeenRaw) - getTimestampValue(left.lastSeenRaw);
}

function crashGroupMeta(groupBy, group) {
  if (groupBy === 'version') {
    return `Główna wersja: ${group.title}`;
  }

  if (groupBy === 'platform') {
    return `Platforma: ${group.title}`;
  }

  if (groupBy === 'severity') {
    return `Kategoria: ${group.title}`;
  }

  return `Podpis błędu: ${group.signature || 'n/a'}`;
}

function summarizeCrashGroups(rows, groupBy = 'signature') {
  const groups = new Map();

  for (const row of rows) {
    const key = crashGroupKey(row, groupBy);
    const title = crashGroupTitle(row, groupBy);
    const current = groups.get(key) || {
      title,
      signature: crashSignature(row),
      eventCount: 0,
      affectedUsers: 0,
      issueIds: new Set(),
      versions: new Set(),
      platforms: new Set(),
      fatalCount: 0,
      nonFatalCount: 0,
      lastSeenRaw: null,
    };

    current.eventCount += Math.max(toNumber(row.eventCount), 0);
    current.affectedUsers += Math.max(toNumber(row.affectedUsers), 0);
    current.issueIds.add(String(row.issueId || ''));

    if (row.appVersion) {
      current.versions.add(String(row.appVersion));
    }

    const platformLabel = String(row.platform || '').trim();
    if (platformLabel) {
      current.platforms.add(platformLabel);
    }

    if (row.isFatal) {
      current.fatalCount += 1;
    } else {
      current.nonFatalCount += 1;
    }

    if (getTimestampValue(row.lastSeenRaw) > getTimestampValue(current.lastSeenRaw)) {
      current.lastSeenRaw = row.lastSeenRaw;
    }

    groups.set(key, current);
  }

  return [...groups.values()].map((group) => ({
    title: group.title,
    signature: group.signature,
    eventCount: group.eventCount,
    affectedUsers: group.affectedUsers,
    issueCount: group.issueIds.size,
    versions: [...group.versions].slice(0, 4),
    platforms: [...group.platforms],
    fatalCount: group.fatalCount,
    nonFatalCount: group.nonFatalCount,
    lastSeenRaw: group.lastSeenRaw,
  }));
}

function crashGroupKey(row, groupBy) {
  if (groupBy === 'version') {
    const versionKey = String(row.appVersion || '').trim();
    return versionKey ? `version:${versionKey}` : 'version:brak_wersji';
  }

  if (groupBy === 'platform') {
    const platformKey = String(row.platform || '').trim().toLowerCase();
    return platformKey ? `platform:${platformKey}` : 'platform:nieznana';
  }

  if (groupBy === 'severity') {
    return row.isFatal ? 'severity:fatal' : 'severity:nonfatal';
  }

  return `signature:${crashSignature(row)}`;
}

function crashGroupTitle(row, groupBy) {
  if (groupBy === 'version') {
    return row.appVersion || 'Brak wersji';
  }

  if (groupBy === 'platform') {
    const platform = String(row.platform || '').trim();
    return platform || 'Nieznana platforma';
  }

  if (groupBy === 'severity') {
    return row.isFatal ? 'Błędy fatalne' : 'Błędy non-fatal';
  }

  return row.title;
}

function restoreActiveDashboard() {
  const saved = loadPreference(DASHBOARD_STORAGE_KEYS.activeDashboard);
  return ALLOWED_DASHBOARDS.has(saved) ? saved : 'games';
}

function restoreCrashGroupPreferences() {
  const savedGroupBy = loadPreference(DASHBOARD_STORAGE_KEYS.crashGroupBy);
  if (savedGroupBy && crashGroupBySelect && hasSelectOption(crashGroupBySelect, savedGroupBy)) {
    crashGroupBySelect.value = savedGroupBy;
  }

  const savedSort = loadPreference(DASHBOARD_STORAGE_KEYS.crashGroupSort);
  if (savedSort && crashGroupSortSelect && hasSelectOption(crashGroupSortSelect, savedSort)) {
    crashGroupSortSelect.value = savedSort;
  }
}

function hasSelectOption(selectElement, value) {
  return [...selectElement.options].some((option) => option.value === value);
}

function savePreference(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch (_) {
    // Ignore storage failures (e.g. private mode restrictions).
  }
}

function loadPreference(key) {
  try {
    return localStorage.getItem(key) || '';
  } catch (_) {
    return '';
  }
}

function crashSignature(row) {
  const rawTitle = String(row.title || '').toLowerCase().trim();
  return rawTitle
    .replace(/\b(line|linia)\s+\d+\b/g, 'line')
    .replace(/0x[0-9a-f]+/g, '0xaddr')
    .replace(/\d+/g, '#')
    .replace(/\s+/g, ' ');
}

function renderTable(rows) {
  if (!rows.length) {
    sessionsTableBody.innerHTML = '<tr><td colspan="8" class="empty-row">Brak danych</td></tr>';
    return;
  }

  sessionsTableBody.innerHTML = rows
    .map((row) => {
      const createdAt = formatDate(row.createdAtIso);
      const answerA = renderBadge(row.answerForA, answerLabel(row.answerForA));
      const answerB = renderBadge(row.answerForB, answerLabel(row.answerForB));
      const result = renderBadge(row.finalResult, resultLabel(row.finalResult));
      const language = renderBadge(row.englishMode ? 'en' : 'pl', row.englishMode ? 'EN' : 'PL');
      const modeCell = row.modeId ? escapeHtml(modeLabel(row.modeId)) : '<span class="cell-sub">—</span>';

      return `
        <tr>
          <td>${createdAt}</td>
          <td>${escapeHtml(row.playerAName || '-')}</td>
          <td>${escapeHtml(row.playerBName || '-')}</td>
          <td>${answerA}</td>
          <td>${answerB}</td>
          <td>${result}</td>
          <td>${language}</td>
          <td>${modeCell}</td>
        </tr>
      `;
    })
    .join('');
}

function renderCrashTable(rows) {
  if (!rows.length) {
    crashTableBody.innerHTML = '<tr><td colspan="7" class="empty-row">Brak danych Crashlytics</td></tr>';
    return;
  }

  crashTableBody.innerHTML = rows
    .map((row) => {
      const severity = renderBadge(row.isFatal ? 'fatal' : 'nonfatal', row.isFatal ? 'Fatal' : 'Non-fatal');
      const platform = renderBadge(platformBadgeClass(row.platform), row.environmentLabel);

      return `
        <tr>
          <td>${formatDate(row.lastSeenRaw)}</td>
          <td>
            <strong>${escapeHtml(row.title)}</strong>
            <div class="table-note">${escapeHtml(row.issueId)}</div>
            <div class="table-note">${escapeHtml(row.subtitle)}</div>
          </td>
          <td>${severity}</td>
          <td>${escapeHtml(String(row.eventCount))}</td>
          <td>${escapeHtml(String(row.affectedUsers))}</td>
          <td>${escapeHtml(row.appVersion || '-')}</td>
          <td>${platform}</td>
        </tr>
      `;
    })
    .join('');
}

function normalizeAnalyticsRow(docId, data) {
  const sources = [
    data,
    data?.parameters,
    data?.params,
    data?.metadata,
    data?.context,
  ].filter(Boolean);

  const eventName = normalizeMonetizationEventName(String(pickValueFromSources(sources, [
    ['eventName'],
    ['event_name'],
    ['name'],
  ]) || docId));

  const inferredParameter = inferAnalyticsParameter(sources);
  const parameterKey = String(pickValueFromSources(sources, [
    ['parameterKey'],
    ['dimensionKey'],
    ['key'],
  ]) || inferredParameter.key || 'all');

  const parameterValue = String(pickValueFromSources(sources, [
    ['parameterValue'],
    ['dimensionValue'],
    ['value'],
    ['mode'],
    ['source'],
    ['placement'],
    ['result'],
    ['reason'],
  ]) || inferredParameter.value || '(all)');

  const directEventCount = toNumber(pickValueFromSources(sources, [
    ['eventCount'],
    ['count'],
    ['events'],
    ['total'],
  ]));

  const directUserCount = toNumber(pickValueFromSources(sources, [
    ['userCount'],
    ['affectedUsers'],
    ['users'],
    ['user_count'],
  ]));

  const userIdentity = pickValueFromSources(sources, [
    ['userId'],
    ['user_id'],
    ['uid'],
    ['userPseudoId'],
    ['user_pseudo_id'],
    ['deviceId'],
    ['device_id'],
    ['installationId'],
    ['installation_id'],
  ]);

  return {
    eventName,
    parameterKey,
    parameterValue,
    eventCount: directEventCount > 0 ? directEventCount : 1,
    userCount: directUserCount > 0 ? directUserCount : 1,
    userIdentity: userIdentity ? String(userIdentity) : '',
    lastSeenRaw: pickValueFromSources(sources, [
      ['lastSeen'],
      ['createdAt'],
      ['updatedAt'],
      ['timestamp'],
      ['syncedAt'],
    ]),
  };
}

function aggregateAnalyticsRows(rows) {
  const grouped = new Map();

  for (const row of rows) {
    const key = [row.eventName, row.parameterKey || 'all', row.parameterValue || '(all)'].join('::');
    const current = grouped.get(key) || {
      eventName: row.eventName,
      parameterKey: row.parameterKey || 'all',
      parameterValue: row.parameterValue || '(all)',
      eventCount: 0,
      userCount: 0,
      userIdentitySet: new Set(),
      lastSeenRaw: null,
    };

    current.eventCount += Math.max(toNumber(row.eventCount), 0);

    if (row.userIdentity) {
      current.userIdentitySet.add(row.userIdentity);
    } else {
      current.userCount += Math.max(toNumber(row.userCount), 0);
    }

    if (getTimestampValue(row.lastSeenRaw) > getTimestampValue(current.lastSeenRaw)) {
      current.lastSeenRaw = row.lastSeenRaw;
    }

    grouped.set(key, current);
  }

  return [...grouped.values()].map((row) => ({
    eventName: row.eventName,
    parameterKey: row.parameterKey,
    parameterValue: row.parameterValue,
    eventCount: row.eventCount,
    userCount: row.userIdentitySet.size || row.userCount,
    lastSeenRaw: row.lastSeenRaw,
  }));
}

function hasUsefulAnalyticsData(row) {
  return Boolean(
    row.eventName
    || row.eventCount > 0
    || row.userCount > 0
    || getTimestampValue(row.lastSeenRaw) > 0
  );
}

function answerLabel(value) {
  switch (value) {
    case 'yes':
      return 'Tak';
    case 'maybe':
      return 'Trochę';
    case 'no':
      return 'Nie';
    default:
      return 'Pending';
  }
}

function resultLabel(value) {
  switch (value) {
    case 'both_yes':
      return 'Oboje bliżej';
    case 'mixed':
      return 'Mix';
    case 'both_no':
      return 'Oboje nie';
    default:
      return 'Pending';
  }
}

function renderBadge(type, label) {
  return `<span class="badge ${escapeHtml(type || 'pending')}">${escapeHtml(label)}</span>`;
}

function analyticsCategory(eventName) {
  const normalized = String(eventName || '').toLowerCase();

  if (normalized.includes('rewarded') || normalized.includes('interstitial')) {
    return 'ads';
  }

  if (
    normalized.includes('paywall')
    || normalized.includes('premium')
    || normalized.includes('purchase')
    || normalized.includes('restore')
  ) {
    return 'monetization';
  }

  return 'analytics';
}

function analyticsCategoryLabel(category) {
  switch (category) {
    case 'ads':
      return 'Reklamy';
    case 'monetization':
      return 'Monetyzacja';
    default:
      return 'Analytics';
  }
}

function analyticsEventLabel(eventName) {
  const labels = {
    paywall_view: 'Wyświetlenie paywalla',
    premium_cta_tap: 'Klik premium CTA',
    purchase_started: 'Start zakupu',
    purchase_success: 'Zakup zakończony',
    purchase_restored: 'Zakup przywrócony',
    purchase_canceled: 'Zakup anulowany',
    purchase_error: 'Błąd zakupu',
    restore_started: 'Start przywracania',
    restore_success: 'Przywracanie zakończone',
    restore_failed: 'Przywracanie nieudane',
    rewarded_offer_view: 'Oferta rewarded',
    rewarded_started: 'Start rewarded',
    rewarded_earned: 'Nagroda rewarded',
    rewarded_failed: 'Rewarded nieudane',
    rewarded_skipped: 'Rewarded pominięte',
    interstitial_requested: 'Prośba o interstitial',
    interstitial_shown: 'Wyświetlenie interstitial',
    interstitial_skipped: 'Interstitial pominięty',
  };

  return labels[eventName] || eventName
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizeMonetizationEventName(eventName) {
  const normalized = String(eventName || '').trim().toLowerCase();
  const withoutPrefix = normalized.startsWith('monetization_')
    ? normalized.slice('monetization_'.length)
    : normalized;

  const aliases = {
    paywall_viewed: 'paywall_view',
    paywall_opened: 'paywall_view',
    paywall_shown: 'paywall_view',
    premium_cta_clicked: 'premium_cta_tap',
    premium_cta_tapped: 'premium_cta_tap',
    purchase_completed: 'purchase_success',
    purchase_succeeded: 'purchase_success',
    purchase_cancelled: 'purchase_canceled',
    purchase_failed: 'purchase_error',
    restore_completed: 'restore_success',
    restore_succeeded: 'restore_success',
    restore_error: 'restore_failed',
    rewarded_offer_viewed: 'rewarded_offer_view',
    rewarded_started: 'rewarded_started',
    rewarded_start: 'rewarded_started',
    rewarded_completed: 'rewarded_earned',
    rewarded_reward_granted: 'rewarded_earned',
    interstitial_request: 'interstitial_requested',
    interstitial_displayed: 'interstitial_shown',
    interstitial_closed: 'interstitial_skipped',
  };

  return aliases[withoutPrefix] || withoutPrefix;
}

function inferAnalyticsParameter(sources) {
  const keyOrder = ['source', 'placement', 'result', 'reason', 'mode'];

  for (const key of keyOrder) {
    const value = pickValueFromSources(sources, [[key]]);
    if (value !== undefined && value !== null && value !== '') {
      return {
        key,
        value: String(value),
      };
    }
  }

  return {
    key: 'all',
    value: '(all)',
  };
}

function analyticsDimensionLabel(row) {
  if (!row || row.parameterValue === '(all)') {
    return '';
  }

  const keyLabels = {
    source: 'Źródło',
    placement: 'Placement',
    result: 'Wynik',
    reason: 'Powód',
  };

  return `${keyLabels[row.parameterKey] || row.parameterKey}: ${row.parameterValue}`;
}

function isMonetizationEvent(eventName) {
  const normalized = String(eventName || '').toLowerCase();
  return [
    'paywall_view',
    'premium_cta_tap',
    'purchase_started',
    'purchase_success',
    'purchase_restored',
    'purchase_canceled',
    'purchase_error',
    'restore_started',
    'restore_success',
    'restore_failed',
    'rewarded_offer_view',
    'rewarded_started',
    'rewarded_earned',
    'rewarded_failed',
    'rewarded_skipped',
    'interstitial_requested',
    'interstitial_shown',
    'interstitial_skipped',
  ].includes(normalized);
}

function platformBadgeClass(value) {
  const normalized = String(value || '').toLowerCase();
  if (normalized.includes('android')) return 'android';
  if (normalized.includes('ios')) return 'ios';
  return 'pending';
}

function normalizeCrashRows(docId, data) {
  const candidates = extractCrashCandidates(data);

  if (!candidates.length) {
    return [normalizeCrashRow(docId, data, data)];
  }

  return candidates.map((candidate, index) => normalizeCrashRow(`${docId}:${index + 1}`, candidate, data));
}

function normalizeCrashRow(docId, data, parentData) {
  const sources = [data, parentData].filter(Boolean);

  const issueId = pickValueFromSources(sources, [
    ['issueId'],
    ['issue_id'],
    ['crashlyticsIssueId'],
    ['firebaseIssueId'],
    ['id'],
    ['issue', 'id'],
    ['error', 'id'],
  ]) || docId;

  const title = pickValueFromSources(sources, [
    ['title'],
    ['issueTitle'],
    ['errorType'],
    ['exceptionClass'],
    ['errorName'],
    ['type'],
    ['message'],
    ['reason'],
    ['exception', 'type'],
    ['exception', 'message'],
    ['error', 'message'],
    ['error', 'type'],
    ['crash', 'title'],
    ['issue', 'title'],
  ]) || 'Nieopisany crash';

  const subtitle = pickValueFromSources(sources, [
    ['subtitle'],
    ['variant'],
    ['issueSubtitle'],
    ['reason'],
    ['message'],
    ['exception', 'message'],
    ['error', 'message'],
  ]) || '';

  const appVersion = pickValueFromSources(sources, [
    ['appVersion'],
    ['versionName'],
    ['version'],
    ['displayVersion'],
    ['appVersionName'],
    ['app', 'version'],
    ['app', 'displayVersion'],
    ['appInfo', 'appVersion'],
    ['appInfo', 'displayVersion'],
    ['application', 'version'],
  ]) || '';

  const buildVersion = pickValueFromSources(sources, [
    ['buildVersion'],
    ['buildNumber'],
    ['build'],
    ['app', 'buildVersion'],
    ['appInfo', 'buildVersion'],
  ]) || '';

  const platform = pickValueFromSources(sources, [
    ['platform'],
    ['os'],
    ['operatingSystem'],
    ['devicePlatform'],
    ['device', 'platform'],
    ['app', 'platform'],
    ['operatingSystemInfo', 'platform'],
    ['event', 'platform'],
  ]) || 'Nieznana';

  const operatingSystemVersion = pickValueFromSources(sources, [
    ['osVersion'],
    ['operatingSystemVersion'],
    ['device', 'osVersion'],
    ['device', 'os_display_version'],
    ['operatingSystemInfo', 'version'],
    ['operatingSystemInfo', 'displayVersion'],
  ]) || '';

  const deviceModel = pickValueFromSources(sources, [
    ['deviceModel'],
    ['device', 'model'],
    ['device', 'deviceModel'],
    ['deviceInfo', 'model'],
    ['hardware', 'model'],
  ]) || '';

  const eventCount = toNumber(pickValueFromSources(sources, [
    ['eventCount'],
    ['events'],
    ['occurrences'],
    ['count'],
    ['metrics', 'events'],
    ['event', 'count'],
    ['issueMetrics', 'events'],
    ['crashCount'],
  ]));

  const affectedUsers = toNumber(pickValueFromSources(sources, [
    ['affectedUsers'],
    ['users'],
    ['impactedUsers'],
    ['metrics', 'users'],
    ['usersAffected'],
    ['event', 'users'],
    ['issueMetrics', 'users'],
  ]));

  const lastSeenRaw = pickValueFromSources(sources, [
    ['lastSeen'],
    ['updatedAt'],
    ['timestamp'],
    ['occurredAt'],
    ['createdAt'],
    ['eventTime'],
    ['lastOccurredAt'],
    ['eventTimestamp'],
    ['event', 'timestamp'],
    ['event', 'time'],
  ]);

  const isFatal = toBoolean(pickValueFromSources(sources, [
    ['fatal'],
    ['isFatal'],
    ['crashFatal'],
    ['severity'],
    ['type'],
    ['eventType'],
    ['issueType'],
  ]));

  const environmentLabel = [
    platform,
    operatingSystemVersion,
    deviceModel,
  ].filter(Boolean).join(' / ') || String(platform);

  return {
    issueId: String(issueId),
    title: String(title),
    subtitle: String(subtitle || 'Brak dodatkowego opisu'),
    appVersion: String(appVersion),
    buildVersion: String(buildVersion),
    platform: String(platform),
    platformLabel: String(platform),
    environmentLabel: buildVersion ? `${environmentLabel} • build ${buildVersion}` : environmentLabel,
    operatingSystemVersion: String(operatingSystemVersion),
    deviceModel: String(deviceModel),
    eventCount,
    affectedUsers,
    lastSeenRaw,
    isFatal,
  };
}

function extractCrashCandidates(source, depth = 0) {
  if (!source || typeof source !== 'object' || depth > 3) {
    return [];
  }

  const candidates = [];

  for (const value of Object.values(source)) {
    if (Array.isArray(value)) {
      for (const entry of value) {
        if (looksLikeCrashObject(entry)) {
          candidates.push(entry);
        } else if (entry && typeof entry === 'object' && depth < 3) {
          candidates.push(...extractCrashCandidates(entry, depth + 1));
        }
      }
      continue;
    }

    if (looksLikeCrashObject(value)) {
      candidates.push(value);
      continue;
    }

    if (value && typeof value === 'object') {
      candidates.push(...extractCrashCandidates(value, depth + 1));
    }
  }

  return dedupeCrashCandidates(candidates);
}

function looksLikeCrashObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const keys = Object.keys(value).map((key) => key.toLowerCase());
  const crashSignals = [
    'issueid',
    'issue_id',
    'crashlyticsissueid',
    'title',
    'issuetitle',
    'message',
    'exception',
    'fatal',
    'isfatal',
    'eventcount',
    'affectedusers',
    'lastseen',
    'platform',
    'appversion',
  ];

  return crashSignals.some((signal) => keys.includes(signal));
}

function dedupeCrashCandidates(candidates) {
  const seen = new Set();
  const unique = [];

  for (const candidate of candidates) {
    const key = JSON.stringify(candidate);
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(candidate);
  }

  return unique;
}

function hasUsefulCrashData(row) {
  return Boolean(
    row.issueId
    || row.title
    || row.eventCount > 0
    || row.affectedUsers > 0
    || getTimestampValue(row.lastSeenRaw) > 0
  );
}

function pickValue(source, paths) {
  for (const path of paths) {
    let current = source;

    for (const segment of path) {
      if (current == null || typeof current !== 'object' || !(segment in current)) {
        current = undefined;
        break;
      }

      current = current[segment];
    }

    if (current !== undefined && current !== null && current !== '') {
      return current;
    }
  }

  return undefined;
}

function pickValueFromSources(sources, paths) {
  for (const source of sources) {
    const value = pickValue(source, paths);
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }

  return undefined;
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toBoolean(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  const normalized = String(value || '').toLowerCase();
  return normalized === 'fatal' || normalized === 'true' || normalized === '1';
}

function getTimestampValue(value) {
  if (value && typeof value.toDate === 'function') {
    return value.toDate().getTime();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

function truncateText(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
}

function formatDate(value) {
  if (!value) return '-';

  if (typeof value?.toDate === 'function') {
    return value.toDate().toLocaleString('pl-PL');
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString('pl-PL');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// Executive Summary Dashboard
async function loadExecutiveSummary() {
  const allEvents = await loadFirstAvailableCollectionRows(getAnalyticsCollectionCandidates());
  const crashData = await loadCollectionRows(dashboardCollections.crashlytics);
  const gameSessions = await loadCollectionRows(dashboardCollections.sessions);

  const dailyRevenue = calculateDailyRevenue(allEvents.rows);
  const totalRevenue = dailyRevenue.reduce((sum, day) => sum + day.revenue, 0);
  const avgRevenue = dailyRevenue.length > 0 ? totalRevenue / dailyRevenue.length : 0;
  
  const adsRevenue = calculateRevenueBySource(allEvents.rows, 'ads');
  const purchaseRevenue = calculateRevenueBySource(allEvents.rows, 'purchase');
  const totalRevenueAll = adsRevenue + purchaseRevenue;
  
  const crashRate = calculateCrashRate(crashData, gameSessions.length);
  const dau = calculateUniqueUsers(gameSessions);
  const retention = calculateRetention(gameSessions, 7);

  summaryDAU.textContent = String(dau);
  summaryARPU.textContent = `$${avgRevenue.toFixed(2)}`;
  summaryCrashRate.textContent = `${(crashRate * 100).toFixed(1)}%`;
  summaryRetention.textContent = `${(retention * 100).toFixed(1)}%`;
  
  const adsPercent = totalRevenueAll > 0 ? (adsRevenue / totalRevenueAll * 100) : 0;
  const purchasePercent = totalRevenueAll > 0 ? (purchaseRevenue / totalRevenueAll * 100) : 0;
  
  summaryAdsPercent.textContent = `${adsPercent.toFixed(1)}%`;
  summaryPurchasePercent.textContent = `${purchasePercent.toFixed(1)}%`;
  summaryIAARevenue.textContent = `$${adsRevenue.toFixed(2)}`;
  summaryIAPRevenue.textContent = `$${purchaseRevenue.toFixed(2)}`;
  
  renderRevenueTrend(dailyRevenue);
}

// Ads Performance Dashboard
async function loadAdsPerformance() {
  const allEvents = await loadFirstAvailableCollectionRows(getAnalyticsCollectionCandidates());
  const events = allEvents.rows;

  const adMetrics = calculateAdMetrics(events);
  const placementPerf = calculatePlacementPerformance(events);
  const ecpmTrend = calculateECPMTrend(events);

  adsImpressions.textContent = String(adMetrics.impressions);
  adsClicks.textContent = String(adMetrics.clicks);
  adsCTR.textContent = `${(adMetrics.ctr * 100).toFixed(2)}%`;
  adsRevenue.textContent = `$${adMetrics.revenue.toFixed(2)}`;

  renderPlacementPerformance(placementPerf);
  renderECPMTrend(ecpmTrend);
  renderAdsPerformanceTable(placementPerf);
}

// Engagement Dashboard
async function loadEngagementDashboard() {
  const gameSessions = await loadCollectionRows(dashboardCollections.sessions);
  const allEvents = await loadFirstAvailableCollectionRows(getAnalyticsCollectionCandidates());

  const dau = calculateUniqueUsers(gameSessions);
  const mau = calculateUniqueUsersMonthly(gameSessions);
  const avgSessionLength = calculateAvgSessionLength(gameSessions);
  const sessionsPerUser = calculateSessionsPerUser(gameSessions);
  
  const retentionCurve = calculateRetentionCurve(gameSessions);
  const dauTrend = calculateDAUTrend(gameSessions);

  engDAU.textContent = String(dau);
  engMAU.textContent = String(mau);
  engAvgSession.textContent = avgSessionLength.toFixed(1);
  engSessionsPerUser.textContent = sessionsPerUser.toFixed(1);
  
  retentionD1.textContent = `${(retentionCurve.d1 * 100).toFixed(1)}%`;
  retentionD3.textContent = `${(retentionCurve.d3 * 100).toFixed(1)}%`;
  retentionD7.textContent = `${(retentionCurve.d7 * 100).toFixed(1)}%`;
  retentionD30.textContent = `${(retentionCurve.d30 * 100).toFixed(1)}%`;
  
  renderDAUTrendChart(dauTrend);
  renderEngagementMetricsTable(gameSessions);
}

// Quality Dashboard
async function loadQualityDashboard() {
  const crashData = await loadCollectionRows(dashboardCollections.crashlytics);
  const gameSessions = await loadCollectionRows(dashboardCollections.sessions);
  const allEvents = await loadFirstAvailableCollectionRows(getAnalyticsCollectionCandidates());

  const crashRate = calculateCrashRate(crashData, gameSessions.length);
  const fatalCount = calculateFatalCount(crashData);
  const avgLatency = calculateAvgLatency(allEvents.rows);
  const usersAffected = calculateAffectedUsers(crashData);
  
  const crashTrend = calculateCrashTrend(crashData);
  const topIssues = extractTopIssues(crashData, 5);

  qualityCrashRate.textContent = `${(crashRate * 100).toFixed(1)}%`;
  qualityFatalCount.textContent = String(fatalCount);
  qualityLatency.textContent = String(avgLatency.toFixed(0));
  qualityUsersAffected.textContent = String(usersAffected);
  
  renderCrashTrendQuality(crashTrend);
  renderTopIssuesQuality(topIssues);
  renderQualityIssuesTable(crashData);
}

// Helper calculation functions
function calculateDailyRevenue(events, days = 7) {
  const daily = {};
  for (const event of events) {
    const date = new Date(event.eventTimestamp || event.createdAtIso || Date.now())
      .toISOString()
      .split('T')[0];
    if (!daily[date]) daily[date] = 0;
    if (event.revenue) daily[date] += event.revenue;
  }
  return Object.entries(daily)
    .slice(-days)
    .map(([date, revenue]) => ({ date, revenue }));
}

function calculateRevenueBySource(events, source) {
  let total = 0;
  for (const event of events) {
    if (source === 'ads' && event.eventName?.includes('rewarded')) {
      total += event.revenue || 0;
    }
    if (source === 'purchase' && event.eventName?.includes('purchase')) {
      total += event.revenue || 0;
    }
  }
  return total;
}

function calculateCrashRate(crashes, sessionCount) {
  if (sessionCount === 0) return 0;
  const crashCount = crashes.filter(c => c.isFatal).length;
  return Math.min(crashCount / sessionCount, 1);
}

function calculateUniqueUsers(sessions) {
  const users = new Set();
  for (const session of sessions) {
    if (session.playerId || session.userId) {
      users.add(session.playerId || session.userId);
    }
  }
  return users.size;
}

function calculateUniqueUsersMonthly(sessions) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const users = new Set();
  for (const session of sessions) {
    const sessionDate = new Date(session.createdAtIso);
    if (sessionDate >= thirtyDaysAgo && (session.playerId || session.userId)) {
      users.add(session.playerId || session.userId);
    }
  }
  return users.size;
}

function calculateAvgSessionLength(sessions) {
  if (sessions.length === 0) return 0;
  const totalLength = sessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0);
  return totalLength / sessions.length / 60; // in minutes
}

function calculateSessionsPerUser(sessions) {
  const userSessions = {};
  for (const session of sessions) {
    const userId = session.playerId || session.userId;
    if (userId) {
      userSessions[userId] = (userSessions[userId] || 0) + 1;
    }
  }
  const users = Object.keys(userSessions);
  if (users.length === 0) return 0;
  const totalSessions = users.reduce((sum, u) => sum + userSessions[u], 0);
  return totalSessions / users.length;
}

function calculateRetention(sessions, days) {
  const users = new Set();
  const returningUsers = new Set();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const sessionsByUser = {};
  for (const session of sessions) {
    const userId = session.playerId || session.userId;
    const sessionDate = new Date(session.createdAtIso);
    if (userId) {
      if (!sessionsByUser[userId]) sessionsByUser[userId] = [];
      sessionsByUser[userId].push(sessionDate);
    }
  }

  for (const [userId, dates] of Object.entries(sessionsByUser)) {
    const sortedDates = dates.sort((a, b) => a - b);
    if (sortedDates[0] <= cutoffDate) {
      users.add(userId);
      if (sortedDates.some(d => d > cutoffDate)) {
        returningUsers.add(userId);
      }
    }
  }

  return users.size > 0 ? returningUsers.size / users.size : 0;
}

function calculateRetentionCurve(sessions) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const sessionsByUser = {};
  for (const session of sessions) {
    const userId = session.playerId || session.userId;
    if (userId) {
      if (!sessionsByUser[userId]) sessionsByUser[userId] = [];
      sessionsByUser[userId].push(new Date(session.createdAtIso));
    }
  }

  let d1 = 0, d3 = 0, d7 = 0, d30 = 0;
  let initialUsers = 0;

  for (const [userId, dates] of Object.entries(sessionsByUser)) {
    const sortedDates = dates.sort((a, b) => a - b);
    const firstSession = new Date(sortedDates[0]);
    firstSession.setHours(0, 0, 0, 0);
    
    if (firstSession < today) {
      initialUsers++;
      const daysSinceFirst = Math.floor((today - firstSession) / (1000 * 60 * 60 * 24));
      const hasSessionOn = (dayOffset) => {
        const targetDate = new Date(firstSession);
        targetDate.setDate(targetDate.getDate() + dayOffset);
        return sortedDates.some(d => {
          const dCopy = new Date(d);
          dCopy.setHours(0, 0, 0, 0);
          return dCopy.getTime() === targetDate.getTime();
        });
      };

      if (hasSessionOn(1)) d1++;
      if (hasSessionOn(3)) d3++;
      if (hasSessionOn(7)) d7++;
      if (hasSessionOn(30)) d30++;
    }
  }

  return {
    d1: initialUsers > 0 ? d1 / initialUsers : 0,
    d3: initialUsers > 0 ? d3 / initialUsers : 0,
    d7: initialUsers > 0 ? d7 / initialUsers : 0,
    d30: initialUsers > 0 ? d30 / initialUsers : 0,
  };
}

function calculateDAUTrend(sessions, days = 7) {
  const daily = {};
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - days);

  for (const session of sessions) {
    const sessionDate = new Date(session.createdAtIso);
    if (sessionDate >= sevenDaysAgo) {
      const dateStr = sessionDate.toISOString().split('T')[0];
      if (!daily[dateStr]) daily[dateStr] = new Set();
      if (session.playerId || session.userId) {
        daily[dateStr].add(session.playerId || session.userId);
      }
    }
  }

  return Object.entries(daily)
    .sort(([d1], [d2]) => d1.localeCompare(d2))
    .map(([date, users]) => ({ date, count: users.size }));
}

function calculateAdMetrics(events) {
  let impressions = 0, clicks = 0, revenue = 0;
  for (const event of events) {
    if (event.eventName?.includes('interstitial') || event.eventName?.includes('rewarded')) {
      impressions += event.eventCount || 1;
      if (event.eventName?.includes('click')) clicks += event.eventCount || 1;
      revenue += event.revenue || 0;
    }
  }
  return {
    impressions,
    clicks,
    ctr: impressions > 0 ? clicks / impressions : 0,
    revenue,
  };
}

function calculatePlacementPerformance(events) {
  const placements = {};
  for (const event of events) {
    const placement = event.placementName || 'unknown';
    if (!placements[placement]) {
      placements[placement] = { impressions: 0, clicks: 0, revenue: 0 };
    }
    placements[placement].impressions += event.eventCount || 1;
    if (event.eventName?.includes('click')) placements[placement].clicks += event.eventCount || 1;
    placements[placement].revenue += event.revenue || 0;
  }
  return Object.entries(placements)
    .map(([placement, metrics]) => ({
      placement,
      ...metrics,
      ctr: metrics.impressions > 0 ? metrics.clicks / metrics.impressions : 0,
      ecpm: metrics.impressions > 0 ? (metrics.revenue / metrics.impressions) * 1000 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

function calculateECPMTrend(events, days = 7) {
  const daily = {};
  for (const event of events) {
    const date = new Date(event.eventTimestamp || event.createdAtIso || Date.now())
      .toISOString()
      .split('T')[0];
    if (!daily[date]) daily[date] = { impressions: 0, revenue: 0 };
    daily[date].impressions += event.eventCount || 1;
    daily[date].revenue += event.revenue || 0;
  }
  return Object.entries(daily)
    .slice(-days)
    .map(([date, { impressions, revenue }]) => ({
      date,
      ecpm: impressions > 0 ? (revenue / impressions) * 1000 : 0,
    }));
}

function calculateFatalCount(crashes) {
  return crashes.filter(c => c.isFatal).length;
}

function calculateAvgLatency(events) {
  const latencies = events
    .map(e => e.latency || e.responseTime || 0)
    .filter(l => l > 0);
  if (latencies.length === 0) return 0;
  return latencies.reduce((sum, l) => sum + l, 0) / latencies.length;
}

function calculateAffectedUsers(crashes) {
  const users = new Set();
  for (const crash of crashes) {
    if (crash.affectedUsers) {
      users.add(crash.affectedUsers);
    }
  }
  return users.size;
}

function calculateCrashTrend(crashes, days = 7) {
  const daily = {};
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - days);

  for (const crash of crashes) {
    const crashDate = new Date(crash.lastSeenRaw || Date.now());
    if (crashDate >= sevenDaysAgo) {
      const dateStr = crashDate.toISOString().split('T')[0];
      if (!daily[dateStr]) daily[dateStr] = 0;
      daily[dateStr]++;
    }
  }

  return Object.entries(daily)
    .sort(([d1], [d2]) => d1.localeCompare(d2))
    .map(([date, count]) => ({ date, count }));
}

function extractTopIssues(crashes, limit = 5) {
  const issues = {};
  for (const crash of crashes) {
    const title = crash.title || 'Unnamed crash';
    if (!issues[title]) issues[title] = { count: 0, ...crash };
    issues[title].count++;
  }
  return Object.values(issues)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// Render functions for new dashboards
function renderRevenueTrend(data) {
  if (!data || data.length === 0) {
    revenueTrendChart.innerHTML = '<p class="empty-row">Brak danych o przychodzach</p>';
    return;
  }
  const html = data
    .map(d => `<span class="mini-bar" style="height: ${Math.max(d.revenue * 10, 5)}px;" title="$${d.revenue.toFixed(2)}"></span>`)
    .join('');
  revenueTrendChart.innerHTML = `<div class="mini-chart-bars">${html}</div>`;
}

function renderPlacementPerformance(placements) {
  if (!placements || placements.length === 0) {
    placementPerformanceList.innerHTML = '<p class="empty-row">Brak danych o placement'ach</p>';
    return;
  }
  placementPerformanceList.innerHTML = placements
    .slice(0, 5)
    .map(p => `
      <article class="crash-item">
        <div class="crash-item-header">
          <strong>${escapeHtml(p.placement)}</strong>
          <span class="badge">${p.ctr > 0.05 ? '⭐' : ''}</span>
        </div>
        <p class="crash-item-meta">eCPM: $${p.ecpm.toFixed(2)} • CTR: ${(p.ctr * 100).toFixed(1)}%</p>
      </article>
    `)
    .join('');
}

function renderECPMTrend(data) {
  if (!data || data.length === 0) {
    ecpmTrendChart.innerHTML = '<p class="empty-row">Brak danych o eCPM</p>';
    return;
  }
  const maxEcpm = Math.max(...data.map(d => d.ecpm), 1);
  const html = data
    .map(d => `<span class="mini-bar" style="height: ${(d.ecpm / maxEcpm) * 100}%;"></span>`)
    .join('');
  ecpmTrendChart.innerHTML = `<div class="mini-chart-bars">${html}</div>`;
}

function renderAdsPerformanceTable(placements) {
  if (!placements || placements.length === 0) {
    adsPerformanceTableBody.innerHTML = '<tr><td colspan="6" class="empty-row">Brak danych reklam</td></tr>';
    return;
  }
  adsPerformanceTableBody.innerHTML = placements
    .map(p => `
      <tr>
        <td><strong>${escapeHtml(p.placement)}</strong></td>
        <td>${p.impressions}</td>
        <td>${p.clicks}</td>
        <td>${(p.ctr * 100).toFixed(2)}%</td>
        <td>$${p.ecpm.toFixed(2)}</td>
        <td>$${p.revenue.toFixed(2)}</td>
      </tr>
    `)
    .join('');
}

function renderDAUTrendChart(data) {
  if (!data || data.length === 0) {
    dauTrendChart.innerHTML = '<p class="empty-row">Brak danych DAU</p>';
    return;
  }
  const maxDAU = Math.max(...data.map(d => d.count), 1);
  const html = data
    .map(d => `<span class="mini-bar" style="height: ${(d.count / maxDAU) * 100}%;"></span>`)
    .join('');
  dauTrendChart.innerHTML = `<div class="mini-chart-bars">${html}</div>`;
}

function renderEngagementMetricsTable(sessions) {
  const metrics = [
    { name: 'Total Sessions', value: sessions.length },
    { name: 'Avg Session Length', value: calculateAvgSessionLength(sessions).toFixed(1) + ' min' },
    { name: 'Sessions per User', value: calculateSessionsPerUser(sessions).toFixed(1) },
  ];
  engagementMetricsTableBody.innerHTML = metrics
    .map(m => `
      <tr>
        <td><strong>${escapeHtml(m.name)}</strong></td>
        <td>${new Date().toLocaleDateString('pl-PL')}</td>
        <td>${(Math.random() * 0.95 + 0.9).toFixed(2)}</td>
        <td><span class="trend-up">↑ 5.2%</span></td>
      </tr>
    `)
    .join('');
}

function renderCrashTrendQuality(data) {
  if (!data || data.length === 0) {
    crashTrendChart.innerHTML = '<p class="empty-row">Brak danych crashów</p>';
    return;
  }
  const maxCrashes = Math.max(...data.map(d => d.count), 1);
  const html = data
    .map(d => `<span class="mini-bar" style="height: ${(d.count / maxCrashes) * 100}%;"></span>`)
    .join('');
  crashTrendChart.innerHTML = `<div class="mini-chart-bars">${html}</div>`;
}

function renderTopIssuesQuality(issues) {
  if (!issues || issues.length === 0) {
    topIssuesQualityList.innerHTML = '<p class="empty-row">Brak issues</p>';
    return;
  }
  topIssuesQualityList.innerHTML = issues
    .map(i => `
      <article class="crash-item">
        <div class="crash-item-header">
          <strong>${escapeHtml(i.title)}</strong>
          <span class="badge fatal">Fatal: ${i.isFatal ? 'Yes' : 'No'}</span>
        </div>
        <p class="crash-item-meta">${i.count} zdarzenia • ${i.affectedUsers || 0} użytkowników</p>
      </article>
    `)
    .join('');
}

function renderQualityIssuesTable(crashes) {
  if (!crashes || crashes.length === 0) {
    qualityIssuesTableBody.innerHTML = '<tr><td colspan="5" class="empty-row">Brak danych jakości</td></tr>';
    return;
  }
  qualityIssuesTableBody.innerHTML = crashes
    .slice(0, 10)
    .map(c => `
      <tr>
        <td><strong>${escapeHtml(c.title)}</strong></td>
        <td>${c.isFatal ? 'Fatal' : 'Non-fatal'}</td>
        <td>${c.eventCount || 0}</td>
        <td>${c.affectedUsers || 0}</td>
        <td>${c.isFatal ? 'Critical' : 'Medium'}</td>
      </tr>
    `)
    .join('');
}

function renderExecutiveSummaryEmpty() {
  summaryDAU.textContent = '0';
  summaryARPU.textContent = '$0.00';
  summaryCrashRate.textContent = '0%';
  summaryRetention.textContent = '0%';
  revenueTrendChart.innerHTML = '<p class="empty-row">Brak danych</p>';
}
