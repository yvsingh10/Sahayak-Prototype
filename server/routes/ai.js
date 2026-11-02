import express from 'express';
import {
  estimatePotholeDimensions,
  scoreSolidWasteDensity,
  checkImageQuality,
  checkDuplicateOrFraud,
  transcribeVoiceAudio,
  applyPrivacyMask,
  extractVideoKeyframes,
  detectFireOrSmoke,
  enhanceNightVision,
  analyzeStreetlightIlluminance
} from '../services/aiService.js';
import { readTickets } from '../services/dataStore.js';

const router = express.Router();

// Feature 121: YOLOv8 Pothole Depth Estimation
router.post('/pothole-depth', (req, res) => {
  const { title = '', description = '', category = 'Roads & Infrastructure' } = req.body;
  const result = estimatePotholeDimensions(category, title, description);
  res.json({ success: true, analysis: result });
});

// Feature 122: Solid Waste Density Scorer
router.post('/waste-density', (req, res) => {
  const { title = '', description = '' } = req.body;
  const result = scoreSolidWasteDensity(title, description);
  res.json({ success: true, analysis: result });
});

// Feature 123: Blurry & Dark Image Auto-Rejection
router.post('/check-quality', (req, res) => {
  const { imageBase64 } = req.body;
  const result = checkImageQuality(imageBase64);
  res.json({ success: true, quality: result });
});

// Feature 124: Duplicate & Stock Photo Fraud Guard
router.post('/fraud-guard', (req, res) => {
  const { photoUrl, lat, lng } = req.body;
  const tickets = readTickets();
  const result = checkDuplicateOrFraud(photoUrl, tickets, lat, lng);
  res.json({ success: true, fraudCheck: result });
});

// Feature 125: Whisper AI Voice Transcriber (Hindi, Bhojpuri, Punjabi, English)
router.post('/transcribe-voice', (req, res) => {
  const { audioBase64, language = 'hi' } = req.body;
  const result = transcribeVoiceAudio(audioBase64, language);
  res.json({ success: true, transcription: result });
});

// Feature 126: Automated Face & License Plate Privacy Mask
router.post('/privacy-mask', (req, res) => {
  const { photoUrl } = req.body;
  const result = applyPrivacyMask(photoUrl);
  res.json({ success: true, privacy: result });
});

// Feature 127: 10-Second Video Keyframe Extractor
router.post('/video-keyframes', (req, res) => {
  const { videoUrl } = req.body;
  const result = extractVideoKeyframes(videoUrl);
  res.json({ success: true, keyframes: result });
});

// Feature 128: Thermal / Smoke / Open Fire AI Detector
router.post('/detect-fire', (req, res) => {
  const { title = '', description = '' } = req.body;
  const result = detectFireOrSmoke(title, description);
  res.json({ success: true, fireDetection: result });
});

// Feature 129: Night-Vision Low-Light Auto Enhancement
router.post('/enhance-night', (req, res) => {
  const { photoUrl } = req.body;
  const result = enhanceNightVision(photoUrl);
  res.json({ success: true, enhancement: result });
});

// Feature 130: Streetlight Glare & Illuminance Analyzer
router.post('/streetlight-illuminance', (req, res) => {
  const { title = '', description = '' } = req.body;
  const result = analyzeStreetlightIlluminance(title, description);
  res.json({ success: true, illuminance: result });
});

export default router;

