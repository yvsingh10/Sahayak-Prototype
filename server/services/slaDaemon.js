import { readTickets, writeTickets, logAudit } from './dataStore.js';
import { calculatePriority, calculateSla } from './priorityEngine.js';

let daemonInterval = null;

export function evaluateSlaAndEscalations() {
  const tickets = readTickets();
  const now = Date.now();
  let modified = false;

  const updatedTickets = tickets.map(ticket => {
    // Only monitor active tickets not yet completed or resolved
    if (ticket.stage >= 4 || ticket.status === 'Resolved' || ticket.status === 'Work Completed') {
      return ticket;
    }

    const priority = calculatePriority(ticket);
    const sla = calculateSla(ticket);
    const hoursElapsed = (now - ticket.createdAt) / (3600 * 1000);

    let newStatus = ticket.status;
    let newStage = ticket.stage;
    let escalationReason = ticket.escalationReason;
    let autoEscalated = false;

    // 1. Tier-2 Super-Escalation (> 96 hours unresolved)
    if (hoursElapsed >= 96 && ticket.escalationTier !== 2) {
      newStatus = 'ESCALATED';
      escalationReason = `Tier-2 Super-Escalation: Unresolved past 96-hour absolute deadline. Escalated directly to Municipal Commissioner & District Magistrate.`;
      autoEscalated = true;
      ticket.escalationTier = 2;
      ticket.assignedAuthorityRole = "Municipal Commissioner";
    }
    // 2. Tier-1 Auto-Escalation (Stage 1 unacknowledged > 48 hours)
    else if (ticket.stage === 1 && hoursElapsed >= 48 && ticket.status !== 'ESCALATED') {
      newStatus = 'ESCALATED';
      escalationReason = `Tier-1 Auto-Escalation: Mandatory 48-Hour SLA Gate expired without official triage. Escalated to Zonal Ward Executive Engineer.`;
      autoEscalated = true;
      ticket.escalationTier = 1;
      ticket.assignedAuthorityRole = "Ward Executive Engineer";
    }
    // 3. Urgency Score Spike Trigger (Score >= 100 or Emergency SOS)
    else if ((priority.score >= 100 || ticket.isEmergencySos) && ticket.status !== 'ESCALATED' && ticket.status !== 'In Progress') {
      newStatus = 'ESCALATED';
      escalationReason = ticket.isEmergencySos 
        ? `Emergency SOS Disaster Flag Triggered by Citizen: Rapid Response Protocol Activated.`
        : `Urgency Score Spike Trigger: Community consensus threshold breached. Auto-Escalated to Zonal Authority.`;
      autoEscalated = true;
      ticket.escalationTier = 1;
    }

    if (autoEscalated && newStatus !== ticket.status) {
      modified = true;
      ticket.status = newStatus;
      ticket.escalationReason = escalationReason;
      ticket.updatedAt = now;

      // Add timeline record
      if (!ticket.timeline) ticket.timeline = [];
      ticket.timeline.push({
        stage: `🚨 ${newStatus} (${ticket.escalationTier ? 'Tier-' + ticket.escalationTier : 'Urgent'})`,
        time: now,
        note: escalationReason
      });

      // Immutable audit log
      logAudit({
        ticketId: ticket.id,
        action: 'AUTO_ESCALATION_TRIGGER',
        previousStage: `Stage ${ticket.stage} (${ticket.stageKey || 'ACTIVE'})`,
        newStage: `Stage ${ticket.stage} (ESCALATED)`,
        actorId: 'SLA_DAEMON_WORKER',
        actorRole: 'Automated 48-Hour SLA Daemon',
        reason: escalationReason,
        details: {
          hoursElapsed: Math.round(hoursElapsed * 10) / 10,
          score: priority.score,
          escalationTier: ticket.escalationTier
        }
      });

      console.log(`[SLA DAEMON] ⚡ Auto-escalated Ticket ${ticket.id}: ${escalationReason}`);
    }

    return ticket;
  });

  if (modified) {
    writeTickets(updatedTickets);
  }
}

export function startSlaDaemon(intervalMs = 15000) {
  if (daemonInterval) clearInterval(daemonInterval);
  console.log(`[SLA DAEMON] Initialized 48-Hour SLA Gateway & Auto-Escalation Daemon (polling every ${intervalMs / 1000}s)`);
  
  // Run initial evaluation
  evaluateSlaAndEscalations();

  daemonInterval = setInterval(() => {
    evaluateSlaAndEscalations();
  }, intervalMs);
}

export function stopSlaDaemon() {
  if (daemonInterval) clearInterval(daemonInterval);
}
