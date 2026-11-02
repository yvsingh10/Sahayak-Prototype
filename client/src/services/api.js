const BASE_URL = '/api';

export const api = {
  async getTickets(params = {}) {
    const query = new URLSearchParams();
    if (params.city && params.city !== 'All') query.append('city', params.city);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.stage && params.stage !== 'All') query.append('stage', params.stage);
    if (params.search) query.append('search', params.search);
    if (params.sort) query.append('sort', params.sort);

    const res = await fetch(`${BASE_URL}/tickets?${query.toString()}`);
    return res.json();
  },

  async getTicketById(id) {
    const res = await fetch(`${BASE_URL}/tickets/${id}`);
    return res.json();
  },

  async createTicket(payload) {
    const res = await fetch(`${BASE_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async upvoteTicket(id, user) {
    const res = await fetch(`${BASE_URL}/tickets/${id}/upvote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?.cuid || user?.id, userName: user?.name })
    });
    return res.json();
  },

  async updateStage(id, payload) {
    const res = await fetch(`${BASE_URL}/tickets/${id}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async forwardDepartment(id, payload) {
    const res = await fetch(`${BASE_URL}/tickets/${id}/forward`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async uploadProof(id, payload) {
    const res = await fetch(`${BASE_URL}/tickets/${id}/proof`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async confirmClosure(id, payload) {
    const res = await fetch(`${BASE_URL}/tickets/${id}/confirm-closure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async disputeQuality(id, payload) {
    const res = await fetch(`${BASE_URL}/tickets/${id}/dispute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async addComment(id, payload) {
    const res = await fetch(`${BASE_URL}/tickets/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async addInternalNote(id, payload) {
    const res = await fetch(`${BASE_URL}/tickets/${id}/internal-notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async resetDatabase() {
    const res = await fetch(`${BASE_URL}/tickets/reset`, {
      method: 'POST'
    });
    return res.json();
  },

  async getStats(city) {
    const query = city && city !== 'All' ? `?city=${encodeURIComponent(city)}` : '';
    const res = await fetch(`${BASE_URL}/stats/overview${query}`);
    return res.json();
  },

  async getPenalties() {
    const res = await fetch(`${BASE_URL}/stats/penalties`);
    return res.json();
  },

  async getSystemHealth() {
    const res = await fetch(`${BASE_URL}/stats/health`);
    return res.json();
  },

  async getAccounts() {
    const res = await fetch(`${BASE_URL}/auth/accounts`);
    return res.json();
  },

  async sendOtp(payload) {
    const res = await fetch(`${BASE_URL}/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async registerCitizen(payload) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async updateProfile(payload) {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // ── PHASE-3: PUBLIC JAN KHATA (101–110)
  async sendJanKhataOtp(phone) {
    const res = await fetch(`${BASE_URL}/auth/jan-khata/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    return res.json();
  },

  async verifyJanKhataOtp(phone, otp) {
    const res = await fetch(`${BASE_URL}/auth/jan-khata/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp })
    });
    return res.json();
  },

  async pullDigiLocker(aadhaarSuffix) {
    const res = await fetch(`${BASE_URL}/auth/jan-khata/digilocker-pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aadhaarSuffix })
    });
    return res.json();
  },

  async registerJanKhata(payload) {
    const res = await fetch(`${BASE_URL}/auth/jan-khata/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async addFamilyMember(cuid, memberName, relation) {
    const res = await fetch(`${BASE_URL}/auth/jan-khata/family-members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cuid, memberName, relation })
    });
    return res.json();
  },

  async escalateGuest(payload) {
    const res = await fetch(`${BASE_URL}/auth/jan-khata/escalate-guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getSessions(cuid) {
    const res = await fetch(`${BASE_URL}/auth/sessions/${cuid}`);
    return res.json();
  },

  async revokeSession(sessionId) {
    const res = await fetch(`${BASE_URL}/auth/sessions/revoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    return res.json();
  },

  async getCitizenLedger(cuid) {
    const res = await fetch(`${BASE_URL}/auth/citizen-ledger/${cuid}`);
    return res.json();
  },

  async dpdpScrub(cuid) {
    const res = await fetch(`${BASE_URL}/auth/dpdp-scrub`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cuid })
    });
    return res.json();
  },

  // ── PHASE-3: AI DAMAGE CLASSIFIER & SMART MEDIA (121–130)
  async aiPotholeDepth(payload) {
    const res = await fetch(`${BASE_URL}/ai/pothole-depth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async aiWasteDensity(payload) {
    const res = await fetch(`${BASE_URL}/ai/waste-density`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async aiCheckQuality(payload) {
    const res = await fetch(`${BASE_URL}/ai/check-quality`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async aiTranscribeVoice(payload) {
    const res = await fetch(`${BASE_URL}/ai/transcribe-voice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async aiPrivacyMask(payload) {
    const res = await fetch(`${BASE_URL}/ai/privacy-mask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async aiVideoKeyframes(payload) {
    const res = await fetch(`${BASE_URL}/ai/video-keyframes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async aiDetectFire(payload) {
    const res = await fetch(`${BASE_URL}/ai/detect-fire`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async aiEnhanceNight(payload) {
    const res = await fetch(`${BASE_URL}/ai/enhance-night`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async aiStreetlight(payload) {
    const res = await fetch(`${BASE_URL}/ai/streetlight-illuminance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // ── PHASE-3: SMART CITY IOT SENSORS (181–190)
  async getIotSensors(city) {
    const query = city && city !== 'All' ? `?city=${encodeURIComponent(city)}` : '';
    const res = await fetch(`${BASE_URL}/iot/sensors${query}`);
    return res.json();
  },

  async triggerIotAnomaly(sensorId) {
    const res = await fetch(`${BASE_URL}/iot/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sensorId })
    });
    return res.json();
  },

  // ── PHASE-3: WORK ORDER, OVERRIDE, CORROBORATION, ENDORSEMENT
  async getWorkOrder(id) {
    const res = await fetch(`${BASE_URL}/tickets/${id}/work-order`);
    return res.json();
  },

  async getClosureOtp(id) {
    const res = await fetch(`${BASE_URL}/tickets/${id}/closure-otp`);
    return res.json();
  },

  async crossDispatch(id, payload) {
    const res = await fetch(`${BASE_URL}/tickets/${id}/cross-dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async dmOverride(id, payload) {
    const res = await fetch(`${BASE_URL}/tickets/${id}/dm-override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async corroborateTicket(id, payload) {
    const res = await fetch(`${BASE_URL}/tickets/${id}/corroborate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async endorseTicket(id, payload) {
    const res = await fetch(`${BASE_URL}/tickets/${id}/endorse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getPenaltyMemo(id) {
    const res = await fetch(`${BASE_URL}/tickets/${id}/penalty-memo`);
    return res.json();
  },

  async justifyExtension(id, payload) {
    const res = await fetch(`${BASE_URL}/tickets/${id}/justify-extension`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getContractors() {
    const res = await fetch(`${BASE_URL}/stats/contractors`);
    return res.json();
  },

  async getSatisfactionIndex() {
    const res = await fetch(`${BASE_URL}/stats/satisfaction`);
    return res.json();
  },

  async getWeeklyRanking() {
    const res = await fetch(`${BASE_URL}/stats/weekly-ranking`);
    return res.json();
  },

  async getEvaluationReport() {
    const res = await fetch(`${BASE_URL}/stats/evaluation-report`);
    return res.json();
  },

  async runTestSuite() {
    const res = await fetch(`${BASE_URL}/stats/run-tests`);
    return res.json();
  }
};
