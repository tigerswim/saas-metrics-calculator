// Metric formulas and definitions for the relationship panel

export interface MetricFormula {
  formula: string;
  description: string;
  components?: string[];
}

export const metricFormulas: Record<string, MetricFormula> = {
  // Operating Budget
  'sales-marketing-spend': {
    formula: 'Marketing Spend + Sales Spend',
    description: 'Sales & Marketing (S&M) Spend represents total investment in customer acquisition and revenue growth, combining all marketing programs and sales team costs. This is the denominator for critical efficiency metrics like Magic Number, CAC, and S&M Payback Period. Target S&M spend at 40-60% of revenue for growth-stage SaaS, declining to 20-40% as you scale and improve efficiency.',
    components: ['marketing-spend', 'sales-spend'],
  },
  'marketing-spend': {
    formula: 'Paid Search + Paid Social + Events + Content + Partnerships + ABM',
    description: 'Marketing Spend aggregates all marketing program investments including paid channels, events, content creation, and partner programs. Tracking spend by channel enables attribution analysis and ROI optimization across your marketing mix. Target marketing representing 40-60% of total S&M spend for balanced investment between demand generation and sales capacity.',
    components: ['paid-search', 'paid-social', 'events', 'content', 'partnerships', 'abm'],
  },
  'sales-spend': {
    formula: 'S&M Spend - Marketing Spend',
    description: 'Sales Spend captures all sales team investments including compensation (base, commission, bonuses), tools (CRM, sales engagement), and travel/entertainment expenses. This is typically 40-60% of total S&M spend for field sales models, lower for inside sales or product-led growth. Monitor sales spend per rep and sales-to-quota attainment to ensure productive investment.',
    components: ['sales-marketing-spend', 'marketing-spend'],
  },
  'rd-spend': {
    formula: 'Monthly R&D Spend',
    description: 'Research & Development (R&D) Spend covers all product development costs including engineering, product management, design, and technical infrastructure. Target R&D at 15-30% of revenue for SaaS companies, balancing feature velocity with cost efficiency. High R&D investment drives product differentiation and innovation but must be balanced against profitability and growth spending.',
  },
  'ga-spend': {
    formula: 'Monthly G&A Spend',
    description: 'General & Administrative (G&A) Spend includes all operational overhead like finance, legal, HR, facilities, and executive leadership costs. Target G&A at 10-15% of revenue for efficient SaaS operations, though early-stage companies often run higher as fixed costs spread across smaller revenue. G&A efficiency improves with scale as these costs don\'t grow proportionally with revenue.',
  },

  // Marketing Activities
  'paid-search': {
    formula: 'Monthly Paid Search Spend',
    description: 'Paid Search investment covers search engine advertising (Google Ads, Bing Ads) targeting high-intent keywords and branded terms. This channel typically delivers strong ROI for B2B SaaS with clear search demand. Track Cost Per Lead and Cost Per SQL by search campaign to identify which keywords and ad groups drive efficient pipeline, optimizing spend toward high-converting terms.',
  },
  'paid-social': {
    formula: 'Monthly Paid Social Spend',
    description: 'Paid Social investment includes advertising on LinkedIn, Facebook, Twitter, and other social platforms for demand generation and brand awareness. LinkedIn typically dominates B2B SaaS social spend due to professional targeting. Track CPM and Cost Per Lead by platform and audience segment to optimize creative, targeting, and budget allocation across social channels.',
  },
  'events': {
    formula: 'Monthly Events Spend',
    description: 'Events spend covers conferences, trade shows, webinars, sponsorships, and hosted customer/prospect gatherings for relationship building and pipeline generation. Events typically have longer sales cycles but higher deal values and win rates than digital channels. Track Cost Per Opportunity and Cost Per Won from events separately, as the economics differ significantly from other marketing channels.',
  },
  'content': {
    formula: 'Monthly Content Marketing Spend',
    description: 'Content Marketing spend includes creation costs (writing, design, video), SEO optimization, content distribution, and organic social programs. Content drives long-term organic lead flow and sales enablement, though attribution is harder than paid channels. Strong content programs reduce paid acquisition costs over time by building organic search rankings and inbound interest.',
  },
  'partnerships': {
    formula: 'Monthly Partnerships Spend',
    description: 'Partnerships spend covers channel partner programs, co-marketing initiatives, affiliate/referral programs, and technology integration partnerships. Partner-sourced deals often have higher close rates and faster sales cycles due to warm introductions. Track partner contribution to pipeline and revenue separately from direct channels to justify partnership investment and optimize partner mix.',
  },
  'abm': {
    formula: 'Monthly ABM Spend',
    description: 'Account-Based Marketing (ABM) spend includes platforms (6sense, Demandbase, RollWorks), targeted advertising, personalized content, and orchestrated outreach to high-value target accounts. ABM focuses resources on accounts with highest revenue potential rather than broad lead generation. Track pipeline and bookings from target accounts to measure ABM effectiveness, expecting higher deal sizes but lower volume than traditional demand gen.',
  },

  // Customer Metrics
  'new-customers-added': {
    formula: 'Count of new customer accounts acquired this month',
    description: 'New Customers Added tracks the count of new paying customer accounts acquired in this period, regardless of contract size. This is a volume metric that drives New Bookings when multiplied by average deal size. Target new customer addition rates that support your ARR growth goals while maintaining healthy unit economics (LTV:CAC >3:1).',
  },
  'customers-churned': {
    formula: 'Count of customer accounts that cancelled this month',
    description: 'Customers Churned tracks the count of customer accounts that completely cancelled their subscription or contract this period, excluding downgrades. Target <2-3% monthly logo churn for B2B SaaS (<5% for SMB-focused products). High customer churn, even with low dollar churn, signals future revenue risk and product-market fit issues that will compound over time.',
  },
  'ending-customer-count': {
    formula: 'Beginning Customers + New Customers - Churned Customers',
    description: 'Ending Customer Count represents your total active customer accounts at period end, showing net customer growth after new additions and cancellations. This metric combines with Ending ARR to calculate ARPA (Average Revenue Per Account). Tracking customer count trends reveals whether you\'re growing through new logos or expansion ARR from existing customers.',
    components: ['new-customers-added', 'customers-churned'],
  },
  'beginning-arr': {
    formula: 'Total ARR at the start of the period',
    description: 'Beginning Annual Recurring Revenue (ARR) represents your contracted recurring revenue at the start of the period, serving as the baseline for measuring growth. This is the starting point of the ARR waterfall that flows through New Bookings, Expansion ARR, and Churned ARR to calculate Net New ARR. Accurate Beginning ARR tracking is critical for calculating retention rates (GRR/NRR) and growth percentages.',
  },
  'expansion-arr': {
    formula: 'Sum of all upsells, cross-sells, and add-ons this month',
    description: 'Expansion Annual Recurring Revenue (ARR) captures additional revenue from existing customers through upsells, cross-sells, add-ons, and price increases. Target expansion ARR representing >20-30% of your total ARR growth to show strong land-and-expand motion. High expansion ARR drives NRR above 100%, indicating you can grow revenue from your existing base without adding new customers.',
  },
  'churned-arr': {
    formula: 'Sum of all cancellations and downgrades this month',
    description: 'Churned Annual Recurring Revenue (ARR) represents revenue lost from customer cancellations and downgrades (contractions) in this period. Target monthly churn <2% of Beginning ARR (or <5% for SMB-focused SaaS) to maintain strong gross retention. Churned ARR directly reduces Net New ARR and caps your growth potential—high churn forces you to run faster just to stand still.',
  },

  // ARR & Growth Metrics
  'new-bookings': {
    formula: 'New Customers Added × Average Deal Size',
    description: 'New Bookings represents the total Annual Recurring Revenue (ARR) value from newly acquired customers in this period. Target new bookings that represent at least 5-10% of Beginning ARR monthly for healthy growth companies. This metric is a critical input to the ARR waterfall, showing the top-of-funnel revenue generation before accounting for expansion or churn.',
    components: ['new-customers-added', 'avg-deal-size'],
  },
  'net-new-arr': {
    formula: 'New Bookings + Expansion ARR - Churned ARR',
    description: 'Net New Annual Recurring Revenue (ARR) represents the total change in ARR this period, combining new customer bookings, expansion from existing customers, and revenue lost to churn. Target positive Net New ARR at >20% of Beginning ARR annually for high-growth SaaS companies. This is the single most important metric for tracking SaaS revenue momentum month-over-month.',
    components: ['new-bookings', 'expansion-arr', 'churned-arr'],
  },
  'ending-arr': {
    formula: 'Beginning ARR + Net New ARR',
    description: 'Ending Annual Recurring Revenue (ARR) is your total contracted recurring revenue at the end of the period, normalized to a yearly value. This is the ultimate outcome of your ARR waterfall, showing the compounded effect of new bookings, expansion, and churn. Investors track ARR as the primary valuation metric for SaaS companies, making this your north star revenue indicator.',
    components: ['beginning-arr', 'net-new-arr'],
  },
  'mrr': {
    formula: 'Ending ARR ÷ 12',
    description: 'Monthly Recurring Revenue (MRR) is your contracted recurring revenue normalized to a monthly value, calculated by dividing Ending ARR by 12. Most SaaS operators track MRR for month-to-month trend analysis and operational planning, while ARR is used for annual projections and investor reporting. Target consistent month-over-month MRR growth of 5-15% depending on your company stage.',
    components: ['ending-arr'],
  },
  'arr-growth-rate': {
    formula: '(Net New ARR ÷ Beginning ARR) × 100',
    description: 'Annual Recurring Revenue (ARR) growth rate measures how fast your recurring revenue is expanding, expressed as an annualized percentage of Beginning ARR. High-growth SaaS companies target >50% annual ARR growth, while mature companies typically see 20-40%. This metric directly feeds into the Rule of 40 calculation and is a primary driver of valuation multiples.',
    components: ['net-new-arr', 'beginning-arr'],
  },

  // Retention Metrics
  'grr': {
    formula: '((Beginning ARR - Churned ARR) ÷ Beginning ARR) × 100',
    description: 'Gross Revenue Retention (GRR) measures how well you retain revenue from existing customers, excluding any expansion or upsells. Target >90% monthly (>95% annualized) indicates strong product-market fit and customer satisfaction, as it shows customers continue paying without upselling. Below 90% monthly signals potential product issues, poor onboarding, or service quality concerns that need immediate attention.',
    components: ['beginning-arr', 'churned-arr'],
  },
  'nrr': {
    formula: '((Beginning ARR + Expansion ARR - Churned ARR) ÷ Beginning ARR) × 100',
    description: 'Net Revenue Retention (NRR) measures revenue retained plus expansion from existing customers, excluding new bookings. Target >100% monthly (meaning expansion exceeds churn) shows strong land-and-expand motion, while >110% is exceptional. NRR is the most important indicator of product stickiness and growth efficiency—it shows if you can grow purely from your existing base.',
    components: ['beginning-arr', 'expansion-arr', 'churned-arr'],
  },
  'annualized-grr': {
    formula: 'Monthly GRR ^ 12',
    description: 'Annualized Gross Revenue Retention (GRR) compounds your monthly GRR over 12 months to project annual retention rates. Target >95% annualized shows sustainable retention over the long term, as monthly retention compounds (e.g., 95% monthly = 54% annualized, so you need very high monthly rates). This metric helps investors and executives understand multi-year revenue stability from your existing customer base.',
    components: ['grr'],
  },
  'annualized-nrr': {
    formula: 'Monthly NRR ^ 12',
    description: 'Annualized Net Revenue Retention (NRR) compounds your monthly NRR over 12 months to project annual retention including expansion. Target >120% annualized shows exceptional land-and-expand motion with strong product stickiness. This metric helps investors and executives understand multi-year revenue expansion potential from your existing customer base without adding new logos.',
    components: ['nrr'],
  },
  'logo-churn-rate': {
    formula: '(Customers Churned ÷ Beginning Customers) × 100',
    description: 'Logo churn rate measures the percentage of customer accounts lost each period, tracking customer count rather than revenue. Target <2-3% monthly for B2B SaaS (<5% for SMB-focused products) to maintain healthy growth. High logo churn, even with strong dollar retention, can signal challenges in customer satisfaction, product complexity, or market fit that will eventually impact revenue.',
    components: ['customers-churned', 'beginning-customers'],
  },
  'arpa': {
    formula: 'Ending ARR ÷ Ending Customer Count',
    description: 'Average Revenue Per Account (ARPA) measures the average annual recurring revenue generated per customer account. Target ARPA growth of 5-15% annually through pricing optimization, upsells, or moving upmarket. ARPA is a critical input to unit economics calculations (LTV, CAC payback) and helps segment your customer base by value tier.',
    components: ['ending-arr', 'ending-customer-count'],
  },

  // Pipeline Metrics
  'sqls': {
    formula: 'MQLs × MQL-to-SQL Conversion Rate',
    description: 'Sales Qualified Leads (SQLs) are prospects vetted by your sales team as ready for active pursuit, having met qualification criteria beyond marketing engagement. The MQL-to-SQL conversion rate measures marketing-sales alignment—target >50% suggests good lead quality and clear qualification criteria. Low conversion rates often indicate misaligned ICP targeting, weak lead scoring, or gaps in sales-marketing communication.',
    components: ['mqls', 'mql-sql-conversion'],
  },
  'opportunities': {
    formula: 'SQLs × SQL-to-Opp Conversion Rate',
    description: 'Opportunities are qualified sales prospects that have moved into active deal cycles, typically with identified budget, authority, need, and timeline (BANT). Target SQL-to-Opp conversion >30-40% for B2B SaaS, indicating strong qualification and discovery processes. This is the stage where sales teams invest significant time, so low conversion here means wasted sales capacity on unqualified prospects.',
    components: ['sqls', 'sql-opp-conversion'],
  },
  'deals-won': {
    formula: 'Opportunities × Win Rate',
    description: 'Deals Won represents closed opportunities that resulted in signed contracts and new customer bookings. Win rates vary by sales motion—target >20-30% for enterprise deals, >30-40% for mid-market, and higher for SMB. This metric directly drives New Bookings and is the ultimate output of your entire acquisition funnel from impressions through close.',
    components: ['opportunities', 'win-rate'],
  },
  'pipeline-generated': {
    formula: 'Opportunities × Average Deal Size',
    description: 'Pipeline Generated measures the total dollar value of sales opportunities created in this period, showing forward-looking revenue potential. Target pipeline coverage of 3-5x your revenue goal, meaning if you need $1M in bookings, generate $3-5M in pipeline. This metric helps forecast future revenue and evaluate whether you\'re creating enough pipeline to hit targets.',
    components: ['opportunities', 'avg-deal-size'],
  },
  'pipeline-conversion': {
    formula: '(Deals Won ÷ MQLs) × 100',
    description: 'Pipeline Conversion measures the end-to-end conversion rate from Marketing Qualified Lead (MQL) to closed won deal, showing overall funnel efficiency. Target >5-10% conversion for B2B SaaS, though this varies significantly by average deal size and sales cycle. This metric reveals whether you have a narrow funnel problem (one stage) or a systematic efficiency issue across multiple stages.',
    components: ['deals-won', 'mqls'],
  },
  'pipeline-velocity': {
    formula: '(Opportunities × Avg Deal Size × Win Rate) ÷ Sales Cycle Days',
    description: 'Pipeline Velocity measures the dollar value of revenue your sales pipeline generates per day, combining pipeline volume, deal size, win rate, and sales cycle length. Increasing velocity requires either creating more opportunities, closing bigger deals, improving win rates, or shortening sales cycles—each lever impacts growth differently. Track velocity trends to identify whether your sales motion is becoming more or less efficient over time.',
    components: ['opportunities', 'avg-deal-size', 'win-rate', 'sales-cycle'],
  },

  // Marketing Efficiency
  'cac-blended': {
    formula: 'Total S&M Spend ÷ New Customers Added',
    description: 'Customer Acquisition Cost (CAC) - Blended measures the total Sales & Marketing spend required to acquire one new customer, including all channels (paid, organic, sales). Target CAC varies by ARPA—aim for CAC < 1/3 of LTV or < 33% of first-year contract value. Blended CAC provides the most accurate view of true customer acquisition economics, though CAC Paid Only helps isolate marketing efficiency.',
    components: ['sales-marketing-spend', 'new-customers-added'],
  },
  'cac-paid-only': {
    formula: 'Paid Marketing Spend ÷ New Customers Added',
    description: 'Customer Acquisition Cost (CAC) - Paid Only isolates the acquisition cost from paid marketing channels (search, social, display), excluding organic and sales costs. Target Paid CAC at 50-70% of Blended CAC, indicating healthy organic/referral contribution. This metric helps marketing teams optimize paid channel mix and evaluate ROI on advertising spend independently from sales investment.',
    components: ['paid-marketing-spend', 'new-customers-added'],
  },
  'ltv': {
    formula: 'ARPA × Average Customer Lifetime (months)',
    description: 'Lifetime Value (LTV) estimates the total revenue a customer will generate over their entire relationship with your company. Calculated as ARPA × Average Customer Lifetime (months), healthy SaaS LTV typically ranges from $50K to $500K+ depending on your market segment and customer type. LTV forms the numerator in the critical LTV:CAC ratio that determines unit economics viability.',
    components: ['arpa', 'avg-customer-lifetime'],
  },
  'ltv-cac-ratio': {
    formula: 'LTV ÷ CAC (Blended)',
    description: 'The LTV:CAC ratio compares customer lifetime value to acquisition cost, measuring the fundamental return on your go-to-market investment. Target >3:1 for healthy SaaS economics, though 2-3:1 is acceptable for high-growth companies prioritizing land-grab over efficiency. Ratios <2:1 mean you\'re spending too much to acquire customers relative to what they\'re worth, requiring immediate CAC reduction or ARPA/retention improvements.',
    components: ['ltv', 'cac-blended'],
  },
  'cac-payback-period': {
    formula: 'CAC ÷ (ARPA × Gross Margin %)',
    description: 'Customer Acquisition Cost (CAC) Payback Period measures how many months of gross profit it takes to recover your customer acquisition investment. Target <12 months for efficient SaaS businesses, though 12-18 months is acceptable for high-ARPA enterprise companies with strong retention. Longer payback periods strain cash flow and mean you need more capital to fuel growth, making this a critical metric for capital efficiency.',
    components: ['cac-blended', 'arpa', 'gross-margin'],
  },
  'cost-per-lead': {
    formula: 'Total Marketing Spend ÷ Leads Generated',
    description: 'Cost Per Lead measures marketing spend divided by total leads generated across all channels (paid, organic, events, content, etc.). Target varies by industry and average deal size—B2B SaaS typically aims for $50-$200 per lead. This is the first efficiency checkpoint in your acquisition funnel, indicating whether your top-of-funnel marketing investment is cost-effective.',
    components: ['marketing-spend', 'leads'],
  },
  'cost-per-mql': {
    formula: 'Total Marketing Spend ÷ MQLs Generated',
    description: 'Cost Per Marketing Qualified Lead (MQL) measures how much marketing spend is required to generate one qualified lead that meets your scoring criteria. Target $100-$500 per MQL for B2B SaaS, though enterprise deals justify higher costs. Compare this to Cost Per Lead to evaluate your lead qualification efficiency—large gaps suggest too many unqualified leads entering the funnel.',
    components: ['marketing-spend', 'mqls'],
  },
  'cost-per-sql': {
    formula: 'Total Marketing Spend ÷ SQLs Generated',
    description: 'Cost Per Sales Qualified Lead (SQL) measures marketing investment per lead accepted by sales as ready for active pursuit. Target $200-$1,000 per SQL for B2B SaaS, varying by deal size. This metric reveals whether marketing is generating leads sales actually wants—if Cost Per SQL is dramatically higher than Cost Per MQL, you have a qualification problem.',
    components: ['marketing-spend', 'sqls'],
  },
  'cost-per-opp': {
    formula: 'Total Marketing Spend ÷ Opportunities Created',
    description: 'Cost Per Opportunity measures marketing investment required to generate one qualified sales opportunity in active deal cycle. Target varies widely by average deal size—$500-$2,000 for mid-market deals, $2,000-$10,000+ for enterprise. This metric shows true marketing efficiency at driving pipeline, not just top-of-funnel activity.',
    components: ['marketing-spend', 'opportunities'],
  },
  'cost-per-won': {
    formula: 'Total Marketing Spend ÷ Deals Closed Won',
    description: 'Cost Per Won (marketing-attributed) measures marketing spend per closed deal, excluding sales costs. This differs from CAC Blended by isolating marketing contribution—target 30-50% of CAC Blended, with the remainder representing sales investment. If Cost Per Won approaches or exceeds CAC Blended, your sales costs are too low (understaffed) or marketing efficiency is poor.',
    components: ['marketing-spend', 'deals-won'],
  },
  'cpm': {
    formula: '(Paid Marketing Spend ÷ Impressions) × 1000',
    description: 'Cost Per Mille (CPM) measures how much you pay for every 1,000 ad impressions across paid channels (search, social, display). Target <$10 for B2B SaaS indicates efficient audience targeting and ad placement, while $10-$30 is acceptable but suggests optimization opportunities. CPM directly impacts overall customer acquisition economics—higher CPM means you need better downstream conversion rates to maintain healthy CAC.',
    components: ['paid-marketing-spend', 'impressions'],
  },
  'cpc': {
    formula: 'Paid Marketing Spend ÷ Clicks',
    description: 'Cost Per Click (CPC) measures how much you pay each time someone clicks your paid ads across search, social, and display channels. Target $2-$10 for B2B SaaS, though competitive keywords can reach $20-$50+. Lower CPC indicates efficient ad relevance and quality scores, but don\'t optimize CPC alone—focus on downstream conversion to leads and customers.',
    components: ['paid-marketing-spend', 'clicks'],
  },
  'ctr': {
    formula: '(Clicks ÷ Impressions) × 100',
    description: 'Click-Through Rate (CTR) measures what percentage of ad impressions result in clicks, indicating ad creative and targeting effectiveness. Target >2% for search ads and >0.5-1% for display/social ads in B2B SaaS. Low CTR suggests poor ad relevance, weak creative, or misaligned targeting—high CTR with poor conversion indicates a messaging mismatch between ads and landing pages.',
    components: ['clicks', 'impressions'],
  },
  'click-to-lead-rate': {
    formula: '(Leads ÷ Clicks) × 100',
    description: 'Click-to-Lead Rate measures what percentage of ad clicks convert to leads on your landing pages, revealing landing page and form optimization effectiveness. Target >10-20% for B2B SaaS, though gated content can achieve higher rates while demo requests may be lower. This metric isolates landing page performance from ad performance, helping you diagnose where your funnel breaks down.',
    components: ['leads', 'clicks'],
  },
  'lead-to-mql-rate': {
    formula: '(MQLs ÷ Leads) × 100',
    description: 'Lead-to-Marketing Qualified Lead (MQL) Rate shows what percentage of raw leads meet your qualification criteria for sales follow-up. Target >40-60% for well-targeted B2B SaaS campaigns, indicating strong lead quality from the start. Low rates suggest your lead generation is attracting unqualified traffic, poor lead scoring criteria, or misaligned messaging between acquisition and qualification.',
    components: ['mqls', 'leads'],
  },
  'mql-to-sql-rate': {
    formula: '(SQLs ÷ MQLs) × 100',
    description: 'Marketing Qualified Lead (MQL) to Sales Qualified Lead (SQL) Rate measures sales acceptance of marketing-generated leads, revealing marketing-sales alignment. Target >50% for strong alignment, indicating marketing understands ideal customer profile (ICP) and sales qualification criteria. Low conversion rates point to misaligned targeting, weak lead scoring, or poor sales follow-up processes.',
    components: ['sqls', 'mqls'],
  },
  'sql-to-opp-rate': {
    formula: '(Opportunities ÷ SQLs) × 100',
    description: 'Sales Qualified Lead (SQL) to Opportunity Rate measures what percentage of sales-accepted leads convert to active deal cycles after discovery. Target >30-40% for efficient B2B sales processes, showing strong qualification at the SQL stage. Low rates indicate sales is accepting leads that aren\'t truly qualified, wasting sales capacity on prospects that won\'t progress.',
    components: ['opportunities', 'sqls'],
  },
  'win-rate': {
    formula: '(Deals Won ÷ Opportunities) × 100',
    description: 'Win Rate measures the percentage of sales opportunities that close as won deals, indicating sales effectiveness and deal qualification quality. Target >20-30% for enterprise B2B SaaS, >30-40% for mid-market, and higher for SMB or product-led growth motions. Low win rates suggest poor qualification, weak value proposition, competitive pressure, or sales execution challenges that need diagnosis.',
    components: ['deals-won', 'opportunities'],
  },

  // Sales Efficiency
  'magic-number': {
    formula: 'Net New ARR ÷ S&M Spend',
    description: 'The Magic Number measures sales and marketing efficiency by showing how much ARR you generate per dollar of Sales & Marketing (S&M) spend. Target >0.75 for healthy growth and >1.0 for excellent efficiency, indicating each dollar spent generates at least that much in new ARR. Below 0.5 signals inefficient go-to-market motion requiring strategic changes to sales process, pricing, or market fit.',
    components: ['net-new-arr', 'sales-marketing-spend'],
  },
  'payback-period-sm': {
    formula: 'S&M Spend ÷ Net New ARR × 12',
    description: 'Sales & Marketing (S&M) Payback Period measures how many months of revenue it takes to recover your S&M investment in acquiring and expanding customers. Target <12 months for efficient SaaS businesses, though 12-18 months is acceptable for high-LTV enterprise deals. Longer payback periods strain cash flow and require more capital to fuel growth.',
    components: ['sales-marketing-spend', 'net-new-arr'],
  },
  'quick-ratio': {
    formula: '(New Bookings + Expansion ARR) ÷ Churned ARR',
    description: 'The Quick Ratio measures the rate of revenue growth versus revenue loss, showing how many dollars of new and expansion ARR you generate for each dollar of churned ARR. Target >4:1 for healthy SaaS businesses, indicating growth significantly outpaces churn. Ratios below 2:1 suggest churn is eroding too much of your growth, requiring immediate retention improvements or faster new customer acquisition.',
    components: ['new-bookings', 'expansion-arr', 'churned-arr'],
  },

  // Financial Performance
  'gross-profit': {
    formula: 'Monthly Revenue × (1 - COGS %)',
    description: 'Gross Profit represents revenue remaining after Cost of Goods Sold (COGS), including hosting, support, and direct delivery costs. This is the pool of dollars available to fund S&M, R&D, and G&A while targeting profitability. SaaS companies target 75-85% gross profit dollars (75-85% gross margin), with higher margins for pure software and lower for services-heavy models.',
    components: ['monthly-revenue', 'cogs-percent'],
  },
  'gross-margin': {
    formula: '(Gross Profit ÷ Monthly Revenue) × 100',
    description: 'Gross Margin measures gross profit as a percentage of revenue, showing how much of each dollar flows through after delivery costs. Target 75-85% for SaaS businesses, with >80% for efficient cloud-native products. Gross margin directly impacts CAC payback and unit economics—lower margins mean you need higher ARPA or lower CAC to maintain profitability.',
    components: ['gross-profit', 'monthly-revenue'],
  },
  'total-opex': {
    formula: 'S&M Spend + R&D Spend + G&A Spend',
    description: 'Total Operating Expenses (OpEx) aggregates all S&M, R&D, and G&A spend, representing your complete cost structure beyond COGS. Total OpEx subtracted from Gross Profit yields EBITDA, the key profitability metric. Growth-stage SaaS companies typically run OpEx at 100-150% of revenue (burning cash to grow), while profitable mature companies target 40-60% of revenue.',
    components: ['sales-marketing-spend', 'rd-spend', 'ga-spend'],
  },
  'ebitda': {
    formula: 'Gross Profit - Total OpEx',
    description: 'Earnings Before Interest, Taxes, Depreciation, and Amortization (EBITDA) measures operating profitability, showing cash generation from core business operations. Target break-even (0%) for growth-stage SaaS, >10-20% for mature businesses. EBITDA feeds into EBITDA Margin and the Rule of 40, balancing profitability against growth investment—most high-growth SaaS companies run negative EBITDA intentionally.',
    components: ['gross-profit', 'total-opex'],
  },
  'ebitda-margin': {
    formula: '(EBITDA ÷ Monthly Revenue) × 100',
    description: 'Earnings Before Interest, Taxes, Depreciation, and Amortization (EBITDA) Margin expresses profitability as a percentage of revenue. Target break-even (0%) for growth-stage SaaS companies, >10-20% for mature profitable businesses. EBITDA Margin is the profitability component of the Rule of 40, balancing growth investment against operational efficiency.',
    components: ['ebitda', 'monthly-revenue'],
  },
  'rule-of-40': {
    formula: 'ARR Growth Rate + EBITDA Margin',
    description: 'The Rule of 40 combines your ARR growth rate and EBITDA margin to measure overall SaaS business health and efficiency. Target >40% indicates you\'re balancing growth and profitability well, which investors view favorably for sustainable business models. Scores <20% suggest you\'re neither growing fast enough nor profitable enough, requiring strategic decisions about growth investment or cost optimization.',
    components: ['arr-growth-rate', 'ebitda-margin'],
  },
  'burn-multiple': {
    formula: 'Net Burn ÷ Net New ARR',
    description: 'Burn Multiple measures capital efficiency by showing how many dollars of cash you burn to generate each dollar of Net New ARR. Target <1.5x for efficient growth, meaning you burn less than $1.50 per dollar of new ARR added. Higher burn multiples indicate you\'re spending heavily relative to growth output, which may be acceptable for early land-grab but signals efficiency problems if sustained long-term.',
    components: ['net-burn', 'net-new-arr'],
  },
};

// Get formula for a metric by its ID or label
export function getMetricFormula(metricId: string): MetricFormula | null {
  return metricFormulas[metricId] || null;
}

// Get a human-readable formula with actual values
export function getFormulaWithValues(
  metricId: string,
  inputs: any,
  metrics: any
): string | null {
  const formula = getMetricFormula(metricId);
  if (!formula) return null;

  // This is a simplified version - in production you'd have more sophisticated value substitution
  return formula.formula;
}
