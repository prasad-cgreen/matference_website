// Central content data for the cGreen site

export const NAV = [
  { label: "Home", href: "#hero" },
  {
    label: "About Us",
    dropdown: [
      { label: "About cGreen", href: "#about" },
      { label: "Our Teams", href: "#team" },
      { label: "Partners in Impact", href: "#partners" },
    ],
  },
  {
    label: "Services",
    dropdown: [
      { label: "Platform", href: "#platform" },
      { label: "Pragati Kendra", href: "#services", tab: "pragati" },
      { label: "Lending Institution", href: "#services", tab: "lending" },
    ],
  },
  { label: "Life at CGreen", to: "/life-at-cgreen" },
  { label: "Contact Us", href: "#contact" },
];

export const HERO_ORBIT = {
  outer: ["Bank", "Call Centres", "NBFC", "Digital Infrastructure", "Higher Trust"],
  inner: ["Financial Literacy", "Collection Agencies", "High Phone Connectivity", "Locatable Addresses"],
};

export const RURAL_ORBIT = {
  outer: ["High Delinquency", "Broken Trust", "No Empathy"],
  inner: ["Lender Overload", "Financial Illiteracy", "Lack of Banks & NBFC"],
};

export const BHARAT_COPY = [
  "Across Bharat, changing borrower realities often remain invisible to traditional collection systems. Outdated data and disconnected channels can cause genuine hardship, disputes and intentional non-payment to be treated alike. Borrowers face increasing distress, while lenders struggle with rising delinquencies and limited customer understanding.",
  "CGreen bridges this gap by combining verified data, empathetic engagement and local execution.",
];

export const STATS = [
  { value: 10, suffix: "+", label: "Lenders" },
  { value: 4, suffix: "", label: "States" },
  { value: 35, suffix: "", label: "Districts" },
  { value: 957, suffix: "K+", label: "Villages" },
];

export const SOLUTION_CAPTIONS = [
  "Risk Scoring",
  "Socioeconomic & Demographic Validation",
  "Financial Inclusion",
  "Customer Place Verification",
  "Digital Connect",
  "Rural Infra",
  "Pragati Kendra",
  "Voice Transcription",
  "Intent & Ability Verification",
];

export const VISION =
  "To build Bharat's most trusted, AI-led customer-resolution network—combining digital scale, multilingual intelligence, responsible human engagement and dependable local presence. We envision a future where lenders do not act only on delinquency status, but on a continuously updated understanding of the customer's intent, ability, contactability and circumstances.";

export const MISSION =
  "CGreen's mission is to build a connected, technology-enabled resolution network across 200 districts in Bharat. Through one cloud platform, trained remote teams and local Pragati Kendras, we aim to deliver digital, remote and field collections, contact-point verification and actionable customer intelligence. Over time, this infrastructure will enable a broader range of lender-approved assistance, verification and documentation services closer to the customer.";

export const SERVICES_TAGLINE =
  "Digital when possible. Human when needed. Local when it matters.";

export const SERVICES_BANNER =
  "Traditional collections rely on fragmented data, disconnected teams and static customer information. CGreen brings every digital interaction, call, field visit, dispute, promise and payment into one continuously updated Customer 360. Our AI-powered platform identifies why a customer has not paid, recommends the right channel, timing and treatment, and prioritises the next best action. Every outcome improves the next decision—making collections more connected, intelligent, traceable and resolution-focused.";

export const PRAGATI_CARDS = [
  {
    icon: "Store",
    value: "Build a trusted local financial-services business",
    title: "Institutional Work Opportunities",
    body: "Access collection, verification and customer-assistance assignments from lending institutions through the CGreen network. Manage opportunities within your territory while building and expanding a trained local team.",
  },
  {
    icon: "Coins",
    value: "Plan better. Execute faster. Report transparently.",
    title: "Technology-Enabled Field Operations",
    body: "Receive prioritised assignments, Customer 360 summaries, route plans and nearby-customer mapping through the CGreen platform. Capture geo-tagged visits, customer responses, documents, payment commitments and field evidence in real time.",
  },
  {
    icon: "Cpu",
    value: "Grow with structured processes and wider opportunities",
    title: "Training, Support and Growth",
    body: "CGreen provides training, compliance guidance, performance dashboards and transparent task and payout visibility. High-performing Kendras can qualify for larger territories and additional lender-approved service lines.",
  },
];

export const LENDING_CARDS = [
  {
    icon: "TrendingUp",
    value: "Scalable, multilingual engagement across customer portfolios",
    title: "Digital and Remote Collections",
    body: "Reach customers through SMS, WhatsApp, IVR, voice bots and trained telecalling teams. Every response, promise, dispute and payment outcome updates the Customer 360 and helps determine the next best action.",
  },
  {
    icon: "Mic",
    value: "Responsible last-mile execution across Bharat",
    title: "Field Collections and Verification",
    body: "Deploy technology-enabled local teams for field collections, residence, business and employment verification. Receive geo-tagged, time-stamped and lender-ready evidence supported by complete digital audit trails.",
  },
  {
    icon: "Database",
    value: "Understand the reason behind every overdue account",
    title: "Customer and Voice Intelligence",
    body: "Convert multilingual conversations, digital behaviour, payment history and field findings into actionable customer insights. Identify repayment intent, ability, hardship, disputes, contact changes and the most suitable channel, tone and resolution path.",
  },
];

export const TEAM = [
  { name: "Vipr Raj Bhardwaj", title: "Co-Founder, MD & CEO", photo: "/team/vipr.png", bio: "Financial services leader with 24 years of experience across ICICI, FINO, and Suryoday, with deep expertise in rural distribution and collections." },
  { name: "Vinay Shetty", title: "Co-Founder & Head of Technology", photo: "/team/vinay.png", bio: "Technology leader with 22 years of experience building scalable banking and financial services platforms, formerly with FINO." },
  { name: "Nikhar Agrawal", title: "Co-Founder & Head of Finance", photo: "/team/nikhar.png", bio: "Finance leader with 13 years of experience across microfinance, lending, collections, BC banking, and rural financial services, formerly with Spandana, Vaya, and Suryoday." },
  { name: "Dipanshu Rajpurohit", title: "Co-Founder & COO", photo: "/team/dipanshu.png", bio: "Business and product leader with 18 years of experience across Lendingkart, Bajaj Finance, YES Bank, and FINO Finance." },
  { name: "Makrand Manjrekar", title: "Head, Operations Risk & Compliance", photo: "/team/mak.png", bio: "Risk and operations leader with 20 years of experience across IDBI Bank and FINO Payments Bank, specialising in risk controls, compliance, and fraud prevention." },
  { name: "Vineet Singh", title: "Head, Collections Unit", photo: "/team/vineet.png", bio: "Collections leader with 17 years of experience across ICICI Bank, HDB, Spocto, and VGM, with deep expertise in remote collections and recovery." },
];

export const NOMINEE_DIRECTORS = [
  { name: "Vikas Guru", title: "Nominee Director", photo: "/team/vikas.png", bio: "Ex-Cashfree, Fino Payments Bank, Bose." },
  { name: "Ankit Kumar", title: "Nominee Director", photo: "/team/ankit.png", bio: "Ex-Reliance, Rivigo, Currently at IndiFly." },
];

export const PARTNERS = [
  { src: "/partners/tie.png", alt: "TiE Young Entrepreneurs" },
  { src: "/partners/wadhwani.png", alt: "Wadhwani Foundation" },
  { src: "/partners/stpi.png", alt: "STPI" },
  { src: "/partners/sies.png", alt: "SIES" },
  { src: "/partners/tgs100.png", alt: "TGS100" },
  { src: "/partners/sarthy.png", alt: "Sarthy Venture Investment Partners" },
  { src: "/partners/pontaq.png", alt: "Pontaq" },
  { src: "/partners/iima-ventures.png", alt: "IIMA Ventures" },
];

export const LENDERS = [
  { src: "/lenders/union-bank.png", alt: "Union Bank of India" },
  { src: "/lenders/yes-bank.png", alt: "YES Bank" },
  { src: "/lenders/bandhan-bank.png", alt: "Bandhan Bank" },
  { src: "/lenders/kotak.png", alt: "Kotak" },
  { src: "/lenders/suryoday.png", alt: "Suryoday Small Finance Bank" },
  { src: "/lenders/fino.png", alt: "Fino" },
  { src: "/lenders/tatkal-loan.png", alt: "Tatkal Loan" },
  { src: "/lenders/happy.png", alt: "Happy" },
  { src: "/lenders/nira.png", alt: "NIRA" },
  { src: "/lenders/avanti-finance.png", alt: "Avanti Finance" },
  { src: "/lenders/indusind-bank.png", alt: "IndusInd Bank" },
  { src: "/lenders/ashirvad-microfinance.png", alt: "Ashirvad Microfinance" },
  { src: "/lenders/smartcoin.png", alt: "SmartCoin" },
  { src: "/lenders/paytm.png", alt: "Paytm" },
  { src: "/lenders/kissht.png", alt: "Kissht" },
  { src: "/lenders/piramal.png", alt: "Piramal Capital & Housing Finance" },
];

export const SUBJECTS = [
  "Partner With Us",
  "Start a Pragati Kendra",
  "Request Product Demo",
  "Customer Support & Feedback",
  "Investor or Media Inquiry",
];

export const FOOTER = {
  description:
    "CGreen is committed to ethical collections, secure data management, and providing actionable feedback to lenders.",
  companyLinks: [
    { label: "Home", href: "#hero" },
    { label: "About Us", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Our Teams", href: "#team" },
    { label: "Contact Us", href: "#contact" },
    { label: "Terms & Conditions", href: "#" },
    { label: "Privacy Policy", href: "/Cgreen_Privacy_Policy.pdf" },
  ],
  commAddressLabel: "Communication Address Office",
  commAddress:
    "Matference Technologies India Pvt Ltd, 705, Bay B, Rupa Solitaire Building, Sector -1, Millennium Business Park, Mahape, Navi Mumbai- 400710",
  regAddressLabel: "Registered Address",
  regAddress:
    "C-602, Balaji Towers, Plot 8, Sec-22, Nerul (West), Navi Mumbai- 400706",
  email: "info@cgreen.in",
  website: "www.cgreen.in",
  cin: "U66190MH2021PTC358948",
  gst: "27AAOCM5134C1ZJ",
  phone: "+91-96533 13952",
  legalName: "Matference Technologies India Private Limited",
};
