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

export const SERVICES_INTRO =
  "Our innovative suite of financial products and services is oriented toward small businesses operating across the BFSI sector. Our offerings empower small businesses to forward their services and grow in underserved markets, bridging gaps in financial inclusion, starting from small-ticket collections and moving on to other financial services such as lending.";

export const PRAGATI_CARDS = [
  {
    icon: "Store",
    value: "Own a certified franchise",
    title: "Franchisee Onboarding",
    body: "Become a certified Pragati Kendra franchisee with full onboarding, training, and operational support, and then offer a comprehensive suite of financial products to end customers.",
  },
  {
    icon: "Coins",
    value: "Earn across financial services",
    title: "Cross-sell Financial Products",
    body: "Seamlessly access banking and financial products, insurance sales, investments, transactions, and liability — delivered through one powerful platform, fully integrated to meet rural customers' needs.",
  },
  {
    icon: "Cpu",
    value: "Recover more, faster",
    title: "Collections Engine",
    body: "A technology-enabled collections engine built for rural India. Our platform empowers agents to track, follow up, and recover small-ticket loans efficiently with AI-driven insights and customer interaction tools.",
  },
];

export const LENDING_CARDS = [
  {
    icon: "TrendingUp",
    value: "Boost repayment, cut NPAs",
    title: "ML-Powered Debt Collection",
    body: "Boost repayment rates with our AI/ML-driven collection engine. We analyze borrower behavior, predict repayment probabilities, and equip agents with personalized communication prompts — delivering smarter, scalable recovery for small-ticket loans in rural India.",
  },
  {
    icon: "Mic",
    value: "Turn conversations into insight",
    title: "Customer Feedback & Transcription Services",
    body: "Every borrower-agent interaction is recorded, transcribed, and analyzed using NLP. This creates actionable insights, voice-based borrower profiling, and quality assurance to improve engagement strategies and collection outcomes.",
  },
  {
    icon: "Database",
    value: "One 360° borrower view",
    title: "Data Management & Analytics",
    body: "We centralize and cleanse credit bureau, lender, and field data to generate 360° borrower views. Our dashboards and analytics models help banks make informed decisions on collections, risk, and product design.",
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
