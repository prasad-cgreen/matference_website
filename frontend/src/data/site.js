// Central content data for the cGreen site

export const NAV = [
  { label: "Home", href: "#hero" },
  {
    label: "About Us",
    dropdown: [
      { label: "About cGreen", href: "#about" },
      { label: "Our Teams", href: "#team" },
      { label: "Partners in Impact", href: "#partners" },
      { label: "Insight", to: "/insight", newTab: true },
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

// Insight / blog posts. Each `body` entry is one paragraph; a string that also
// appears in `headings` is rendered as a sub-heading, and one wrapped in the
// `quote` marker is rendered as a pull-quote.
export const BLOG_POSTS = [
  {
    slug: "indifly-backs-cgreen",
    image: "/blog/cgreen.png",
    imageAlt:
      "Indifly and CGreen leadership at the strategic investment signing",
    headline:
      "Indifly backs CGreen to build the loan resolution infrastructure Bharat's lenders don't have",
    date: "5 September 2025",
    dateISO: "2025-09-05",
    author: "CGreen",
    body: [
      "Collections is the backbone of lending. It is also the least rebuilt part of it, still running on manual trackers, telecalling scripts and reporting systems that tell a lender an account has gone bad without ever explaining why.",
      "With a vision to build the resolution layer Bharat's credit economy actually runs on, CGreen has raised a strategic investment from Indifly Ventures, the venture builder shaping Bharat's digital economy across financial services, commerce and digital access.",
      "The capital will strengthen CGreen's AI and borrower intelligence platform, expand its Pragati Kendra field network into new districts, and deepen its work with banks, NBFCs, MFIs and fintech lenders operating in Tier 3 and below markets.",
      { type: "heading", text: "The question nobody can answer" },
      "Two borrowers miss the same EMI. One has had a bad season and genuinely cannot pay. The other can and has chosen not to. Every collections system in India today treats them identically — same bucket, same queue, same escalation — because none of them can tell the difference.",
      "That is the whole problem. Intent and ability are two different failures requiring two different resolutions, and the industry has been guessing between them for a decade.",
      "Digital channels don't close the gap. SMS, WhatsApp, email and IVR are excellent at establishing contact and useless the moment a borrower stops responding. Where lending is growing fastest — deep into Bharat — remote channels reach fewest and dependable ground capability is scarcest.",
      { type: "heading", text: "What CGreen built instead" },
      "CGreen combines AI-led case prioritisation, Voice AI, recorded borrower interactions and structured resolution workflows with something no software-only competitor has: trained local teams across 35 districts in Uttar Pradesh, Maharashtra and Assam.",
      "When a remote channel returns nothing, someone makes contact in person, in the borrower's language — and that conversation enters the same structured record as every digital touchpoint. The lender gets an auditable trail, a reason behind every resolution decision, and the ability to restructure where restructuring works and escalate where it doesn't.",
      "Platforms without people can't reach the borrowers who matter. People without a platform produce anecdotes instead of intelligence. CGreen is built to be both.",
      {
        type: "quote",
        text: "Recovery should begin with understanding the borrower, not just the default. Give a lender the reason behind a missed payment and they get the decision right the first time instead of the fourth. That is the entire business.",
        cite: "Vipr Raj Bhardwaj, CEO, CGreen",
      },
      { type: "heading", text: "Already at scale" },
      "CGreen is empaneled with 29+ lending institutions — among them Kotak Mahindra Bank, Axis Bank, Yes Bank, Bandhan Bank, AU Small Finance Bank, Suryoday Small Finance Bank and Home Credit. Together they represent over 3 lakh borrowers and more than ₹1,350 crore in AUM under resolution, supported by a pan-India remote network alongside our on-ground presence across 35 districts.",
      "That mix matters. Large private banks, small finance banks and consumer lenders have very different books, very different borrower profiles and very different compliance requirements. Building for all of them at once is what forced the platform to be genuinely configurable rather than one recovery playbook applied everywhere.",
      {
        type: "quote",
        text: "CGreen is solving the part of the lending stack that receives the least investment and carries some of the highest cost. Combining borrower intelligence with real on-ground execution is hard to build and harder to copy — and it is the infrastructure Bharat's credit economy will depend on.",
        cite: "Abhinath Shinde, Co-founder & Director, Indifly",
      },
      "Indifly works through its inCORE operating ecosystem rather than as a passive investor, bringing operational and functional support alongside capital — which, for a business that runs on the ground as much as in software, is the part that compounds.",
      { type: "heading", text: "Building for Bharat" },
      "India is heading toward a credit economy of enormous scale, but the ability to lend has always been capped by the ability to collect. As lenders push deeper into underserved markets, the binding constraint stops being underwriting and becomes resolution.",
      "Collections is not a back-office function. It is where a lender's economics are decided and where a borrower's experience of the financial system is formed. CGreen is building that layer properly, and building it for Bharat rather than adapting it to Bharat.",
    ],
  },
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
  "CGreen's mission is to build a connected, technology-enabled resolution network across 200 districts in Bharat within 3 years. Through one cloud platform, trained remote teams and local Pragati Kendras, we aim to deliver digital, remote and field collections, contact-point verification and actionable customer intelligence. Over time, this infrastructure will enable a broader range of lender-approved assistance, verification and documentation services closer to the customer.";

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
  { name: "Vipr Raj Bhardwaj", title: "Co-Founder, MD & CEO", photo: "/team/vipr.png", linkedin: "https://www.linkedin.com/in/vipr-raj/", bio: "Financial services leader with 24 years of experience across ICICI, FINO, and Suryoday, with deep expertise in rural distribution and collections." },
  { name: "Vinay Shetty", title: "Co-Founder & Head of Technology", photo: "/team/vinay.png", linkedin: "https://www.linkedin.com/in/winay-shetty/", bio: "Technology leader with 22 years of experience building scalable banking and financial services platforms, formerly with FINO." },
  { name: "Nikhar Agrawal", title: "Co-Founder & Head of Finance", photo: "/team/nikhar.png", linkedin: "https://www.linkedin.com/in/nikhar-agrawal-5631b716/", bio: "Finance leader with 13 years of experience across microfinance, lending, collections, BC banking, and rural financial services, formerly with Spandana, Vaya, and Suryoday." },
  { name: "Dipanshu Rajpurohit", title: "Co-Founder & COO", photo: "/team/dipanshu.png", linkedin: "https://www.linkedin.com/in/dipanshurajpurohit/", bio: "Business and product leader with 18 years of experience across Lendingkart, Bajaj Finance, YES Bank, and FINO Finance." },
  { name: "Makrand Manjrekar", title: "Co-Founder & Head, Risk & Compliance", photo: "/team/mak.png", linkedin: "https://www.linkedin.com/in/makrand-manjrekar/", bio: "Risk and operations leader with 20 years of experience across IDBI Bank and FINO Payments Bank, specialising in risk controls, compliance, and fraud prevention." },
<<<<<<< HEAD
//  { name: "Vineet Singh", title: "Head, Collections Unit", photo: "/team/vineet.png", linkedin: "https://www.linkedin.com/in/vineet-kumar-singh-303022a7/", bio: "Collections leader with 17 years of experience across ICICI Bank, HDB, Spocto, and VGM, with deep expertise in remote collections and recovery." },
=======
  // { name: "Vineet Singh", title: "Head, Collections Unit", photo: "/team/vineet.png", linkedin: "https://www.linkedin.com/in/vineet-kumar-singh-303022a7/", bio: "Collections leader with 17 years of experience across ICICI Bank, HDB, Spocto, and VGM, with deep expertise in remote collections and recovery." },
>>>>>>> 01ce10733f10226ea9f73dbdb7cf7fb2a886fa64
];

export const NOMINEE_DIRECTORS = [
  { name: "Vikas Guru", title: "Nominee Director", photo: "/team/vikas.png", linkedin: "https://www.linkedin.com/in/vikas-guru-42745b13/", bio: "Ex-Cashfree, Fino Payments Bank, Bose." },
  { name: "Ankit Kumar", title: "Nominee Director", photo: "/team/ankit.png", linkedin: "https://www.linkedin.com/in/ankit-kumar-profile/", bio: "Ex-Reliance, Rivigo, Currently at IndiFly." },
];

export const PARTNERS = [
  { src: "/partners/iima-ventures.png", alt: "IIMA Ventures" },
  { src: "/partners/indifly.jpg", alt: "Indifly" },
  { src: "/partners/pontaq.png", alt: "Pontaq" },
  { src: "/partners/stpi.png", alt: "STPI" },
  { src: "/partners/sarthy.png", alt: "Sarthy Venture Investment Partners" },
  { src: "/partners/dpiit.png", alt: "DPIIT — Startup India" },
  { src: "/partners/wadhwani.png", alt: "Wadhwani Foundation" },
  { src: "/partners/sies.png", alt: "SIES" },
  { src: "/partners/face.jpg", alt: "FACE SRO" },
  { src: "/partners/tie-new.jpg", alt: "TiE Delhi-NCR" },
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
  { src: "/lenders/home-credit.png", alt: "Home Credit" },
  { src: "/lenders/flot.png", alt: "FLot" },
  { src: "/lenders/northern-arc.png", alt: "Northern Arc Investments" },
  { src: "/lenders/third-unicorn.png", alt: "Third Unicorn" },
  { src: "/lenders/tvs-credit.png", alt: "TVS Credit" },
  { src: "/lenders/bajaj-finance.png", alt: "Bajaj Finance" },
  { src: "/lenders/chola.png", alt: "Cholamandalam" },
  { src: "/lenders/credgenics.png", alt: "Credgenics" },
  { src: "/lenders/fatakpay.png", alt: "FatakPay" },
  { src: "/lenders/fibe.png", alt: "Fibe" },
  { src: "/lenders/aeon-credit.png", alt: "AEON Credit Service" },
  { src: "/lenders/arth-finance.png", alt: "Arth Finance" },
  { src: "/lenders/au-small-finance.png", alt: "AU Small Finance Bank" },
  { src: "/lenders/axis-bank.png", alt: "Axis Bank" },
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
    { label: "Terms & Conditions", href: "/Terms_and_Conditions.pdf" },
    { label: "Privacy Policy", href: "/Cgreen_Privacy_Policy.pdf" },
  ],
  commAddressLabel: "Communication Address Office",
  commAddress:
    "Matference Technologies India Pvt Ltd, Building No. 1 (61), B Wing, Sector 2, Millenium Business Park, Mahape, Navi Mumbai – 400710. Landmark: Near post office building",
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
