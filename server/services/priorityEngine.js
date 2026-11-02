/**
 * SAHAYAK Dynamic Priority & SLA Gateway Engine
 * 
 * Clean UI Directive:
 * All mathematical formulas and equations are strictly calculated on the backend
 * and transformed into clean visual indicators (Priority Badges, Urgency Levels,
 * Progress Bar Percentages, and Human-Friendly SLA Countdowns) for frontend display.
 */

export function calculatePriority(ticket) {
  // Base Severity Weight (W_base): Low = 20, Medium = 40, High/Critical = 60
  const wBase = ticket.wBase || (ticket.baseSeverity === 'High' ? 60 : ticket.baseSeverity === 'Medium' ? 40 : 20);
  const u = ticket.upvotedBy ? ticket.upvotedBy.length : 0;
  
  const now = Date.now();
  const hoursElapsed = Math.max(0, (now - ticket.createdAt) / (3600 * 1000));
  
  // Logarithmic community endorsement amplification: prevents spam/brigading
  const upvoteDampened = 10 * Math.log2(1 + u);
  
  // Time aging acceleration: 5 priority points per 24 hours open
  const timeFactor = 5 * (hoursElapsed / 24);
  
  // Emergency SOS multiplier
  const sosBonus = ticket.isEmergencySos ? 50 : 0;

  const rawScore = wBase + upvoteDampened + timeFactor + sosBonus;
  const score = Math.round(rawScore * 10) / 10;
  
  // Normalized urgency percentage (0 to 100% scale for progress meters)
  const urgencyPercent = Math.min(100, Math.round((score / 120) * 100));

  // Clean Human-Readable Visual Indicators (No Raw Formulas)
  let priorityBadge = "Normal Maintenance";
  let badgeColor = "emerald";
  let riskLevel = "Low Concern";
  let isCritical = false;

  if (ticket.isEmergencySos || score >= 100) {
    priorityBadge = "Critical Hazard";
    badgeColor = "rose";
    riskLevel = "Immediate Danger / Auto-Escalated";
    isCritical = true;
  } else if (score >= 80) {
    priorityBadge = "High Urgency";
    badgeColor = "orange";
    riskLevel = "Severe Disruption";
  } else if (score >= 55) {
    priorityBadge = "Elevated Priority";
    badgeColor = "amber";
    riskLevel = "Moderate Concern";
  } else if (score >= 35) {
    priorityBadge = "Normal Maintenance";
    badgeColor = "blue";
    riskLevel = "Standard Civic Issue";
  } else {
    priorityBadge = "Low Priority";
    badgeColor = "slate";
    riskLevel = "Routine Task";
  }

  return {
    score,
    urgencyPercent,
    priorityBadge,
    badgeColor,
    riskLevel,
    isCritical,
    uCount: u,
    hoursElapsed: Math.round(hoursElapsed * 10) / 10
  };
}

export function calculateSla(ticket) {
  // 48-Hour SLA Gateway
  const triageSlaMs = 48 * 3600 * 1000;
  const superSlaMs = 96 * 3600 * 1000; // Tier-2 Commissioner super-escalation
  const deadline = ticket.createdAt + triageSlaMs;
  const superDeadline = ticket.createdAt + superSlaMs;
  const now = Date.now();
  
  const remainingMs = deadline - now;
  const isBreached = remainingMs <= 0 && ticket.stage < 4; // Not completed or resolved
  const isSuperBreached = (now - ticket.createdAt) >= superSlaMs && ticket.stage < 4;
  
  const percentLeft = Math.max(0, Math.min(100, Math.round((remainingMs / triageSlaMs) * 100)));
  
  let formattedCountdown = "";
  let slaBadgeText = "";
  let slaBadgeClass = "";

  if (ticket.stage >= 4) {
    formattedCountdown = "SLA Satisfied";
    slaBadgeText = "Work Completed";
    slaBadgeClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
  } else if (remainingMs > 0) {
    const hours = Math.floor(remainingMs / (3600 * 1000));
    const mins = Math.floor((remainingMs % (3600 * 1000)) / (60 * 1000));
    formattedCountdown = `${hours}h ${mins}m Remaining`;
    if (hours < 12) {
      slaBadgeText = `${hours}h Left (Urgent Review)`;
      slaBadgeClass = "bg-amber-100 text-amber-800 border-amber-300";
    } else {
      slaBadgeText = `${hours}h Remaining for Review`;
      slaBadgeClass = "bg-blue-100 text-blue-800 border-blue-200";
    }
  } else {
    const overdueHours = Math.floor(Math.abs(remainingMs) / (3600 * 1000));
    formattedCountdown = `SLA Breached (${overdueHours}h Overdue)`;
    if (isSuperBreached) {
      slaBadgeText = `Tier-2 Super-Escalated (${overdueHours}h Overdue)`;
      slaBadgeClass = "bg-rose-600 text-white border-rose-700 animate-pulse font-bold";
    } else {
      slaBadgeText = `Tier-1 Auto-Escalated (${overdueHours}h Overdue)`;
      slaBadgeClass = "bg-rose-100 text-rose-800 border-rose-300 font-semibold";
    }
  }

  // Check stage delay (>24h in current stage)
  const lastTransitionTime = ticket.updatedAt || ticket.createdAt;
  const hoursInCurrentStage = Math.max(0, (now - lastTransitionTime) / (3600 * 1000));
  const isStageDelayed = hoursInCurrentStage > 24 && ticket.stage < 4;

  return {
    remainingMs,
    isBreached,
    isSuperBreached,
    isStageDelayed,
    hoursInCurrentStage: Math.round(hoursInCurrentStage * 10) / 10,
    percentLeft,
    formattedCountdown,
    slaBadgeText,
    slaBadgeClass,
    deadlineDate: new Date(deadline).toISOString()
  };
}
