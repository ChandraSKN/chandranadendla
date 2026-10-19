// node scripts/test-match.cjs — sanity checks for the job-match scorer.
const assert = require('assert');
const { analyse, tailor, people } = require('../match/match.js');

const pm = `Senior Product Manager – Robotics
About Skyline Robotics: we build autonomous drones for defence customers.
Requirements: 5+ years product management, roadmap ownership, writing PRDs, stakeholder management with government and defence procurement, pricing and bid proposals.`;
const dev = `Backend Engineer at Stripe. Requirements: 8+ years Java, AWS, Kubernetes, payments and fintech experience.`;

const a = analyse(pm), b = analyse(dev);
assert(a.score >= 75, 'PM robotics role should be strong: ' + a.score);
assert(b.score < 40, 'Java fintech role should be a long shot: ' + b.score);
assert.equal(a.company, 'Skyline Robotics');
assert.equal(b.company, 'Stripe');
assert.equal(a.family, 'product');
assert(b.gaps.some(g => g.id === 'cloud'));
assert(!analyse('forbidden zone').found.some(s => s.id === 'bid'), 'word-start matching');
const cv = tailor(a);
assert(/Defence|lifecycle|GeM/.test(cv.roles[0].bullets[0]), 'most relevant bullet first');
assert(people('Stripe', 'Backend Engineer')[0].url.includes('Stripe%20recruiter'));
const { answer } = require('../match/match.js');
assert(answer('Why do you want to join us?', { company: 'Skyline Robotics', title: 'PM', r: a }).includes('Skyline Robotics'));
assert(answer('What is your notice period?').includes('['), 'unknown facts stay as placeholders');
assert(answer('Do you have experience with Python?').startsWith('Yes'));
assert(answer('Do you have AWS experience?').startsWith('Not directly'));
console.log('match ok', a.score, b.score);
const li = analyse('Company logo for, TriNet.\nShare\nSenior Product Manager\nShow more\nAbout the job: roadmap, PRDs.');
assert.equal(li.company, 'TriNet');
assert.equal(li.title, 'Senior Product Manager');
assert(!require('../match/match.js').cleanJd('Company logo for, TriNet.\nShare\nRoadmap').includes('logo'));
console.log('linkedin junk ok');
if (process.argv.includes('--live')) require('../match/match.js').fetchJobs().then(({ jobs, failed }) => {
  console.log(jobs.length, 'live jobs; failed:', failed);
  jobs.slice(0, 12).forEach(j => console.log(j.score, j.source, j.company, '|', j.title, '|', j.location));
});
