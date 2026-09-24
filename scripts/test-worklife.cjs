const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const model=require('../blogs/unemployment-or-income-stagnation/model.js');
const BASE=process.env.PORTFOLIO_BASE_URL||'http://127.0.0.1:3021';
const ROUTE='/blogs/unemployment-or-income-stagnation/';
const expected={asha:[144000,216000,72000,144000,6,3],ravi:[636000,648000,237600,249600,0,0],imran:[336000,336000,76000,76000,4,0]};
for(const [id,values] of Object.entries(expected)){
 const s=model.getScenario(id);assert.deepEqual([s.original.earned,s.replay.earned,s.original.ending,s.replay.ending,s.original.shortfalls,s.replay.shortfalls],values);
}
const defaults={incomeBefore:50000,incomeAfter:53000,essentialsBefore:40000,essentialsAfter:43200,otherBefore:0,otherAfter:0,hoursBefore:176,hoursAfter:176,basketChange:8};
const r=model.calculate(defaults);assert(Math.abs(r.nominal-6)<1e-10);assert.equal(r.after,9800);assert.equal(r.surplusChange,-200);assert(Math.abs(r.real-(-1.85185185185186))<1e-10);assert(Math.abs(r.hourlyAfter-301.1363636363636)<1e-10);
assert.equal(model.calculate({...defaults,basketChange:null}).real,null);
assert.equal(model.calculate({...defaults,incomeBefore:0}).nominal,null);
for(const field of ['hoursBefore','hoursAfter'])assert.equal(model.calculate({...defaults,[field]:0})[field==='hoursBefore'?'hourlyBefore':'hourlyAfter'],null);
for(const [field,value] of [['hoursBefore',745],['hoursAfter',745],['incomeBefore',-1],['incomeAfter',1e9+1],['basketChange',-100],['basketChange',1001]])assert.throws(()=>model.calculate({...defaults,[field]:value}));
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];const failures=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(BASE)&&r.status()>=400)failures.push(r.url());});
 await page.goto(BASE+'/blogs/');await page.locator('a[href="unemployment-or-income-stagnation/"]').click();assert.equal(new URL(page.url()).pathname,ROUTE);
 await page.reload();
 await page.addScriptTag({path:require.resolve('axe-core')});
 const accessibility=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));assert.deepEqual(accessibility.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
 await page.screenshot({path:'/tmp/worklife-opening-desktop.png'});
 assert.equal(await page.locator('#workdots .dot').count(),100);
 await page.locator('#higher-pay').focus();await page.keyboard.press('Enter');assert.match(await page.locator('#pay-balance').innerText(),/11,000/);assert.equal(await page.locator('#higher-pay').getAttribute('aria-pressed'),'true');await page.locator('#low-pay').click();assert.match(await page.locator('#pay-balance').innerText(),/2,000/);
 for(const id of Object.keys(expected)){
  await page.locator(`[data-story=${id}]`).click();
  for(let q=0;q<4;q++){await page.locator(`[data-quarter="${q}"]`).click();assert.equal(await page.locator('#chapter-copy').innerText(),model.getScenario(id).chapters[q]);assert.equal(await page.locator(`[data-quarter="${q}"]`).getAttribute('aria-pressed'),'true');}
  assert.equal(await page.locator('#cash-chart polyline').count(),1);await page.locator('#replay-button').click();assert.equal(await page.locator('#cash-chart polyline').count(),2);assert(await page.locator('#replay-result').isVisible());assert.equal(await page.locator('#monthly-table tr').count(),12);
  const rows=await page.locator('#monthly-table tr').allTextContents();assert(rows[11].includes(new Intl.NumberFormat('en-IN').format(expected[id][3])));
  await page.locator('#replay-button').click();assert(await page.locator('#replay-result').isHidden());
 }
 for(const summary of await page.locator('#evidence summary').all()){await summary.focus();await page.keyboard.press('Enter');assert(await summary.evaluate(e=>e.parentElement.open));await page.keyboard.press('Enter');}
 assert.match(await page.locator('#calc-metrics').innerText(),/\+6.00%/);assert.match(await page.locator('#calc-metrics').innerText(),/-1.85%/);
 const submit=()=>page.locator('#budget-form button[type=submit]').click();
 for(const [field,value] of [['incomeBefore',''],['incomeAfter','-1'],['hoursBefore','745'],['hoursAfter','745'],['incomeAfter','1000000001'],['basketChange','-100'],['basketChange','1001']]){
  await page.locator('#reset-budget').click();await page.locator('#'+field).fill(value);assert(await page.locator('#calc-results').isHidden());await submit();assert(await page.locator('#calc-error').isVisible());assert(await page.locator('#calc-results').isHidden());
 }
 await page.locator('#reset-budget').click();await page.locator('#basketChange').fill('');await submit();assert.match(await page.locator('#calc-metrics').innerText(),/Not estimated/);
 await page.locator('#incomeBefore').fill('0');await page.locator('#hoursAfter').fill('0');await submit();assert.match(await page.locator('#calc-metrics').innerText(),/Not comparable/);
 await page.locator('#reset-budget').click();assert.match(await page.locator('#calc-interpretation').innerText(),/200 less/);
 const sourceLinks=await page.locator('.source-link a').evaluateAll(es=>es.map(e=>e.href));assert.equal(sourceLinks.length,6);
 for(let i=1;i<=6;i++){await page.locator(`a.ref[href="#source-${i}"]`).first().click();assert.equal(new URL(page.url()).hash,'#source-'+i);assert.equal(await page.locator('#source-'+i).count(),1);}
 assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll(es=>es.filter(e=>e.hash&&!document.getElementById(decodeURIComponent(e.hash.slice(1)))).map(e=>e.hash)),[]);
 const widths=[1440,768,390,320];
 for(const width of widths){
  await page.setViewportSize({width,height:900});await page.goto(BASE+ROUTE);await page.locator('[data-story=imran]').click();await page.locator('#replay-button').click();await page.getByText('Inspect the monthly calculations',{exact:true}).click();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'overflow at '+width);
  await page.screenshot({path:`/tmp/worklife-${width}.png`,fullPage:false});
  await page.locator('#replay').scrollIntoViewIfNeeded();await page.screenshot({path:`/tmp/worklife-replay-${width}.png`});
  await page.locator('#calculator').scrollIntoViewIfNeeded();await page.screenshot({path:`/tmp/worklife-calculator-${width}.png`});
 }
 await page.locator('.theme-toggle').click();assert(await page.locator('body').evaluate(e=>e.classList.contains('night')));await page.locator('#replay').scrollIntoViewIfNeeded();await page.screenshot({path:'/tmp/worklife-night.png'});
 await page.addScriptTag({path:require.resolve('axe-core')});const nightAccessibility=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));assert.deepEqual(nightAccessibility.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
 await page.locator('.type-toggle').click();assert(await page.locator('body').evaluate(e=>e.classList.contains('large-type')));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.locator('.focus-toggle').click();assert(await page.locator('.site-header').isHidden());await page.locator('.focus-toggle').click();assert(await page.locator('.site-header').isVisible());
 await page.goto(BASE+ROUTE.slice(0,-1));assert.equal(new URL(page.url()).pathname,ROUTE);
 await page.locator('.back').click();assert.equal(new URL(page.url()).pathname,'/blogs/');await page.goBack();assert.equal(await page.locator('#workdots .dot').count(),100);
 const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.goto(BASE+ROUTE);const integrated=await nojs.locator('.prose').allTextContents();assert(await nojs.locator('#site-navigation').isVisible());
 await nojs.goto(BASE+'/Unemployment_Income_Stagnation_Portfolio_Handoff/article-handoff/dist/');assert.deepEqual(integrated,await nojs.locator('.prose').allTextContents());assert.deepEqual(sourceLinks,await nojs.locator('.source-link a').evaluateAll(es=>es.map(e=>e.href)));
 assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);await browser.close();console.log(JSON.stringify({model:'all acceptance values and edge cases passed',browser:'all stories, quarters, replay states, headline, calculator validation/reset, evidence, citations, reader modes, navigation, no-JS content parity passed',widths,pageErrors:errors,failedLocalRequests:failures},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
