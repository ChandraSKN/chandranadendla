(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WorkLife = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const scenarios = {
    asha: { name:'Asha', role:'Finding a first job', opening:72000, expense:12000,
      originalIncome:Array.from({length:12},(_,i)=>i<6?0:24000),
      replayIncome:Array.from({length:12},(_,i)=>i<3?0:24000),
      replayLabel:'Start the same job in April',
      assumption:'Opening savings ₹72,000. Essentials ₹12,000 a month. Take-home pay ₹24,000 from July. No other income or interest.',
      change:'Only the job start changes, from July to April. The same salary arrives for three more months.',
      result:'Earlier access to the same job adds ₹72,000 over the year. This is an opportunity scenario, not a claim that searching harder guarantees an earlier offer.',
      chapters:[
        'January to March: applications continue. Three months of essentials use ₹36,000 of her starting savings.',
        'April to June: another ₹36,000 goes on essentials. Her original savings reach zero before her first wage arrives.',
        'July to September: the new job pays ₹24,000 a month. She rebuilds ₹36,000 after essentials.',
        'October to December: another ₹36,000 restores her opening savings. In the original year, total income only matches total essentials.'
      ]},
    ravi: { name:'Ravi', role:'An increment and higher prices', opening:120000, expense:43200,
      originalIncome:Array(12).fill(53000), replayIncome:Array(12).fill(54000),
      replayLabel:'Match the 8% basket price rise',
      assumption:'Opening savings ₹1,20,000. Previous monthly pay ₹50,000, fixed basket ₹40,000. From January: pay ₹53,000, same basket ₹43,200. No other spending or interest.',
      change:'Only the increment changes, from 6% to 8%. The same basket still costs ₹43,200 a month.',
      result:'The replay restores pay’s purchasing power against the assumed basket. Its ₹10,800 monthly surplus has the same basket purchasing power as the old ₹10,000.',
      chapters:[
        'January to March: the 6% increment brings take-home pay to ₹53,000. The unchanged basket costs 8% more. Monthly surplus is ₹9,800.',
        'April to June: six months add ₹58,800 to savings. At the old pay and price levels, the same six months would have added ₹60,000.',
        'July to September: the gap continues without a new purchase, a new dependent or a change in the basket.',
        'October to December: annual surplus is ₹1,17,600. It was ₹1,20,000 under the old monthly budget. Real pay against this basket is down about 1.85%.'
      ]},
    imran: { name:'Imran', role:'Work with unpredictable hours', opening:52000, expense:26000,
      hours:[160,140,120,160,100,140,180,120,100,160,140,160],
      originalIncome:[160,140,120,160,100,140,180,120,100,160,140,160].map(h=>h*200),
      replayIncome:Array(12).fill(28000),
      replayLabel:'Spread the same hours evenly',
      assumption:'Opening savings ₹52,000. Take-home equivalent ₹200 per paid hour. Essentials ₹26,000 monthly. 1,680 paid hours in the year. No other income or interest.',
      change:'Only the schedule changes to 140 paid hours every month. Total hours, annual income and annual essentials stay the same.',
      result:'Year-end cash is unchanged. The replay removes four monthly shortfalls by smoothing income. Predictability improves without an increase in annual pay.',
      chapters:[
        'January to March: paid hours are 160, 140 and 120. March earnings fall ₹2,000 short of essentials.',
        'April to June: paid hours are 160, 100 and 140. May earnings fall ₹6,000 short of essentials.',
        'July to September: paid hours are 180, 120 and 100. A stronger July is followed by two shortfall months.',
        'October to December: paid hours are 160, 140 and 160. Annual income is ₹3,36,000. Four shortfall months are hidden by the ₹28,000 monthly average.'
      ]}
  };
  function summarize(income, expense, opening) {
    let cash=opening; const balances=[cash];
    income.forEach(x=>{cash+=x-expense;balances.push(cash);});
    const earned=income.reduce((a,b)=>a+b,0);
    return {earned,expenses:expense*12,surplus:earned-expense*12,ending:cash,shortfalls:income.filter(x=>x<expense).length,balances};
  }
  function getScenario(id) {
    if(!Object.prototype.hasOwnProperty.call(scenarios,id)) throw new Error('Unknown story');
    const s=scenarios[id];
    return {...s,original:summarize(s.originalIncome,s.expense,s.opening),replay:summarize(s.replayIncome,s.expense,s.opening)};
  }
  function calculate(input) {
    const fields=['incomeBefore','incomeAfter','essentialsBefore','essentialsAfter','otherBefore','otherAfter','hoursBefore','hoursAfter'];
    for(const k of fields)if(typeof input[k]!=='number'||!Number.isFinite(input[k])||input[k]<0||input[k]>1e9) throw new Error('Enter a non-negative number for each pay, expense and hours field.');
    if(input.hoursBefore>744||input.hoursAfter>744)throw new Error('Monthly paid hours must be between 0 and 744.');
    const p=input.basketChange;
    if(p!==null && (typeof p!=='number'||!Number.isFinite(p)||p<=-100||p>1000))throw new Error('The fixed-basket price change must be more than −100% and no more than 1,000%, or left blank.');
    const before=input.incomeBefore-input.essentialsBefore-input.otherBefore;
    const after=input.incomeAfter-input.essentialsAfter-input.otherAfter;
    const nominal=input.incomeBefore>0?(input.incomeAfter/input.incomeBefore-1)*100:null;
    const real=input.incomeBefore>0 && p!==null?(input.incomeAfter/input.incomeBefore/(1+p/100)-1)*100:null;
    const hourlyBefore=input.hoursBefore>0?input.incomeBefore/input.hoursBefore:null;
    const hourlyAfter=input.hoursAfter>0?input.incomeAfter/input.hoursAfter:null;
    const hourlyChange=hourlyBefore!==null&&hourlyBefore>0&&hourlyAfter!==null?(hourlyAfter/hourlyBefore-1)*100:null;
    return {before,after,surplusChange:after-before,incomeChange:input.incomeAfter-input.incomeBefore,expenseChange:input.essentialsAfter+input.otherAfter-input.essentialsBefore-input.otherBefore,nominal,real,hourlyBefore,hourlyAfter,hourlyChange};
  }
  return {getScenario,calculate};
});
