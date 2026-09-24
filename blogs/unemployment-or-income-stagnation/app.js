'use strict';
(() => {
  const $=id=>document.getElementById(id);
  const money=(v,d=0)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:d,minimumFractionDigits:d}).format(v);
  const percent=v=>v===null?'Not comparable':(v>0?'+':'')+v.toFixed(2)+'%';
  const signedMoney=v=>(v>0?'+':'')+money(v);
  const metric=(label,value,note='')=>'<div class="metric"><span>'+label+'</span><strong>'+value+'</strong><small>'+note+'</small></div>';
  for(let i=0;i<100;i++){
    const mark=document.createElement('span');mark.className='dot'+(i>=95?' unemployed':i>=90?' new':'');mark.setAttribute('aria-hidden','true');$('workdots').appendChild(mark);
  }
  function setHeadline(pay){
    $('new-pay').textContent=money(pay);const gap=pay-14000;
    $('pay-balance-label').textContent=gap<0?'Monthly shortfall':'Monthly amount remaining';$('pay-balance').textContent=money(Math.abs(gap));
    $('headline-insight').textContent=gap<0?'Income improves. The new pay still falls short of the assumed essentials.':'Income improves and leaves a buffer after the same assumed essentials.';
    $('low-pay').setAttribute('aria-pressed',String(pay===12000));$('higher-pay').setAttribute('aria-pressed',String(pay===25000));
  }
  $('low-pay').addEventListener('click',()=>setHeadline(12000));$('higher-pay').addEventListener('click',()=>setHeadline(25000));
  let person='asha',quarter=0,replay=false;
  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function drawChart(s){
    const svg=$('cash-chart');svg.replaceChildren();
    const width=Math.max(240,svg.parentElement.getBoundingClientRect().width),height=290;
    svg.setAttribute('viewBox','0 0 '+width+' '+height);
    const ns='http://www.w3.org/2000/svg';
    function make(tag,attrs={},text){const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));if(text!==undefined)el.textContent=text;svg.appendChild(el);return el;}
    make('title',{},s.name+': cash balance in the original'+(replay?' and replayed':'')+' year. Full values are available in the monthly table.');
    const left=66,right=width-18,top=32,bottom=243;
    const max=Math.ceil(Math.max(...s.original.balances,...s.replay.balances)/50000)*50000||50000;
    const x=m=>left+(right-left)*m/12,y=v=>bottom-(bottom-top)*v/max;
    make('text',{x:0,y:14,class:'axis-title'},'Cash balance (₹)');
    [0,max/2,max].forEach(v=>{make('line',{x1:left,x2:right,y1:y(v),y2:y(v),stroke:'var(--line)','stroke-width':'1'});make('text',{x:left-8,y:y(v)+4,'text-anchor':'end'},v===0?'0':v>=100000?(v/100000).toFixed(1)+'L':(v/1000)+'k');});
    [0,3,6,9,12].forEach((m,i)=>make('text',{x:x(m),y:bottom+22,'text-anchor':m===0?'start':m===12?'end':'middle'},['Start','Mar','Jun','Sep','Dec'][i]));
    make('text',{x:(left+right)/2,y:height-5,'text-anchor':'middle',class:'axis-title'},'Month');
    function line(values,color,dash){make('polyline',{points:values.map((v,i)=>x(i)+','+y(v)).join(' '),fill:'none',stroke:color,'stroke-width':'2.5',...(dash?{'stroke-dasharray':'6 5'}:{})});[0,3,6,9,12].forEach(m=>make('circle',{cx:x(m),cy:y(values[m]),r:3,fill:color}));}
    line(s.original.balances,'var(--ink)',false);if(replay)line(s.replay.balances,'var(--blue)',true);
  }
  function renderStory(){
    const s=WorkLife.getScenario(person);
    document.querySelectorAll('[data-story]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.story===person)));
    document.querySelectorAll('[data-quarter]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.quarter)===quarter)));
    $('person-name').textContent=s.name;$('person-role').textContent=s.role;$('story-assumptions').textContent=s.assumption;
    $('chapter-copy').textContent=s.chapters[quarter];
    $('original-stats').innerHTML=metric('Original year’s income',money(s.original.earned),'Twelve months of earnings')+metric('Original year-end cash',money(s.original.ending),'Includes opening savings')+metric('Original shortfall months',String(s.original.shortfalls),'Income below essentials');
    $('replay-button').textContent=replay?'Return to original year':s.replayLabel;
    $('replay-button').setAttribute('aria-pressed',String(replay));$('replay-change').textContent=s.change;
    $('replay-result').hidden=!replay;$('replay-key').hidden=!replay;
    $('replay-stats').innerHTML='<div><span>Replayed annual income</span><strong>'+money(s.replay.earned)+'</strong></div><div><span>Replayed year-end cash</span><strong>'+money(s.replay.ending)+'</strong></div><div><span>Replayed shortfall months</span><strong>'+s.replay.shortfalls+'</strong></div>';
    $('replay-explanation').textContent=s.result;
    $('monthly-table').innerHTML=months.map((m,i)=>'<tr><td>'+m+'</td><td>'+money(s.originalIncome[i])+'</td><td>'+money(s.expense)+'</td><td>'+money(s.original.balances[i+1])+'</td><td>'+money(s.replay.balances[i+1])+'</td></tr>').join('');
    drawChart(s);
  }
  document.querySelectorAll('[data-story]').forEach(b=>b.addEventListener('click',()=>{person=b.dataset.story;quarter=0;replay=false;renderStory();}));
  document.querySelectorAll('[data-quarter]').forEach(b=>b.addEventListener('click',()=>{quarter=Number(b.dataset.quarter);renderStory();}));
  $('replay-button').addEventListener('click',()=>{replay=!replay;renderStory();});
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(()=>drawChart(WorkLife.getScenario(person))).observe($('cash-chart').parentElement);
  renderStory();
  const keys=['incomeBefore','incomeAfter','essentialsBefore','essentialsAfter','otherBefore','otherAfter','hoursBefore','hoursAfter'];
  function readBudget(){
    const input={};for(const k of keys){if($(k).value.trim()==='')throw new Error('Complete the pay, expenses and hours fields. Use 0 where appropriate.');input[k]=Number($(k).value);}
    input.basketChange=$('basketChange').value.trim()===''?null:Number($('basketChange').value);return input;
  }
  function calculateBudget(){
    try{
      const input=readBudget(),r=WorkLife.calculate(input);
      $('calc-error').hidden=true;$('calc-results').hidden=false;
      $('calc-metrics').innerHTML=metric('Take-home income change',percent(r.nominal),signedMoney(r.incomeChange)+' a month')+metric('Amount left after spending',money(r.after),signedMoney(r.surplusChange)+' versus before')+metric('Pay change after basket prices',input.basketChange===null?'Not estimated':percent(r.real),input.basketChange===null?'No fixed-basket price input':'Uses your fixed-basket assumption')+metric('Take-home pay per paid hour',r.hourlyAfter===null?'Not comparable':money(r.hourlyAfter,2),r.hourlyChange===null?'A comparable baseline is unavailable':percent(r.hourlyChange)+' versus before');
      let explanation;
      if(r.after<0)explanation='Your listed spending exceeds take-home income by '+money(-r.after)+' a month. The model does not assume how that gap is funded.';
      else if(r.surplusChange<0)explanation='You have '+money(r.after)+' left each month, '+money(-r.surplusChange)+' less than before. '+(r.incomeChange>0?'Your income increase is smaller than the increase in your listed spending.':'The change reflects both your income and spending inputs.');
      else if(r.surplusChange>0)explanation='You have '+money(r.after)+' left each month, '+money(r.surplusChange)+' more than before. This is a cash-flow improvement; any purchasing-power comparison uses the separate basket input.';
      else explanation='Your monthly amount remaining is unchanged at '+money(r.after)+'. The basket comparison and paid hours may still tell a different part of the story.';
      $('calc-interpretation').textContent=explanation;
      $('calc-hours').textContent='Paid hours: '+input.hoursBefore+' before and '+input.hoursAfter+' after. '+(r.hourlyBefore===null||r.hourlyAfter===null?'An hourly comparison needs positive hours in both periods.':'Take-home income per paid hour: '+money(r.hourlyBefore,2)+' before and '+money(r.hourlyAfter,2)+' after.');
      $('calc-decomposition').textContent='Change in monthly surplus = income change ('+signedMoney(r.incomeChange)+') less spending change ('+signedMoney(r.expenseChange)+'). Spending changes can include new needs or quantities. They are not automatically inflation.';
      return r;
    }catch(e){$('calc-error').textContent=e.message;$('calc-error').hidden=false;$('calc-results').hidden=true;return null;}
  }
  $('budget-form').addEventListener('input',()=>{$('calc-results').hidden=true;$('calc-error').hidden=true;});
  $('budget-form').addEventListener('submit',e=>{e.preventDefault();calculateBudget();});
  $('reset-budget').addEventListener('click',()=>{$('budget-form').reset();calculateBudget();});
  calculateBudget();
})();
