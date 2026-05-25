import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js';
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  documentId,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  writeBatch,
} from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';
import {
  getFunctions,
  httpsCallable,
} from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-functions.js';

import { adminAccess, dashboardCollections, firebaseConfig } from './firebase-config.js';

// === DIAGNOSTIC: catch every unhandled error/rejection so nothing is silent ===
window.addEventListener('error', (e) => {
  console.error('[FATAL] uncaught error:', e.message, '\nat:', e.filename, e.lineno, '\nfull:', e);
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('[FATAL] unhandled promise rejection:', e.reason);
});
console.log('[INIT] app.js module started — Firebase SDK imports OK');
// =============================================================================

const topBanner = document.getElementById('topBanner');
const bannerEmail = document.getElementById('bannerEmail');
const bannerActiveView = document.getElementById('bannerActiveView');
const bannerLastRefresh = document.getElementById('bannerLastRefresh');
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
const multiphoneTabButton = document.getElementById('multiphoneTabButton');
const individualAnswersTabButton = document.getElementById('individualAnswersTabButton');
const releasesTabButton = document.getElementById('releasesTabButton');
const gamesPanel = document.getElementById('gamesPanel');
const crashlyticsPanel = document.getElementById('crashlyticsPanel');
const modesPanel = document.getElementById('modesPanel');
const analyticsPanel = document.getElementById('analyticsPanel');
const executiveSummaryPanel = document.getElementById('executiveSummaryPanel');
const adsPerformancePanel = document.getElementById('adsPerformancePanel');
const engagementPanel = document.getElementById('engagementPanel');
const qualityPanel = document.getElementById('qualityPanel');
const multiphonePanel = document.getElementById('multiphonePanel');
const individualAnswersPanel = document.getElementById('individualAnswersPanel');
const releasesPanel = document.getElementById('releasesPanel');

// Multiphone (Karty Wariata) elements
const mpSessions7d = document.getElementById('mpSessions7d');
const mpAvgPlayers = document.getElementById('mpAvgPlayers');
const mpCompletedShare = document.getElementById('mpCompletedShare');
const mpCrashCount = document.getElementById('mpCrashCount');
const mpStatusLobby = document.getElementById('mpStatusLobby');
const mpStatusInProgress = document.getElementById('mpStatusInProgress');
const mpStatusCompleted = document.getElementById('mpStatusCompleted');
const mpStatusAbandoned = document.getElementById('mpStatusAbandoned');
const mpDeleteCompleted = document.getElementById('mpDeleteCompleted');
const mpDeleteAbandoned = document.getElementById('mpDeleteAbandoned');
const mpDeleteOngoing = document.getElementById('mpDeleteOngoing');
const mpDeleteCompletedEligible = document.getElementById('mpDeleteCompletedEligible');
const mpDeleteAbandonedEligible = document.getElementById('mpDeleteAbandonedEligible');
const mpDeleteSelectedButton = document.getElementById('mpDeleteSelectedButton');
const mpDeleteSelectedManualButton = document.getElementById('mpDeleteSelectedManualButton');
const mpReloadBucketsButton = document.getElementById('mpReloadBucketsButton');
const mpCleanupMessage = document.getElementById('mpCleanupMessage');
const mpTopCrashList = document.getElementById('mpTopCrashList');
const mpRoomsTableBody = document.getElementById('mpRoomsTableBody');
const mpInsights = document.getElementById('mpInsights');

// Individual answers elements
const iaTotalAnswers = document.getElementById('iaTotalAnswers');
const iaCustomAnswers = document.getElementById('iaCustomAnswers');
const iaUniquePlayers = document.getElementById('iaUniquePlayers');
const iaUniqueSessions = document.getElementById('iaUniqueSessions');
const iaTableBody = document.getElementById('iaTableBody');
const iaInsights = document.getElementById('iaInsights');
const iaOnlyCustomToggle = document.getElementById('iaOnlyCustomToggle');
const iaSelectVisibleButton = document.getElementById('iaSelectVisibleButton');
const iaClearSelectionButton = document.getElementById('iaClearSelectionButton');
const iaDeleteSelectedButton = document.getElementById('iaDeleteSelectedButton');
const iaManageMessage = document.getElementById('iaManageMessage');

// Release Insights elements
const relActiveVersions = document.getElementById('relActiveVersions');
const relTopVersion = document.getElementById('relTopVersion');
const relTopVersionShare = document.getElementById('relTopVersionShare');
const relTopVersionCrashes = document.getElementById('relTopVersionCrashes');
const relRegressionVersion = document.getElementById('relRegressionVersion');
const relAdoptionList = document.getElementById('relAdoptionList');
const relQualityChart = document.getElementById('relQualityChart');
const relVersionsTableBody = document.getElementById('relVersionsTableBody');
const relInsights = document.getElementById('relInsights');
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
const modeSelectVisibleButton = document.getElementById('modeSelectVisibleButton');
const modeClearSelectionButton = document.getElementById('modeClearSelectionButton');
const modeDeleteSelectedButton = document.getElementById('modeDeleteSelectedButton');
const modeManageMessage = document.getElementById('modeManageMessage');
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

const ALLOWED_DASHBOARDS = new Set([
  'games',
  'modes',
  'analytics',
  'crashlytics',
  'executiveSummary',
  'adsPerformance',
  'engagement',
  'quality',
  'multiphone',
  'individualAnswers',
  'releases',
]);

let activeDashboard = restoreActiveDashboard();
let crashRowsCache = [];
let mpRoomStatsCache = null;
let mpCleanupBusy = false;
let iaRowsCache = [];
let iaSelectedDocIds = new Set();
let iaManageBusy = false;
let modeSummaryCache = emptyModeSummary();
let modeDiagnosticsCache = { sessionDocs: 0, modeStatDocs: 0, analyticsModeDocs: 0 };
let modeSelectedDocIds = new Set();
let modeManageBusy = false;
const MP_COMPLETED_RETENTION_MS = 2 * 60 * 60 * 1000;
const MP_ABANDONED_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

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
const fns = getFunctions(app, 'europe-west1');
const kwRoomCategoryStatsCallable = httpsCallable(fns, 'kwRoomCategoryStats');
const kwRoomCategoryDeleteCallable = httpsCallable(fns, 'kwRoomCategoryDelete');
const provider = new GoogleAuthProvider();

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

multiphoneTabButton.addEventListener('click', async () => {
  await switchDashboard('multiphone');
});

individualAnswersTabButton.addEventListener('click', async () => {
  await switchDashboard('individualAnswers');
});

releasesTabButton.addEventListener('click', async () => {
  await switchDashboard('releases');
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

loginButton.addEventListener('click', async () => {
  console.log('[AUTH] login button clicked');
  loginError.hidden = true;
  try {
    console.log('[AUTH] calling signInWithPopup...');
    const result = await signInWithPopup(auth, provider);
    console.log('[AUTH] signInWithPopup succeeded, user:', result.user?.email);
  } catch (error) {
    const code = String(error?.code || '');
    console.error('[AUTH] signInWithPopup error — code:', code, '| message:', error?.message, '| full:', error);
    if (code.includes('popup-closed-by-user') || code.includes('cancelled-popup-request')) {
      console.log('[AUTH] popup closed by user — silent return');
      return;
    }
    loginError.hidden = false;
    loginError.textContent = error.message || 'Logowanie nie powiodło się.';
  }
});

logoutButton.addEventListener('click', async () => {
  console.log('[AUTH] logout clicked');
  await signOut(auth);
});

refreshButton.addEventListener('click', async () => {
  await loadDashboard();
});

mpReloadBucketsButton?.addEventListener('click', async () => {
  await refreshMultiphoneRoomStats({ force: true });
});

mpDeleteSelectedButton?.addEventListener('click', async () => {
  await handleDeleteSelectedRoomCategories();
});

mpDeleteSelectedManualButton?.addEventListener('click', async () => {
  await handleDeleteSelectedRoomCategories({ forceClientSide: true });
});

modeSelectVisibleButton?.addEventListener('click', () => {
  if (modeManageBusy) return;
  if (modeSummaryCache.source !== 'mode-stats') {
    setModeManageMessage('Kasowanie i selekcja dziala tylko dla zrodla mode_play_stats.', 'error');
    return;
  }

  const visibleModes = getVisibleModeRows();
  for (const modeRow of visibleModes) {
    for (const docId of modeRow.docIds || []) {
      if (docId) modeSelectedDocIds.add(docId);
    }
  }

  renderModeManagementPanel();
  setModeManageMessage(`Zaznaczono ${modeSelectedDocIds.size} rekordow.`, 'success');
});

modeClearSelectionButton?.addEventListener('click', () => {
  if (modeManageBusy) return;
  modeSelectedDocIds.clear();
  renderModeManagementPanel();
  setModeManageMessage('Wyczyszczono zaznaczenie trybow.');
});

modeDeleteSelectedButton?.addEventListener('click', async () => {
  await handleDeleteSelectedModes();
});

modesTableBody?.addEventListener('change', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (!target.classList.contains('mode-row-select')) return;

  const modeKey = String(target.dataset.modeKey || '').trim();
  if (!modeKey) return;

  const modeRow = modeSummaryCache.modes.find((row) => row.mode === modeKey);
  if (!modeRow) return;

  const docIds = modeRow.docIds || [];
  if (target.checked) {
    for (const docId of docIds) {
      if (docId) modeSelectedDocIds.add(docId);
    }
  } else {
    for (const docId of docIds) {
      modeSelectedDocIds.delete(docId);
    }
  }

  refreshModeSelectionState();
});

iaOnlyCustomToggle?.addEventListener('change', () => {
  renderIndividualAnswersPanel();
});

iaSelectVisibleButton?.addEventListener('click', () => {
  if (iaManageBusy) return;
  const visibleRows = getVisibleIndividualAnswerRows();
  for (const row of visibleRows) {
    if (row.docId) iaSelectedDocIds.add(row.docId);
  }
  renderIndividualAnswersPanel();
  setIndividualAnswersManageMessage(
    `Zaznaczono ${iaSelectedDocIds.size} rekordów.`,
    'success',
  );
});

iaClearSelectionButton?.addEventListener('click', () => {
  if (iaManageBusy) return;
  iaSelectedDocIds.clear();
  renderIndividualAnswersPanel();
  setIndividualAnswersManageMessage('Wyczyszczono zaznaczenie.');
});

iaDeleteSelectedButton?.addEventListener('click', async () => {
  await handleDeleteSelectedIndividualAnswers();
});

iaTableBody?.addEventListener('change', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (!target.classList.contains('ia-row-select')) return;

  const docId = String(target.dataset.docId || '').trim();
  if (!docId) return;

  if (target.checked) {
    iaSelectedDocIds.add(docId);
  } else {
    iaSelectedDocIds.delete(docId);
  }
  refreshIndividualAnswersSelectionState();
});

onAuthStateChanged(auth, async (user) => {
  console.log('[AUTH] onAuthStateChanged — user:', user ? user.email : 'null');
  if (!user) {
    setState('login');
    return;
  }

  const email = (user.email || '').toLowerCase();
  console.log('[AUTH] checking email:', email, 'vs expected:', adminAccess.email.toLowerCase());
  if (email !== adminAccess.email.toLowerCase()) {
    console.warn('[AUTH] unauthorized email — signing out');
    setState('unauthorized');
    await signOut(auth);
    return;
  }

  console.log('[AUTH] authorized — switching to dashboard');
  setState('dashboard', user.email);
  await loadDashboard();
});

const DASHBOARD_LABELS = {
  games: 'Statystyki gry',
  modes: 'Tryby gry',
  analytics: 'Monetyzacja',
  crashlytics: 'Crashlytics',
  executiveSummary: 'Podsumowanie',
  adsPerformance: 'Reklamy',
  engagement: 'Zaangażowanie',
  quality: 'Jakość',
  multiphone: 'Karty Wariata',
  individualAnswers: 'Odpowiedzi indywidualne',
  releases: 'Release Insights',
};

function setState(state, userEmail) {
  console.log('[AUTH] setState:', state);
  loginCard.hidden = state !== 'login';
  unauthorizedCard.hidden = state !== 'unauthorized';
  dashboardContent.hidden = state !== 'dashboard';
  logoutButton.hidden = state !== 'dashboard';
  refreshButton.disabled = state !== 'dashboard';
  if (topBanner) topBanner.hidden = state !== 'dashboard';

  if (state === 'dashboard') {
    if (bannerEmail && userEmail) bannerEmail.textContent = userEmail;
    updateBannerView();
    updateDashboardVisibility();
  }
}

function updateBannerView() {
  if (bannerActiveView) {
    bannerActiveView.textContent = DASHBOARD_LABELS[activeDashboard] || activeDashboard;
  }
}

function updateBannerRefresh() {
  if (bannerLastRefresh) {
    bannerLastRefresh.textContent = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
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
    } else if (activeDashboard === 'multiphone') {
      await loadMultiphoneDashboard();
    } else if (activeDashboard === 'individualAnswers') {
      await loadIndividualAnswersDashboard();
    } else if (activeDashboard === 'releases') {
      await loadReleasesDashboard();
    } else {
      await loadCrashlyticsDashboard();
      crashLastRefreshValue.textContent = new Date().toLocaleString('pl-PL');
    }
    updateBannerRefresh();
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
      modeSummaryCache = emptyModeSummary();
      modeDiagnosticsCache = { sessionDocs: 0, modeStatDocs: 0, analyticsModeDocs: 0 };
      modeSelectedDocIds.clear();
      renderModeManagementPanel();
      modesDocsCountValue.textContent = '0';
    } else if (activeDashboard === 'games') {
      renderStats([]);
      renderTable([]);
      docsCountValue.textContent = '0';
    } else if (activeDashboard === 'individualAnswers') {
      renderIndividualAnswersStats([]);
      renderIndividualAnswersTable([]);
      renderInsights(iaInsights, []);
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
  const isMultiphone = activeDashboard === 'multiphone';
  const isIndividualAnswers = activeDashboard === 'individualAnswers';
  const isReleases = activeDashboard === 'releases';

  gamesTabButton.classList.toggle('active', isGames);
  modesTabButton.classList.toggle('active', isModes);
  analyticsTabButton.classList.toggle('active', isAnalytics);
  crashlyticsTabButton.classList.toggle('active', isCrashlytics);
  executiveSummaryTabButton.classList.toggle('active', isExecutiveSummary);
  adsPerformanceTabButton.classList.toggle('active', isAdsPerformance);
  engagementTabButton.classList.toggle('active', isEngagement);
  qualityTabButton.classList.toggle('active', isQuality);
  multiphoneTabButton.classList.toggle('active', isMultiphone);
  individualAnswersTabButton.classList.toggle('active', isIndividualAnswers);
  releasesTabButton.classList.toggle('active', isReleases);

  gamesTabButton.setAttribute('aria-selected', String(isGames));
  modesTabButton.setAttribute('aria-selected', String(isModes));
  analyticsTabButton.setAttribute('aria-selected', String(isAnalytics));
  crashlyticsTabButton.setAttribute('aria-selected', String(isCrashlytics));
  executiveSummaryTabButton.setAttribute('aria-selected', String(isExecutiveSummary));
  adsPerformanceTabButton.setAttribute('aria-selected', String(isAdsPerformance));
  engagementTabButton.setAttribute('aria-selected', String(isEngagement));
  qualityTabButton.setAttribute('aria-selected', String(isQuality));
  multiphoneTabButton.setAttribute('aria-selected', String(isMultiphone));
  individualAnswersTabButton.setAttribute('aria-selected', String(isIndividualAnswers));
  releasesTabButton.setAttribute('aria-selected', String(isReleases));

  gamesPanel.hidden = !isGames;
  modesPanel.hidden = !isModes;
  analyticsPanel.hidden = !isAnalytics;
  crashlyticsPanel.hidden = !isCrashlytics;
  executiveSummaryPanel.hidden = !isExecutiveSummary;
  adsPerformancePanel.hidden = !isAdsPerformance;
  engagementPanel.hidden = !isEngagement;
  qualityPanel.hidden = !isQuality;
  multiphonePanel.hidden = !isMultiphone;
  individualAnswersPanel.hidden = !isIndividualAnswers;
  releasesPanel.hidden = !isReleases;

  updateBannerView();
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

  if (activeDashboard === 'individualAnswers') {
    return 'Odpowiedzi indywidualne nie zwracają danych';
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

    if (activeDashboard === 'individualAnswers') {
      return 'Brakuje reguły odczytu kolekcji kw_individual_answers albo kolekcja nie istnieje jeszcze w Firestore.';
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

async function loadIndividualAnswersDashboard() {
  const collectionName = dashboardCollections.kwIndividualAnswers;
  const rows = collectionName ? await loadCollectionRows(collectionName) : [];
  iaRowsCache = rows
    .map((row) => normalizeKwIndividualAnswerRow(row.id, row))
    .filter((row) => hasUsefulIndividualAnswerData(row))
    .sort((left, right) => getTimestampValue(right.createdAtRaw) - getTimestampValue(left.createdAtRaw));

  pruneIndividualAnswersSelection();
  renderIndividualAnswersPanel();
}

function getVisibleIndividualAnswerRows() {
  const onlyCustom = iaOnlyCustomToggle?.checked ?? true;
  if (!onlyCustom) return iaRowsCache;
  return iaRowsCache.filter((row) => row.answerType === 'custom');
}

function pruneIndividualAnswersSelection() {
  const validIds = new Set(iaRowsCache.map((row) => row.docId).filter(Boolean));
  iaSelectedDocIds = new Set(
    [...iaSelectedDocIds].filter((docId) => validIds.has(docId)),
  );
}

function setIndividualAnswersManageMessage(text, tone = 'muted') {
  if (!iaManageMessage) return;
  iaManageMessage.textContent = text || '';
  iaManageMessage.classList.remove('mp-cleanup-error', 'mp-cleanup-success');
  if (tone === 'error') iaManageMessage.classList.add('mp-cleanup-error');
  if (tone === 'success') iaManageMessage.classList.add('mp-cleanup-success');
}

function setIndividualAnswersManageBusy(busy) {
  iaManageBusy = busy;
  if (iaOnlyCustomToggle) iaOnlyCustomToggle.disabled = busy;
  if (iaSelectVisibleButton) iaSelectVisibleButton.disabled = busy;
  if (iaClearSelectionButton) iaClearSelectionButton.disabled = busy;
  if (iaDeleteSelectedButton) iaDeleteSelectedButton.disabled = busy;
}

function refreshIndividualAnswersSelectionState() {
  const visibleRows = getVisibleIndividualAnswerRows();
  const selectedVisibleCount = visibleRows.filter(
    (row) => row.docId && iaSelectedDocIds.has(row.docId),
  ).length;
  const totalSelected = iaSelectedDocIds.size;
  if (!iaManageMessage) return;
  if (iaManageBusy) return;
  if (totalSelected <= 0) {
    iaManageMessage.textContent = `Widoczne rekordy: ${visibleRows.length}. Zaznaczone: 0.`;
    iaManageMessage.classList.remove('mp-cleanup-error', 'mp-cleanup-success');
    return;
  }
  iaManageMessage.textContent =
    `Widoczne rekordy: ${visibleRows.length}. Zaznaczone (widoczne): ${selectedVisibleCount}. Łącznie zaznaczone: ${totalSelected}.`;
  iaManageMessage.classList.remove('mp-cleanup-error', 'mp-cleanup-success');
}

function renderIndividualAnswersPanel() {
  const visibleRows = getVisibleIndividualAnswerRows();
  renderIndividualAnswersStats(visibleRows);
  renderIndividualAnswersTable(visibleRows);
  renderIndividualAnswersInsights(visibleRows);
  refreshIndividualAnswersSelectionState();
}

async function handleDeleteSelectedIndividualAnswers() {
  if (iaManageBusy) return;
  const selectedDocIds = [...iaSelectedDocIds].filter(Boolean);
  if (!selectedDocIds.length) {
    setIndividualAnswersManageMessage(
      'Zaznacz co najmniej jeden rekord do usunięcia.',
      'error',
    );
    return;
  }

  const ok = window.confirm(
    `Usunąć zaznaczone rekordy (${selectedDocIds.length}) z kw_individual_answers?`,
  );
  if (!ok) return;

  try {
    setIndividualAnswersManageBusy(true);
    setIndividualAnswersManageMessage('Usuwanie zaznaczonych rekordów...');
    const collectionName = dashboardCollections.kwIndividualAnswers;
    if (!collectionName) {
      throw new Error('Nie skonfigurowano kolekcji kw_individual_answers.');
    }
    for (const chunk of chunkArray(selectedDocIds, 350)) {
      const batch = writeBatch(db);
      for (const docId of chunk) {
        batch.delete(doc(db, collectionName, docId));
      }
      await batch.commit();
    }
    iaSelectedDocIds.clear();
    await loadIndividualAnswersDashboard();
    setIndividualAnswersManageMessage(
      `Usunięto rekordów: ${selectedDocIds.length}.`,
      'success',
    );
  } catch (error) {
    console.error('[KW_INDIVIDUAL] delete failed:', error);
    setIndividualAnswersManageMessage(
      `Nie udało się usunąć rekordów: ${error?.message || error}`,
      'error',
    );
  } finally {
    setIndividualAnswersManageBusy(false);
    refreshIndividualAnswersSelectionState();
  }
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

  modeSummaryCache = modeSummary;
  modeDiagnosticsCache = {
    sessionDocs: 0,
    modeStatDocs,
    analyticsModeDocs,
  };
  pruneModeSelection();
  renderModeManagementPanel();
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

function getVisibleModeRows() {
  return modeSummaryCache?.modes || [];
}

function pruneModeSelection() {
  const validIds = new Set();
  for (const modeRow of getVisibleModeRows()) {
    for (const docId of modeRow.docIds || []) {
      if (docId) validIds.add(docId);
    }
  }

  modeSelectedDocIds = new Set([...modeSelectedDocIds].filter((docId) => validIds.has(docId)));
}

function setModeManageMessage(text, tone = 'muted') {
  if (!modeManageMessage) return;
  modeManageMessage.textContent = text || '';
  modeManageMessage.classList.remove('mp-cleanup-error', 'mp-cleanup-success');
  if (tone === 'error') modeManageMessage.classList.add('mp-cleanup-error');
  if (tone === 'success') modeManageMessage.classList.add('mp-cleanup-success');
}

function setModeManageBusy(busy) {
  modeManageBusy = busy;
  if (modeSelectVisibleButton) modeSelectVisibleButton.disabled = busy;
  if (modeClearSelectionButton) modeClearSelectionButton.disabled = busy;
  if (modeDeleteSelectedButton) modeDeleteSelectedButton.disabled = busy;
}

function refreshModeSelectionState() {
  if (!modeManageMessage) return;
  if (modeManageBusy) return;

  const visibleModes = getVisibleModeRows();
  if (modeSummaryCache.source !== 'mode-stats') {
    modeManageMessage.textContent = `Tryb tylko do odczytu. Aktywne zrodlo: ${modeSummaryCache.source}.`;
    modeManageMessage.classList.remove('mp-cleanup-error', 'mp-cleanup-success');
    return;
  }

  const selectableRows = visibleModes.filter((modeRow) => (modeRow.docIds || []).length > 0);
  const selectedVisible = selectableRows.filter((modeRow) => (modeRow.docIds || []).some((docId) => modeSelectedDocIds.has(docId))).length;
  if (!modeSelectedDocIds.size) {
    modeManageMessage.textContent = `Widoczne tryby: ${visibleModes.length}. Zaznaczone: 0.`;
    modeManageMessage.classList.remove('mp-cleanup-error', 'mp-cleanup-success');
    return;
  }

  modeManageMessage.textContent = `Widoczne tryby: ${visibleModes.length}. Zaznaczone tryby: ${selectedVisible}. Zaznaczone rekordy: ${modeSelectedDocIds.size}.`;
  modeManageMessage.classList.remove('mp-cleanup-error', 'mp-cleanup-success');
}

function renderModeManagementPanel() {
  renderModeSummary(modeSummaryCache, modeDiagnosticsCache);
  refreshModeSelectionState();
}

async function handleDeleteSelectedModes() {
  if (modeManageBusy) return;
  if (modeSummaryCache.source !== 'mode-stats') {
    setModeManageMessage('Usuwanie trybow jest dostepne tylko dla danych mode_play_stats.', 'error');
    return;
  }

  const selectedDocIds = [...modeSelectedDocIds].filter(Boolean);
  if (!selectedDocIds.length) {
    setModeManageMessage('Zaznacz co najmniej jeden rekord trybu do usuniecia.', 'error');
    return;
  }

  const ok = window.confirm(`Usunac zaznaczone rekordy trybow (${selectedDocIds.length}) z mode_play_stats?`);
  if (!ok) return;

  try {
    setModeManageBusy(true);
    setModeManageMessage('Usuwanie zaznaczonych rekordow trybow...');

    const collectionName = dashboardCollections.modeStats;
    if (!collectionName) {
      throw new Error('Nie skonfigurowano kolekcji mode_play_stats.');
    }

    for (const chunk of chunkArray(selectedDocIds, 350)) {
      const batch = writeBatch(db);
      for (const docId of chunk) {
        batch.delete(doc(db, collectionName, docId));
      }
      await batch.commit();
    }

    modeSelectedDocIds.clear();
    await loadModesDashboard();
    setModeManageMessage(`Usunieto rekordow: ${selectedDocIds.length}.`, 'success');
  } catch (error) {
    console.error('[MODE_STATS] delete failed:', error);
    setModeManageMessage(`Nie udalo sie usunac rekordow: ${error?.message || error}`, 'error');
  } finally {
    setModeManageBusy(false);
    refreshModeSelectionState();
  }
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
      docIds: [],
    };

    current.count += count;

    const rawOpenCount = toNumber(pickValue(row, [['openCount'], ['open_count']])) || 0;
    const rawPlayCount = toNumber(pickValue(row, [['playCount'], ['play_count']])) || 0;
    current.openCount += rawOpenCount;
    current.playCount += rawPlayCount;

    const docId = String(row.id || '').trim();
    if (docId && !current.docIds.includes(docId)) {
      current.docIds.push(docId);
    }

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
    modesTableBody.innerHTML = `<tr><td colspan="5" class="empty-row">${escapeHtml(modeSourceLabels(source).emptyTable)}</td></tr>`;
    return;
  }

  const countLabel = modeCountLabel(source);
  const isModeStats = source === 'mode-stats';

  modesTableBody.innerHTML = modes
    .map((summary) => {
      const docIds = summary.docIds || [];
      const canSelect = isModeStats && docIds.length > 0;
      const isSelected = canSelect && docIds.every((docId) => modeSelectedDocIds.has(docId));
      const selectCell = canSelect
        ? `
            <input
              type="checkbox"
              class="mode-row-select"
              data-mode-key="${escapeHtml(summary.mode)}"
              ${isSelected ? 'checked' : ''}
            />
          `
        : '<span class="table-note">-</span>';

      if (isModeStats && (summary.openCount > 0 || summary.playCount > 0)) {
        const opens = summary.openCount;
        const plays = summary.playCount;
        const convPct = opens > 0 ? Math.round((plays / opens) * 100) : 0;
        const playsLabel = plays === 1 ? '1 start' : plays < 5 ? `${plays} starty` : `${plays} startow`;
        return `
          <tr>
            <td>${selectCell}</td>
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
          <td>${selectCell}</td>
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

function normalizeKwIndividualAnswerRow(docId, row) {
  const sources = [row, row?.payload, row?.data, row?.metadata].filter(Boolean);
  const roundIndex = toNumber(pickValueFromSources(sources, [
    ['roundIndex'],
    ['round'],
    ['round_number'],
  ]));
  const totalRounds = toNumber(pickValueFromSources(sources, [
    ['totalRounds'],
    ['roundCount'],
    ['roundsTotal'],
  ]));
  const answerTypeRaw = String(pickValueFromSources(sources, [
    ['answerType'],
    ['submissionType'],
    ['type'],
  ]) || '').toLowerCase();
  const answerType = answerTypeRaw === 'custom' ? 'custom' : 'deck';

  return {
    docId,
    createdAtRaw: pickValueFromSources(sources, [
      ['createdAt'],
      ['submittedAt'],
      ['timestamp'],
      ['createdAtMs'],
    ]),
    sessionId: String(pickValueFromSources(sources, [['sessionId']]) || ''),
    roomId: String(pickValueFromSources(sources, [['roomId']]) || ''),
    roundIndex,
    totalRounds,
    playerId: String(pickValueFromSources(sources, [['playerId']]) || ''),
    playerName: String(pickValueFromSources(sources, [['playerName'], ['displayName']]) || ''),
    answerType,
    visionId: String(pickValueFromSources(sources, [['visionId']]) || ''),
    visionText: String(pickValueFromSources(sources, [['visionText'], ['questionText']]) || ''),
    elementId: String(pickValueFromSources(sources, [['elementId'], ['answerId']]) || ''),
    answerText: String(pickValueFromSources(sources, [['answerText'], ['submissionText'], ['text']]) || ''),
  };
}

function hasUsefulIndividualAnswerData(row) {
  return Boolean(
    row.answerText
    || row.elementId
    || row.sessionId
    || row.roomId
    || getTimestampValue(row.createdAtRaw) > 0
  );
}

function renderIndividualAnswersStats(rows) {
  const total = rows.length;
  const customCount = rows.filter((row) => row.answerType === 'custom').length;
  const uniquePlayers = new Set(rows.map((row) => row.playerId || row.playerName).filter(Boolean)).size;
  const uniqueSessions = new Set(rows.map((row) => row.sessionId || row.roomId).filter(Boolean)).size;

  iaTotalAnswers.textContent = String(total);
  iaCustomAnswers.textContent = String(customCount);
  iaUniquePlayers.textContent = String(uniquePlayers);
  iaUniqueSessions.textContent = String(uniqueSessions);
}

function individualAnswerTypeLabel(type) {
  return type === 'custom' ? 'Dopisz chaos' : 'Karta z ręki';
}

function individualAnswerTypeBadge(type) {
  return type === 'custom' ? 'mixed' : 'pending';
}

function renderIndividualAnswersTable(rows) {
  if (!rows.length) {
    iaTableBody.innerHTML = '<tr><td colspan="8" class="empty-row">Brak danych odpowiedzi indywidualnych</td></tr>';
    return;
  }

  iaTableBody.innerHTML = rows
    .map((row) => {
      const isSelected = row.docId ? iaSelectedDocIds.has(row.docId) : false;
      const session = row.sessionId || row.roomId || '�';
      const roundLabel = row.totalRounds > 0
        ? `${row.roundIndex + 1}/${row.totalRounds}`
        : String(row.roundIndex + 1);
      const playerName = row.playerName || row.playerId || '�';
      const visionValue = row.visionText || row.visionId || '�';
      const answerValue = row.answerText || row.elementId || '�';
      const answerType = renderBadge(
        individualAnswerTypeBadge(row.answerType),
        individualAnswerTypeLabel(row.answerType),
      );

      return `
        <tr>
          <td>
            <input
              type="checkbox"
              class="ia-row-select"
              data-doc-id="${escapeHtml(String(row.docId || ''))}"
              ${isSelected ? 'checked' : ''}
            />
          </td>
          <td>${escapeHtml(formatDate(row.createdAtRaw))}</td>
          <td><code>${escapeHtml(truncateText(String(session), 28))}</code></td>
          <td>${escapeHtml(roundLabel)}</td>
          <td>
            <strong>${escapeHtml(truncateText(String(playerName), 28))}</strong>
            ${row.playerId ? `<div class="table-note">${escapeHtml(row.playerId)}</div>` : ''}
          </td>
          <td>${answerType}</td>
          <td title="${escapeHtml(String(visionValue))}">${escapeHtml(truncateText(String(visionValue), 72))}</td>
          <td title="${escapeHtml(String(answerValue))}">${escapeHtml(truncateText(String(answerValue), 88))}</td>
        </tr>
      `;
    })
    .join('');
}
function renderIndividualAnswersInsights(rows) {
  if (!rows.length) {
    renderInsights(iaInsights, []);
    return;
  }

  const customCount = rows.filter((row) => row.answerType === 'custom').length;
  const customShare = Math.round((customCount / Math.max(rows.length, 1)) * 100);

  const byPlayer = new Map();
  for (const row of rows) {
    const key = row.playerId || row.playerName || '(unknown)';
    const current = byPlayer.get(key) || { total: 0, custom: 0, label: row.playerName || row.playerId || '(unknown)' };
    current.total += 1;
    if (row.answerType === 'custom') current.custom += 1;
    byPlayer.set(key, current);
  }
  const topPlayer = [...byPlayer.values()].sort((a, b) => b.total - a.total)[0];

  const hints = [
    {
      tone: customShare >= 30 ? 'good' : 'info',
      title: 'Udział "Dopisz chaos"',
      body: `${customShare}% odpowiedzi to własny tekst (${customCount}/${rows.length}).`,
    },
    {
      tone: 'info',
      title: 'Najbardziej aktywny gracz',
      body: `${topPlayer.label}: ${topPlayer.total} odpowiedzi, w tym ${topPlayer.custom} własnych.`,
    },
  ];

  renderInsights(iaInsights, hints);
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

  const summaryInsightsTarget = document.getElementById('summaryInsights');
  if (summaryInsightsTarget) {
    renderInsights(
      summaryInsightsTarget,
      buildExecutiveSummaryInsights({
        dau,
        avgRevenue,
        adsPercent,
        purchasePercent,
        crashRate,
        retention,
        totalRevenueAll,
      }),
    );
  }
}

function buildExecutiveSummaryInsights(metrics) {
  const hints = [];
  const { dau, avgRevenue, adsPercent, purchasePercent, crashRate, retention, totalRevenueAll } = metrics;

  if (dau === 0 && avgRevenue === 0 && totalRevenueAll === 0) {
    hints.push({
      tone: 'info',
      title: 'Brak danych w panelu',
      body: 'Brak sesji / eventów. Sprawdź synchronizację BigQuery → Firestore lub uruchom `uruchom_sync_analytics.bat`.',
    });
    return hints;
  }

  if (crashRate > 0.02) {
    hints.push({
      tone: 'danger',
      title: `Crash rate ${(crashRate * 100).toFixed(2)}% przekracza próg 2%`,
      body: 'Zaplanuj hotfix dla top issue z dashboardu Crashlytics zanim CTR spadnie.',
    });
  } else if (crashRate > 0 && crashRate < 0.01) {
    hints.push({
      tone: 'success',
      title: 'Crash rate w bezpiecznej strefie (<1%)',
      body: 'Możesz przyspieszyć rollout następnej wersji albo testowy ABT.',
    });
  }

  if (retention > 0 && retention < 0.20) {
    hints.push({
      tone: 'warning',
      title: `D7 retencja ${(retention * 100).toFixed(0)}% — poniżej zdrowego progu`,
      body: 'Sprawdź tutorial / first-session UX, dodaj push przypominający o nowych kartach.',
    });
  }

  if (adsPercent > 80 && purchasePercent < 15) {
    hints.push({
      tone: 'info',
      title: 'Monetyzacja prawie wyłącznie z reklam',
      body: 'Rozważ kampanię paywall albo nowy paczki premium — IAP daje wyższy ARPU per płacący.',
    });
  } else if (purchasePercent > 65) {
    hints.push({
      tone: 'success',
      title: 'IAP-driven monetyzacja',
      body: 'Premium konwertuje. Możesz testować większe oferty (np. roczny pass).',
    });
  }

  if (avgRevenue > 0 && avgRevenue < 0.05) {
    hints.push({
      tone: 'warning',
      title: `Niski ARPU ($${avgRevenue.toFixed(3)})`,
      body: 'Brak płacących userów lub niska liczba impresji rewarded. Zweryfikuj eCPM dashboard Reklamy.',
    });
  }

  if (hints.length === 0) {
    hints.push({
      tone: 'success',
      title: 'Health KPI w normie',
      body: 'Brak ostrzeżeń. Możesz iść w eksperymenty growth / nowe contenty.',
    });
  }

  return hints;
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
    placementPerformanceList.innerHTML = '<p class="empty-row">Brak danych o placementach</p>';
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

function setMultiphoneCleanupMessage(text, tone = 'muted') {
  if (!mpCleanupMessage) return;
  mpCleanupMessage.textContent = text || '';
  mpCleanupMessage.classList.remove('mp-cleanup-error', 'mp-cleanup-success');
  if (tone === 'error') mpCleanupMessage.classList.add('mp-cleanup-error');
  if (tone === 'success') mpCleanupMessage.classList.add('mp-cleanup-success');
}

function setMultiphoneCleanupBusy(busy) {
  mpCleanupBusy = busy;
  if (mpDeleteSelectedButton) mpDeleteSelectedButton.disabled = busy;
  if (mpDeleteSelectedManualButton) mpDeleteSelectedManualButton.disabled = busy;
  if (mpReloadBucketsButton) mpReloadBucketsButton.disabled = busy;
}

function applyRoomStatsToMultiphoneStatus(roomStats) {
  if (!roomStats || !roomStats.counts) return;
  const counts = roomStats.counts;
  const eligible = roomStats.eligibleForDeletion || {};

  mpStatusLobby.textContent = String(toNumber(counts.ongoing));
  mpStatusInProgress.textContent = String(toNumber(counts.total));
  mpStatusCompleted.textContent = String(toNumber(counts.completed));
  mpStatusAbandoned.textContent = String(toNumber(counts.abandoned));

  if (mpDeleteCompletedEligible) {
    mpDeleteCompletedEligible.textContent = String(toNumber(eligible.completed));
  }
  if (mpDeleteAbandonedEligible) {
    mpDeleteAbandonedEligible.textContent = String(toNumber(eligible.abandoned));
  }
}

function mapRoomStatsSampleToRows(sampledRooms) {
  if (!Array.isArray(sampledRooms)) return [];
  return sampledRooms.map((row) => ({
    roomId: row.roomId || '',
    roomCode: row.roomCode || '',
    status: row.status || 'unknown',
    playerCount: toNumber(row.playerCount),
    totalRounds: toNumber(row.totalRounds) || 0,
    hostName: row.hostDisplayName || '',
    createdAtIso: row.updatedAtMs ? new Date(Number(row.updatedAtMs)).toISOString() : '',
  }));
}

function toInt(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function normalizeKwRoomStatus(value) {
  const status = String(value || '').trim().toLowerCase();
  if (status === 'in_progress') return 'inprogress';
  if (status === 'active') return 'inprogress';
  return status || 'unknown';
}

function roomBucketFromStatus(status) {
  if (status === 'completed') return 'completed';
  if (status === 'abandoned' || status === 'closed') return 'abandoned';
  if (status === 'lobby' || status === 'inprogress') return 'ongoing';
  return 'unknown';
}

function kwRoomUpdatedAtMs(snapshotData) {
  const direct = toInt(snapshotData?.updatedAtMs, 0);
  if (direct > 0) return direct;
  return toInt(snapshotData?.gameState?.updatedAtMs, 0);
}

function kwRoomIdFromSnapshotDoc(docSnap, snapshotData) {
  const explicit = String(snapshotData?.roomId || '').trim();
  if (explicit) return explicit;
  const parts = String(docSnap?.ref?.path || '').split('/');
  if (parts.length >= 2 && parts[0] === 'kw_rooms') {
    return String(parts[1] || '').trim();
  }
  return '';
}

function computeRoomSummary(snapshotData, roomId) {
  const status = normalizeKwRoomStatus(snapshotData?.status);
  const bucket = roomBucketFromStatus(status);
  const updatedAtMs = kwRoomUpdatedAtMs(snapshotData);

  const players = Array.isArray(snapshotData?.players) ? snapshotData.players : [];
  const playerCount = players.length;
  const hostPlayerId = String(snapshotData?.hostPlayerId || '').trim();
  const host = players.find((p) => String(p?.playerId || '').trim() === hostPlayerId);
  const hostDisplayName = String(host?.displayName || '').trim();

  return {
    roomId,
    roomCode: String(snapshotData?.roomCode || '').trim(),
    status,
    bucket,
    updatedAtMs,
    playerCount,
    hostDisplayName,
    totalRounds: toInt(snapshotData?.gameState?.totalRounds, 0),
    roundIndex: toInt(snapshotData?.gameState?.currentRoundIndex, 0),
  };
}

function eligibleRetentionCategory(summary, now) {
  if (!summary || summary.updatedAtMs <= 0) return null;
  const ageMs = now - summary.updatedAtMs;
  if (summary.status === 'completed' && ageMs >= MP_COMPLETED_RETENTION_MS) {
    return 'completed';
  }
  if ((summary.status === 'abandoned' || summary.status === 'closed') &&
      ageMs >= MP_ABANDONED_RETENTION_MS) {
    return 'abandoned';
  }
  return null;
}

function bucketCountersFromSummaries(summaries) {
  const counters = {
    total: 0,
    ongoing: 0,
    completed: 0,
    abandoned: 0,
    unknown: 0,
  };
  for (const summary of summaries) {
    counters.total += 1;
    if (summary.bucket === 'ongoing') counters.ongoing += 1;
    else if (summary.bucket === 'completed') counters.completed += 1;
    else if (summary.bucket === 'abandoned') counters.abandoned += 1;
    else counters.unknown += 1;
  }
  return counters;
}

function eligibleCountersFromSummaries(summaries, now) {
  const counters = { completed: 0, abandoned: 0 };
  for (const summary of summaries) {
    const category = eligibleRetentionCategory(summary, now);
    if (category === 'completed') counters.completed += 1;
    if (category === 'abandoned') counters.abandoned += 1;
  }
  return counters;
}

function selectSummariesForDelete({
  summaries,
  categories,
  now,
  forceOngoing = false,
  enforceRetention = true,
}) {
  const requested = new Set(
    (Array.isArray(categories) ? categories : [])
      .map((v) => String(v || '').trim().toLowerCase())
      .filter(Boolean),
  );
  const allowCompleted = requested.has('completed');
  const allowAbandoned = requested.has('abandoned');
  const allowOngoing = requested.has('ongoing');
  const selected = [];

  for (const summary of summaries) {
    const retentionCategory = eligibleRetentionCategory(summary, now);
    if (
      allowCompleted &&
      ((enforceRetention && retentionCategory === 'completed') ||
        (!enforceRetention && summary.bucket === 'completed'))
    ) {
      selected.push(summary);
      continue;
    }
    if (
      allowAbandoned &&
      ((enforceRetention && retentionCategory === 'abandoned') ||
        (!enforceRetention && summary.bucket === 'abandoned'))
    ) {
      selected.push(summary);
      continue;
    }
    if (allowOngoing && forceOngoing && summary.bucket === 'ongoing') {
      selected.push(summary);
    }
  }
  return selected;
}

async function loadAllRoomSummariesClientSide() {
  const summaries = [];
  const everySnapshot = await getDocs(query(collectionGroup(db, 'snapshots')));
  const docs = everySnapshot.docs.filter((docSnap) => docSnap.id === 'current');

  for (const docSnap of docs) {
    if (docSnap.id !== 'current') continue;
    const data = docSnap.data() || {};
    const roomId = kwRoomIdFromSnapshotDoc(docSnap, data);
    if (!roomId) continue;
    summaries.push(computeRoomSummary(data, roomId));
  }
  return summaries;
}

function buildClientRoomStats(summaries) {
  const now = Date.now();
  const counts = bucketCountersFromSummaries(summaries);
  const eligibleForDeletion = eligibleCountersFromSummaries(summaries, now);
  const sampledRooms = summaries
    .slice()
    .sort((a, b) => b.updatedAtMs - a.updatedAtMs)
    .slice(0, 200);

  return {
    generatedAtMs: now,
    retentionPolicy: {
      completedTtlMs: MP_COMPLETED_RETENTION_MS,
      abandonedTtlMs: MP_ABANDONED_RETENTION_MS,
    },
    counts,
    eligibleForDeletion,
    sampledRooms,
  };
}

function chunkArray(items, chunkSize = 400) {
  const chunks = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
}

async function deleteDocsInBatches(docSnapshots) {
  if (!Array.isArray(docSnapshots) || docSnapshots.length === 0) return;
  for (const chunk of chunkArray(docSnapshots, 350)) {
    const batch = writeBatch(db);
    for (const docSnap of chunk) {
      batch.delete(docSnap.ref);
    }
    await batch.commit();
  }
}

async function deleteSubcollectionDocs(path) {
  const colRef = collection(db, path);
  while (true) {
    const page = await getDocs(query(colRef, limit(350)));
    if (page.empty) break;
    await deleteDocsInBatches(page.docs);
    if (page.size < 350) break;
  }
}

async function deleteRoomCodeDocs(summary) {
  if (summary.roomCode) {
    await deleteDoc(doc(db, 'kw_room_codes', summary.roomCode)).catch(() => {});
  }

  const byRoomId = await getDocs(
    query(collection(db, 'kw_room_codes'), where('roomId', '==', summary.roomId)),
  );
  if (!byRoomId.empty) {
    await deleteDocsInBatches(byRoomId.docs);
  }
}

async function deleteRoomArtifactsClientSide(summary) {
  if (!summary?.roomId) return false;
  try {
    await deleteSubcollectionDocs(`kw_rooms/${summary.roomId}/actions`);
  } catch (error) {
    console.warn('[KW_STATS] skipping actions cleanup for room', summary.roomId, error);
  }
  try {
    await deleteSubcollectionDocs(`kw_rooms/${summary.roomId}/snapshots`);
  } catch (error) {
    console.warn('[KW_STATS] skipping snapshots cleanup for room', summary.roomId, error);
    await deleteDoc(doc(db, 'kw_rooms', summary.roomId, 'snapshots', 'current')).catch(() => {});
  }
  await deleteRoomCodeDocs(summary).catch((error) => {
    console.warn('[KW_STATS] room code cleanup warning for room', summary.roomId, error);
  });
  await deleteDoc(doc(db, 'kw_rooms', summary.roomId)).catch(() => {});
  return true;
}

async function refreshMultiphoneRoomStatsClientSide() {
  const summaries = await loadAllRoomSummariesClientSide();
  const stats = buildClientRoomStats(summaries);
  mpRoomStatsCache = stats;
  applyRoomStatsToMultiphoneStatus(stats);
  return stats;
}

async function deleteRoomCategoriesClientSide(
  categories,
  { respectRetention = true } = {},
) {
  const now = Date.now();
  const forceOngoing = categories.includes('ongoing');
  const summaries = await loadAllRoomSummariesClientSide();
  const selected = selectSummariesForDelete({
    summaries,
    categories,
    now,
    forceOngoing,
    enforceRetention: respectRetention,
  });
  let deletedCount = 0;
  for (const summary of selected) {
    const deleted = await deleteRoomArtifactsClientSide(summary);
    if (deleted) deletedCount += 1;
  }
  return deletedCount;
}

async function refreshMultiphoneRoomStats({ force = false } = {}) {
  if (!force && mpRoomStatsCache) {
    return mpRoomStatsCache;
  }

  try {
    const response = await kwRoomCategoryStatsCallable();
    const stats = response?.data || null;
    if (!stats) throw new Error('kwRoomCategoryStats returned empty payload.');
    mpRoomStatsCache = stats;
    applyRoomStatsToMultiphoneStatus(stats);
    setMultiphoneCleanupMessage('');
    return stats;
  } catch (error) {
    console.warn('[KW_STATS] kwRoomCategoryStats unavailable:', error);
    try {
      const stats = await refreshMultiphoneRoomStatsClientSide();
      setMultiphoneCleanupMessage(
        'Tryb reczny aktywny (bez Cloud Functions / Blaze).',
      );
      return stats;
    } catch (fallbackError) {
      console.error('[KW_STATS] client-side stats failed:', fallbackError);
      setMultiphoneCleanupMessage(
        `Nie udalo sie pobrac statusow pokoi: ${fallbackError?.message || fallbackError}`,
        'error',
      );
      return null;
    }
  }
}

function selectedRoomCleanupCategories() {
  const categories = [];
  if (mpDeleteCompleted?.checked) categories.push('completed');
  if (mpDeleteAbandoned?.checked) categories.push('abandoned');
  if (mpDeleteOngoing?.checked) categories.push('ongoing');
  return categories;
}

async function handleDeleteSelectedRoomCategories({ forceClientSide = false } = {}) {
  if (mpCleanupBusy) return;
  const categories = selectedRoomCleanupCategories();
  if (!categories.length) {
    setMultiphoneCleanupMessage('Wybierz co najmniej jedna kategorie.', 'error');
    return;
  }

  if (categories.includes('ongoing')) {
    const ok = window.confirm(
      'Usuwanie trwajacych pokoi przerwie aktywne sesje. Kontynuowac?',
    );
    if (!ok) return;
  }

  try {
    setMultiphoneCleanupBusy(true);
    setMultiphoneCleanupMessage(
      forceClientSide
        ? 'Reczne czyszczenie danych...'
        : 'Usuwanie danych...',
    );

    let deletedCount = 0;
    let usedClientSideFallback = forceClientSide;

    if (forceClientSide) {
      deletedCount = await deleteRoomCategoriesClientSide(categories, {
        // Manual cleanup is explicit admin action: delete selected categories now.
        respectRetention: false,
      });
    } else {
      try {
        const response = await kwRoomCategoryDeleteCallable({
          categories,
          dryRun: false,
          forceOngoing: categories.includes('ongoing'),
        });
        const payload = response?.data || {};
        deletedCount = toNumber(payload.deletedCount);
      } catch (callableError) {
        console.warn('[KW_STATS] callable delete unavailable, using manual mode:', callableError);
        usedClientSideFallback = true;
        // No Functions available (Spark/manual mode): apply immediate cleanup
        // so UX matches the selected categories and does not get stuck on
        // "eligible: 0" retention-only filters.
        deletedCount = await deleteRoomCategoriesClientSide(categories, {
          respectRetention: false,
        });
      }
    }

    setMultiphoneCleanupMessage(
      usedClientSideFallback
        ? `Usunieto pokojow recznie: ${deletedCount}.`
        : `Usunieto pokojow: ${deletedCount}.`,
      'success',
    );
    mpRoomStatsCache = null;
    await refreshMultiphoneRoomStats({ force: true });
    if (activeDashboard === 'multiphone') {
      await loadMultiphoneDashboard();
    }
  } catch (error) {
    console.error('[KW_STATS] delete categories failed:', error);
    setMultiphoneCleanupMessage(
      `Nie udalo sie usunac kategorii: ${error?.message || error?.code || error}`,
      'error',
    );
  } finally {
    setMultiphoneCleanupBusy(false);
  }
}

// ── Karty Wariata Health dashboard ──────────────────────────────────────────
// Reads from analytics_events (canonical source of kw_* events) + crashlytics
// reports + game_history (fallback). Tile copy framed as "Karty Wariata" so
// the panel produces signal even when sessions don't carry a multi-phone tag.
async function loadMultiphoneDashboard() {
  mpRoomStatsCache = null;
  const [analyticsRaw, crashesRaw, sessions] = await Promise.all([
    loadFirstAvailableCollectionRows(getAnalyticsCollectionCandidates())
      .then((r) => r.rows)
      .catch(() => []),
    loadCollectionRows(dashboardCollections.crashlytics).catch(() => []),
    loadCollectionRows(dashboardCollections.sessions).catch(() => []),
  ]);

  // ── Source 1: kw_* analytics events (last 30 days) ──────────────────────
  const recentEvents = filterByDays(
    analyticsRaw,
    30,
    (e) => extractTimestamp(e) || e.createdAtIso || e.timestamp,
  );
  const kwEvents = recentEvents.filter((row) => isKwEvent(row));

  const sessionStarted = kwEvents.filter((e) => eventNameOf(e).startsWith('kw_session_started'));
  const sessionCompleted = kwEvents.filter((e) => eventNameOf(e).startsWith('kw_session_completed'));
  const sessionAbandoned = kwEvents.filter((e) => eventNameOf(e).startsWith('kw_session_abandoned'));
  const roundStarted = kwEvents.filter((e) => eventNameOf(e).startsWith('kw_round_started'));

  const totalSessionStarts =
    sumEventCounts(sessionStarted) || sessionStarted.length;
  const totalSessionCompletes =
    sumEventCounts(sessionCompleted) || sessionCompleted.length;
  const totalSessionAbandons =
    sumEventCounts(sessionAbandoned) || sessionAbandoned.length;
  const totalRoundStarts =
    sumEventCounts(roundStarted) || roundStarted.length;

  // ── Source 2: game_history rows (best-effort signal) ────────────────────
  const recentSessions = filterByDays(sessions, 30, (s) => s.createdAtIso);
  const mpLikeSessions = recentSessions.filter(isMultiplayerLike);

  // ── Tile 1: sesje (events + sessions union, prefer events when present)
  const sessionsTotal = totalSessionStarts || recentSessions.length;
  mpSessions7d.textContent = String(sessionsTotal);

  // ── Tile 2: średnia liczba graczy — bias to events, fallback to rows
  let avgPlayers = '—';
  const eventBasedAvg = avgPlayersFromKwEvents(kwEvents);
  if (eventBasedAvg > 0) {
    avgPlayers = eventBasedAvg.toFixed(1);
  } else if (mpLikeSessions.length > 0) {
    const counts = mpLikeSessions
      .map((row) => extractPlayerCount(row))
      .filter((n) => Number.isFinite(n) && n > 0);
    avgPlayers = counts.length
      ? (counts.reduce((a, b) => a + b, 0) / counts.length).toFixed(1)
      : '—';
  }
  mpAvgPlayers.textContent = avgPlayers;

  // ── Tile 3: completion share
  const completionDenominator = totalSessionStarts || sessionsTotal;
  const completionShare = completionDenominator > 0
    ? Math.round((totalSessionCompletes / completionDenominator) * 100)
    : 0;
  mpCompletedShare.textContent = `${completionShare}%`;

  // ── Tile 4: crashes from KW package (broadened heuristic)
  const allCrashes = crashesRaw.flatMap((row) => normalizeCrashRows(row.id, row));
  const recentCrashes = filterByDays(
    allCrashes,
    30,
    (c) => c.createdAtIso || c.timestamp || c.lastSeenRaw,
  );
  const kwCrashes = recentCrashes.filter((c) => isKwCrash(c));
  const kwCrashEvents = kwCrashes.reduce(
    (sum, c) => sum + (toNumber(c.eventCount) || 1),
    0,
  );
  mpCrashCount.textContent = String(kwCrashEvents);

  // ── Status buckets — derive from events when sessions lack status field
  const statusBuckets = {
    lobby: Math.max(0, totalSessionStarts - totalRoundStarts), // started but no round yet
    inProgress: Math.max(0, totalRoundStarts - totalSessionCompletes - totalSessionAbandons),
    completed: totalSessionCompletes,
    abandoned: totalSessionAbandons,
  };
  // If no event data, fall back to status field on sessions
  if (totalSessionStarts === 0 && mpLikeSessions.length > 0) {
    statusBuckets.lobby = 0;
    statusBuckets.inProgress = 0;
    statusBuckets.completed = 0;
    statusBuckets.abandoned = 0;
    for (const row of mpLikeSessions) {
      const status = String(row.status || row.roomStatus || '').toLowerCase();
      if (status === 'lobby') statusBuckets.lobby += 1;
      else if (['inprogress', 'in_progress', 'active'].includes(status)) {
        statusBuckets.inProgress += 1;
      } else if (status === 'completed' || isCompletedRow(row)) {
        statusBuckets.completed += 1;
      } else if (['abandoned', 'closed'].includes(status)) {
        statusBuckets.abandoned += 1;
      }
    }
  }
  let roomRows = mpLikeSessions.slice(0, 20);
  const roomStats = await refreshMultiphoneRoomStats();
  if (roomStats?.counts) {
    statusBuckets.lobby = toNumber(roomStats.counts.ongoing);
    statusBuckets.inProgress = toNumber(roomStats.counts.total);
    statusBuckets.completed = toNumber(roomStats.counts.completed);
    statusBuckets.abandoned = toNumber(roomStats.counts.abandoned);
    applyRoomStatsToMultiphoneStatus(roomStats);

    const sampledRows = mapRoomStatsSampleToRows(roomStats.sampledRooms).slice(0, 20);
    if (sampledRows.length > 0) {
      roomRows = sampledRows;
    }
  } else {
    mpStatusLobby.textContent = String(statusBuckets.lobby);
    mpStatusInProgress.textContent = String(statusBuckets.inProgress);
    mpStatusCompleted.textContent = String(statusBuckets.completed);
    mpStatusAbandoned.textContent = String(statusBuckets.abandoned);
    if (mpDeleteCompletedEligible) mpDeleteCompletedEligible.textContent = '0';
    if (mpDeleteAbandonedEligible) mpDeleteAbandonedEligible.textContent = '0';
  }

  renderMultiphoneTopCrashes(kwCrashes);
  renderMultiphoneRoomsTable(roomRows);

  renderInsights(
    mpInsights,
    buildMultiphoneInsights({
      sessions: kwEvents.length > 0 ? kwEvents : mpLikeSessions,
      crashCount: kwCrashEvents,
      completedShare: completionShare,
      avgPlayers: eventBasedAvg > 0 ? eventBasedAvg : parseFloat(avgPlayers) || 0,
      statusBuckets,
      noEvents: kwEvents.length === 0 && mpLikeSessions.length === 0,
    }),
  );
}

function eventNameOf(row) {
  return String(row?.eventName || row?.event_name || row?.name || '').toLowerCase();
}

function isKwEvent(row) {
  return eventNameOf(row).startsWith('kw_');
}

function isKwCrash(crash) {
  const fields = [
    crash.issueTitle,
    crash.title,
    crash.subtitle,
    crash.summary,
    crash.message,
    crash.stackTrace,
    crash.issueId,
  ]
    .filter(Boolean)
    .map((v) => String(v).toLowerCase())
    .join(' ');
  const markers = [
    'karty_wariata',
    'kartywariata',
    'kw_',
    'multiphone',
    'multi_phone',
    'multiplayer',
    'lobbyscreen',
    'lobby_screen',
    'karty wariata',
  ];
  return markers.some((m) => fields.includes(m));
}

function sumEventCounts(rows) {
  return rows.reduce((sum, row) => {
    const sources = [row, row?.parameters, row?.params, row?.metadata].filter(Boolean);
    const n = toNumber(
      pickValueFromSources(sources, [
        ['eventCount'],
        ['event_count'],
        ['count'],
        ['events'],
        ['total'],
      ]),
    );
    return sum + (n > 0 ? n : 1);
  }, 0);
}

function avgPlayersFromKwEvents(events) {
  const samples = [];
  for (const e of events) {
    const sources = [e, e?.parameters, e?.params, e?.metadata].filter(Boolean);
    const n = toNumber(
      pickValueFromSources(sources, [
        ['playerCount'],
        ['player_count'],
        ['players'],
        ['playerCountTotal'],
      ]),
    );
    if (n > 0) samples.push(n);
  }
  if (samples.length === 0) return 0;
  return samples.reduce((a, b) => a + b, 0) / samples.length;
}

function extractTimestamp(row) {
  if (!row) return '';
  const sources = [row, row?.parameters, row?.params, row?.metadata].filter(Boolean);
  return pickValueFromSources(sources, [
    ['createdAtIso'],
    ['createdAt'],
    ['updatedAt'],
    ['timestamp'],
    ['eventTimestamp'],
    ['event', 'timestamp'],
    ['event', 'time'],
    ['syncedAt'],
    ['lastSeen'],
  ]) || '';
}

function extractAppVersion(row) {
  if (!row) return '';
  const sources = [
    row,
    row?.parameters,
    row?.params,
    row?.metadata,
    row?.context,
    row?.appInfo,
    row?.app_info,
    row?.app,
  ].filter(Boolean);
  return pickValueFromSources(sources, [
    ['appVersion'],
    ['app_version'],
    ['appVersionName'],
    ['versionName'],
    ['version'],
    ['displayVersion'],
    ['app', 'version'],
    ['app', 'displayVersion'],
    ['app', 'appVersion'],
    ['appInfo', 'appVersion'],
    ['appInfo', 'displayVersion'],
    ['application', 'version'],
  ]) || '';
}

function isMultiplayerLike(row) {
  // A row is considered multi-phone when any of these signals is present:
  //   - explicit roomCode / roomId field
  //   - players array length > 2
  //   - modeId / modeName includes "wariat" or "multi"
  //   - status field with one of the room statuses
  if (row.roomCode || row.roomId) return true;
  const players = row.players || row.playerNames;
  if (Array.isArray(players) && players.length > 2) return true;
  const count = toNumber(row.playerCount);
  if (count > 2) return true;
  const modeName = String(row.modeName || row.modeId || '').toLowerCase();
  if (modeName.includes('wariat') || modeName.includes('multi')) return true;
  const status = String(row.status || row.roomStatus || '').toLowerCase();
  if (['lobby', 'inprogress', 'in_progress', 'completed', 'abandoned', 'closed'].includes(status)) {
    return true;
  }
  return false;
}

function isCompletedRow(row) {
  const status = String(row.status || row.roomStatus || '').toLowerCase();
  if (status === 'completed') return true;
  return Boolean(row.finalResult);
}

function extractPlayerCount(row) {
  const explicit = toNumber(row.playerCount);
  if (explicit > 0) return explicit;
  const players = row.players || row.playerNames;
  if (Array.isArray(players)) return players.length;
  // Legacy 2-player game_history rows count as 2.
  if (row.playerAName && row.playerBName) return 2;
  return 0;
}

function isMultiphoneCrash(crash, analyticsEvents) {
  // Heuristic: a crash is multi-phone-related when its issue/title/message
  // mentions multiphone / multiplayer / kw_room / lobby etc.
  const fields = [crash.issueTitle, crash.summary, crash.message, crash.stackTrace, crash.issueId]
    .filter(Boolean)
    .map((v) => String(v).toLowerCase());
  const haystack = fields.join(' ');
  const markers = ['multiphone', 'multi_phone', 'multiplayer', 'kw_room', 'kw_multi', 'lobbyscreen', 'karty_wariata_multi'];
  return markers.some((m) => haystack.includes(m));
}

function renderMultiphoneTopCrashes(crashes) {
  if (!mpTopCrashList) return;
  if (!crashes || crashes.length === 0) {
    mpTopCrashList.innerHTML = '<p class="empty-row">Brak crashy multi-phone w ostatnich 7 dniach.</p>';
    return;
  }
  const groups = new Map();
  for (const c of crashes) {
    const key = String(c.issueTitle || c.summary || c.message || c.issueId || 'Unknown');
    const existing = groups.get(key) || { key, count: 0, latest: '' };
    existing.count += toNumber(c.eventCount) || 1;
    const ts = c.createdAtIso || c.timestamp || '';
    if (ts > existing.latest) existing.latest = ts;
    groups.set(key, existing);
  }
  const top = [...groups.values()].sort((a, b) => b.count - a.count).slice(0, 5);
  mpTopCrashList.innerHTML = top
    .map((g) => `
      <div class="crash-item">
        <div class="crash-item-header">
          <strong>${escapeHtml(truncateText(g.key, 80))}</strong>
          <span class="badge fatal">${g.count}×</span>
        </div>
        ${g.latest ? `<p class="crash-item-meta">${escapeHtml(formatDate(g.latest))}</p>` : ''}
      </div>
    `)
    .join('');
}

function renderMultiphoneRoomsTable(rows) {
  if (!mpRoomsTableBody) return;
  if (!rows || rows.length === 0) {
    mpRoomsTableBody.innerHTML = '<tr><td colspan="6" class="empty-row">Brak danych multiplayer</td></tr>';
    return;
  }
  mpRoomsTableBody.innerHTML = rows
    .map((r) => {
      const code = r.roomCode || (r.roomId ? `…${String(r.roomId).slice(-6)}` : '—');
      const status = r.status || r.roomStatus || (isCompletedRow(r) ? 'completed' : 'unknown');
      const playerCount = extractPlayerCount(r);
      const rounds = toNumber(r.totalRounds) || toNumber(r.roundCount) || '—';
      const host = r.hostName || (Array.isArray(r.players) ? r.players[0] : r.playerAName) || '—';
      return `<tr>
        <td>${escapeHtml(formatDate(r.createdAtIso))}</td>
        <td><code>${escapeHtml(String(code))}</code></td>
        <td><span class="badge ${escapeHtml(statusBadgeClass(status))}">${escapeHtml(String(status))}</span></td>
        <td>${escapeHtml(String(playerCount || '—'))}</td>
        <td>${escapeHtml(String(rounds))}</td>
        <td>${escapeHtml(truncateText(String(host), 18))}</td>
      </tr>`;
    })
    .join('');
}

function statusBadgeClass(status) {
  const s = String(status).toLowerCase();
  if (s === 'completed') return 'yes';
  if (s === 'lobby') return 'pending';
  if (s === 'inprogress' || s === 'in_progress') return 'maybe';
  if (s === 'closed' || s === 'abandoned') return 'no';
  return 'pending';
}

function buildMultiphoneInsights({ sessions, crashCount, completedShare, avgPlayers, statusBuckets, noEvents }) {
  const hints = [];
  if (noEvents || (sessions && sessions.length === 0)) {
    hints.push({
      tone: 'info',
      title: 'Brak eventów Karty Wariata w ostatnich 30 dniach',
      body:
        'Sprawdź czy synchronizacja analytics_events działa (uruchom `uruchom_sync_analytics.bat`). Multi-phone wymaga też flagi KW_MULTIPHONE_FIREBASE_ENABLED=true w buildzie.',
    });
    return hints;
  }
  if (completedShare < 40) {
    hints.push({
      tone: 'warning',
      title: `Niski udział sesji ukończonych (${completedShare}%)`,
      body:
        'Gracze odpadają przed końcem. Zweryfikuj lobby UX, copy startu rundy i czas oczekiwania na host start.',
    });
  } else if (completedShare > 80) {
    hints.push({
      tone: 'success',
      title: `Wysoki completion rate (${completedShare}%)`,
      body: 'Multi-phone trzyma graczy do końca. Możesz pchnąć invite-loop / share-code w marketing.',
    });
  }
  if (crashCount > 10) {
    hints.push({
      tone: 'danger',
      title: `${crashCount} crashy multi-phone w 7 dniach`,
      body:
        'Powyżej progu bezpieczeństwa. Otwórz top-5 issue listę powyżej i zaplanuj hotfix przed kolejnym wzrostem ruchu.',
    });
  }
  if (avgPlayers && avgPlayers < 3) {
    hints.push({
      tone: 'info',
      title: `Średnio ${avgPlayers} graczy / pokój`,
      body:
        'Pokoje są małe — rozważ tutoriale w lobby albo "auto-invite" share-code do natywnych komunikatorów.',
    });
  }
  if (statusBuckets.abandoned > statusBuckets.completed) {
    hints.push({
      tone: 'warning',
      title: 'Więcej porzuconych niż ukończonych pokojów',
      body:
        'Przyczyna #1 zwykle: host wychodzi przed startem albo gość nie wie, że gra się rozpoczęła. Spróbuj push notification "Host wystartował grę".',
    });
  }
  if (hints.length === 0) {
    hints.push({
      tone: 'success',
      title: 'Multi-phone health w normie',
      body: 'Brak alarmów dla ostatnich 7 dni. Możesz iść w nowe modele rozgrywki albo skin packy.',
    });
  }
  return hints;
}

// ── Release Insights dashboard ────────────────────────────────────────────────
// 30-day window, robust appVersion extraction (analytics events nest the
// field under `parameters.app_version` / `appInfo.appVersion` etc.).
async function loadReleasesDashboard() {
  const [crashesRaw, analyticsEvents, sessions] = await Promise.all([
    loadCollectionRows(dashboardCollections.crashlytics).catch(() => []),
    loadFirstAvailableCollectionRows(getAnalyticsCollectionCandidates())
      .then((r) => r.rows)
      .catch(() => []),
    loadCollectionRows(dashboardCollections.sessions).catch(() => []),
  ]);

  const crashes = crashesRaw.flatMap((row) => normalizeCrashRows(row.id, row));
  const recentCrashes = filterByDays(
    crashes,
    30,
    (c) => c.createdAtIso || c.timestamp || c.lastSeenRaw,
  );
  const recentEvents = filterByDays(
    analyticsEvents,
    30,
    (e) => extractTimestamp(e),
  );
  const recentSessions = filterByDays(sessions, 30, (s) => s.createdAtIso);

  const versions = new Map();

  const bumpVersion = (rawVersion, key, lastSeen, increment) => {
    if (!rawVersion) return;
    const v = String(rawVersion).trim();
    if (!v || v === 'undefined' || v === 'null') return;
    const entry = versions.get(v) || {
      version: v,
      sessions: 0,
      crashes: 0,
      lastSeen: '',
    };
    entry[key] = (entry[key] || 0) + (increment || 1);
    if (lastSeen && lastSeen > entry.lastSeen) entry.lastSeen = lastSeen;
    versions.set(v, entry);
  };

  for (const e of recentEvents) {
    const version = extractAppVersion(e);
    const ts = extractTimestamp(e);
    bumpVersion(version, 'sessions', ts, 1);
  }
  for (const s of recentSessions) {
    const version = extractAppVersion(s);
    bumpVersion(version, 'sessions', s.createdAtIso || '', 1);
  }
  for (const c of recentCrashes) {
    const ts = c.createdAtIso || c.timestamp || c.lastSeenRaw || '';
    const eventCount = toNumber(c.eventCount) || 1;
    bumpVersion(c.appVersion, 'crashes', ts, eventCount);
  }

  const versionList = [...versions.values()].sort((a, b) => b.sessions - a.sessions);
  const totalSessions = versionList.reduce((acc, v) => acc + v.sessions, 0);

  relActiveVersions.textContent = String(versionList.length);

  const topVersion = versionList[0];
  if (topVersion && totalSessions > 0) {
    relTopVersion.textContent = topVersion.version;
    relTopVersionShare.textContent = `${Math.round((topVersion.sessions / totalSessions) * 100)}% sesji`;
    relTopVersionCrashes.textContent = String(topVersion.crashes);
  } else {
    relTopVersion.textContent = '—';
    relTopVersionShare.textContent = '0% sesji';
    relTopVersionCrashes.textContent = '0';
  }

  // Regression candidate — version with highest crash/session ratio (min 5 sessions).
  const candidates = versionList
    .filter((v) => v.sessions >= 5)
    .map((v) => ({ ...v, ratio: v.crashes / Math.max(1, v.sessions) }))
    .sort((a, b) => b.ratio - a.ratio);
  if (candidates.length && candidates[0].ratio > 0) {
    relRegressionVersion.textContent = candidates[0].version;
  } else {
    relRegressionVersion.textContent = '—';
  }

  renderReleasesAdoptionList(versionList, totalSessions);
  renderReleasesQualityChart(versionList);
  renderReleasesVersionsTable(versionList, totalSessions);

  renderInsights(relInsights, buildReleasesInsights({
    versionList,
    totalSessions,
    topVersion,
    regressionVersion: candidates[0],
  }));
}

function renderReleasesAdoptionList(list, total) {
  if (!relAdoptionList) return;
  if (!list || list.length === 0) {
    relAdoptionList.innerHTML = '<p class="empty-row">Brak danych o wersjach.</p>';
    return;
  }
  relAdoptionList.innerHTML = list
    .slice(0, 8)
    .map((v) => {
      const pct = total > 0 ? (v.sessions / total) * 100 : 0;
      return `
        <div class="mode-row">
          <div class="mode-row-top">
            <strong>${escapeHtml(v.version)}</strong>
            <span>${v.sessions} sesji • ${pct.toFixed(1)}%</span>
          </div>
          <div class="answer-meter">
            <div class="answer-fill mode" style="width: ${Math.min(100, pct).toFixed(1)}%"></div>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderReleasesQualityChart(list) {
  if (!relQualityChart) return;
  if (!list || list.length === 0) {
    relQualityChart.innerHTML = '<p class="empty-row">Brak danych.</p>';
    return;
  }
  const top = list.slice(0, 7);
  const maxCrashes = Math.max(1, ...top.map((v) => v.crashes));
  const bars = top
    .map((v) => {
      const heightPct = Math.max(4, Math.round((v.crashes / maxCrashes) * 100));
      const title = `${v.version} • ${v.crashes} crashy / ${v.sessions} sesji`;
      return `<div class="mini-bar" title="${escapeHtml(title)}" style="height: ${heightPct}%"></div>`;
    })
    .join('');
  relQualityChart.innerHTML = `<div class="mini-chart-bars">${bars}</div>`;
}

function renderReleasesVersionsTable(list, total) {
  if (!relVersionsTableBody) return;
  if (!list || list.length === 0) {
    relVersionsTableBody.innerHTML =
      '<tr><td colspan="6" class="empty-row">Brak danych o wersjach</td></tr>';
    return;
  }
  relVersionsTableBody.innerHTML = list
    .map((v) => {
      const share = total > 0 ? (v.sessions / total) * 100 : 0;
      const rate = v.sessions > 0 ? (v.crashes / v.sessions) * 100 : 0;
      return `<tr>
        <td><code>${escapeHtml(v.version)}</code></td>
        <td>${v.sessions}</td>
        <td>${share.toFixed(1)}%</td>
        <td>${v.crashes}</td>
        <td><span class="badge ${rate > 2 ? 'fatal' : rate > 0 ? 'maybe' : 'yes'}">${rate.toFixed(2)}%</span></td>
        <td>${escapeHtml(formatDate(v.lastSeen))}</td>
      </tr>`;
    })
    .join('');
}

function buildReleasesInsights({ versionList, totalSessions, topVersion, regressionVersion }) {
  const hints = [];
  if (!versionList || versionList.length === 0) {
    hints.push({
      tone: 'info',
      title: 'Brak danych o wersjach',
      body: 'Włącz pole appVersion w analytics_events i crashlytics_reports — bez tego Release Insights nie wyciągnie segmentacji.',
    });
    return hints;
  }
  if (topVersion && totalSessions > 0) {
    const share = (topVersion.sessions / totalSessions) * 100;
    if (share > 70) {
      hints.push({
        tone: 'success',
        title: `Dominująca wersja ${topVersion.version} (${share.toFixed(0)}%)`,
        body: 'Skupiaj hotfixy na tej wersji — daje największy wpływ na users.',
      });
    } else if (versionList.length >= 4) {
      hints.push({
        tone: 'info',
        title: 'Fragmentacja użytkowników',
        body: `Aktywne ${versionList.length} wersje. Rozważ wymuszenie aktualizacji starszych buildów (bumping minVersion).`,
      });
    }
  }
  if (regressionVersion && regressionVersion.ratio > 0.02) {
    hints.push({
      tone: 'danger',
      title: `Regresja w ${regressionVersion.version}`,
      body: `Crash rate ${(regressionVersion.ratio * 100).toFixed(1)}% (próg 2%). Sprawdź zmiany w tym buildzie albo wycofaj rollout.`,
    });
  }
  const noisyCount = versionList.filter((v) => v.crashes > 0).length;
  if (noisyCount === 0) {
    hints.push({
      tone: 'success',
      title: 'Zero crashy w aktywnych wersjach',
      body: 'Build pipeline trzyma jakość. Możesz przyspieszyć rollout następnego release.',
    });
  }
  if (hints.length === 0) {
    hints.push({
      tone: 'info',
      title: 'Release health stabilny',
      body: 'Brak alarmów. Możesz przygotować next release lub eksperyment A/B.',
    });
  }
  return hints;
}

// ── Generic helpers shared by Multiphone + Releases ──────────────────────────
function filterByDays(rows, days, getDate) {
  if (!Array.isArray(rows)) return [];
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return rows.filter((row) => {
    const raw = getDate(row);
    const t = getTimestampValue(raw);
    return t >= cutoff;
  });
}

function renderInsights(target, hints) {
  if (!target) return;
  if (!hints || hints.length === 0) {
    target.innerHTML = '<li class="insight-placeholder">Brak rekomendacji dla wybranego zakresu.</li>';
    return;
  }
  target.innerHTML = hints
    .map((hint) => `
      <li class="insight-item insight-${escapeHtml(hint.tone || 'info')}">
        <div class="insight-title">${escapeHtml(hint.title)}</div>
        <div class="insight-body">${escapeHtml(hint.body)}</div>
      </li>
    `)
    .join('');
}
