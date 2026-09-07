"""The content the website ships with.

These values mirror ``frontend/src/data/site.js``. They are inserted into the
database the first time the app starts against an empty collection, so the
administrator opens the panel and finds the real, current website content ready
to edit - rather than a blank form that would blank the live site on save.

The frontend keeps its own copy as a fallback for when the database is
unreachable, which is why the two files overlap. If you change a default here,
change it there too, or the site will look different while the database is down.
"""

GROUPS = ("team", "nominee_directors", "advisors", "partners", "lenders")

SINGLETONS = ("vision_mission", "our_reach")

SINGLETON_DEFAULTS = {
    "vision_mission": {
        "heading": "VISION AND MISSION",
        "vision_title": "VISION",
        "vision_body": (
            "To build Bharat's most trusted, AI-led customer-resolution network—combining "
            "digital scale, multilingual intelligence, responsible human engagement and "
            "dependable local presence. We envision a future where lenders do not act only "
            "on delinquency status, but on a continuously updated understanding of the "
            "customer's intent, ability, contactability and circumstances."
        ),
        "mission_title": "MISSION",
        "mission_body": (
            "CGreen's mission is to build a connected, technology-enabled resolution network "
            "across 200 districts in Bharat within 3 years. Through one cloud platform, "
            "trained remote teams and local Pragati Kendras, we aim to deliver digital, "
            "remote and field collections, contact-point verification and actionable customer "
            "intelligence. Over time, this infrastructure will enable a broader range of "
            "lender-approved assistance, verification and documentation services closer to "
            "the customer."
        ),
    },
    "our_reach": {
        "heading": "OUR REACH",
        "subheading": "OUR FOOTPRINT IN ACTION",
        "map_image": "/india-map-final.png",
        "stats": [
            {"value": "29+", "label": "Lenders"},
            {"value": "3", "label": "States"},
            {"value": "35", "label": "Districts"},
            {"value": "957K+", "label": "Villages"},
        ],
    },
}

# Each entry becomes one row in `site_items`, keyed by its group.
GROUP_DEFAULTS = {
    "team": [
        {
            "name": "Vipr Raj Bhardwaj",
            "title": "Co-Founder, MD & CEO",
            "image_url": "/team/vipr.png",
            "link": "https://www.linkedin.com/in/vipr-raj/",
            "bio": (
                "Financial services leader with 24 years of experience across ICICI, FINO, "
                "and Suryoday, with deep expertise in rural distribution and collections."
            ),
        },
        {
            "name": "Vinay Shetty",
            "title": "Co-Founder & Head of Technology",
            "image_url": "/team/vinay.png",
            "link": "https://www.linkedin.com/in/winay-shetty/",
            "bio": (
                "Technology leader with 22 years of experience building scalable banking and "
                "financial services platforms, formerly with FINO."
            ),
        },
        {
            "name": "Nikhar Agrawal",
            "title": "Co-Founder & Head of Finance",
            "image_url": "/team/nikhar.png",
            "link": "https://www.linkedin.com/in/nikhar-agrawal-5631b716/",
            "bio": (
                "Finance leader with 13 years of experience across microfinance, lending, "
                "collections, BC banking, and rural financial services, formerly with "
                "Spandana, Vaya, and Suryoday."
            ),
        },
        {
            "name": "Dipanshu Rajpurohit",
            "title": "Co-Founder & COO",
            "image_url": "/team/dipanshu.png",
            "link": "https://www.linkedin.com/in/dipanshurajpurohit/",
            "bio": (
                "Business and product leader with 18 years of experience across Lendingkart, "
                "Bajaj Finance, YES Bank, and FINO Finance."
            ),
        },
        {
            "name": "Makrand Manjrekar",
            "title": "Co-Founder & Head, Risk & Compliance",
            "image_url": "/team/mak.png",
            "link": "https://www.linkedin.com/in/makrand-manjrekar/",
            "bio": (
                "Risk and operations leader with 20 years of experience across IDBI Bank and "
                "FINO Payments Bank, specialising in risk controls, compliance, and fraud "
                "prevention."
            ),
        },
        
    ],
    "nominee_directors": [
        {
            "name": "Vikas Guru",
            "title": "Nominee Director",
            "image_url": "/team/vikas.png",
            "link": "https://www.linkedin.com/in/vikas-guru-42745b13/",
            "bio": "Ex-Cashfree, Fino Payments Bank, Bose.",
        },
        {
            "name": "Ankit Kumar",
            "title": "Nominee Director",
            "image_url": "/team/ankit.png",
            "link": "https://www.linkedin.com/in/ankit-kumar-profile/",
            "bio": "Ex-Reliance, Rivigo, Currently at IndiFly.",
        },
    ],
    # The live site shows a "Coming Soon" card here. An empty group renders the
    # same placeholder, so this starts empty rather than with invented people.
    "advisors": [],
    "partners": [
        {"name": "IIMA Ventures", "image_url": "/partners/iima-ventures.png"},
        {"name": "Indifly", "image_url": "/partners/indifly.jpg"},
        {"name": "Pontaq", "image_url": "/partners/pontaq.png"},
        {"name": "STPI", "image_url": "/partners/stpi.png"},
        {"name": "Sarthy Venture Investment Partners", "image_url": "/partners/sarthy.png"},
        {"name": "DPIIT — Startup India", "image_url": "/partners/dpiit.png"},
        {"name": "Wadhwani Foundation", "image_url": "/partners/wadhwani.png"},
        {"name": "SIES", "image_url": "/partners/sies.png"},
        {"name": "FACE SRO", "image_url": "/partners/face.jpg"},
        {"name": "TiE Delhi-NCR", "image_url": "/partners/tie-new.jpg"},
    ],
    "lenders": [
        {"name": "Union Bank of India", "image_url": "/lenders/union-bank.png"},
        {"name": "YES Bank", "image_url": "/lenders/yes-bank.png"},
        {"name": "Bandhan Bank", "image_url": "/lenders/bandhan-bank.png"},
        {"name": "Kotak", "image_url": "/lenders/kotak.png"},
        {"name": "Suryoday Small Finance Bank", "image_url": "/lenders/suryoday.png"},
        {"name": "Fino", "image_url": "/lenders/fino.png"},
        {"name": "Tatkal Loan", "image_url": "/lenders/tatkal-loan.png"},
        {"name": "Happy", "image_url": "/lenders/happy.png"},
        {"name": "NIRA", "image_url": "/lenders/nira.png"},
        {"name": "Avanti Finance", "image_url": "/lenders/avanti-finance.png"},
        {"name": "IndusInd Bank", "image_url": "/lenders/indusind-bank.png"},
        {"name": "Ashirvad Microfinance", "image_url": "/lenders/ashirvad-microfinance.png"},
        {"name": "SmartCoin", "image_url": "/lenders/smartcoin.png"},
        {"name": "Paytm", "image_url": "/lenders/paytm.png"},
        {"name": "Kissht", "image_url": "/lenders/kissht.png"},
        {"name": "Piramal Capital & Housing Finance", "image_url": "/lenders/piramal.png"},
        {"name": "Home Credit", "image_url": "/lenders/home-credit.png"},
        {"name": "FLot", "image_url": "/lenders/flot.png"},
        {"name": "Northern Arc Investments", "image_url": "/lenders/northern-arc.png"},
        {"name": "Third Unicorn", "image_url": "/lenders/third-unicorn.png"},
        {"name": "TVS Credit", "image_url": "/lenders/tvs-credit.png"},
        {"name": "Bajaj Finance", "image_url": "/lenders/bajaj-finance.png"},
        {"name": "Cholamandalam", "image_url": "/lenders/chola.png"},
        {"name": "Credgenics", "image_url": "/lenders/credgenics.png"},
        {"name": "FatakPay", "image_url": "/lenders/fatakpay.png"},
        {"name": "Fibe", "image_url": "/lenders/fibe.png"},
        {"name": "AEON Credit Service", "image_url": "/lenders/aeon-credit.png"},
        {"name": "Arth Finance", "image_url": "/lenders/arth-finance.png"},
        {"name": "AU Small Finance Bank", "image_url": "/lenders/au-small-finance.png"},
        {"name": "Axis Bank", "image_url": "/lenders/axis-bank.png"},
    ],
}

# What each group is called in the admin panel, and whether its items are people
# (name, role, bio, LinkedIn, portrait) or logos (name and an image).
GROUP_META = {
    "team": {"label": "Managing Team", "kind": "people"},
    "nominee_directors": {"label": "Nominee Directors on Board", "kind": "people"},
    "advisors": {"label": "Advisors to the Board", "kind": "people"},
    "partners": {"label": "Partners in Impact", "kind": "logos"},
    "lenders": {"label": "Trusted by Lenders", "kind": "logos"},
}
