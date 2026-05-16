// Single source of truth for site copy & configuration (Thai-first).

export const SITE = {
  name: "Software PM Tools",
  url: "https://softwarepmtools.com",
  tagline:
    "เครื่องมือช่วยประเมินและวางแผน Software Project สำหรับ PM และเจ้าของธุรกิจ",
  email: "contact@softwarepmtools.com",
  // TODO: replace with the real Google Form URL before launch.
  googleFormUrl: "https://forms.gle/REPLACE_WITH_REAL_FORM_URL",
} as const;

export const NAV: { label: string; href: string }[] = [
  { label: "หน้าแรก", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "ประเมินโปรเจกต์", href: "/tools/project-estimation" },
  { label: "บริการ", href: "/services" },
  { label: "เกี่ยวกับ", href: "/about" },
  { label: "ติดต่อ", href: "/contact" },
];

export const PRIMARY_CTA = {
  label: "เริ่มประเมินฟรี",
  href: "/tools/project-estimation",
} as const;

export const HERO = {
  headline:
    "เครื่องมือช่วยประเมินและวางแผน Software Project สำหรับ PM และเจ้าของธุรกิจ",
  subheadline:
    "คำนวณ Man-day, Budget, Timeline และความเสี่ยงเบื้องต้น ก่อนเริ่มจ้าง Vendor หรือเริ่มพัฒนา Software Project",
  primaryCta: { label: "เริ่มประเมินฟรี", href: "/tools/project-estimation" },
  secondaryCta: { label: "ดูบริการ Consulting", href: "/services" },
} as const;

/** Lead-capture button labels — all open the Google Form in a new tab. */
export const LEAD_CTAS = {
  quickEstimate: "ขอ Quick Estimate Review",
  sowReady: "ขอ SOW Ready Pack",
  proposalReview: "ส่ง Proposal ให้ช่วยตรวจ",
  contactProject: "ติดต่อปรึกษาโครงการ",
  reviewScope: "ให้ช่วย Review Scope นี้",
} as const;

export type LeadCtaKey = keyof typeof LEAD_CTAS;

/** Conversion copy — clear intent, low pressure. */
export const LEAD_COPY = {
  proposal:
    "มี Requirement หรือ Proposal แล้ว? ส่งมาให้ช่วยประเมินก่อนตัดสินใจจ้าง Vendor",
  scope:
    "ไม่แน่ใจว่า Scope นี้ควรใช้งบเท่าไหร่? ให้ช่วย Review แบบมืออาชีพได้",
  afterEstimate:
    "ใช้ผลประเมินนี้เป็นจุดเริ่มต้น แล้วให้ผู้เชี่ยวชาญช่วยตรวจ Scope, Budget และ Risk เพิ่มเติม",
} as const;

/** Honest, non-pushy reassurance shown under CTA button groups. */
export const LEAD_REASSURANCE = "สอบถามฟรี ไม่มีข้อผูกมัด";

export const TRUST_POINTS: string[] = [
  "ใช้สำหรับประเมินเบื้องต้นก่อนคุยกับ Vendor",
  "เหมาะสำหรับ PM, BA, Founder และทีม IT",
  "ช่วยลดความเสี่ยงจาก Scope ไม่ชัดและงบบาน",
  "ออกแบบจากมุมมอง Software Project Management",
];

export const PAIN_POINTS: string[] = [
  "ไม่รู้ว่า Software Project ควรใช้งบเท่าไหร่",
  "Requirement ยังไม่ชัด",
  "กลัว Vendor ตีราคาแพงเกินจริง",
  "Scope บานระหว่างทาง",
  "ไม่มี SOW หรือ Acceptance Criteria ที่ชัดเจน",
  "ไม่รู้ว่า Timeline ที่ Vendor เสนอสมจริงหรือไม่",
];

export const CAPABILITIES: { title: string; desc: string }[] = [
  {
    title: "Estimate Man-day",
    desc: "ประเมินแรงงานที่ต้องใช้จริงตามขอบเขตและความซับซ้อนของงาน",
  },
  {
    title: "Estimate Budget",
    desc: "ให้กรอบงบประมาณเบื้องต้นตามอัตราตลาดเพื่อใช้ตั้งต้นเจรจา",
  },
  {
    title: "Recommend Timeline",
    desc: "แนะนำกรอบเวลาที่สมเหตุสมผลตามปริมาณงาน",
  },
  {
    title: "Identify Risk",
    desc: "ชี้จุดเสี่ยงด้านงบ เวลา และความซับซ้อนตั้งแต่ต้น",
  },
  {
    title: "Prepare for SOW",
    desc: "ช่วยจัดระเบียบขอบเขตงานให้พร้อมต่อยอดเป็น SOW",
  },
  {
    title: "Support Vendor Discussion",
    desc: "มีตัวเลขอ้างอิงสำหรับคุยและต่อรองกับ Vendor อย่างมีหลักการ",
  },
];

export interface Tool {
  id: string;
  name: string;
  description: string;
  status: "available" | "coming_soon";
  /** Who this tool is primarily for. */
  targetUser: string;
  href?: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  tools: Tool[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "estimation-planning",
    name: "Estimation & Planning",
    description: "ประเมินงบ เวลา และทีม ก่อนเริ่มโครงการ",
    tools: [
      {
        id: "project-estimation",
        name: "Software Project Estimation Calculator",
        description:
          "ประเมิน Man-day งบประมาณ Timeline และความเสี่ยงของโปรเจกต์ภายในไม่กี่นาที",
        status: "available",
        targetUser: "PM, BA, Founder, เจ้าของธุรกิจ",
        href: "/tools/project-estimation",
      },
      {
        id: "timeline-planner",
        name: "Timeline Planner",
        description:
          "วางแผน Phase และ Milestone ของโครงการให้สอดคล้องกับ Man-day ที่ประเมินไว้",
        status: "coming_soon",
        targetUser: "Project Manager, Delivery Lead",
      },
      {
        id: "team-role-breakdown",
        name: "Team Role Breakdown Calculator",
        description:
          "คำนวณสัดส่วน PM, BA, Dev, QA, DevOps ที่ต้องใช้ตามขนาดงาน",
        status: "coming_soon",
        targetUser: "PM, Resource Manager",
      },
    ],
  },
  {
    id: "requirement-scope",
    name: "Requirement & Scope",
    description: "ทำขอบเขตและเอกสารให้ชัดก่อนจ้าง Vendor",
    tools: [
      {
        id: "sow-generator",
        name: "SOW Generator",
        description:
          "สร้างร่าง Statement of Work พร้อม Scope, Assumptions และ Acceptance Criteria",
        status: "coming_soon",
        targetUser: "PM, BA, ทีมจัดซื้อ / Procurement",
      },
      {
        id: "requirement-breakdown",
        name: "Requirement Breakdown Tool",
        description: "แตก Requirement เป็น Feature และ Task ที่ประเมินได้",
        status: "coming_soon",
        targetUser: "Business Analyst, Product Owner",
      },
      {
        id: "acceptance-criteria",
        name: "Acceptance Criteria Generator",
        description:
          "สร้างเกณฑ์การตรวจรับงานที่วัดผลได้ สำหรับแต่ละ Feature",
        status: "coming_soon",
        targetUser: "BA, QA, Product Owner",
      },
    ],
  },
  {
    id: "delivery-control",
    name: "Delivery & Control",
    description: "ควบคุมการส่งมอบและความเสี่ยงระหว่างโครงการ",
    tools: [
      {
        id: "uat-test-case",
        name: "UAT Test Case Generator",
        description: "สร้างชุด Test Case สำหรับการทดสอบ UAT อย่างเป็นระบบ",
        status: "coming_soon",
        targetUser: "QA, UAT Coordinator, BA",
      },
      {
        id: "raid-log",
        name: "RAID Log Generator",
        description: "จัดทำ Risks, Assumptions, Issues และ Dependencies",
        status: "coming_soon",
        targetUser: "Project Manager, PMO",
      },
      {
        id: "steering-report",
        name: "Steering Report Generator",
        description: "สรุปสถานะโครงการสำหรับนำเสนอผู้บริหาร",
        status: "coming_soon",
        targetUser: "PM, PMO, ผู้บริหารโครงการ",
      },
      {
        id: "vendor-proposal-checklist",
        name: "Vendor Proposal Review Checklist",
        description:
          "เช็กลิสต์ตรวจข้อเสนอ Vendor ก่อนตัดสินใจเซ็นสัญญา",
        status: "coming_soon",
        targetUser: "เจ้าของธุรกิจ, ทีมจัดซื้อ, PM",
      },
    ],
  },
];

/** Flat list derived from categories — used by the home-page preview grid. */
export const TOOLS: Tool[] = TOOL_CATEGORIES.flatMap((c) => c.tools);

export interface ServicePackage {
  id: string;
  name: string;
  tagline: string;
  /** Display price, e.g. "3,900 บาท". */
  startingPrice: string;
  /** Billing model used by the comparison table. */
  billing: "ครั้งเดียว" | "รายเดือน";
  description: string;
  /** Who this package is for. */
  forWho: string[];
  deliverables: string[];
}

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: "quick-estimate-review",
    name: "Quick Estimate Review",
    tagline: "รู้กรอบงบและเวลาก่อนเริ่มจริง",
    startingPrice: "3,900 บาท",
    billing: "ครั้งเดียว",
    description:
      "ให้ PM จริงช่วยรีวิว Scope และประเมิน Man-day งบประมาณ และ Timeline เบื้องต้น เพื่อให้คุณเริ่มต้นวางแผนได้อย่างมั่นใจ",
    forWho: [
      "คนที่มีไอเดียหรือ Requirement เบื้องต้น",
      "ต้องการรู้ว่างบประมาณและระยะเวลาควรอยู่ประมาณไหน",
    ],
    deliverables: [
      "รีวิว Scope (Scope review)",
      "ประเมิน Man-day (Man-day estimate)",
      "ประเมินงบประมาณ (Budget estimate)",
      "แนะนำ Timeline (Timeline recommendation)",
      "แจ้งเตือนความเสี่ยง (Risk warning)",
      "สรุปผล 1 หน้า (1-page summary)",
    ],
  },
  {
    id: "sow-ready-pack",
    name: "SOW Ready Pack",
    tagline: "เอกสาร Scope of Work พร้อมจ้าง Vendor",
    startingPrice: "19,900 บาท",
    billing: "ครั้งเดียว",
    description:
      "จัดทำเอกสาร Scope of Work ครบชุด พร้อม Acceptance Criteria และ Assumptions ให้คุณใช้คุยและทำสัญญากับ Vendor ได้ทันที",
    forWho: [
      "บริษัทที่กำลังจะจ้าง Vendor",
      "ทีมที่ต้องการเอกสาร Scope of Work ก่อนเริ่มโครงการ",
    ],
    deliverables: [
      "ที่มาของโครงการ (Project background)",
      "วัตถุประสงค์ (Objective)",
      "ขอบเขตงาน (Scope of Work)",
      "ขอบเขตเชิงฟังก์ชัน (Functional scope)",
      "สิ่งที่อยู่นอกขอบเขต (Out of scope)",
      "ข้อสมมุติฐาน (Assumptions)",
      "สิ่งที่ส่งมอบ (Deliverables)",
      "เกณฑ์การตรวจรับ (Acceptance criteria)",
      "Timeline ระดับภาพรวม (High-level timeline)",
      "ความเสี่ยงและ Dependency (Risk and dependency)",
    ],
  },
  {
    id: "vendor-proposal-review",
    name: "Vendor Proposal Review",
    tagline: "ตรวจข้อเสนอ Vendor ก่อนเซ็นสัญญา",
    startingPrice: "29,900 บาท",
    billing: "ครั้งเดียว",
    description:
      "วิเคราะห์ Proposal จาก Vendor ทั้งด้าน Scope ราคา Timeline และ Risk พร้อมคำแนะนำก่อนตัดสินใจเซ็นสัญญา",
    forWho: [
      "บริษัทที่ได้รับ Proposal จาก Vendor แล้ว",
      "ต้องการตรวจว่า Scope, ราคา, Timeline และ Risk เหมาะสมหรือไม่",
    ],
    deliverables: [
      "รีวิว Proposal (Proposal review)",
      "วิเคราะห์ช่องว่างของ Scope (Scope gap analysis)",
      "ตรวจความสมเหตุสมผลของราคา (Cost reasonableness check)",
      "ตรวจสอบ Timeline (Timeline check)",
      "ทบทวนความเสี่ยงและข้อสมมุติฐาน (Risk and assumption review)",
      "สรุปสำหรับผู้บริหาร (Executive summary)",
      "ข้อแนะนำก่อนเซ็นสัญญา (Recommendation before signing)",
    ],
  },
  {
    id: "pm-as-a-service",
    name: "PM-as-a-Service",
    tagline: "PM part-time ดูแลโครงการให้ต่อเนื่อง",
    startingPrice: "30,000 บาท / เดือน",
    billing: "รายเดือน",
    description:
      "PM มืออาชีพแบบ part-time ช่วยคุม Scope, Timeline, Risk ประสานงาน Vendor และรายงานผู้บริหารตลอดโครงการ",
    forWho: [
      "SME หรือองค์กรที่ต้องการ PM part-time",
      "ทีมที่มี Vendor แล้วแต่ต้องการคนช่วยคุม Scope, Timeline, Risk",
    ],
    deliverables: [
      "ติดตามโครงการรายสัปดาห์ (Weekly project tracking)",
      "บริหาร Issue และ Risk (Issue and risk management)",
      "ประสานงานกับ Vendor (Vendor coordination)",
      "สรุปความคืบหน้า (Progress summary)",
      "สนับสนุน Steering report",
      "ประสานงาน UAT และ Go-live",
    ],
  },
];

/** Scenario → recommended package. Mirrors the calculator's budget logic. */
export const RECOMMEND_LOGIC: { situation: string; packageId: string }[] = [
  {
    situation:
      "มีแค่ไอเดียหรือ Requirement เบื้องต้น อยากรู้ว่างบและเวลาควรอยู่ประมาณไหน",
    packageId: "quick-estimate-review",
  },
  {
    situation:
      "กำลังจะจ้าง Vendor และต้องการเอกสาร Scope of Work ที่ใช้ทำสัญญาได้",
    packageId: "sow-ready-pack",
  },
  {
    situation:
      "ได้รับ Proposal จาก Vendor แล้ว และต้องการตรวจ Scope ราคา Timeline ก่อนเซ็น",
    packageId: "vendor-proposal-review",
  },
  {
    situation:
      "มี Vendor แล้วแต่ไม่มีคนคุมงาน ต้องการ PM ช่วยดูแล Scope, Timeline, Risk",
    packageId: "pm-as-a-service",
  },
];

/** Capability matrix for the comparison table (true = included). */
export const SERVICE_COMPARISON: { label: string; values: boolean[] }[] = [
  // Order of columns follows SERVICE_PACKAGES.
  {
    label: "รีวิว Scope และประเมินงบ / Man-day / Timeline",
    values: [true, true, true, false],
  },
  {
    label: "จัดทำเอกสาร SOW และ Acceptance Criteria",
    values: [false, true, false, false],
  },
  {
    label: "ตรวจ Proposal และความสมเหตุสมผลของราคา Vendor",
    values: [false, false, true, false],
  },
  {
    label: "บริหารโครงการและคุม Risk ต่อเนื่อง",
    values: [false, false, false, true],
  },
  {
    label: "ประสานงาน Vendor / UAT / Go-live",
    values: [false, false, false, true],
  },
  {
    label: "สรุปสำหรับผู้บริหาร (Executive / Steering)",
    values: [true, false, true, true],
  },
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "ผลประเมินจากเครื่องมือนี้แม่นยำแค่ไหน?",
    a: "เป็นการประเมินเบื้องต้นเชิงตัวเลขตามอัตราตลาด เพื่อใช้ตั้งต้นวางแผนและเจรจา ไม่ใช่ใบเสนอราคา แนะนำให้ตรวจสอบกับ PM จริงก่อนตัดสินใจ",
  },
  {
    q: "ต้องสมัครสมาชิกหรือเสียค่าใช้จ่ายไหม?",
    a: "เครื่องมือประเมินใช้งานได้ฟรี ไม่ต้องสมัครสมาชิก ส่วนบริการ Consulting เป็นบริการเสริมแบบมีค่าใช้จ่าย",
  },
  {
    q: "ข้อมูลที่กรอกถูกเก็บไว้หรือไม่?",
    a: "เวอร์ชันนี้คำนวณบนเครื่องของคุณ ไม่มีการส่งหรือบันทึกข้อมูลไปยังเซิร์ฟเวอร์",
  },
  {
    q: "เหมาะกับโปรเจกต์ประเภทไหน?",
    a: "เหมาะกับ Web, Mobile, ระบบภายใน, API และ E-commerce ที่ต้องวางแผนงบ เวลา และขอบเขตก่อนเริ่ม",
  },
  {
    q: "ขอให้ทีมช่วยรีวิวผลประเมินได้ไหม?",
    a: "ได้ครับ เลือกบริการ Quick Estimate Review หรือบริการอื่นที่เกี่ยวข้อง แล้วส่งรายละเอียดผ่านแบบฟอร์มติดต่อ",
  },
];

export const SERVICES_FAQ: { q: string; a: string }[] = [
  {
    q: "ราคาที่แสดงเป็นราคาสุดท้ายหรือไม่?",
    a: "เป็นราคาเริ่มต้น (starting price) ราคาจริงขึ้นกับขนาดและความซับซ้อนของโปรเจกต์ เราจะยืนยันขอบเขตและราคาก่อนเริ่มงานเสมอ",
  },
  {
    q: "ใช้เวลาดำเนินการนานแค่ไหน?",
    a: "Quick Estimate Review โดยทั่วไปใช้เวลาไม่กี่วันทำการ ส่วน SOW Ready Pack และ Vendor Proposal Review ขึ้นกับความซับซ้อนของ Scope จะแจ้งกรอบเวลาก่อนเริ่มงาน",
  },
  {
    q: "ยังไม่มีผลประเมินจากเครื่องมือ ใช้บริการได้ไหม?",
    a: "ได้ครับ ไม่จำเป็นต้องใช้เครื่องมือก่อน แต่ถ้าลองประเมินเบื้องต้นมาก่อน จะช่วยให้การพูดคุยเร็วและตรงจุดขึ้น",
  },
  {
    q: "PM-as-a-Service มีสัญญาผูกมัดระยะยาวไหม?",
    a: "คิดค่าบริการเป็นรายเดือน ปรับขอบเขตและต่อเนื่องตามความต้องการของโครงการได้ ไม่บังคับสัญญาระยะยาว",
  },
  {
    q: "ถ้าไม่แน่ใจว่าควรเลือกแพ็กเกจไหน?",
    a: "ส่งรายละเอียดโครงการผ่านแบบฟอร์มติดต่อ เราจะช่วยแนะนำแพ็กเกจที่เหมาะกับสถานการณ์ของคุณก่อนเริ่มงาน",
  },
];

export function getServicePackage(id: string): ServicePackage | undefined {
  return SERVICE_PACKAGES.find((p) => p.id === id);
}
