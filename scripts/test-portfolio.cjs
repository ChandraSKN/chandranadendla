const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const BASE=process.env.PORTFOLIO_BASE_URL||'http://127.0.0.1:3021';
(async()=>{
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const routes=['/','/professional.html','/stories/','/stories/GameChanger/','/stories/MAD/','/stories/LOVE/','/stories/Maya/','/stories/Yamadutta/','/blogs/','/blogs/theTurk/','/blogs/generativeAI/','/learn.html','/projects/common-ground/','/projects/spinodoid/','/projects/agent-office/'];
const overflows=[];const broken=[];
for(const width of [1440,768,390,320]){
await page.setViewportSize({width,height:1000});
for(const route of routes){await page.goto(BASE+route);await page.waitForTimeout(80);
const issue=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,items:[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().right>innerWidth+2&&getComputedStyle(e).position!=='absolute').slice(0,4).map(e=>e.className),images:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)}));
if(issue.overflow)overflows.push({width,route,items:issue.items});broken.push(...issue.images);
if([1440,390].includes(width)&&['/','/stories/','/stories/GameChanger/','/blogs/','/learn.html','/projects/spinodoid/'].includes(route))await page.screenshot({path:'/tmp/redesign-'+(route==='/'?'home':route.replaceAll('/','-').replace('.html',''))+'-'+width+'.png',fullPage:false});
}
}
await page.setViewportSize({width:390,height:844});await page.goto(BASE);await page.getByRole('button',{name:'Menu',exact:true}).click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
await page.locator('[data-perspective=technology]').click();assert((await page.locator('.thinking-description').innerText()).includes('engineering'));
await page.goto(BASE+'/stories/');await page.locator('[data-filter=Reboots]').click();assert.equal(await page.locator('.story-card:visible').count(),1);await page.locator('[data-filter=All]').click();assert.equal(await page.locator('.story-card:visible').count(),5);
await page.goto(BASE+'/stories/GameChanger/');await page.locator('.focus-toggle').click();assert(await page.locator('.site-header').isHidden());await page.locator('.focus-toggle').click();assert(await page.locator('.site-header').isVisible());
await page.goto(BASE+'/blogs/theTurk/');await page.locator('.theme-toggle').click();assert(await page.locator('body').evaluate(e=>e.classList.contains('night')));await page.locator('.type-toggle').click();assert(await page.locator('body').evaluate(e=>e.classList.contains('large-type')));await page.locator('.focus-toggle').click();assert(await page.locator('.site-header').isHidden());await page.locator('.focus-toggle').click();
await page.goto(BASE+'/learn.html');for(const n of [0,3,1,4,2])await page.locator('.tic-grid button').nth(n).click();assert((await page.locator('#tic-status').innerText()).includes('wins'));await page.locator('#tic-reset').click();assert((await page.locator('#tic-status').innerText()).includes('X goes first'));await page.locator('#bounce-start').click();await page.locator('#bounce-pause').click();assert.equal(await page.locator('#bounce-pause').innerText(),'Resume');
const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.goto(BASE);assert(await nojs.locator('#site-navigation').isVisible());assert(await nojs.locator('.thinking-fallback').isVisible());
console.log(JSON.stringify({routes:routes.length,widths:[1440,768,390,320],overflows,brokenImages:[...new Set(broken)],pageErrors:[...new Set(errors)],interactions:'menu, perspectives, filters, reader modes, tic-tac-toe, bounce pause, no-JS navigation passed'},null,2));
await browser.close();if(overflows.length||broken.length||errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
