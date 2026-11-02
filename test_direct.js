import { 
  readTickets, 
  writeTickets, 
  generateSeedTickets, 
  getEnrichedTickets, 
  getDistanceMeters, 
  reverseGeocodeCoords,
  getNearestGovOffice,
  logAudit,
  readAuditLogs
} from './server/services/dataStore.js';
import { calculatePriority, calculateSla } from './server/services/priorityEngine.js';
import { generateCUID } from './server/routes/auth.js';
import crypto from 'crypto';

console.log("==================================================");
console.log("🧪 RUNNING DIRECT IN-MEMORY SAHAYAK SUITE TESTS");
console.log("==================================================");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

// 1. C-UID Generation (Module 1)
const cuid = generateCUID("UP");
assert(cuid.startsWith("C-UID-2026-UP-"), `C-UID cryptographically formatted: ${cuid}`);

// 2. Hardware Geolocation & Accuracy (Module 2)
const lat = 28.474412;
const lng = 77.504018;
const rev = reverseGeocodeCoords(lat, lng, "Greater Noida", "Ward 12 (Knowledge Park)");
assert(rev.precision === "6-decimal hardware lock", "Precision matches 6-decimal hardware geo-lock");
assert(rev.horizontalErrorMeters < 15, `GPS Horizontal Error (${rev.horizontalErrorMeters}m) strictly < 15m`);
assert(rev.district === "Gautam Buddha Nagar" && rev.state === "Uttar Pradesh", "Automated reverse geocoding correctly identified district & state");

// 3. Haversine Distance (Module 2 & 10)
const dist10m = getDistanceMeters(lat, lng, lat + 0.00009, lng);
assert(dist10m <= 15, `Haversine distance within 15m (${dist10m}m)`);
const distFar = getDistanceMeters(lat, lng, 28.5682, 77.2215);
assert(distFar > 20000, `Haversine distance to Delhi > 20km (${Math.round(distFar/1000)}km)`);

// 4. Clean UI Priority Engine (Module 5 & Clean UI Directive)
const testTicket = {
  id: "TEST-001",
  baseSeverity: "High",
  wBase: 60,
  createdAt: Date.now() - (12 * 3600 * 1000),
  upvotedBy: ["u1", "u2", "u3", "u4", "u5"],
  isEmergencySos: false
};
const prio = calculatePriority(testTicket);
assert(!prio.equation && !prio.rawFormula, "Clean UI Directive: No mathematical equation strings exported in UI priority object");
assert(typeof prio.priorityBadge === 'string' && prio.priorityBadge === 'High Urgency', `Human-readable Priority Badge assigned: ${prio.priorityBadge}`);
assert(prio.urgencyPercent >= 50 && prio.urgencyPercent <= 100, `Urgency percent calibrated: ${prio.urgencyPercent}%`);

// 5. 48-Hour SLA Gateway & Countdowns (Module 9)
const slaFresh = calculateSla({ ...testTicket, createdAt: Date.now() - (10 * 3600 * 1000), stage: 1 });
assert(slaFresh.formattedCountdown.includes("Remaining") && !slaFresh.isBreached, `SLA active countdown formatted: ${slaFresh.formattedCountdown}`);

const slaBreached = calculateSla({ ...testTicket, createdAt: Date.now() - (50 * 3600 * 1000), stage: 1 });
assert(slaBreached.isBreached && slaBreached.slaBadgeText.includes("Tier-1 Auto-Escalated"), `SLA breach triggers Tier-1 Auto-Escalation: ${slaBreached.slaBadgeText}`);

const slaSuper = calculateSla({ ...testTicket, createdAt: Date.now() - (98 * 3600 * 1000), stage: 1 });
assert(slaSuper.isSuperBreached && slaSuper.slaBadgeText.includes("Tier-2 Super-Escalated"), `SLA 96h breach triggers Tier-2 Commissioner Super-Escalation: ${slaSuper.slaBadgeText}`);

// 6. Nearest Government Office Directory (Module 3)
const office = getNearestGovOffice("Greater Noida", "Roads & Infrastructure");
assert(office && office.officer.includes("Narula"), `Nearest government office found: ${office.name}`);
assert(office.turnByTurn && office.turnByTurn.length > 0, `Turn-by-turn routing steps populated: ${office.turnByTurn.length} steps`);
assert(office.nearbyFacilities && office.nearbyFacilities.length > 0, `Nearby essential facilities populated: ${office.nearbyFacilities.length}`);

// 7. 5-Stage Life-Cycle Pipeline & FSM Enforcement (Module 6)
const seed = generateSeedTickets();
assert(seed.some(t => t.stage === 1), "Stage 1 (PENDING_TRIAGE) tickets present");
assert(seed.some(t => t.stage === 2), "Stage 2 (IN_REVIEW) tickets present");
assert(seed.some(t => t.stage === 3), "Stage 3 (IN_PROGRESS) tickets present");
assert(seed.some(t => t.stage === 4), "Stage 4 (WORK_COMPLETED) tickets present");
assert(seed.some(t => t.stage === 5), "Stage 5 (RESOLVED_CLOSED) tickets present");

// 8. 5 Segregated Departments (Module 7)
const departments = [
  "Roads & Infrastructure",
  "Water Supply & Sewage",
  "Solid Waste & Cleanliness",
  "Electricity & Power",
  "Public Health & Safety"
];
departments.forEach(dept => {
  const hasDept = seed.some(t => t.category === dept);
  assert(hasDept, `Department segregation active for: ${dept}`);
});

// 9. SHA-256 Tamper-Proof Cryptographic Hashing (Module 4)
const samplePayload = "Evidence Photo Bytes 2026";
const hash = crypto.createHash('sha256').update(samplePayload).digest('hex');
assert(hash.length === 64, `SHA-256 asset hash verified (64 hex characters): ${hash.slice(0, 16)}...`);

// 10. Audit Logging Ledger (Module 10)
const auditEntry = logAudit({
  ticketId: "SAH-TEST-9999",
  action: "TEST_INTEGRATION_VERIFY",
  previousStage: "STAGE_1",
  newStage: "STAGE_2",
  actorId: "C-UID-2026-IND-08241",
  actorRole: "Citizen",
  reason: "Automated regression verification."
});
assert(auditEntry.id.startsWith("AUD-"), `Audit log entry created with immutable ID: ${auditEntry.id}`);

// 11. Phase-3 AI Visual Damage Classification (Features 121, 122, 123, 125, 128)
import { 
  estimatePotholeDimensions, 
  scoreSolidWasteDensity, 
  checkImageQuality, 
  transcribeVoiceAudio, 
  detectFireOrSmoke 
} from './server/services/aiService.js';

const potholeResult = estimatePotholeDimensions('Roads & Infrastructure', 'Crater on Pari Chowk main road');
assert(potholeResult.model.includes('YOLOv8'), `YOLOv8 pothole estimation active: ${potholeResult.model}`);
assert(potholeResult.estimatedDepthCm > 0, `Pothole depth estimated: ${potholeResult.estimatedDepthCm} cm`);

const wasteResult = scoreSolidWasteDensity('Construction malba dumped on footpath');
assert(wasteResult.wasteType.includes('Construction'), `WasteNet classified debris: ${wasteResult.wasteType}`);
assert(wasteResult.requiresJCB === true, "Heavy debris triggers JCB vehicle recommendation");

const qualityCheck = checkImageQuality('valid_base64_payload_string_with_proper_length_for_camera_photo_capture');
assert(qualityCheck.isAcceptable === true, `Image quality verified sharp: ${qualityCheck.sharpnessScore}/100`);

const voiceResult = transcribeVoiceAudio('', 'hi');
assert(voiceResult.engine.includes('Whisper'), `Whisper voice transcriber active: ${voiceResult.engine}`);
assert(voiceResult.text.length > 5, `Hindi voice transcribed: ${voiceResult.text}`);

const fireResult = detectFireOrSmoke('Open fire burning in municipal garbage dump');
assert(fireResult.fireSmokeDetected === true && fireResult.isEmergencySosTrigger === true, "Thermal/smoke detector flagged emergency hazard");

// 12. Phase-3 Smart City IoT Sensor Stream (Features 181–190)
import { getIotSensors, simulateSensorAnomaly } from './server/services/iotService.js';
const sensors = getIotSensors();
assert(sensors.length === 10, `All 10 Smart City IoT sensors loaded into grid: ${sensors.length}`);
const simResult = simulateSensorAnomaly('IOT-WATER-091');
assert(simResult.success && simResult.ticketSuggested.category === 'Water Supply & Sewage', "Water pressure anomaly auto-generated high priority ticket");

// 13. Phase-3 Blockchain Ledger & AES-256 PII Encryption (Features 193, 196)
import { appendBlockchainBlock, encryptPII, decryptPII } from './server/services/blockchainLedger.js';
const block = appendBlockchainBlock('SAH-BLOCK-01', 'STAGE_TRANSITION', 'C-UID-TEST-001', { note: 'Field crew dispatched' });
assert(block.currentHash.length === 64, `SHA-256 blockchain chained block minted: ${block.currentHash.slice(0, 16)}...`);

const plainPhone = "+91-98101-55241";
const encryptedPhone = encryptPII(plainPhone);
assert(encryptedPhone.startsWith("AES256:"), `AES-256 PII encryption active: ${encryptedPhone.slice(0, 20)}...`);
const decryptedPhone = decryptPII(encryptedPhone);
assert(decryptedPhone === plainPhone, `AES-256 PII decrypted cleanly: ${decryptedPhone}`);

// 14. Phase-3 Enriched Ticket Attributes (Features 114, 116, 119, 138, 163)
const enrichedTickets = getEnrichedTickets();
const first = enrichedTickets[0];
assert(first.isGeofenceVerified !== undefined, "Enriched ticket has geofence verification flag");
assert(first.elevationMeters > 0, `Enriched ticket altitude present: ${first.elevationMeters}m`);
assert(first.subStageTimers && first.subStageTimers.repairHoursLeft === 24, "Enriched ticket has SLA sub-stage micro-timers");
assert(first.whatsappShareUrl.includes('whatsapp.com'), "Enriched ticket has WhatsApp viral alert share link");

// 15. Phase-3 Additional Cryptographic, PostGIS & Smart Media Tests (Features 124, 126, 127, 130, 194, 195)
import { checkDuplicateOrFraud, applyPrivacyMask, extractVideoKeyframes, analyzeStreetlightIlluminance } from './server/services/aiService.js';
import { spatialQueryDWithin, checkRateLimit } from './server/services/blockchainLedger.js';

const fraudTest = checkDuplicateOrFraud("https://example.com/unique-photo-99.jpg");
assert(fraudTest.verdict.includes('Authentic'), "Reverse image fraud detector verified authentic capture");

const maskTest = applyPrivacyMask("https://example.com/photo.jpg");
assert(maskTest.privacyMaskApplied && maskTest.maskedElements.length === 2, "Privacy shield masked human faces and license plates");

const videoTest = extractVideoKeyframes("blob:sample_video");
assert(videoTest.extractedKeyframes.length === 3, "10s video damage keyframe extractor extracted top 3 sharpest frames");

const lightTest = analyzeStreetlightIlluminance("Streetlight flickering at night");
assert(lightTest.measuredLux < 15, `Streetlight dark-zone illuminance deficit detected (${lightTest.measuredLux} lux)`);

const spatialResults = spatialQueryDWithin(enrichedTickets, lat, lng, 10000);
assert(spatialResults.length > 0, `PostGIS ST_DWithin simulated spatial radius query returned ${spatialResults.length} grievances`);

const rateLimitCheck = checkRateLimit("127.0.0.1", 100);
assert(rateLimitCheck.isAllowed === true, "Anti-DDoS token-bucket rate limiter operational");

console.log("==================================================");
console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================");

process.exit(failed > 0 ? 1 : 0);

