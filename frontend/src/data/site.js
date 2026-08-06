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
  { label: "Our Solution", href: "#solution" },
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
  "To transform the way debt collections are performed in India by prioritizing customer engagement and utilizing technology to provide a seamless and effective collection experience. Our goal is to empower lenders with valuable insights and secure, efficient collections while upholding the highest ethical standards and protecting customer data.";

export const MISSION =
  "To become a leading player in the Indian collection sector by providing a customer-focused and technology-driven solution. Utilizing a gig network and cutting-edge AI/ML technology, we are committed to delivering effective customer engagement, efficient collections, and secure data management. Our goal is to achieve 10% market share within the next 3 years by upholding the highest ethical standards and providing valuable insights to lenders.";

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
  { name: "Vipr Raj Bhardwaj", title: "CEO", bio: "Ex-FINO, Suryoday, ICICI. Built rural distribution networks and recovery units." },
  { name: "Nikhar Agrawal", title: "Head, Product", bio: "Ex-Spandana, Vaya, Suryoday. Unsecured systems and design expert." },
  { name: "Vineet Singh", title: "Head, Collections Unit", bio: "Ex-ICICI Bank, HDB, Spocto, VGM." },
  { name: "Vinay Shetty", title: "Head, Tech", bio: "Ex-FINO. Core tech builder for scalable banking systems." },
  { name: "Vikas", title: "Nominee Director", bio: "Ex-Cashfree, Fino Payments Bank, Bose." },
  { name: "Makrand Manjrekar", title: "Head, Ops Risk & Compliance", bio: "Ex-IDBI Bank, Fino Payments Bank." },
];

export const PARTNERS = ["IIMA", "Pont", "DP", "Sarthy", "1to10", "STPI", "TGS", "SIES", "Wadhwani", "TiE"];

export const LENDERS = ["Aarti Finance", "Bharat Credit", "Sahyog NBFC", "Prayas Bank", "Uday Microfin", "Ganga Trust", "Vikas Capital", "Setu Lending"];

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
    { label: "Privacy Policy", href: "#" },
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
