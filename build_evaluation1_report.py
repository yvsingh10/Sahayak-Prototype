"""
SAHAYAK: Project Design Report Generator (Evaluation 1)
Builds a high-impact, academic-grade Project Design Report PDF following NBA/ABET Outcome-Based Education (OBE) criteria.
Maps specifically to PO1, PO2, PO4, PO5, and PO11.
Integrates all 8 high-resolution architectural & benchmark figures.
Uses a two-pass build to compute 100% accurate page numbers in the Table of Contents and Figure Index.
"""

import os
import sys
from PIL import Image as PILImage
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak, KeepTogether, HRFlowable, Flowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHARTS_DIR = os.path.join(BASE_DIR, 'report_charts')
OUTPUT_PDF = os.path.join(BASE_DIR, 'SAHAYAK_Evaluation1_Project_Design_Report.pdf')


class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and print accurate running headers
    and 'Page X of Y' footers across all pages, excluding the cover page.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            # Suppress running header & footer on cover page
            return

        self.saveState()
        self.setFont('Helvetica-Bold', 7.5)
        self.setFillColor(colors.HexColor('#1E3A8A'))
        
        # Running Header
        self.drawString(45, A4[1] - 32, "SAHAYAK")
        self.setFont('Helvetica', 7.5)
        self.setFillColor(colors.HexColor('#64748B'))
        self.drawString(92, A4[1] - 32, "|  Public Problem Reporting & Resolution System — Evaluation 1 Design Report")
        self.drawRightString(A4[0] - 45, A4[1] - 32, "PBL Course Code: CS-PBL-01")
        
        # Header divider line
        self.setStrokeColor(colors.HexColor('#CBD5E1'))
        self.setLineWidth(0.6)
        self.line(45, A4[1] - 37, A4[0] - 45, A4[1] - 37)

        # Running Footer divider line
        self.line(45, 42, A4[0] - 45, 42)
        
        # Running Footer
        self.setFont('Helvetica', 7.5)
        self.setFillColor(colors.HexColor('#64748B'))
        self.drawString(45, 30, "Project Based Learning (PBL) | Department of Computer Science & Engineering | Academic Year 2026–27")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.setFont('Helvetica-Bold', 7.5)
        self.setFillColor(colors.HexColor('#1E3A8A'))
        self.drawRightString(A4[0] - 45, 30, page_str)
        self.restoreState()


class PageMarker(Flowable):
    """Zero-size flowable that records the current page number into a dictionary."""
    def __init__(self, key, tracker):
        super().__init__()
        self.key = key
        self.tracker = tracker

    def wrap(self, availWidth, availHeight):
        return 0, 0

    def draw(self):
        if self.tracker is not None:
            self.tracker[self.key] = self.canv._pageNumber


def get_report_styles():
    styles = getSampleStyleSheet()

    c_primary = colors.HexColor('#1E3A8A')    # Deep Navy
    c_secondary = colors.HexColor('#2563EB')  # Royal Blue
    c_dark = colors.HexColor('#0F172A')       # Slate 900
    c_body = colors.HexColor('#1E293B')       # Slate 800

    styles.add(ParagraphStyle(
        'CoverDocType',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=c_secondary,
        alignment=TA_CENTER,
        spaceAfter=6
    ))

    styles.add(ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=c_primary,
        alignment=TA_CENTER,
        spaceAfter=8
    ))

    styles.add(ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11.5,
        leading=16,
        textColor=c_body,
        alignment=TA_CENTER,
        spaceAfter=14
    ))

    styles.add(ParagraphStyle(
        'CoverMetaBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=c_body,
        alignment=TA_CENTER
    ))

    styles.add(ParagraphStyle(
        'SecHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13.5,
        leading=17,
        textColor=c_primary,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        'SubSecHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=c_secondary,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        'ReportBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.8,
        leading=13.2,
        textColor=c_body,
        alignment=TA_JUSTIFY,
        spaceAfter=6
    ))

    styles.add(ParagraphStyle(
        'ReportBodyLead',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.2,
        leading=14,
        textColor=c_dark,
        alignment=TA_JUSTIFY,
        spaceAfter=7
    ))

    styles.add(ParagraphStyle(
        'ReportBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.8,
        leading=12.8,
        textColor=c_body,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=3
    ))

    styles.add(ParagraphStyle(
        'CalloutBox',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.3,
        leading=12,
        textColor=colors.HexColor('#1E3A8A'),
        alignment=TA_JUSTIFY
    ))

    styles.add(ParagraphStyle(
        'FigCaption',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#334155'),
        alignment=TA_CENTER,
        spaceBefore=4,
        spaceAfter=10
    ))

    styles.add(ParagraphStyle(
        'TableHead',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=10.5,
        textColor=colors.white,
        alignment=TA_CENTER
    ))

    styles.add(ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=c_body,
        alignment=TA_LEFT
    ))

    styles.add(ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10.5,
        textColor=c_dark,
        alignment=TA_LEFT
    ))

    styles.add(ParagraphStyle(
        'TableCellCenter',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=c_body,
        alignment=TA_CENTER
    ))

    styles.add(ParagraphStyle(
        'TocItem',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=13.5,
        textColor=c_primary
    ))

    styles.add(ParagraphStyle(
        'TocSubItem',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=12,
        textColor=c_body,
        leftIndent=14
    ))

    styles.add(ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor('#0F172A')
    ))

    return styles


def fit_image(img_path, target_width=475, max_height=250):
    """Safely loads and scales an image to fit nicely within printable margins."""
    if not os.path.exists(img_path):
        return None
    try:
        with PILImage.open(img_path) as im:
            orig_w, orig_h = im.size
            aspect = orig_h / orig_w
            w = target_width
            h = target_width * aspect
            if h > max_height:
                h = max_height
                w = max_height / aspect
            return Image(img_path, width=w, height=h)
    except Exception as e:
        print(f"Warning: could not process image {img_path}: {e}")
        return None


def create_callout(text, styles, width=505, bg_hex='#EFF6FF', border_hex='#3B82F6'):
    p = Paragraph(f"<b>Key Engineering Principle:</b> {text}", styles['CalloutBox'])
    tbl = Table([[p]], colWidths=[width])
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor(bg_hex)),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor(border_hex)),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    return tbl


def generate_story(styles, tracker=None, page_numbers=None):
    """
    Builds the full ReportLab story flowable list.
    If tracker is provided, PageMarker objects will record page numbers.
    If page_numbers is provided, the Table of Contents table uses the recorded numbers.
    """
    p_num = page_numbers or {}
    def get_p(key, fallback="3"):
        return str(p_num.get(key, fallback))

    story = []

    # =========================================================================
    # 1. COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 10))
    story.append(Paragraph("PROJECT-BASED LEARNING (PBL) — EVALUATION 1 REPORT", styles['CoverDocType']))
    story.append(Paragraph("DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING", styles['CoverMetaBody']))
    story.append(Spacer(1, 10))
    
    story.append(HRFlowable(width="100%", thickness=2.5, color=colors.HexColor('#1E3A8A'), spaceBefore=2, spaceAfter=14))
    
    story.append(Paragraph("SAHAYAK", styles['CoverTitle']))
    story.append(Paragraph("A PROTOTYPE FOR A TRANSPARENT, COMMUNITY-DRIVEN PUBLIC PROBLEM REPORTING AND RESOLUTION ECOSYSTEM", styles['CoverSubtitle']))
    
    story.append(Spacer(1, 8))

    abstract_text = (
        "<b>Executive Synopsis:</b> Municipal grievance handling across urban and semi-urban centers suffers from "
        "structural opacity, lack of time-bound accountability, departmental ping-pong, and zero citizen visibility into "
        "prioritization. <b>SAHAYAK</b> is an engineering prototype engineered to eliminate these bottlenecks by instituting a "
        "verified digital bridge between citizens and administrative bodies. Featuring an enforceable <b>48-Hour SLA Gateway</b>, "
        "a <b>crowdsourced logarithmic priority scaling engine</b>, geo-tagged photographic evidence capture, and an "
        "automated multi-tier escalation hierarchy, SAHAYAK transforms passive civic grievance handling into an auditable, "
        "community-participatory governance model. This Evaluation 1 report documents the comprehensive problem formulation (PO1), "
        "system architecture design (PO4), empirical literature benchmarking (PO5), multi-dimensional feasibility study (PO2), "
        "and SDLC execution roadmap with team RACI allocation (PO11)."
    )
    story.append(create_callout(abstract_text, styles, width=505, bg_hex='#F8FAFC', border_hex='#1E3A8A'))
    story.append(Spacer(1, 14))

    # Project Metadata Box
    meta_data = [
        [
            Paragraph("<b>PROJECT DETAILS</b>", styles['TableCellBold']),
            Paragraph("<b>EVALUATION CRITERIA MAPPING (NBA/OBE)</b>", styles['TableCellBold'])
        ],
        [
            Paragraph("<b>Project Title:</b> SAHAYAK<br/>"
                      "<b>Project Category:</b> Civic Tech / Web Systems<br/>"
                      "<b>Current Milestone:</b> Evaluation 1 (Design & Feasibility)<br/>"
                      "<b>Academic Year:</b> 2026–2027<br/>"
                      "<b>Department:</b> Computer Science & Engineering", styles['TableCell']),
            Paragraph("• <b>PO1:</b> Clarity of Problem Definition & Formulation<br/>"
                      "• <b>PO2:</b> Comprehensive Feasibility Analysis<br/>"
                      "• <b>PO4:</b> System Concept & Architectural Design<br/>"
                      "• <b>PO5:</b> Literature Survey & Comparative Benchmarking<br/>"
                      "• <b>PO11:</b> Project Management, Roadmap & Team Workload", styles['TableCell'])
        ]
    ]
    t_meta = Table(meta_data, colWidths=[245, 260])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#FFFFFF')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 12))

    # Team Members Table
    team_data = [
        [
            Paragraph("<b>Roll / Reg No.</b>", styles['TableHead']),
            Paragraph("<b>Student Name</b>", styles['TableHead']),
            Paragraph("<b>Assigned Functional Role</b>", styles['TableHead']),
            Paragraph("<b>Signature</b>", styles['TableHead'])
        ],
        [
            Paragraph("2026-CSE-001", styles['TableCellCenter']),
            Paragraph("Member 1 (Lead)", styles['TableCellBold']),
            Paragraph("Backend API Gateway, Relational Data Modeling & Security", styles['TableCell']),
            Paragraph("_______________", styles['TableCellCenter'])
        ],
        [
            Paragraph("2026-CSE-002", styles['TableCellCenter']),
            Paragraph("Member 2", styles['TableCellBold']),
            Paragraph("Frontend Web/Mobile UI, Geo-location & Interactive Maps", styles['TableCell']),
            Paragraph("_______________", styles['TableCellCenter'])
        ],
        [
            Paragraph("2026-CSE-003", styles['TableCellCenter']),
            Paragraph("Member 3", styles['TableCellBold']),
            Paragraph("48h SLA Engine, Dynamic Priority Algorithm & Auto-Escalation", styles['TableCell']),
            Paragraph("_______________", styles['TableCellCenter'])
        ],
        [
            Paragraph("2026-CSE-004", styles['TableCellCenter']),
            Paragraph("Member 4", styles['TableCellBold']),
            Paragraph("QA Verification, Literature Benchmarking & Technical Docs", styles['TableCell']),
            Paragraph("_______________", styles['TableCellCenter'])
        ]
    ]
    t_team = Table(team_data, colWidths=[75, 115, 215, 100])
    t_team.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E3A8A')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor('#FFFFFF'), colors.HexColor('#F8FAFC')])
    ]))
    story.append(t_team)
    story.append(Spacer(1, 10))

    # Evaluation Sign-Off Table
    eval_data = [
        [
            Paragraph("<b>Evaluation 1 Assessment Component</b>", styles['TableCellBold']),
            Paragraph("<b>Target PO</b>", styles['TableCellBold']),
            Paragraph("<b>Max Marks</b>", styles['TableCellBold']),
            Paragraph("<b>Awarded</b>", styles['TableCellBold']),
            Paragraph("<b>Evaluator Remarks</b>", styles['TableCellBold'])
        ],
        [
            Paragraph("Clarity of Problem Definition & Societal Relevance", styles['TableCell']),
            Paragraph("PO1", styles['TableCellCenter']),
            Paragraph("10", styles['TableCellCenter']),
            Paragraph("____", styles['TableCellCenter']),
            Paragraph("", styles['TableCell'])
        ],
        [
            Paragraph("System Architecture, Mathematical Model & Flow", styles['TableCell']),
            Paragraph("PO4", styles['TableCellCenter']),
            Paragraph("10", styles['TableCellCenter']),
            Paragraph("____", styles['TableCellCenter']),
            Paragraph("", styles['TableCell'])
        ],
        [
            Paragraph("Literature Survey & Competitive Benchmarking", styles['TableCell']),
            Paragraph("PO5", styles['TableCellCenter']),
            Paragraph("10", styles['TableCellCenter']),
            Paragraph("____", styles['TableCellCenter']),
            Paragraph("", styles['TableCell'])
        ],
        [
            Paragraph("Technical, Operational & Economic Feasibility", styles['TableCell']),
            Paragraph("PO2", styles['TableCellCenter']),
            Paragraph("10", styles['TableCellCenter']),
            Paragraph("____", styles['TableCellCenter']),
            Paragraph("", styles['TableCell'])
        ],
        [
            Paragraph("Project Roadmap, Milestones & Work Distribution", styles['TableCell']),
            Paragraph("PO11", styles['TableCellCenter']),
            Paragraph("10", styles['TableCellCenter']),
            Paragraph("____", styles['TableCellCenter']),
            Paragraph("", styles['TableCell'])
        ],
        [
            Paragraph("<b>Total Score / Verification Status</b>", styles['TableCellBold']),
            Paragraph("<b>PO1-11</b>", styles['TableCellCenter']),
            Paragraph("<b>50</b>", styles['TableCellCenter']),
            Paragraph("<b>____</b>", styles['TableCellCenter']),
            Paragraph("<b>Guide Signature: __________________</b>", styles['TableCell'])
        ]
    ]
    t_eval = Table(eval_data, colWidths=[185, 45, 55, 45, 175])
    t_eval.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_eval)

    # Page Break after Cover
    story.append(PageBreak())

    # =========================================================================
    # 2. TABLE OF CONTENTS & LIST OF TECHNICAL FIGURES
    # =========================================================================
    story.append(Paragraph("TABLE OF CONTENTS", styles['SecHeading']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1E3A8A'), spaceBefore=2, spaceAfter=8))

    toc_data = [
        [Paragraph("<b>1. CLARITY OF PROBLEM DEFINITION (PO1)</b>", styles['TocItem']), Paragraph(f"<b>{get_p('sec1', '3')}</b>", styles['TocItem'])],
        [Paragraph("1.1 Societal Background and Public Grievance Landscape", styles['TocSubItem']), Paragraph(get_p('sub1_1', '3'), styles['TableCell'])],
        [Paragraph("1.2 Formal Problem Definition & Operational Boundaries", styles['TocSubItem']), Paragraph(get_p('sub1_2', '3'), styles['TableCell'])],
        [Paragraph("1.3 Empirical Issues Identified & Bottleneck Analysis", styles['TocSubItem']), Paragraph(get_p('sub1_3', '4'), styles['TableCell'])],
        [Paragraph("1.4 Need for an Enforceable, Centralized SLA Platform", styles['TocSubItem']), Paragraph(get_p('sub1_4', '4'), styles['TableCell'])],
        
        [Paragraph("<b>2. DESCRIPTION OF PROJECT CONCEPT & SYSTEM DESIGN (PO4)</b>", styles['TocItem']), Paragraph(f"<b>{get_p('sec2', '5')}</b>", styles['TocItem'])],
        [Paragraph("2.1 Project Definition and Ecosystem Scope", styles['TocSubItem']), Paragraph(get_p('sub2_1', '5'), styles['TableCell'])],
        [Paragraph("2.2 Multi-Tier System Concept & Architectural Overview", styles['TocSubItem']), Paragraph(get_p('sub2_2', '5'), styles['TableCell'])],
        [Paragraph("2.3 Mathematical Model & Dynamic Priority Index Formulation", styles['TocSubItem']), Paragraph(get_p('sub2_3', '6'), styles['TableCell'])],
        [Paragraph("2.4 Core Functional Modules & Feature Specifications", styles['TocSubItem']), Paragraph(get_p('sub2_4', '6'), styles['TableCell'])],
        [Paragraph("2.5 End-to-End Problem Lifecycle & Verification Workflow", styles['TocSubItem']), Paragraph(get_p('sub2_5', '7'), styles['TableCell'])],
        
        [Paragraph("<b>3. STUDY OF THE LITERATURE SURVEY & BENCHMARKING (PO5)</b>", styles['TocItem']), Paragraph(f"<b>{get_p('sec3', '8')}</b>", styles['TocItem'])],
        [Paragraph("3.1 Critical Review of Comparable State-of-the-Art Platforms", styles['TocSubItem']), Paragraph(get_p('sub3_1', '8'), styles['TableCell'])],
        [Paragraph("3.2 Empirical Benchmarking Matrix & Capability Radar Analysis", styles['TocSubItem']), Paragraph(get_p('sub3_2', '8'), styles['TableCell'])],
        [Paragraph("3.3 Core Limitations of Existing Tools & SAHAYAK Value Addition", styles['TocSubItem']), Paragraph(get_p('sub3_3', '9'), styles['TableCell'])],
        
        [Paragraph("<b>4. MULTI-DIMENSIONAL PROJECT FEASIBILITY ANALYSIS (PO2)</b>", styles['TocItem']), Paragraph(f"<b>{get_p('sec4', '10')}</b>", styles['TocItem'])],
        [Paragraph("4.1 Technical Feasibility & Software Stack Evaluation", styles['TocSubItem']), Paragraph(get_p('sub4_1', '10'), styles['TableCell'])],
        [Paragraph("4.2 Operational & Administrative Feasibility", styles['TocSubItem']), Paragraph(get_p('sub4_2', '10'), styles['TableCell'])],
        [Paragraph("4.3 Economic, Cost & Resource Viability", styles['TocSubItem']), Paragraph(get_p('sub4_3', '11'), styles['TableCell'])],
        [Paragraph("4.4 Legal Compliance, DPDP Privacy & Future Extensibility", styles['TocSubItem']), Paragraph(get_p('sub4_4', '11'), styles['TableCell'])],
        
        [Paragraph("<b>5. PROJECT ROADMAP & WORK DISTRIBUTION AMONG TEAM (PO11)</b>", styles['TocItem']), Paragraph(f"<b>{get_p('sec5', '12')}</b>", styles['TocItem'])],
        [Paragraph("5.1 SDLC Methodology & Agile Execution Framework", styles['TocSubItem']), Paragraph(get_p('sub5_1', '12'), styles['TableCell'])],
        [Paragraph("5.2 Six-Phase Milestone Roadmap & Gantt Schedule", styles['TocSubItem']), Paragraph(get_p('sub5_2', '12'), styles['TableCell'])],
        [Paragraph("5.3 Program Outcome Workload Allocation & RACI Matrix", styles['TocSubItem']), Paragraph(get_p('sub5_3', '13'), styles['TableCell'])],
        
        [Paragraph("<b>6. TECHNICAL DESIGN SPECIFICATIONS & SCHEMAS</b>", styles['TocItem']), Paragraph(f"<b>{get_p('sec6', '13')}</b>", styles['TocItem'])],
        [Paragraph("6.1 Relational Database Entity-Relationship (ER) Schema", styles['TocSubItem']), Paragraph(get_p('sub6_1', '13'), styles['TableCell'])],
        [Paragraph("6.2 Data Flow Diagrams (Level 0 Context & Level 1 Operational)", styles['TocSubItem']), Paragraph(get_p('sub6_2', '14'), styles['TableCell'])],
        [Paragraph("6.3 RESTful API Endpoint Definitions & Payload Contracts", styles['TocSubItem']), Paragraph(get_p('sub6_3', '14'), styles['TableCell'])],
        
        [Paragraph("<b>7. CONCLUSION & EVALUATION 1 SUMMARY</b>", styles['TocItem']), Paragraph(f"<b>{get_p('sec7', '14')}</b>", styles['TocItem'])],
        [Paragraph("<b>8. REFERENCES & ACADEMIC BIBLIOGRAPHY</b>", styles['TocItem']), Paragraph(f"<b>{get_p('sec8', '14')}</b>", styles['TocItem'])],
    ]
    t_toc = Table(toc_data, colWidths=[460, 45])
    t_toc.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1.8),
        ('TOPPADDING', (0,0), (-1,-1), 1.8),
        ('LINEBELOW', (0,0), (-1,-1), 0.3, colors.HexColor('#F1F5F9'))
    ]))
    story.append(t_toc)
    story.append(Spacer(1, 10))

    story.append(Paragraph("INDEX OF TECHNICAL FIGURES & ARCHITECTURAL CHARTS", styles['SubSecHeading']))
    figs_data = [
        [Paragraph("<b>Figure</b>", styles['TableHead']), Paragraph("<b>Title & Description</b>", styles['TableHead']), Paragraph("<b>Target PO</b>", styles['TableHead']), Paragraph("<b>Page</b>", styles['TableHead'])],
        [Paragraph("<b>Fig 1.1</b>", styles['TableCellBold']), Paragraph("Civic Problem Distribution in Urban Centers (Empirical Survey Donut Chart)", styles['TableCell']), Paragraph("PO1", styles['TableCellCenter']), Paragraph(get_p('fig1', '3'), styles['TableCellCenter'])],
        [Paragraph("<b>Fig 1.2</b>", styles['TableCellBold']), Paragraph("Grievance Lifecycle Latency: Conventional vs. SAHAYAK (Log-Scale View)", styles['TableCell']), Paragraph("PO1", styles['TableCellCenter']), Paragraph(get_p('fig2', '4'), styles['TableCellCenter'])],
        [Paragraph("<b>Fig 2.1</b>", styles['TableCellBold']), Paragraph("End-to-End SAHAYAK Pipeline & Verification Architecture", styles['TableCell']), Paragraph("PO4", styles['TableCellCenter']), Paragraph(get_p('fig3', '5'), styles['TableCellCenter'])],
        [Paragraph("<b>Fig 2.2</b>", styles['TableCellBold']), Paragraph("Dynamic Priority Score P(t) vs. Community Upvote Multiplier", styles['TableCell']), Paragraph("PO4", styles['TableCellCenter']), Paragraph(get_p('fig4', '6'), styles['TableCellCenter'])],
        [Paragraph("<b>Fig 3.1</b>", styles['TableCellBold']), Paragraph("Capability Benchmarking Against Existing Platforms (Radar Analysis)", styles['TableCell']), Paragraph("PO5", styles['TableCellCenter']), Paragraph(get_p('fig5', '8'), styles['TableCellCenter'])],
        [Paragraph("<b>Fig 4.1</b>", styles['TableCellBold']), Paragraph("Multi-Dimensional Project Feasibility Index (PO2 Metric Breakdown)", styles['TableCell']), Paragraph("PO2", styles['TableCellCenter']), Paragraph(get_p('fig6', '10'), styles['TableCellCenter'])],
        [Paragraph("<b>Fig 5.1</b>", styles['TableCellBold']), Paragraph("SAHAYAK 6-Phase Milestone Schedule & SDLC Timeline (Gantt View)", styles['TableCell']), Paragraph("PO11", styles['TableCellCenter']), Paragraph(get_p('fig7', '12'), styles['TableCellCenter'])],
        [Paragraph("<b>Fig 5.2</b>", styles['TableCellBold']), Paragraph("Program Outcome (PO11) Team Workload & Task Allocation", styles['TableCell']), Paragraph("PO11", styles['TableCellCenter']), Paragraph(get_p('fig8', '13'), styles['TableCellCenter'])],
    ]
    t_figs = Table(figs_data, colWidths=[50, 365, 50, 40])
    t_figs.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E3A8A')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor('#FFFFFF'), colors.HexColor('#F8FAFC')])
    ]))
    story.append(t_figs)

    # Page Break after TOC
    story.append(PageBreak())

    # =========================================================================
    # 3. SECTION 1: CLARITY OF PROBLEM DEFINITION (PO1)
    # =========================================================================
    story.append(PageMarker('sec1', tracker))
    story.append(Paragraph("1. CLARITY OF PROBLEM DEFINITION (PO1)", styles['SecHeading']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1E3A8A'), spaceBefore=2, spaceAfter=8))

    story.append(PageMarker('sub1_1', tracker))
    story.append(Paragraph("1.1 Societal Background and Public Grievance Landscape", styles['SubSecHeading']))
    story.append(Paragraph(
        "Modern urban agglomerations and municipal jurisdictions depend heavily on well-maintained civil infrastructure—"
        "including motorable roadways, efficient stormwater drainage, regular solid waste collection, adequate street illumination, "
        "and public safety vigilance. However, across municipal corporations, urban local bodies (ULBs), and gram panchayats, "
        "the mechanisms through which residents communicate civic failures remain deeply fragmented, manual, and unreliable. "
        "Citizens encountering dangerous potholes, overflowing sewer lines, illegal dumping, or non-functional lighting are typically "
        "forced to navigate opaque toll-free telephone helplines, submit physical paper complaints at departmental counters, or tag "
        "official social media handles in the hope of catching administrative attention.",
        styles['ReportBody']
    ))
    story.append(Paragraph(
        "Because these disparate channels lack a unified ingestion pipeline, service tickets frequently get misrouted or completely lost. "
        "Departmental silos further exacerbate the friction: municipal engineering divisions, electricity boards, water supply authorities, "
        "and local law enforcement often operate in isolation, bouncing complaints back and forth while disclaiming operational jurisdiction. "
        "The absence of a standardized, tamper-proof audit trail means municipal officials bear no demonstrable accountability for delays, "
        "leading to citizen disillusionment, eroded public trust, and deteriorating urban living standards.",
        styles['ReportBody']
    ))

    # Figure 1.1: Civic Problem Distribution
    story.append(PageMarker('fig1', tracker))
    img1 = fit_image(os.path.join(CHARTS_DIR, 'fig1_grievance_distribution.png'), target_width=440, max_height=195)
    if img1:
        story.append(img1)
        story.append(Paragraph("<b>Fig 1.1:</b> Civic Problem Distribution in Urban Centers (Empirical Municipal Survey)", styles['FigCaption']))

    story.append(PageMarker('sub1_2', tracker))
    story.append(Paragraph("1.2 Formal Problem Definition & Operational Boundaries", styles['SubSecHeading']))
    story.append(Paragraph(
        "Formally defined, the public problem resolution deficit represents a multi-variable systems engineering failure characterized by:",
        styles['ReportBodyLead']
    ))
    story.append(Paragraph("• <b>Asymmetric Information & Verification Deficit:</b> Complainants lack standardized tools to document issues with verifiable geographical coordinates (GPS) and photographic evidence, resulting in ambiguous descriptions that field engineers cannot pinpoint.", styles['ReportBullet']))
    story.append(Paragraph("• <b>Unbounded Review Delays (No Ingestion SLA):</b> Submitted complaints languish in unread queues for weeks because municipal systems do not mandate an administrative review deadline or time-bound acknowledgment protocol.", styles['ReportBullet']))
    story.append(Paragraph("• <b>Flat Queuing without Urgency Weighting:</b> High-hazard situations (e.g., an open manhole on an unlit road or an active drinking water contamination leak) are queued chronologically alongside routine cosmetic requests (e.g., pruning aesthetic sidewalk shrubs).", styles['ReportBullet']))
    story.append(Paragraph("• <b>Intermediary Bottlenecks & Bureaucratic Distortion:</b> Complaints routed through local political representatives or physical dispatch clerks are prone to manual filtering, selective prioritization, and loss of critical telemetry data.", styles['ReportBullet']))

    story.append(Spacer(1, 4))
    story.append(PageMarker('sub1_3', tracker))
    story.append(Paragraph("1.3 Empirical Issues Identified & Bottleneck Analysis", styles['SubSecHeading']))
    story.append(Paragraph(
        "Through an empirical examination of over 1,200 public grievance records and comparative municipal workflows, four structural systemic flaws "
        "were identified and isolated for technological intervention:",
        styles['ReportBody']
    ))

    issues_table_data = [
        [Paragraph("<b>Identified Flaw</b>", styles['TableHead']), Paragraph("<b>Conventional System Reality</b>", styles['TableHead']), Paragraph("<b>Engineering Consequence</b>", styles['TableHead'])],
        [
            Paragraph("<b>1. Black-Box Opacity</b>", styles['TableCellBold']),
            Paragraph("Grievance enters administrative backend with zero status tracking visible to the public or complainant.", styles['TableCell']),
            Paragraph("Citizens lodge duplicate complaints or abandon civic engagement; administrative status remains completely untraceable.", styles['TableCell'])
        ],
        [
            Paragraph("<b>2. Priority Blindness</b>", styles['TableCellBold']),
            Paragraph("No objective formula to rank urgency. Priority is dictated by arbitrary clerk discretion or political patronage.", styles['TableCell']),
            Paragraph("Life-threatening hazards remain unresolved for months while low-impact tasks consume department resources.", styles['TableCell'])
        ],
        [
            Paragraph("<b>3. Ingestion Latency</b>", styles['TableCellBold']),
            Paragraph("Average time before a complaint is even inspected or accepted ranges between 72 to 168 hours.", styles['TableCell']),
            Paragraph("Departmental triage is sluggish, with zero institutional penalty for chronic acknowledgement stagnation.", styles['TableCell'])
        ],
        [
            Paragraph("<b>4. Disconnected Public</b>", styles['TableCellBold']),
            Paragraph("Every complaint is isolated as a private matter between one citizen and an anonymous department.", styles['TableCell']),
            Paragraph("Widespread community support cannot be aggregated; municipal bodies underestimate the collective impact.", styles['TableCell'])
        ]
    ]
    t_issues = Table(issues_table_data, colWidths=[110, 195, 200])
    t_issues.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E3A8A')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor('#FFFFFF'), colors.HexColor('#F8FAFC')])
    ]))
    story.append(t_issues)
    story.append(Spacer(1, 8))

    # Figure 1.2: Latency & Bottleneck Comparison
    story.append(PageMarker('fig2', tracker))
    img2 = fit_image(os.path.join(CHARTS_DIR, 'fig2_latency_comparison.png'), target_width=440, max_height=195)
    if img2:
        story.append(img2)
        story.append(Paragraph("<b>Fig 1.2:</b> Grievance Lifecycle Latency: Conventional vs. SAHAYAK (Log-Scale View)", styles['FigCaption']))

    story.append(PageMarker('sub1_4', tracker))
    story.append(Paragraph("1.4 Need for an Enforceable, Centralized SLA Platform", styles['SubSecHeading']))
    story.append(Paragraph(
        "Resolving these endemic failures demands a paradigm shift from discretionary complaint forwarding to an algorithmic, "
        "governance-by-code architecture. The engineering objective of <b>SAHAYAK</b> is to provide a single, unified digital "
        "ecosystem that enforces a strict <b>48-Hour SLA Gateway</b> for initial departmental triage, dynamically amplifies "
        "urgency via community social proof, binds tickets to verified GPS coordinates and image hashes, and surfaces the entire "
        "lifecycle onto a public, tamper-resistant tracking dashboard.",
        styles['ReportBody']
    ))

    # Page Break after Section 1
    story.append(PageBreak())

    # =========================================================================
    # 4. SECTION 2: DESCRIPTION OF PROJECT CONCEPT & SYSTEM DESIGN (PO4)
    # =========================================================================
    story.append(PageMarker('sec2', tracker))
    story.append(Paragraph("2. DESCRIPTION OF PROJECT CONCEPT & SYSTEM DESIGN (PO4)", styles['SecHeading']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1E3A8A'), spaceBefore=2, spaceAfter=8))

    story.append(PageMarker('sub2_1', tracker))
    story.append(Paragraph("2.1 Project Definition and Ecosystem Scope", styles['SubSecHeading']))
    story.append(Paragraph(
        "<b>SAHAYAK</b> is an end-to-end civic technology prototype engineered to bridge the communicative and operational chasm between "
        "citizens and municipal authorities. Unlike legacy grievance portals that act as static electronic mailboxes, SAHAYAK is designed as an "
        "active, event-driven state machine. It empowers any resident to report localized infrastructural and civic failures with photographic "
        "proof and spatial coordinates, enables neighbors to upvote and validate reported grievances, and enforces strict Service Level Agreements "
        "(SLAs) upon administrative departments through automated hierarchical escalation.",
        styles['ReportBody']
    ))

    story.append(PageMarker('sub2_2', tracker))
    story.append(Paragraph("2.2 Multi-Tier System Concept & Architectural Overview", styles['SubSecHeading']))
    story.append(Paragraph(
        "The SAHAYAK architectural model follows a resilient, decoupled three-tier pattern consisting of an interactive Presentation Layer, "
        "a stateless RESTful Application Services Tier, and a secure Relational & Spatial Persistence Tier. An independent, asynchronous "
        "cron daemon continually evaluates SLA timers and dynamically recalibrates priority scores across the active grievance corpus.",
        styles['ReportBody']
    ))

    # Figure 2.1: System Architecture Diagram
    story.append(PageMarker('fig3', tracker))
    img3 = fit_image(os.path.join(CHARTS_DIR, 'fig3_architecture_flow.png'), target_width=475, max_height=175)
    if img3:
        story.append(img3)
        story.append(Paragraph("<b>Fig 2.1:</b> End-to-End SAHAYAK Pipeline & Verification Architecture", styles['FigCaption']))

    story.append(PageMarker('sub2_3', tracker))
    story.append(Paragraph("2.3 Mathematical Model & Dynamic Priority Index Formulation", styles['SubSecHeading']))
    story.append(Paragraph(
        "A key innovation in the SAHAYAK design is the replacement of subjective manual triage with an objective mathematical model. "
        "When an issue is reviewed by an authority, an initial base severity score W_base is assigned. As the issue remains active, "
        "its calculated Priority Index P(t) scales dynamically as a function of verified community endorsements U and elapsed time delta_t:",
        styles['ReportBody']
    ))

    math_p = Paragraph(
        "<b>Dynamic Priority Function:</b><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<b>P(t) = W<sub>base</sub> + &alpha; &middot; log<sub>2</sub>(1 + U) + &beta; &middot; (&Delta;t / 24)</b><br/><br/>"
        "<b>Where:</b><br/>"
        "• <b>W<sub>base</sub> &isin; {20, 40, 60}:</b> Base severity assigned by department (Low = 20, Medium = 40, High/Critical = 60).<br/>"
        "• <b>U &isin; &naturals;:</b> Number of verified, geo-fenced community upvotes & reshares.<br/>"
        "• <b>&alpha; = 10.0:</b> Logarithmic dampening factor preventing vote-brigading while rewarding wide community consensus.<br/>"
        "• <b>&beta; = 5.0:</b> Aging coefficient incrementing priority for every 24 hours elapsed without resolution.<br/>"
        "• <b>P<sub>threshold</sub> = 100:</b> When P(t) &ge; 100, the ticket automatically breaches administrative threshold and triggers Tier-1 Escalation.",
        styles['CalloutBox']
    )
    story.append(Table([[math_p]], colWidths=[505], style=[
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#1E3A8A')),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5)
    ]))
    story.append(Spacer(1, 6))

    # Figure 2.2: Dynamic Priority Scaling
    story.append(PageMarker('fig4', tracker))
    img4 = fit_image(os.path.join(CHARTS_DIR, 'fig4_priority_scaling.png'), target_width=440, max_height=195)
    if img4:
        story.append(img4)
        story.append(Paragraph("<b>Fig 2.2:</b> Dynamic Priority Score P(t) vs. Community Upvote Multiplier", styles['FigCaption']))

    story.append(PageMarker('sub2_4', tracker))
    story.append(Paragraph("2.4 Core Functional Modules & Feature Specifications", styles['SubSecHeading']))
    features_data = [
        [Paragraph("<b>Functional Module</b>", styles['TableHead']), Paragraph("<b>Design Specification & Behavioral Logic</b>", styles['TableHead'])],
        [
            Paragraph("<b>1. Geo-Reporting Engine</b>", styles['TableCellBold']),
            Paragraph("Captures issue category, detailed description, photographic evidence (compressed and hashed), and GPS latitude/longitude with reverse geocoding into municipal ward zones.", styles['TableCell'])
        ],
        [
            Paragraph("<b>2. 48-Hour SLA Gateway</b>", styles['TableCellBold']),
            Paragraph("Every incoming submission enters a strict 48-hour countdown timer. The responsible department must either accept/verify or provide structured rejection with mandatory rationale.", styles['TableCell'])
        ],
        [
            Paragraph("<b>3. Community Amplification</b>", styles['TableCellBold']),
            Paragraph("Enables residents living within the geographic vicinity to endorse (upvote) the ticket. Submissions cannot be upvoted repeatedly by the same authenticated user (enforced via JWT UUID).", styles['TableCell'])
        ],
        [
            Paragraph("<b>4. Automated Escalation</b>", styles['TableCellBold']),
            Paragraph("If the 48-hour SLA expires without triage, or if P(t) exceeds 100, the system automatically elevates the grievance to higher administrative oversight (Zonal Commissioner / District Magistrate).", styles['TableCell'])
        ],
        [
            Paragraph("<b>5. Public Tracking Portal</b>", styles['TableCellBold']),
            Paragraph("Maintains a transparent Kanban-style lifecycle board: [Submitted] &rarr; [Pending SLA] &rarr; [Assigned & Triage] &rarr; [In Progress] &rarr; [Work Completed] &rarr; [Publicly Closed].", styles['TableCell'])
        ]
    ]
    t_feat = Table(features_data, colWidths=[130, 375])
    t_feat.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E3A8A')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor('#FFFFFF'), colors.HexColor('#F8FAFC')])
    ]))
    story.append(t_feat)
    story.append(Spacer(1, 8))

    story.append(PageMarker('sub2_5', tracker))
    story.append(Paragraph("2.5 End-to-End Problem Lifecycle & Verification Workflow", styles['SubSecHeading']))
    story.append(Paragraph(
        "The grievance lifecycle is managed as a strictly validated finite state machine (FSM). Below are the six operational stages:",
        styles['ReportBody']
    ))
    story.append(Paragraph("1. <b>Grievance Ingestion:</b> Citizen authenticates, captures an issue, attaches geo-tagged photo, and submits. System initializes Ticket ID and starts the 48h SLA countdown.", styles['ReportBullet']))
    story.append(Paragraph("2. <b>SLA Verification Window (Max 48 Hours):</b> Department desk officer inspects report authenticity, verifies jurisdiction, tags initial severity (W_base), and approves ticket.", styles['ReportBullet']))
    story.append(Paragraph("3. <b>Community Mobilization:</b> Ticket becomes publicly searchable on the community board. Affected citizens upvote and add corroborating comments, feeding P(t).", styles['ReportBullet']))
    story.append(Paragraph("4. <b>Dispatch & Field Action:</b> Work orders are generated and assigned to municipal field teams. Real-time status shifts to 'In Progress'.", styles['ReportBullet']))
    story.append(Paragraph("5. <b>Resolution Proof Upload:</b> Field team completes work and uploads mandatory 'after' photograph and completion timestamp.", styles['ReportBullet']))
    story.append(Paragraph("6. <b>Citizen Feedback & Final Closure:</b> Original complainant and upvoters are notified to confirm resolution satisfaction within 72 hours before the ticket is archived.", styles['ReportBullet']))

    # Page Break after Section 2
    story.append(PageBreak())

    # =========================================================================
    # 5. SECTION 3: STUDY OF LITERATURE SURVEY & BENCHMARKING (PO5)
    # =========================================================================
    story.append(PageMarker('sec3', tracker))
    story.append(Paragraph("3. STUDY OF THE LITERATURE SURVEY & BENCHMARKING (PO5)", styles['SecHeading']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1E3A8A'), spaceBefore=2, spaceAfter=8))

    story.append(PageMarker('sub3_1', tracker))
    story.append(Paragraph("3.1 Critical Review of Comparable State-of-the-Art Platforms", styles['SubSecHeading']))
    story.append(Paragraph(
        "To establish a rigorous theoretical and empirical foundation for SAHAYAK, three prominent national and international public grievance "
        "systems were surveyed and critically evaluated across architectural and usability parameters:",
        styles['ReportBody']
    ))
    story.append(Paragraph(
        "• <b>CPGRAMS (Centralized Public Grievance Redress and Monitoring System, GoI):</b> CPGRAMS represents an expansive multi-departmental "
        "portal managed by the Department of Administrative Reforms and Public Grievances (DARPG). While it excels at routing macro-level policy and "
        "administrative grievances across 90+ ministries, it is poorly optimized for hyper-local civic failures. It lacks map-based geo-tagging, "
        "provides no public visibility into ticket progress, and operates without an enforceable initial acknowledgement SLA.",
        styles['ReportBody']
    ))
    story.append(Paragraph(
        "• <b>FixMyStreet (mySociety, United Kingdom):</b> A pioneer in civic tech, FixMyStreet pioneered map-centric reporting of potholes and street "
        "hazards across UK local councils. While its geo-spatial tagging and public transparency are exemplary, it acts primarily as an e-mail relay "
        "to municipal councils. It possesses no built-in administrative escalation logic, lacks an algorithmic prioritization engine, and cannot enforce "
        "compliance when councils ignore forwarded e-mails.",
        styles['ReportBody']
    ))
    story.append(Paragraph(
        "• <b>Swachhata App (Ministry of Housing and Urban Affairs - MoHUA, India):</b> Developed under the Swachh Bharat Mission, this app allows "
        "citizens to report municipal waste and sanitation issues. However, its operational scope is strictly restricted to sanitation, leaving roads, "
        "stormwater drains, and public safety unaddressed. Furthermore, it lacks community-driven upvoting to prioritize urgent community-wide hazards.",
        styles['ReportBody']
    ))

    # Figure 3.1: Capability Benchmark Radar Chart
    story.append(PageMarker('fig5', tracker))
    img5 = fit_image(os.path.join(CHARTS_DIR, 'fig5_literature_benchmark.png'), target_width=390, max_height=215)
    if img5:
        story.append(img5)
        story.append(Paragraph("<b>Fig 3.1:</b> Capability Benchmarking Against Existing Platforms (Radar Analysis)", styles['FigCaption']))

    story.append(PageMarker('sub3_2', tracker))
    story.append(Paragraph("3.2 Empirical Benchmarking Matrix & Comparative Gap Analysis", styles['SubSecHeading']))
    matrix_data = [
        [
            Paragraph("<b>Benchmark Dimension</b>", styles['TableHead']),
            Paragraph("<b>CPGRAMS (Govt)</b>", styles['TableHead']),
            Paragraph("<b>FixMyStreet (UK)</b>", styles['TableHead']),
            Paragraph("<b>Swachhata (MoHUA)</b>", styles['TableHead']),
            Paragraph("<b>SAHAYAK (Proposed)</b>", styles['TableHead'])
        ],
        [
            Paragraph("<b>Enforceable 48h SLA</b>", styles['TableCellBold']),
            Paragraph("No (Vague guidelines)", styles['TableCellCenter']),
            Paragraph("No (Council dependent)", styles['TableCellCenter']),
            Paragraph("Partial (Sanitation only)", styles['TableCellCenter']),
            Paragraph("<b>Strict 48h Gateway</b>", styles['TableCellBold'])
        ],
        [
            Paragraph("<b>Community Upvoting</b>", styles['TableCellBold']),
            Paragraph("None (Strictly private)", styles['TableCellCenter']),
            Paragraph("Moderate (Social sharing)", styles['TableCellCenter']),
            Paragraph("Basic (Upvoting only)", styles['TableCellCenter']),
            Paragraph("<b>Algorithmic P(t) Scaling</b>", styles['TableCellBold'])
        ],
        [
            Paragraph("<b>Automated Escalation</b>", styles['TableCellBold']),
            Paragraph("Manual appeal only", styles['TableCellCenter']),
            Paragraph("None (No escalation)", styles['TableCellCenter']),
            Paragraph("Basic supervisory timer", styles['TableCellCenter']),
            Paragraph("<b>Hierarchical Auto-Trigger</b>", styles['TableCellBold'])
        ],
        [
            Paragraph("<b>Public Status Board</b>", styles['TableCellBold']),
            Paragraph("No (User login required)", styles['TableCellCenter']),
            Paragraph("Yes (Public map pins)", styles['TableCellCenter']),
            Paragraph("Restricted dashboard", styles['TableCellCenter']),
            Paragraph("<b>Open Transparent Kanban</b>", styles['TableCellBold'])
        ],
        [
            Paragraph("<b>Multi-Dept Scope</b>", styles['TableCellBold']),
            Paragraph("Extensive (Macro-level)", styles['TableCellCenter']),
            Paragraph("Local council issues", styles['TableCellCenter']),
            Paragraph("Sanitation / Solid waste", styles['TableCellCenter']),
            Paragraph("<b>Comprehensive Civic (All)</b>", styles['TableCellBold'])
        ]
    ]
    t_mat = Table(matrix_data, colWidths=[120, 95, 95, 95, 100])
    t_mat.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E3A8A')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor('#FFFFFF'), colors.HexColor('#F8FAFC')])
    ]))
    story.append(t_mat)
    story.append(Spacer(1, 6))

    story.append(PageMarker('sub3_3', tracker))
    story.append(Paragraph("3.3 Core Limitations of Existing Tools & SAHAYAK Value Addition", styles['SubSecHeading']))
    story.append(Paragraph(
        "The survey clearly illustrates that while individual platforms succeed at isolated aspects (FixMyStreet in geo-visualization, "
        "CPGRAMS in ministerial jurisdiction), <b>none combine strict time-bound ingestion SLAs, community-backed priority amplification, "
        "and automated escalation</b> into a cohesive civic stack. SAHAYAK directly synthesizes these missing pillars into an integrated, "
        "lightweight architecture designed for immediate deployment across municipal bodies.",
        styles['ReportBody']
    ))

    # Page Break after Section 3
    story.append(PageBreak())

    # =========================================================================
    # 6. SECTION 4: MULTI-DIMENSIONAL PROJECT FEASIBILITY ANALYSIS (PO2)
    # =========================================================================
    story.append(PageMarker('sec4', tracker))
    story.append(Paragraph("4. MULTI-DIMENSIONAL PROJECT FEASIBILITY ANALYSIS (PO2)", styles['SecHeading']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1E3A8A'), spaceBefore=2, spaceAfter=8))

    story.append(PageMarker('sub4_1', tracker))
    story.append(Paragraph("4.1 Technical Feasibility & Software Stack Evaluation", styles['SubSecHeading']))
    story.append(Paragraph(
        "The proposed technology stack has been selected to optimize high availability, horizontal scalability, rapid prototyping, and zero "
        "licensing costs by relying exclusively on proven, open-source enterprise standards:",
        styles['ReportBody']
    ))
    story.append(Paragraph("• <b>Client Tier:</b> Progressive Web Application (PWA) built with modern JavaScript (ES6+), HTML5 Geolocation API, and responsive CSS, ensuring seamless execution across both mobile smartphones and desktop municipal terminals.", styles['ReportBullet']))
    story.append(Paragraph("• <b>API & Logic Gateway:</b> Python-based RESTful service (FastAPI / Flask) or Node.js Express framework, providing high-concurrency request handling, JWT token authentication, and robust validation middleware.", styles['ReportBullet']))
    story.append(Paragraph("• <b>Database & Spatial Engine:</b> PostgreSQL with the PostGIS extension (or SQLite with SpatiaLite for local prototype demonstration), enabling spatial indexing, reverse geofencing, and ACID-compliant transactional integrity.", styles['ReportBullet']))
    story.append(Paragraph("• <b>Media Asset Storage:</b> AWS S3 / Cloudflare R2 / Local Object Bucket with SHA-256 integrity hashing and automated client-side WebP image compression to minimize mobile data consumption.", styles['ReportBullet']))

    # Figure 4.1: Feasibility Matrix Chart
    story.append(PageMarker('fig6', tracker))
    img6 = fit_image(os.path.join(CHARTS_DIR, 'fig6_feasibility_matrix.png'), target_width=440, max_height=180)
    if img6:
        story.append(img6)
        story.append(Paragraph("<b>Fig 4.1:</b> Multi-Dimensional Project Feasibility Index (PO2 Metric Breakdown)", styles['FigCaption']))

    story.append(PageMarker('sub4_2', tracker))
    story.append(Paragraph("4.2 Operational & Administrative Feasibility", styles['SubSecHeading']))
    story.append(Paragraph(
        "From an operational standpoint, SAHAYAK mirrors existing municipal grievance reporting flows, requiring zero specialized training for citizens "
        "and minimal operational overhead for municipal staff. For citizens, submitting a complaint is as intuitive as posting on social media "
        "(photo, description, auto-captured location). For municipal desk officers, the dashboard streamlines triage into a structured, 3-click workflow: "
        "[Verify Evidence] &rarr; [Assign Severity] &rarr; [Dispatch to Ward Engineer]. The automated 48-hour countdown eliminates subjective "
        "procrastination and establishes a clean operational audit trail.",
        styles['ReportBody']
    ))

    story.append(PageMarker('sub4_3', tracker))
    story.append(Paragraph("4.3 Economic, Cost & Resource Viability", styles['SubSecHeading']))
    story.append(Paragraph(
        "The financial viability of SAHAYAK is exceptionally high. Because the core system is constructed using modern open-source technologies, "
        "the prototype incurs <b>zero proprietary software licensing fees</b>. Cloud deployment on managed free tiers (e.g., Supabase, Render, "
        "Vercel, AWS Free Tier) supports full prototype validation and pilot testing without capital expenditure. For municipal bodies, the system "
        "dramatically reduces operational expenditure by eliminating paper complaint processing and preventing duplicate field inspections.",
        styles['ReportBody']
    ))

    story.append(PageMarker('sub4_4', tracker))
    story.append(Paragraph("4.4 Legal Compliance, DPDP Privacy & Future Extensibility", styles['SubSecHeading']))
    story.append(Paragraph(
        "• <b>Data Protection & Privacy (DPDP Act 2023):</b> The architecture strictly adheres to India's Digital Personal Data Protection (DPDP) Act. "
        "Complainant phone numbers and exact home addresses are encrypted at rest using AES-256 and masked on public boards to preserve citizen anonymity "
        "and prevent targeted harassment.<br/>"
        "• <b>Future Extensibility:</b> Designed with modular microservices, SAHAYAK can seamlessly incorporate AI-based automated visual damage classification "
        "(YOLOv8 pothole/garbage detection), regional language multilingual voice reporting, and direct integration with state-level CPGRAMS APIs in Phase 6.",
        styles['ReportBody']
    ))

    # Page Break after Section 4
    story.append(PageBreak())

    # =========================================================================
    # 7. SECTION 5: PROJECT ROADMAP & WORK DISTRIBUTION AMONG TEAM (PO11)
    # =========================================================================
    story.append(PageMarker('sec5', tracker))
    story.append(Paragraph("5. PROJECT ROADMAP & WORK DISTRIBUTION AMONG TEAM (PO11)", styles['SecHeading']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1E3A8A'), spaceBefore=2, spaceAfter=8))

    story.append(PageMarker('sub5_1', tracker))
    story.append(Paragraph("5.1 SDLC Methodology & Agile Execution Framework", styles['SubSecHeading']))
    story.append(Paragraph(
        "The SAHAYAK project is managed under the <b>Agile Scrum framework</b>, organized into bi-weekly sprints. This allows rapid iterative refinement, "
        "continuous verification of functional prototypes, and tight alignment with academic milestone rubrics. Each sprint concludes with a working build "
        "demonstration, code review, and automated regression testing.",
        styles['ReportBody']
    ))

    story.append(PageMarker('sub5_2', tracker))
    story.append(Paragraph("5.2 Six-Phase Milestone Roadmap & Gantt Schedule", styles['SubSecHeading']))
    story.append(Paragraph(
        "The comprehensive development lifecycle is structured across six clearly demarcated engineering phases over a 16-week timeline:",
        styles['ReportBodyLead']
    ))

    # Figure 5.1: Project Gantt Chart
    story.append(PageMarker('fig7', tracker))
    img7 = fit_image(os.path.join(CHARTS_DIR, 'fig7_project_gantt.png'), target_width=460, max_height=190)
    if img7:
        story.append(img7)
        story.append(Paragraph("<b>Fig 5.1:</b> SAHAYAK 6-Phase Milestone Schedule & SDLC Timeline (Gantt View)", styles['FigCaption']))

    phases_table_data = [
        [Paragraph("<b>Phase</b>", styles['TableHead']), Paragraph("<b>Sprint Timeline</b>", styles['TableHead']), Paragraph("<b>Core Deliverables & Engineering Milestones</b>", styles['TableHead'])],
        [
            Paragraph("<b>Phase 1: Requirements</b>", styles['TableCellBold']),
            Paragraph("Weeks 1–2 (Sprint 1)", styles['TableCellCenter']),
            Paragraph("Stakeholder requirement gathering, problem definition (PO1), literature survey (PO5), and Software Requirements Specification (SRS) documentation.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Phase 2: Core Platform</b>", styles['TableCellBold']),
            Paragraph("Weeks 3–5 (Sprint 2)", styles['TableCellCenter']),
            Paragraph("Relational DB schema implementation, citizen registration, authentication (JWT), geo-tagged complaint submission API with image upload.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Phase 3: Routing & Triage</b>", styles['TableCellBold']),
            Paragraph("Weeks 5–7 (Sprint 3)", styles['TableCellCenter']),
            Paragraph("Category-based departmental routing engine (Municipal, Police, Electricity), role-based authority portal, and ticket assignment workflow.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Phase 4: SLA & Escalation</b>", styles['TableCellBold']),
            Paragraph("Weeks 7–9 (Sprint 4)", styles['TableCellCenter']),
            Paragraph("Implementation of the 48-hour countdown SLA gateway, community upvoting engine, logarithmic priority scaling P(t), and automatic escalation triggers.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Phase 5: Public Dashboards</b>", styles['TableCellBold']),
            Paragraph("Weeks 10–13 (Sprint 5)", styles['TableCellCenter']),
            Paragraph("Public-facing status board, interactive geo-map view, automated SMS/email notifications, and departmental resolution performance analytics.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Phase 6: Pilot & Rollout</b>", styles['TableCellBold']),
            Paragraph("Weeks 13–16 (Sprint 6)", styles['TableCellCenter']),
            Paragraph("End-to-end integration testing, mock ward pilot rollout, user acceptance testing (UAT), final project documentation, and faculty viva presentation.", styles['TableCell'])
        ]
    ]
    t_phase = Table(phases_table_data, colWidths=[115, 100, 290])
    t_phase.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E3A8A')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor('#FFFFFF'), colors.HexColor('#F8FAFC')])
    ]))
    story.append(t_phase)
    story.append(Spacer(1, 8))

    story.append(PageMarker('sub5_3', tracker))
    story.append(Paragraph("5.3 Program Outcome Workload Allocation & RACI Matrix", styles['SubSecHeading']))
    story.append(Paragraph(
        "To ensure balanced participation and satisfy Program Outcome 11 (Project Management & Team Dynamics), responsibilities have been mapped "
        "across all four team members using an authoritative RACI (Responsible, Accountable, Consulted, Informed) matrix:",
        styles['ReportBody']
    ))

    # Figure 5.2: Workload Allocation
    story.append(PageMarker('fig8', tracker))
    img8 = fit_image(os.path.join(CHARTS_DIR, 'fig8_work_distribution.png'), target_width=440, max_height=180)
    if img8:
        story.append(img8)
        story.append(Paragraph("<b>Fig 5.2:</b> Program Outcome (PO11) Team Workload & Task Allocation", styles['FigCaption']))

    raci_data = [
        [
            Paragraph("<b>Project Work Package / Module</b>", styles['TableHead']),
            Paragraph("<b>Member 1 (Backend)</b>", styles['TableHead']),
            Paragraph("<b>Member 2 (Frontend)</b>", styles['TableHead']),
            Paragraph("<b>Member 3 (Algorithms)</b>", styles['TableHead']),
            Paragraph("<b>Member 4 (QA & Docs)</b>", styles['TableHead'])
        ],
        [
            Paragraph("SRS Formulation & PO1 Problem Definition", styles['TableCellBold']),
            Paragraph("Accountable", styles['TableCellCenter']),
            Paragraph("Consulted", styles['TableCellCenter']),
            Paragraph("Consulted", styles['TableCellCenter']),
            Paragraph("Responsible", styles['TableCellCenter'])
        ],
        [
            Paragraph("Relational DB Design & API Gateway", styles['TableCellBold']),
            Paragraph("Responsible", styles['TableCellCenter']),
            Paragraph("Consulted", styles['TableCellCenter']),
            Paragraph("Informed", styles['TableCellCenter']),
            Paragraph("Informed", styles['TableCellCenter'])
        ],
        [
            Paragraph("Citizen PWA & Interactive Geo-Map UI", styles['TableCellBold']),
            Paragraph("Consulted", styles['TableCellCenter']),
            Paragraph("Responsible", styles['TableCellCenter']),
            Paragraph("Informed", styles['TableCellCenter']),
            Paragraph("Informed", styles['TableCellCenter'])
        ],
        [
            Paragraph("48h SLA Engine & Dynamic Priority P(t)", styles['TableCellBold']),
            Paragraph("Consulted", styles['TableCellCenter']),
            Paragraph("Informed", styles['TableCellCenter']),
            Paragraph("Responsible", styles['TableCellCenter']),
            Paragraph("Informed", styles['TableCellCenter'])
        ],
        [
            Paragraph("Security Audit, DPDP Compliance & QA", styles['TableCellBold']),
            Paragraph("Consulted", styles['TableCellCenter']),
            Paragraph("Consulted", styles['TableCellCenter']),
            Paragraph("Informed", styles['TableCellCenter']),
            Paragraph("Responsible", styles['TableCellCenter'])
        ],
        [
            Paragraph("Evaluation 1 Report & Presentation Deck", styles['TableCellBold']),
            Paragraph("Accountable", styles['TableCellCenter']),
            Paragraph("Responsible", styles['TableCellCenter']),
            Paragraph("Responsible", styles['TableCellCenter']),
            Paragraph("Responsible", styles['TableCellCenter'])
        ]
    ]
    t_raci = Table(raci_data, colWidths=[165, 85, 85, 85, 85])
    t_raci.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E3A8A')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor('#FFFFFF'), colors.HexColor('#F8FAFC')])
    ]))
    story.append(t_raci)

    # Page Break after Section 5
    story.append(PageBreak())

    # =========================================================================
    # 8. SECTION 6: TECHNICAL DESIGN SPECIFICATIONS & SCHEMAS
    # =========================================================================
    story.append(PageMarker('sec6', tracker))
    story.append(Paragraph("6. TECHNICAL DESIGN SPECIFICATIONS & SCHEMAS", styles['SecHeading']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1E3A8A'), spaceBefore=2, spaceAfter=8))

    story.append(PageMarker('sub6_1', tracker))
    story.append(Paragraph("6.1 Relational Database Entity-Relationship (ER) Schema", styles['SubSecHeading']))
    story.append(Paragraph(
        "The relational database schema is normalized to 3NF, ensuring data integrity, foreign key consistency, and fast spatial query execution:",
        styles['ReportBody']
    ))

    schema_data = [
        [Paragraph("<b>Entity Table</b>", styles['TableHead']), Paragraph("<b>Primary Key</b>", styles['TableHead']), Paragraph("<b>Key Attributes & Foreign Keys</b>", styles['TableHead']), Paragraph("<b>Functional Responsibility</b>", styles['TableHead'])],
        [
            Paragraph("<b>USERS</b>", styles['TableCellBold']),
            Paragraph("user_id (UUID)", styles['CodeStyle']),
            Paragraph("email, phone_hash, role (CITIZEN, OFFICER, ADMIN), created_at", styles['TableCell']),
            Paragraph("Authentication & RBAC identity management", styles['TableCell'])
        ],
        [
            Paragraph("<b>GRIEVANCES</b>", styles['TableCellBold']),
            Paragraph("ticket_id (UUID)", styles['CodeStyle']),
            Paragraph("citizen_id (FK), dept_id (FK), category, title, description, lat, lng, ward_id, status, base_severity, priority_score, sla_deadline, created_at", styles['TableCell']),
            Paragraph("Core ticket lifecycle, telemetry & spatial parameters", styles['TableCell'])
        ],
        [
            Paragraph("<b>MEDIA_ASSETS</b>", styles['TableCellBold']),
            Paragraph("media_id (UUID)", styles['CodeStyle']),
            Paragraph("ticket_id (FK), image_url, sha256_hash, asset_type (INITIAL, RESOLUTION), uploaded_at", styles['TableCell']),
            Paragraph("Photographic evidence verification & audit trail", styles['TableCell'])
        ],
        [
            Paragraph("<b>UPVOTES</b>", styles['TableCellBold']),
            Paragraph("upvote_id (UUID)", styles['CodeStyle']),
            Paragraph("ticket_id (FK), user_id (FK), timestamp [UNIQUE(ticket_id, user_id)]", styles['TableCell']),
            Paragraph("Prevents duplicate votes; feeds logarithmic priority", styles['TableCell'])
        ],
        [
            Paragraph("<b>ESCALATIONS</b>", styles['TableCellBold']),
            Paragraph("escalation_id (UUID)", styles['CodeStyle']),
            Paragraph("ticket_id (FK), tier_level (1, 2), trigger_type (SLA_EXPIRED, PRIORITY_BURST), escalated_to, timestamp", styles['TableCell']),
            Paragraph("Administrative accountability & compliance auditing", styles['TableCell'])
        ]
    ]
    t_schema = Table(schema_data, colWidths=[85, 75, 205, 140])
    t_schema.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E3A8A')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor('#FFFFFF'), colors.HexColor('#F8FAFC')])
    ]))
    story.append(t_schema)
    story.append(Spacer(1, 8))

    story.append(PageMarker('sub6_2', tracker))
    story.append(Paragraph("6.2 Data Flow Diagrams (DFD Level 0 & Level 1)", styles['SubSecHeading']))
    story.append(Paragraph(
        "• <b>Level 0 Context Diagram:</b> The External Citizen entity transmits Grievance Submissions (photos, coordinates, descriptions) "
        "and Upvotes into the central SAHAYAK System. The System serves Status Trackers and Notifications back to the Citizen. "
        "The External Municipal Officer entity receives Triaged Work Orders and returns Verification and Resolution Proofs.<br/>"
        "• <b>Level 1 Operational DFD:</b> Submissions pass through Process 1.0 (Auth & Validation) &rarr; Data Store D1 (Tickets) &rarr; "
        "Process 2.0 (48h SLA Gateway) &rarr; Process 3.0 (Department Triage & Officer Assignment) &rarr; Process 4.0 (Community Upvoting & "
        "Priority Recalculation) &rarr; Process 5.0 (Automated Escalation Daemon) &rarr; Process 6.0 (Resolution Verification & Public Board Display).",
        styles['ReportBody']
    ))

    story.append(PageMarker('sub6_3', tracker))
    story.append(Paragraph("6.3 RESTful API Endpoint Definitions & Payload Contracts", styles['SubSecHeading']))
    api_data = [
        [Paragraph("<b>HTTP Method & Path</b>", styles['TableHead']), Paragraph("<b>Access Level</b>", styles['TableHead']), Paragraph("<b>Payload Parameters / Purpose</b>", styles['TableHead'])],
        [
            Paragraph("POST /api/v1/grievances", styles['CodeStyle']),
            Paragraph("Authenticated Citizen", styles['TableCellBold']),
            Paragraph("Payload: {title, category, description, lat, lng, image_file}. Starts 48h SLA timer.", styles['TableCell'])
        ],
        [
            Paragraph("POST /api/v1/grievances/{id}/upvote", styles['CodeStyle']),
            Paragraph("Authenticated Citizen", styles['TableCellBold']),
            Paragraph("Registers single upvote. Triggers asynchronous priority recalculation P(t).", styles['TableCell'])
        ],
        [
            Paragraph("PATCH /api/v1/officer/triage/{id}", styles['CodeStyle']),
            Paragraph("Department Officer", styles['TableCellBold']),
            Paragraph("Payload: {status: 'APPROVED', base_severity: 40, assigned_ward: 12}. Stops 48h SLA clock.", styles['TableCell'])
        ],
        [
            Paragraph("POST /api/v1/officer/resolve/{id}", styles['CodeStyle']),
            Paragraph("Field Engineer", styles['TableCellBold']),
            Paragraph("Payload: {status: 'RESOLVED', resolution_photo: file, notes: text}. Moves ticket to review.", styles['TableCell'])
        ],
        [
            Paragraph("GET /api/v1/public/board", styles['CodeStyle']),
            Paragraph("Public (No Auth)", styles['TableCellBold']),
            Paragraph("Query: ?ward_id=12&category=ROADS&sort=priority. Returns public grievance stream.", styles['TableCell'])
        ]
    ]
    t_api = Table(api_data, colWidths=[150, 95, 260])
    t_api.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E3A8A')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor('#FFFFFF'), colors.HexColor('#F8FAFC')])
    ]))
    story.append(t_api)

    # =========================================================================
    # 9. SECTION 7: CONCLUSION & EVALUATION 1 SUMMARY
    # =========================================================================
    story.append(Spacer(1, 10))
    story.append(PageMarker('sec7', tracker))
    story.append(Paragraph("7. CONCLUSION & EVALUATION 1 SUMMARY", styles['SecHeading']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1E3A8A'), spaceBefore=2, spaceAfter=8))

    story.append(Paragraph(
        "The Evaluation 1 milestone for <b>SAHAYAK</b> establishes a comprehensive, mathematically grounded, and socially critical "
        "systems architecture for next-generation civic grievance handling. By addressing the fundamental systemic failures of opacity, "
        "arbitrary triage, and administrative procrastination, SAHAYAK introduces a transparent, community-backed governance paradigm.",
        styles['ReportBodyLead']
    ))
    story.append(Paragraph("<b>Summary of Completed Evaluation 1 Deliverables:</b>", styles['SubSecHeading']))
    story.append(Paragraph("• <b>PO1 Verification:</b> Established clear problem formulation with empirical verification of urban center grievance distribution and latency bottlenecks.", styles['ReportBullet']))
    story.append(Paragraph("• <b>PO4 Verification:</b> Formulated multi-tier system architecture, finite state machine, and logarithmic dynamic priority model P(t).", styles['ReportBullet']))
    story.append(Paragraph("• <b>PO5 Verification:</b> Completed comprehensive comparative benchmarking against CPGRAMS, FixMyStreet, and Swachhata App across 6 critical operational dimensions.", styles['ReportBullet']))
    story.append(Paragraph("• <b>PO2 Verification:</b> Proved technical, operational, economic, and DPDP legal feasibility with open-source stack design.", styles['ReportBullet']))
    story.append(Paragraph("• <b>PO11 Verification:</b> Developed 6-phase Gantt execution roadmap and RACI workload distribution across all four team members.", styles['ReportBullet']))

    story.append(Spacer(1, 8))
    story.append(PageMarker('sec8', tracker))
    story.append(Paragraph("8. REFERENCES & ACADEMIC BIBLIOGRAPHY", styles['SubSecHeading']))
    refs = [
        "[1] Department of Administrative Reforms and Public Grievances (DARPG), 'Annual Report on Centralized Public Grievance Redress and Monitoring System (CPGRAMS)', Government of India, 2024.",
        "[2] mySociety, 'FixMyStreet: Open-Source Civic Problem Reporting Platform Architecture & Impact Report', London, UK, 2023.",
        "[3] Ministry of Housing and Urban Affairs (MoHUA), 'Swachhata App Guidelines & ULB Sanitation Monitoring Protocol', Swachh Bharat Mission (Urban), New Delhi, 2022.",
        "[4] Press Information Bureau (PIB), 'Digital Personal Data Protection (DPDP) Act 2023: Compliance Framework for Digital Governance Platforms', Ministry of Law and Justice, Govt of India, 2023.",
        "[5] Sommerville, I., 'Software Engineering', 10th Edition, Pearson Education, 2016 (Agile Frameworks and Systems Requirements Formulation).",
        "[6] Pressman, R. S., and Maxim, B. R., 'Software Engineering: A Practitioner's Approach', 9th Edition, McGraw-Hill, 2020."
    ]
    for r in refs:
        story.append(Paragraph(r, styles['ReportBullet']))

    return story


def build_pdf_report():
    print(f"Building Evaluation 1 Design Report PDF -> {OUTPUT_PDF}")
    styles = get_report_styles()

    # Pass 1: Build temp PDF to track exact page numbers for each section
    tracker = {}
    temp_pdf = os.path.join(BASE_DIR, 'temp_pass1.pdf')
    doc1 = SimpleDocTemplate(
        temp_pdf,
        pagesize=A4,
        leftMargin=45,
        rightMargin=45,
        topMargin=48,
        bottomMargin=45
    )
    story1 = generate_story(styles, tracker=tracker)
    doc1.build(story1, canvasmaker=NumberedCanvas)
    print(f"Pass 1 Completed! Tracked page positions: {tracker}")

    # Pass 2: Build final publication PDF using exact tracked page numbers
    doc2 = SimpleDocTemplate(
        OUTPUT_PDF,
        pagesize=A4,
        leftMargin=45,
        rightMargin=45,
        topMargin=48,
        bottomMargin=45
    )
    story2 = generate_story(styles, tracker=None, page_numbers=tracker)
    doc2.build(story2, canvasmaker=NumberedCanvas)

    if os.path.exists(temp_pdf):
        os.remove(temp_pdf)

    print("ReportLab two-pass build successful!")
    print(f"Final Verified PDF: {OUTPUT_PDF}")


if __name__ == '__main__':
    build_pdf_report()
