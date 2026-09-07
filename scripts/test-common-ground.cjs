const {chromium}=require('playwright');
const fs=require('fs');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000},acceptDownloads:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto((process.env.COMMON_GROUND_BASE_URL||'http://127.0.0.1:3017')+'/projects/common-ground/demo.html');
await page.evaluate(()=>{localStorage.setItem('existing-real-quote','KEEP-REAL-REVISION');sessionStorage.setItem('existing-real-session','KEEP');});
await page.screenshot({path:'/tmp/common-ground-desktop.png',fullPage:true});
await page.getByRole('button',{name:'Try a negotiation',exact:true}).click();
let prior='';
for(const value of ['performance','payment','budget','unknown']){await page.locator(`input[value="${value}"]`).check();const question=await page.locator('#question').innerText();assert.notEqual(question,prior);prior=question;assert((await page.locator('#next-action').innerText()).length>80);}
assert(await page.locator('#confirm').isDisabled());
await page.locator('input[value="performance"]').check();await page.locator('#clarify-reply').click();assert((await page.locator('#clarification-reply').innerText()).includes('Our main concern is paying for development and then finding that the system does not meet our acceptance requirements.'));
assert((await page.locator('#concern-state').innerText()).includes('Working interpretation'));
await page.locator('#confirm').click();assert((await page.locator('#timeline').innerText()).includes('confirmed in simulation'));
await page.getByRole('button',{name:'Choose Full project',exact:true}).click();assert.equal(await page.locator('#selected-margin').innerText(),'25%');
await page.getByRole('button',{name:'Choose 10% discount',exact:true}).click();assert.equal(await page.locator('#selected-margin').innerText(),'16.7%');assert((await page.locator('#boundary-status').innerText()).includes('below'));
await page.locator('#reason').selectOption('fear');assert((await page.locator('#reflection-response').innerText()).includes('₹1,50,000'));
await page.locator('details.private summary').click();await page.locator('#private-note').fill('PRIVATE_SENTINEL_DO_NOT_EXPORT');
await page.getByRole('button',{name:'Choose Separately scoped paid pilot',exact:true}).click();assert.equal(await page.locator('#selected-margin').innerText(),'26.7%');
await page.locator('#draft').fill((await page.locator('#draft').inputValue())+'\nCUSTOMER_EDIT_PRESERVED');
await page.locator('#save').click();
const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;const exported=fs.readFileSync(await download.path(),'utf8');assert(exported.includes('FICTIONAL'));assert(exported.includes('CUSTOMER_EDIT_PRESERVED'));assert(!exported.includes('PRIVATE_SENTINEL'));assert(!exported.includes('losing the order'));assert(!exported.includes('₹3,30,000'));assert(!exported.includes('₹7,50,000'));
await page.locator('#reaction').click();assert(!await page.locator('#resolve').isChecked());assert((await page.locator('#timeline').innerText()).includes('measurable thresholds'));await page.locator('#resolve').check();assert((await page.locator('#timeline').innerText()).includes('Marked resolved'));await page.locator('#reaction').click();assert(!await page.locator('#resolve').isChecked());
await page.locator('summary').filter({hasText:'Costing & minimum margin'}).click();await page.locator('#pilot-cost').fill('360000');await page.locator('#minimum').fill('22');await page.locator('#apply-costs').click();assert.equal(await page.locator('#selected-margin').innerText(),'20%');assert((await page.locator('#boundary-status').innerText()).includes('below'));assert((await page.locator('#draft').inputValue()).includes('CUSTOMER_EDIT_PRESERVED'));
await page.locator('#full-cost').fill('-10');await page.locator('#apply-costs').click();assert.equal(await page.locator('#selected-cost').innerText(),'₹3,60,000');
await page.locator('#reject').click();assert(await page.locator('#guidance').isHidden());
await page.locator('#restart').click();assert.equal(await page.locator('#revision-count').innerText(),'0 saved');assert.equal(await page.locator('#selected-margin').innerText(),'25%');assert(await page.locator('#draft-work').isHidden());assert.equal(await page.evaluate(()=>localStorage.getItem('existing-real-quote')),'KEEP-REAL-REVISION');assert.equal(await page.evaluate(()=>sessionStorage.getItem('existing-real-session')),'KEEP');
for(const width of [390,760,1024,1440]){await page.setViewportSize({width,height:900});assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Overflow '+width);}
await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/common-ground-mobile.png',fullPage:true});assert.deepEqual(errors,[]);console.log('PASS: four guidance branches, confirmation/rejection, all margins, cost validation, private export exclusion, edited drafts, reactions, resolution, revisions, restart preserves real storage, four viewport sizes, no page errors.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
