/* Job match: reads a job description, scores fit against Chandra's real CV,
   tailors the CV and builds LinkedIn searches. Runs entirely in the browser. */

// Every claim here comes from ChandraSKNadendla_CV.pdf and the project pages. Do not add skills he doesn't have.
// level: 1 = core, proven at work · 0.6 = solid, used in projects · 0 = gap (listed so JDs asking for it count against the score).
const SKILLS = [
  ['product', 'Product management', 1, ['product manag', 'product owner', 'product lifecycle', 'product strategy']],
  ['roadmap', 'Roadmapping & prioritisation', 1, ['roadmap', 'prioriti', 'backlog']],
  ['prd', 'PRDs, SOWs & specifications', 1, ['prd', 'requirements doc', 'sow', 'statement of work', 'specification', 'user stor']],
  ['discovery', 'Customer discovery', 1, ['discovery', 'customer research', 'user research', 'customer needs', 'voice of the customer']],
  ['stakeholder', 'Stakeholder & customer management', 1, ['stakeholder', 'client relationship', 'customer relationship', 'account manag', 'cross-functional', 'cross functional']],
  ['delivery', 'Project delivery & execution', 1, ['project manag', 'program manag', 'programme manag', 'delivery', 'execution', 'end-to-end', 'end to end']],
  ['ops', 'Operations', 1, ['operations', 'operational excellence', 'process improvement']],
  ['finance', 'Financial planning & budgeting', 1, ['financial planning', 'budget', 'p&l', 'forecast', 'financial model']],
  ['pricing', 'Costing, pricing & margin analysis', 1, ['pricing', 'costing', 'cost estimat', 'margin', 'unit economics']],
  ['bid', 'Bids, proposals & tenders', 1, ['bid', 'proposal', 'tender', 'rfp', 'rfq', 'gem portal', 'government e-marketplace']],
  ['procurement', 'Defence & public-sector procurement', 1, ['procurement', 'public sector', 'government', 'psu']],
  ['negotiation', 'Negotiation', 1, ['negotiat']],
  ['bd', 'Business development', 1, ['business development', 'pipeline', 'lead generation', 'new business', 'sales']],
  ['gtm', 'Go-to-market & market entry', 1, ['go-to-market', 'go to market', 'gtm', 'market entry', 'market expansion']],
  ['competitive', 'Market & competitive analysis', 1, ['competitive analysis', 'market research', 'market analysis', 'competitor']],
  ['investor', 'Investor presentations', 1, ['investor', 'fundrais', 'pitch deck']],
  ['presenting', 'Demos, workshops & presentations', 1, ['presentation', 'demo', 'workshop', 'communication skills']],
  ['strategy', 'Business strategy', 1, ['strategy', 'strategic']],
  ['leadership', 'Team leadership & mentoring', 1, ['lead a team', 'team lead', 'mentor', 'people manag', 'leadership', 'coach']],
  ['defence', 'Defence', 1, ['defence', 'defense', 'military', 'armed forces', 'navy', 'army', 'aerospace']],
  ['robotics', 'Robotics & autonomous systems', 1, ['robot', 'autonomous', 'drone', 'uav', 'unmanned']],
  ['vision', 'Perception & machine vision', 0.6, ['computer vision', 'machine vision', 'perception', 'image processing', 'face recognition']],
  ['automation', 'Automation & inspection', 0.6, ['automation', 'inspection', 'industrial']],
  ['deeptech', 'Deep-tech & hardware', 1, ['deep tech', 'deep-tech', 'hardware', 'embedded', 'electronics', 'iot']],
  ['startup', 'Startup environment', 1, ['startup', 'start-up', 'early stage', 'early-stage', 'fast-paced', 'ambiguity']],
  ['mech', 'Mechanical engineering', 1, ['mechanical', 'cad', 'manufactur', 'additive']],
  ['react', 'React & front-end', 1, ['react', 'front-end', 'frontend', 'javascript', 'typescript', 'html', 'css']],
  ['python', 'Python', 0.6, ['python']],
  ['django', 'Django', 0.6, ['django']],
  ['matlab', 'MATLAB', 0.6, ['matlab']],
  ['sql', 'Postgres / SQL', 0.6, ['sql', 'postgres', 'database']],
  ['docker', 'Docker', 0.6, ['docker', 'container']],
  ['ai', 'AI / LLM products', 0.6, ['llm', 'generative ai', 'genai', 'artificial intelligence', 'ai ', 'ai-', 'ai,', 'machine learning', 'claude', 'openai']],
  ['data', 'Data analysis & modelling', 0.6, ['data analy', 'analytics', 'predictive model', 'excel', 'dashboards']],
  ['saas', 'SaaS / platforms', 0.6, ['saas', 'platform', 'b2b software']],
  ['agile', 'Agile delivery', 0.6, ['agile', 'scrum', 'sprint', 'jira']],
  // Gaps: asked for often, not on the CV.
  ['java', 'Java / C++ / C#', 0, ['java ', 'c++', 'c#', '.net']],
  ['cloud', 'AWS / Azure / GCP', 0, ['aws', 'azure', 'gcp', 'google cloud', 'kubernetes']],
  ['ros', 'ROS', 0, ['ros ', 'ros2', 'robot operating system']],
  ['mba', 'MBA', 0, ['mba']],
  ['clearance', 'Security clearance', 0, ['clearance', 'sc cleared', 'dv cleared']],
  ['fintech', 'Banking / fintech', 0, ['banking', 'fintech', 'payments', 'insurance']],
  ['salesforce', 'CRM tools (Salesforce/HubSpot)', 0, ['salesforce', 'hubspot', 'crm']],
  ['cert', 'PMP / PRINCE2 / CSPO', 0, ['pmp', 'prince2', 'cspo', 'cspm', 'safe certif']],
].map(([id, label, level, terms]) => ({ id, label, level, terms }));

const YEARS = 5; // 5+ years per CV

const CV = {
  name: 'Chandra SK Nadendla',
  contact: 'Hyderabad, India · chandrasknadendla@gmail.com · +91 73829 59704 · LinkedIn · chandranadendla.com',
  profiles: {
    product: 'Product manager with 5+ years across product, business development and software engineering. At a defence robotics startup I own the lifecycle of 6+ robotics initiatives from discovery and PRDs to client delivery, and I build my own products, from a costing platform to an AI desktop assistant.',
    business: 'Strategy and business development professional with 5+ years across product, commercial and engineering roles. I lead pricing, bids and negotiation for defence programmes, have built a ₹2 crore+ pipeline, and bring business management training (NMIMS) on top of an engineering foundation.',
    engineering: 'Engineer with 5+ years spanning production React at Cognizant, robotics product delivery and AI tooling. MSc Mechanical Engineering (University of Glasgow). I ship working prototypes end to end, from fleet-management platforms to a voice-driven AI assistant built on the Claude API.',
    operations: 'Operations and delivery lead with 5+ years across product, business and engineering. I run concurrent robotics projects end to end, introduced an execution framework across a 20+ member team, and translate customer problems into scoped, costed requirements.',
  },
  roles: [
    { title: 'Product Manager', org: 'Trinnovate Synergy Technologies Pvt. Ltd.', when: 'Feb 2025 – Present', bullets: [
      ['Led financial planning for two Central Command defence programmes worth ₹2 crore: a camera-controlled drone system and a co-axial drone launcher adapted from a missile launcher, covering cost estimation, budgeting and pricing from proposal to delivery.', 'finance pricing defence robotics'],
      ['Converted 4 of 10+ GeM bids into orders and built an active pipeline of over ₹2 crore, owning technical proposals, feasibility, pricing, demonstrations and negotiation.', 'bid procurement negotiation bd pricing presenting'],
      ['Took part in investor discussions and led product demonstrations, customer workshops and technical presentations.', 'investor presenting strategy'],
      ['Primary interface for Defence, Navy, PSU and industrial customers, translating operational problems into scoped, costed technical requirements.', 'stakeholder defence procurement discovery prd'],
      ['Run 4 active perception and smart-inspection projects end to end, aligning client engineering teams with internal development and driving delivery.', 'delivery vision automation stakeholder ops'],
      ['Own the lifecycle of 6+ robotics and autonomous-system initiatives: discovery, PRDs, SOWs, specifications, prioritisation and client delivery.', 'product roadmap prd discovery robotics delivery'],
      ['Introduced an execution framework across a 20+ member engineering intern team, improving ownership and delivery consistency.', 'leadership ops agile delivery'],
      ['Built working prototypes of a cloud-based multi-robot fleet management platform and a face-recognition attendance system for international schools.', 'robotics vision saas python product'],
    ]},
    { title: 'Business Development Executive', org: 'Geo Lands Doctor (Remote)', when: 'Sep 2024 – Dec 2024', bullets: [
      ['Built 3 market-entry models for taking a digital-twin product into Canada, assessing segment fit, entry route and positioning.', 'gtm strategy competitive data'],
      ['Delivered competitive analysis that fed directly into leadership’s go-to-market decision.', 'competitive gtm strategy'],
      ['Reached out to 50+ organisations, generating 15+ qualified conversations through segment-specific messaging.', 'bd sales'],
    ]},
    { title: 'Front-End Engineer', org: 'Cognizant', when: 'Dec 2019 – Dec 2021', bullets: [
      ['Built 10+ production React interfaces for high-volume stock and billing workflows, gathering requirements directly from operations users.', 'react discovery ops'],
      ['Worked with backend and operations teams on reliability and performance; mentored 5 engineers in React.', 'react leadership stakeholder'],
    ]},
  ],
  projects: [
    ['Common Ground — costing & quotation platform', 'A platform for startups and small engineering teams covering costing, scoping, quotation and revisions. Its negotiation workspace compares offers on full cost and margin, models alternatives such as a paid pilot, and separates internal reasoning from the customer response.', 'pricing negotiation product saas startup react', 'common-ground'],
    ['Desktop Buddy — AI desktop assistant', 'An animated assistant for Linux with meeting reminders, minutes, long-term memory and “Hey Buddy” voice in English and Telugu. Python, PyQt6, Claude API with tool use, local speech models, 200+ automated tests. Now building a hardware version on an ESP32-S3 round display.', 'ai python product deeptech', 'desktop-buddy'],
    ['Spinodoid lattice structures — University of Glasgow', 'MATLAB and Python predictive models linking electrical and mechanical properties across 500+ data points from 35 printed samples.', 'matlab python data mech', 'spinodoid'],
  ],
  education: [
    ['MSc Mechanical Engineering (Merit)', 'University of Glasgow, UK', '2022 – 2023'],
    ['Diploma in General Business Management', 'NMIMS, India', '2021 – 2022'],
    ['B.Tech Mechanical Engineering', 'KL University, India', '2016 – 2020'],
  ],
};

const FAMILY_TERMS = {
  product: ['product manag', 'product owner', 'roadmap', 'prd'],
  business: ['business development', 'sales', 'bid', 'commercial', 'strategy', 'partnership', 'account'],
  engineering: ['engineer', 'developer', 'react', 'python', 'software'],
  operations: ['operations', 'program manag', 'programme manag', 'project manag', 'delivery'],
};

// Terms are stems matched from a word start, so 'bid' won't hit 'forbidden'.
const count = (text, term) => (text.match(new RegExp('\\b' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;

function analyse(raw) {
  const text = ' ' + raw.toLowerCase().replace(/\s+/g, ' ') + ' ';
  // Text after "requirements"/"must have" weighs double: that's what screens people out.
  const cut = text.search(/requirements|qualifications|must have|what you.ll need|what we.re looking for|you have/);
  const must = cut < 0 ? text : text.slice(cut);
  const found = [];
  for (const s of SKILLS) {
    const hits = s.terms.reduce((n, t) => n + count(text, t), 0);
    if (!hits) continue;
    const req = s.terms.some(t => count(must, t));
    found.push({ ...s, hits, weight: (req ? 2 : 1) * Math.min(hits, 3) });
  }
  const total = found.reduce((n, s) => n + s.weight, 0);
  const got = found.reduce((n, s) => n + s.weight * s.level, 0);
  let score = total ? got / total * 100 : 0;

  // Years: "5+ years", "3-5 years", "minimum of 8 years".
  const years = [...text.matchAll(/(\d{1,2})\s*(?:\+|-\s*\d{1,2})?\s*(?:years|yrs)/g)].map(m => +m[1]).filter(n => n < 30);
  const askYears = years.length ? Math.max(...years) : null;
  if (askYears && askYears > YEARS) score -= Math.min(25, (askYears - YEARS) * 6);
  if (found.length < 4) score = Math.min(score, 50); // too little signal to be confident
  score = Math.round(Math.max(5, Math.min(95, score)));

  const family = Object.entries(FAMILY_TERMS)
    .map(([k, ts]) => [k, ts.reduce((n, t) => n + count(text, t), 0)])
    .sort((a, b) => b[1] - a[1])[0][0];

  return {
    score, askYears, family, found,
    strengths: found.filter(s => s.level >= 1).sort((a, b) => b.weight - a.weight),
    partial: found.filter(s => s.level > 0 && s.level < 1).sort((a, b) => b.weight - a.weight),
    gaps: found.filter(s => s.level === 0).sort((a, b) => b.weight - a.weight),
    ...guessMeta(raw),
  };
}

function verdict(score) {
  if (score >= 75) return ['Strong match', 'Apply now and reach out to the hiring team directly.'];
  if (score >= 60) return ['Good match', 'Worth applying. Lead with the strengths below and address the gaps in your note.'];
  if (score >= 40) return ['Stretch', 'Possible with a referral. A warm introduction will matter more than the CV.'];
  return ['Long shot', 'The role leans on things your CV doesn’t show yet. Apply only if you can close the gaps.'];
}

// ponytail: heuristic title/company guess; the form lets the user correct it.
// Junk that comes along when copying a LinkedIn/job-board page.
const JUNK = /^(company logo for,?.*|.*\blogo\b.*|share|save|apply|easy apply|show (more|less)|see more|more options|report this job|promoted|actively recruiting|\d+ (applicants|people clicked apply).*|.*\bago\b.*·.*)$/i;
const cleanJd = raw => raw.split('\n').filter(l => !JUNK.test(l.trim())).join('\n').trim();

function guessMeta(raw) {
  const logo = (raw.match(/company logo for,?\s*([^\n]+)/i) || [])[1]?.trim().replace(/[.,]$/, '');
  raw = cleanJd(raw);
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  const label = re => (raw.match(re) || [])[1]?.trim();
  const company = logo || label(/(?:company|organisation|organization|employer)\s*[:\-–]\s*(.+)/i)
    || label(/\b[Aa]bout\s+([A-Z][\w&.\- ]{1,40}?)(?:\n|:| is | are |,)/)
    || label(/\bat\s+([A-Z][\w&\-]+(?: [A-Z][\w&\-]+){0,3})/) || '';
  const title = label(/(?:job title|role|position)\s*[:\-–]\s*(.+)/i) || (lines[0] || '').slice(0, 80);
  return { company: company.replace(/[.,]$/, ''), title };
}

function tailor(result) {
  const ids = new Set(result.found.map(s => s.id));
  const rank = tags => tags.split(' ').filter(t => ids.has(t)).length;
  const roles = CV.roles.map(r => {
    const scored = r.bullets.map(([text, tags], i) => ({ text, i, rank: rank(tags) }));
    const keep = Math.max(2, Math.ceil(r.bullets.length * 0.75));
    const top = scored.sort((a, b) => b.rank - a.rank || a.i - b.i).slice(0, keep);
    return { ...r, bullets: top.map(b => b.text) }; // most relevant first
  });
  const projects = CV.projects.map(([name, text, tags, slug]) => ({ name, text, url: 'https://chandranadendla.com/projects/' + slug + '/', rank: rank(tags) }))
    .sort((a, b) => b.rank - a.rank).slice(0, 2);
  const skills = [...result.strengths, ...result.partial].map(s => s.label);
  for (const s of SKILLS) if (s.level >= 1 && skills.length < 14 && !skills.includes(s.label)) skills.push(s.label);
  return { ...CV, profile: CV.profiles[result.family], roles, projects, skills };
}

function people(company, title) {
  const q = k => 'https://www.linkedin.com/search/results/people/?keywords=' + encodeURIComponent(k);
  const role = title.replace(/\(.*?\)|[-–|].*$/g, '').trim();
  const c = company || 'company';
  return [
    ['Recruiters & talent team', `${c} recruiter`, 'They screen this role. A short note referencing the job ID gets read.'],
    ['Likely hiring manager', `${c} head of ${role.split(' ').pop() || 'product'}`, 'Senior people in the function this role reports into.'],
    ['People in the same role', `${c} ${role}`, 'Ask what the team actually values. They often refer.'],
    ['University of Glasgow alumni', `${c} University of Glasgow`, 'Shared university is the warmest cold message.'],
    ['KL University alumni', `${c} KL University`, ''],
    ['NMIMS alumni', `${c} NMIMS`, ''],
    ['Ex-Cognizant', `${c} Cognizant`, 'Former colleagues-of-colleagues; ask for a referral.'],
  ].map(([who, k, why]) => ({ who, url: q(k), why }));
}

function message(company, title, r) {
  const top = r.strengths.slice(0, 2).map(s => s.label.toLowerCase()).join(' and ');
  return `Hi {name}, I'm applying for the ${title || 'open role'} at ${company || 'your company'}. I'm a product manager at a defence robotics startup, where I work on ${top || 'product and commercial delivery'}. I'd value 10 minutes to hear what the team looks for — and if it seems a fit, a referral would mean a lot. Thanks, Chandra`;
}

// Application-form answers in Chandra's voice. Only CV facts; anything the CV can't know stays in [brackets].
// ponytail: regex intents, first match wins; add an entry when a question type keeps falling through.
function answer(q, { company = '', title = '', r = null } = {}) {
  const c = company || 'your company', role = title || 'this role';
  const top = (r?.strengths || []).slice(0, 3).map(s => s.label.toLowerCase());
  const fit = top.length ? top.join(', ').replace(/, ([^,]*)$/, ' and $1') : 'product ownership, commercial delivery and hands-on engineering';
  const bullets = CV.roles.flatMap(x => x.bullets.map(([t, tags]) => ({ t, tags, org: x.org })));
  const t = q.toLowerCase();
  const A = [
    [/about yourself|introduce|who are you|your background|walk (me|us) through/, () =>
      `I'm a product manager with 5+ years across product, business development and software engineering. I started as a front-end engineer at Cognizant, did an MSc in Mechanical Engineering at the University of Glasgow and a business management diploma at NMIMS, and now own 6+ robotics and autonomous-system initiatives at Trinnovate Synergy, from discovery and PRDs to pricing, bids and client delivery. Outside work I build my own products: Common Ground, a costing and quotation platform, and Desktop Buddy, an AI desktop assistant built on the Claude API.`],
    [/why (do you want|are you interested|this (company|role|position)|us\b|join|apply)|interest(ed)? in (this|the|our)|what attracts|motivat/, () =>
      `The ${role} at ${c} lines up with what I already do day to day: ${fit}. At Trinnovate I translate Defence, Navy and industrial customers' problems into scoped, costed requirements and see them through delivery, and I want to bring that end-to-end ownership to ${c}. [Add one specific thing about ${c}: a product, a mission or a recent announcement that genuinely interests you.]`],
    [/why (are you )?(leaving|looking|change|move|switch)|reason for (leaving|change)/, () =>
      `I've learned a lot at a defence robotics startup: owning products end to end, pricing ₹2 crore programmes and converting GeM bids into orders. I'm now looking for a role where I can apply that at larger scale and grow with a stronger product organisation, and the ${role} at ${c} is that step.`],
    [/weakness|improve|area of development|development area/, () =>
      `Because I can prototype myself, I've sometimes jumped into building before the team was fully aligned on the problem. I now insist on a written PRD and an agreed success measure before any build starts, which is also how I run the 20+ member engineering intern team at Trinnovate.`],
    [/strength|good at|what (can|would) you bring|value (do you|would you) add|why (should we )?hire/, () =>
      `My strength is bridging customers, commercial and engineering. I can sit with a Navy or PSU customer, turn their operational problem into a costed spec, price and win it (4 of 10+ GeM bids converted, a ₹2 crore+ pipeline), then run delivery with the engineers. My engineering background (React at Cognizant, an MSc from Glasgow, AI tooling on the Claude API) means I earn credibility with technical teams quickly.`],
    [/achievement|proud|accomplish|success|impact/, () =>
      `Leading financial planning for two Central Command defence programmes worth ₹2 crore: a camera-controlled drone system and a co-axial drone launcher adapted from a missile launcher. I owned cost estimation, budgeting and pricing from proposal to delivery, which meant balancing customer requirements, engineering feasibility and margin under tight procurement rules.`],
    [/challeng|difficult|fail|mistake|conflict|disagree|setback|pressure/, () =>
      `When I joined Trinnovate, a 20+ member engineering intern team was working without clear ownership, and delivery was inconsistent. I introduced an execution framework with clear owners, written scopes and regular check-ins. Ownership and delivery consistency improved, and I learned that most delivery problems are really clarity problems.`],
    [/lead|manage(d)? (a )?team|mentor|people management/, () =>
      `At Trinnovate I introduced an execution framework across a 20+ member engineering intern team and run 4 perception and smart-inspection projects end to end, aligning client engineering teams with internal development. Earlier, at Cognizant, I mentored 5 engineers in React.`],
    [/stakeholder|customer|client/, () =>
      `I'm the primary interface for Defence, Navy, PSU and industrial customers at Trinnovate. I run demonstrations, workshops and technical presentations, translate operational problems into scoped, costed requirements, and keep client engineering teams aligned with our internal development through delivery.`],
    [/how many years|years of (experience|exp)|total experience/, () =>
      `5+ years: about 2 years as a front-end engineer at Cognizant (2019–2021), business development at Geo Lands Doctor (2024), and product management at Trinnovate Synergy since February 2025, plus an MSc at the University of Glasgow in between.`],
    [/notice|start date|when can you (start|join)|availab/, () => `My notice period is [X weeks/days]. I can start on [date].`],
    [/salary|ctc|compensation|pay|expected|package/, () => `My current CTC is [current CTC] and I'm looking for [expected CTC], though I'm open to discussing the full package for the right role.`],
    [/relocat|willing to (move|travel)|location|remote|hybrid|on.?site|office/, () => `I'm based in Hyderabad, India, and I'm [open to relocating / available for hybrid or on-site work]. I've already worked remotely across countries, for example the Canada market-entry work at Geo Lands Doctor.`],
    [/visa|sponsor|work (permit|authori)|right to work|eligib/, () => `I'm an Indian citizen based in Hyderabad. [State your work authorisation for the role's country and whether you need sponsorship.]`],
    [/5 years|five years|future|career goal|long.?term|aspir/, () => `I want to grow into a senior product leader who owns a product line end to end, from customer discovery and pricing to delivery, ideally in deep-tech or robotics where my engineering background counts. The ${role} at ${c} builds directly towards that.`],
  ];
  const hit = A.find(([re]) => re.test(t));
  if (hit) return hit[1]();

  // Skill questions ("Do you have experience with X?"): answer from the skill list, honestly.
  const skill = SKILLS.find(s => s.terms.some(term => count(' ' + t + ' ', term)));
  if (skill) {
    if (!skill.level) return `Not directly yet. ${skill.label} isn't something I've used in a role, but I learn new tools quickly: I went from front-end engineering to mechanical engineering to product, and built Desktop Buddy on the Claude API from scratch. [Add anything relevant you have done with ${skill.label}.]`;
    const b = bullets.find(x => x.tags.split(' ').includes(skill.id));
    const proj = CV.projects.find(p => p[2].split(' ').includes(skill.id));
    return `${/^(do|have|are|can|is|did|any)\b/.test(t) ? "Yes. " : ""}${b ? `At ${b.org}, I ${b.t.charAt(0).toLowerCase() + b.t.slice(1)}` : ''}${proj ? ` I've also used it on my own project ${proj[0].split(' —')[0]}: ${proj[1].split('. ')[0]}.` : ''}`.trim();
  }
  return `[No ready answer for this one. Closest material:] ${CV.profiles[r?.family || 'product']}`;
}

// System prompt for Claude: every fact it may use, and the rules for using them.
function answerPrompt() {
  const roles = CV.roles.map(r => `${r.title}, ${r.org} (${r.when}):\n` + r.bullets.map(([t]) => '- ' + t).join('\n')).join('\n\n');
  const skills = SKILLS.map(s => `- ${s.label}: ${s.level >= 1 ? 'core, proven at work' : s.level > 0 ? 'used in projects' : 'NO experience'}`).join('\n');
  return `You write answers to job-application form questions as Chandra SK Nadendla, in first person.

Voice: plain, confident, specific, warm. Short sentences. British spelling. No buzzwords ("passionate", "leverage", "synergy"), no em-dash flourishes, no restating the question, no sign-off. Sound like a person typing into a form, not a cover letter.

Length: match the question. Factual questions get one or two sentences. Motivation or behavioural questions get about 80-150 words. If the question states a word or character limit, stay under it. For behavioural questions (a time when..., challenge, conflict), use a compact situation-action-result shape without labels.

Honesty rules, strictly:
- Use only the facts below. Never invent employers, numbers, dates, tools, certifications or stories.
- If a skill is marked NO experience, say so plainly and point to the closest real experience.
- For anything the facts can't answer (notice period, salary, visa status, personal anecdotes, why a specific company), write a clear [placeholder in brackets] for Chandra to fill in instead of guessing.
- If a job description is provided, connect the answer to what that role asks for, but only through real facts.

Output only the answer text.

FACTS
Name: ${CV.name}. Based in Hyderabad, India. 5+ years of experience.

Experience:
${roles}

Projects:
${CV.projects.map(([n, t]) => `- ${n}: ${t}`).join('\n')}

Education:
${CV.education.map(([d, s, y]) => `- ${d}, ${s} (${y})`).join('\n')}

Skills:
${skills}`;
}

// Job feeds: public careers-board APIs that allow browser requests. Add a company by its board slug.
const BOARDS = {
  greenhouse: ['razorpaysoftwareprivatelimited', 'groww', 'druva', 'inmobi'],
  lever: ['cred', 'zeta', 'meesho', 'paytm', 'mindtickle', 'fampay', 'porter', 'shieldai'],
  ashby: ['sarvam', 'atlan', 'composio'],
  smartrecruiters: ['Freshworks', 'Swiggy'],
};
const ROLE_RE = /product|program|business|bid|strategy|operations|partnership|solutions|commercial|growth/i;
// India or remote only. "Worldwide"/APAC counts; "Remote - USA" does not.
const PLACE_RE = /india|bengaluru|bangalore|hyderabad|mumbai|pune|delhi|gurgaon|gurugram|noida|chennai|kolkata|ahmedabad|worldwide|anywhere|^remote$|\bapac\b|remote.*(india|asia|global)/i;
const htmlText = h => (h || '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
  .replace(/<\/(p|li|h\d|div)>|<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
const getJson = url => fetch(url).then(r => r.ok ? r.json() : Promise.reject(new Error(r.status + ' ' + url)));
const keep = j => ROLE_RE.test(j.title) && PLACE_RE.test((j.location || '').trim());

async function fetchJobs(minScore = 50) {
  const B = BOARDS;
  const feeds = [
    ...B.greenhouse.map(s => getJson(`https://boards-api.greenhouse.io/v1/boards/${s}/jobs?content=true`).then(d => d.jobs.map(j => ({
      title: j.title, company: d.meta?.name || s, location: j.location?.name, url: j.absolute_url, jd: htmlText(j.content), source: 'Greenhouse' })))),
    ...B.lever.map(s => getJson(`https://api.lever.co/v0/postings/${s}?mode=json`).then(d => d.map(j => ({
      title: j.text, company: s, location: j.categories?.location, url: j.hostedUrl,
      jd: [j.descriptionPlain, ...(j.lists || []).map(l => l.text + '\n' + htmlText(l.content)), j.additionalPlain].filter(Boolean).join('\n\n'), source: 'Lever' })))),
    ...B.ashby.map(s => getJson(`https://api.ashbyhq.com/posting-api/job-board/${s}`).then(d => d.jobs.map(j => ({
      title: j.title, company: s, location: j.isRemote && !j.location ? 'Remote' : j.location, url: j.jobUrl, jd: j.descriptionPlain || htmlText(j.descriptionHtml), source: 'Ashby' })))),
    // SmartRecruiters lists have no description: fetch details only for the roles that pass the filter.
    ...B.smartrecruiters.map(s => getJson(`https://api.smartrecruiters.com/v1/companies/${s}/postings?country=in&limit=100`).then(d => Promise.all(d.content
      .map(j => ({ id: j.id, title: j.name, company: j.company?.name || s, location: [j.location?.city, 'India'].filter(Boolean).join(', ') }))
      .filter(keep)
      .map(j => getJson(`https://api.smartrecruiters.com/v1/companies/${s}/postings/${j.id}`).then(x => ({
        ...j, url: x.postingUrl || x.applyUrl, source: 'SmartRecruiters',
        jd: Object.values(x.jobAd?.sections || {}).map(v => htmlText(v.text)).join('\n\n') })))))),
    getJson('https://remotive.com/api/remote-jobs?category=product').then(d => d.jobs.map(j => ({
      title: j.title, company: j.company_name, location: j.candidate_required_location || 'Remote', url: j.url, jd: htmlText(j.description), source: 'Remotive' }))),
  ];
  const jobs = [], failed = [], seen = new Set();
  for (const r of await Promise.allSettled(feeds)) {
    if (r.status === 'rejected') { failed.push(r.reason.message); continue; }
    for (const j of r.value.filter(keep)) {
      const k = `${j.company}|${j.title}|${j.location}`.toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k);
      const { score } = analyse(`${j.title}\n${j.jd}`);
      if (score >= minScore) jobs.push({ ...j, score });
    }
  }
  return { jobs: jobs.sort((a, b) => b.score - a.score), failed };
}

if (typeof module !== 'undefined') module.exports = { analyse, tailor, people, verdict, message, answer, answerPrompt, cleanJd, fetchJobs, SKILLS };
