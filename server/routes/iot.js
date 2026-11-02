import express from 'express';
import { getIotSensors, simulateSensorAnomaly } from '../services/iotService.js';
import { readTickets, writeTickets, logAudit } from '../services/dataStore.js';
import { appendBlockchainBlock } from '../services/blockchainLedger.js';

const router = express.Router();

// GET /api/iot/sensors - Fetch real-time IoT sensors telemetry
router.get('/sensors', (req, res) => {
  const { city } = req.query;
  const sensors = getIotSensors(city);
  res.json({
    success: true,
    count: sensors.length,
    activeGridSensors: sensors,
    networkStatus: 'Operational (MQTT / CoAP Bridge Active)'
  });
});

// POST /api/iot/trigger - Trigger simulated anomaly and auto-dispatch municipal ticket
router.post('/trigger', (req, res) => {
  try {
    const { sensorId } = req.body;
    const sim = simulateSensorAnomaly(sensorId || "IOT-WATER-091");

    if (!sim) {
      return res.status(404).json({ success: false, error: "Sensor not found in grid." });
    }

    const { ticketSuggested } = sim;
    const tickets = readTickets();
    const newId = `SAH-IOT-${Date.now().toString().slice(-4)}`;

    const newTicket = {
      id: newId,
      ...ticketSuggested,
      stage: 1,
      stageKey: "PENDING_TRIAGE",
      status: "PENDING_TRIAGE",
      complainant: "Municipal Smart City IoT Telemetry Gateway",
      complainantCuid: "C-UID-IOT-GATEWAY-2026",
      complainantPhone: "+91-120-2340000",
      isEmergencySos: ticketSuggested.isEmergencySos,
      createdAt: Date.now(),
      upvotedBy: ["C-UID-2026-IND-08241", "C-UID-IOT-AUTO-NODE"],
      photoUrl: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=700&q=80",
      iotSensorOrigin: sim.sensor.id
    };

    tickets.unshift(newTicket);
    writeTickets(tickets);

    // Immutable blockchain log
    appendBlockchainBlock(newId, "IOT_AUTO_ALARM_DISPATCH", sim.sensor.id, {
      sensorType: sim.sensor.type,
      reading: sim.sensor.currentValue,
      threshold: sim.sensor.threshold
    });

    logAudit({
      ticketId: newId,
      action: "IOT_TELEMETRY_ALARM",
      previousStage: "GRID_NORMAL",
      newStage: "PENDING_TRIAGE",
      actorId: sim.sensor.id,
      actorRole: "Smart City IoT Daemon",
      reason: `Automated anomaly trigger: ${sim.sensor.alertTitle}`
    });

    res.json({
      success: true,
      message: `Sensor anomaly registered! Automated high-priority grievance #${newId} dispatched.`,
      ticket: newTicket,
      sensor: sim.sensor
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

