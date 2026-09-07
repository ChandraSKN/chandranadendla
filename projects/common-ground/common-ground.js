(() => {
'use strict';
const $ = id => document.getElementById(id);
const money = value => new Intl.NumberFormat('en-IN', {style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);
const percent = value => Number(value.toFixed(1)).toString();
const initialPrivate = 'This order would help us keep the team occupied. I am worried that pushing back could cost us the opportunity.';
const concerns = {
  performance: {name:'Technical performance',question:'Which acceptance requirements would you need to see demonstrated before committing to the full project?',action:'Agree a measurable test plan together. Explore a separately scoped paid pilot before committing to two production units.',reply:'Our main concern is paying for development and then finding that the system does not meet our acceptance requirements.'},
  payment: {name:'Initial payment',question:'Is the total price workable if payments follow agreed delivery milestones, or is the overall budget also a constraint?',action:'Clarify the upfront amount and payment dates. Explore milestone payments at the full price, then check whether the delivery cash flow is affordable.',reply:'The total price may work for us, but we need to understand what we pay upfront and what is due after acceptance.'},
  budget: {name:'Total budget',question:'What total budget is approved, and which inspection requirements are essential for the first delivery?',action:'Separate essential requirements from optional work. Rescope and recost before making a price concession; a pilot is a separate purchase, not two discounted units.',reply:'We have a fixed budget for this phase. Could we discuss which requirements can be deferred?'},
  unknown: {name:'More information needed',question:'When you say committing before seeing it work is difficult, is the main issue performance, payment timing, the total budget, or something else?',action:'Ask the customer to distinguish the constraints. Hold off on choosing a concession until the key concern is clearer.',reply:'We need to discuss this internally before we can say whether the main constraint is budget, payment timing or performance.'}
};
const choices = {
 full:{name:'Full project',price:1000000,summary:'Two custom inspection units · eight-week delivery.',scope:'Two custom inspection units with an eight-week delivery period. Acceptance requirements, sample parts, site readiness and payment milestones still need agreement.',question:'What acceptance criteria and payment milestones can both sides commit to?',reaction:'We are open to the full project. Can you clarify acceptance criteria and when each payment would become due?'},
 discount:{name:'10% discount',price:900000,summary:'The same two units and eight-week delivery. No assumed cost reduction.',scope:'The same two custom inspection units and eight-week delivery period. A discount changes price only. No scope reduction, cost saving or future order is assumed.',question:'What confirmed change in scope, cost or commitment would make this concession sustainable?',reaction:'The lower price helps. We still need clarity on how acceptance will be demonstrated before we commit.'},
 pilot:{name:'Separately scoped paid pilot',price:450000,summary:'One bench-stage proof of inspection · a smaller, separate commitment.',scope:'One bench-stage inspection setup for one agreed part family and one agreed defect type, tested on customer-supplied samples. Excludes two production units, full throughput validation, site installation and production integration. Pilot timing must be agreed separately; the eight-week quote applies to the full project.',question:'Which sample set, measurable thresholds and sign-off process will define pilot acceptance?',reaction:'We are interested in a paid pilot. Could you make the acceptance criteria clearer before we agree?'}
};
let state;
function reset(){
 state={concern:null,confirmed:false,option:null,fullCost:750000,pilotCost:330000,minimum:20,reason:'',resolved:false,reaction:false,revisions:[]};
 $('private-note').value=initialPrivate;
 document.querySelectorAll('[name=concern]').forEach(r=>r.checked=false);
 $('reason').value='';$('draft').value='';$('resolve').checked=false;
 $('full-cost').value=750000;$('pilot-cost').value=330000;$('minimum').value=20;
 $('guidance').hidden=true;$('clarification-reply').hidden=true;$('reaction-copy').hidden=true;$('draft-work').hidden=true;$('draft-empty').hidden=false;
 $('cost-message').textContent='';$('reflection-response').textContent='';$('concern-state').textContent='';
 document.querySelectorAll('details').forEach(d=>d.open=false);
 renderOptions();renderCommercial();renderTimeline();renderScope();renderRevisions();renderQuote();
}
function cost(id){return id==='pilot'?state.pilotCost:state.fullCost;}
function margin(id){return (choices[id].price-cost(id))/choices[id].price*100;}
function announce(text){$('announcement').textContent=text;}
function appendText(parent,tag,text,cls){const el=document.createElement(tag);el.textContent=text;if(cls)el.className=cls;parent.append(el);return el;}
function renderOptions(){
 $('options').replaceChildren();
 for(const [id,choice] of Object.entries(choices)){
  const row=document.createElement('article');row.className='option'+(state.option===id?' selected':'')+(margin(id)<state.minimum?' below':'');
  const copy=document.createElement('div');appendText(copy,'h3',choice.name);appendText(copy,'p',choice.summary);
  const metrics=document.createElement('div');metrics.className='option-metrics';appendText(metrics,'span',money(choice.price),'option-price');appendText(metrics,'span',percent(margin(id))+'% margin','margin-tag');copy.append(metrics);
  appendText(copy,'p','Estimated full cost '+money(cost(id))+' · profit '+money(choice.price-cost(id)));
  if(margin(id)<state.minimum)appendText(copy,'p','Below your '+percent(state.minimum)+'% minimum by '+percent(state.minimum-margin(id))+' percentage points.','warning');
  const button=document.createElement('button');button.type='button';button.className='option-choice';button.textContent=state.option===id?'✓':'↗';button.setAttribute('aria-label','Choose '+choice.name);button.setAttribute('aria-pressed',String(state.option===id));button.addEventListener('click',()=>selectOption(id));row.append(copy,button);$('options').append(row);
 }
 $('concession').hidden=state.option!=='discount';
}
function renderCommercial(){
 const id=state.option||'full',m=margin(id),difference=m-state.minimum;
 $('minimum-display').textContent=percent(state.minimum);$('selection-label').textContent=choices[id].name;
 $('selected-price').textContent=money(choices[id].price);$('selected-cost').textContent=money(cost(id));$('selected-profit').textContent=money(choices[id].price-cost(id));$('selected-margin').textContent=percent(m)+'%';
 $('boundary-status').textContent=difference===0?'At your configured minimum.':percent(Math.abs(difference))+' percentage points '+(difference<0?'below':'above')+' your minimum.';
 document.querySelector('.commercial').classList.toggle('below',difference<0);
}
function renderTimeline(){
 const timeline=$('timeline');timeline.replaceChildren();
 const lines=[['Customer statement','“Can you reduce the price by 10%?” — committing before seeing it work is difficult.'],['Concern',state.concern?concerns[state.concern].name+(state.confirmed?' · confirmed in simulation':' · unconfirmed hypothesis'):'Not yet clarified'],['Proposed option',state.option?choices[state.option].name+' · '+money(choices[state.option].price):'No option selected'],['Unresolved question',state.option?(state.resolved?'Marked resolved by you in the simulation.':choices[state.option].question):'What is driving the customer’s request?']];
 for(const [heading,text] of lines){const li=document.createElement('li');appendText(li,'strong',heading);appendText(li,'p',text);timeline.append(li);}
}
function renderGuidance(){
 $('guidance').hidden=!state.concern;if(!state.concern)return;
 const c=concerns[state.concern];$('question').textContent=c.question;$('next-action').textContent='Next action: '+c.action;
 $('confirm').disabled=state.confirmed||state.concern==='unknown';
 $('concern-state').textContent=state.confirmed?'Confirmed by you in this fictional simulation.':state.concern==='unknown'?'Keep the concern open until you have more information.':'Working interpretation only. Confirm or reject after clarifying.';
}
function renderScope(){
 const holder=$('scope-copy');holder.replaceChildren();
 if(!state.option){appendText(holder,'p','Choose an option to inspect its scope, assumptions and missing information.');return;}
 const id=state.option;appendText(holder,'h3',choices[id].name);appendText(holder,'p',choices[id].scope);
 if(id==='pilot'){
  appendText(holder,'h3','Proposed measurable acceptance conditions · fictional, not agreed');
  appendText(holder,'p','Before starting: agree a labelled set of 100 representative samples, including 20 known defects. Proposed pass thresholds: detect at least 19 of 20 defects and falsely reject no more than 4 of 80 conforming samples. Record the results in three repeated runs under agreed lighting and fixture conditions. Both sides review the evidence and sign off in writing. These draft thresholds must be checked against the actual inspection risk and use case.');
  appendText(holder,'p','Missing: the actual part family, defect specification, sample availability, test conditions, pilot schedule, payment dates and who signs off. Any subsequent production order requires a separate scope and quotation. The pilot price is not a deposit or automatic credit against production.');
 }else appendText(holder,'p','Missing: agreed technical acceptance criteria, inspection throughput, exclusions, site access and payment schedule. The cost estimate must cover the agreed delivery scope. Any milestone-payment arrangement needs a cash-flow check; it does not change the total price or margin.');
 appendText(holder,'p','Assumptions: estimates are fictional and on a consistent tax basis. Future orders are uncommitted and excluded. '+(id==='discount'?'The 10% discount assumes unchanged scope and delivery cost.':'No future-volume saving is included.'));
}
function reflection(){
 const messages={scope:'Agree exactly what leaves the scope, then recost it in Costing. The current calculation still assumes the full delivery cost.',cost:'Verify the revised estimate and update Costing. Until then, the current full cost remains in the calculation.',commitment:'Document what the customer has actually committed to. A possible future order is not current revenue; it contributes ₹0 here.',fear:'Keeping the team occupied matters. At this price, estimated profit is '+money(choices.discount.price-state.fullCost)+' and margin is '+percent(margin('discount'))+'%. '+(margin('discount')<state.minimum?'That is below your configured minimum. ':'Compare this with your configured minimum. ')+'You could hold the full-project price while discussing payment milestones, or offer a separately scoped paid pilot. Clarify the concern before trading away margin.'};
 $('reflection-response').textContent=messages[state.reason]||'A concession can have several causes. Choose the one you want to examine; this reflection stays private.';
}
function draftFor(id){
 const opening=state.confirmed&&state.concern?{performance:'Thank you for explaining the concern about meeting your acceptance requirements.',payment:'Thank you for clarifying the concern about the initial payment.',budget:'Thank you for sharing the budget constraint.'}[state.concern]:'Thank you for the feedback on our proposal. Before changing the offer, I would like to clarify what would make the commitment workable for you.';
 const body={full:'We can offer the two custom inspection units at ₹10,00,000, with an eight-week delivery period. Let’s agree the acceptance requirements and discuss payment milestones tied to documented progress. We would need to confirm the payment schedule against delivery needs.',discount:'We could propose ₹9,00,000 for the same two custom inspection units and eight-week delivery period, subject to final commercial approval. Before confirming, let’s agree the acceptance requirements and payment terms. Any future order would be separately scoped and quoted.',pilot:'One option is a separately scoped paid pilot at ₹4,50,000: one bench-stage setup for one agreed part family and defect type, using your sample parts. This excludes production integration, installation and the two production units. Pilot timing would be agreed separately.\n\nAs a starting point for discussion, we could test 100 agreed samples (20 known defects and 80 conforming), detect at least 19 defects and falsely reject no more than 4 conforming samples in each of three runs under agreed conditions. We should review these proposed thresholds together before agreeing to them.\n\nWe would document the results and agree written sign-off. Any production order would need a separate quotation; the pilot is not a deposit or automatic credit against it.'}[id];
 return opening+'\n\n'+body+'\n\n'+choices[id].question;
}
function selectOption(id){
 if(state.option===id)return;
 state.option=id;state.resolved=false;state.reaction=false;$('resolve').checked=false;$('reaction-copy').hidden=true;
 $('draft').value=draftFor(id);$('draft-work').hidden=false;$('draft-empty').hidden=true;$('unresolved').textContent=choices[id].question;
 renderOptions();renderCommercial();renderTimeline();renderScope();renderQuote();reflection();announce(choices[id].name+' selected. Draft prepared.');
}
// Customer-facing exports use this explicit projection; private state is never serialized.
function customerDocument(){
 const id=state.option;
 return 'COMMON GROUND — FICTIONAL DEMO QUOTATION\nNot a real offer. Nothing has been sent.\n\nOption: '+choices[id].name+'\nPrice: '+money(choices[id].price)+'\nScope: '+choices[id].scope+'\n'+(id==='pilot'?'Any production order requires a separate quotation.\n':'')+'\nCUSTOMER RESPONSE DRAFT\n'+$('draft').value;
}
function renderQuote(){const target=$('quote-preview');target.replaceChildren();appendText(target,'p',state.option?customerDocument():'Select a commercial option to preview the quotation.','quote-lines');}
function renderRevisions(){
 $('revision-count').textContent=state.revisions.length+' saved';$('revisions').replaceChildren();
 if(!state.revisions.length){appendText($('revisions'),'p','No revisions yet.');return;}
 for(const item of [...state.revisions].reverse()){
  const section=document.createElement('section');section.className='revision';appendText(section,'h3','Demo revision '+item.number+' · '+item.name);
  const details=document.createElement('details');appendText(details,'summary','Read saved customer draft');appendText(details,'pre',item.document);section.append(details);$('revisions').append(section);
 }
}
document.querySelectorAll('[name=concern]').forEach(radio=>radio.addEventListener('change',()=>{
 state.concern=radio.value;state.confirmed=false;state.resolved=false;$('resolve').checked=false;$('clarification-reply').hidden=true;renderGuidance();renderTimeline();announce('Guidance updated for '+concerns[state.concern].name+'.');
}));
$('confirm').addEventListener('click',()=>{if(!state.concern||state.concern==='unknown')return;state.confirmed=true;renderGuidance();renderTimeline();});
$('reject').addEventListener('click',()=>{state.concern=null;state.confirmed=false;state.resolved=false;$('resolve').checked=false;document.querySelectorAll('[name=concern]').forEach(r=>r.checked=false);$('guidance').hidden=true;renderTimeline();announce('Interpretation rejected. Choose another concern or ask for more information.');});
$('clarify-reply').addEventListener('click',()=>{const reply=$('clarification-reply');reply.replaceChildren();appendText(reply,'strong','Simulated customer reply');appendText(reply,'p','“'+concerns[state.concern].reply+'”');appendText(reply,'p','This scripted reply does not automatically confirm your interpretation.');reply.hidden=false;});
$('reason').addEventListener('change',()=>{state.reason=$('reason').value;reflection();});
$('reaction').addEventListener('click',()=>{state.reaction=true;state.resolved=false;$('resolve').checked=false;const target=$('reaction-copy');target.replaceChildren();appendText(target,'strong','Scripted customer reaction · fictional');appendText(target,'p','“'+choices[state.option].reaction+'”');appendText(target,'p','Interest is not acceptance. Keep the question open until you explicitly resolve it.');target.hidden=false;renderTimeline();});
$('resolve').addEventListener('change',()=>{state.resolved=$('resolve').checked;renderTimeline();announce(state.resolved?'Question marked resolved in simulation.':'Question reopened.');});
$('draft').addEventListener('input',renderQuote);
$('save').addEventListener('click',()=>{state.revisions.push({number:state.revisions.length+1,name:choices[state.option].name,document:customerDocument()});renderRevisions();announce('Demo revision saved. Private notes excluded.');});
$('export').addEventListener('click',()=>{const blob=new Blob([customerDocument()],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='common-ground-fictional-customer-draft.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('Fictional customer draft exported. Private notes excluded.');});
$('apply-costs').addEventListener('click',()=>{
 const ids=['full-cost','pilot-cost','minimum'];
 for(const id of ids){if(!$(id).reportValidity()||$(id).value===''){$('cost-message').textContent='Enter valid costs and a minimum margin before applying.';return;}}
 state.fullCost=Number($('full-cost').value);state.pilotCost=Number($('pilot-cost').value);state.minimum=Number($('minimum').value);
 renderOptions();renderCommercial();reflection();$('cost-message').textContent='Demo estimates updated. All margins recalculated; your edited response and saved revisions are preserved.';
});
$('start').addEventListener('click',()=>{$('clarify').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});document.querySelector('[name=concern]').focus({preventScroll:true});announce('Try the fictional negotiation by selecting a working interpretation.');});
$('restart').addEventListener('click',()=>{reset();announce('Simulation restarted. No real records or browser storage were changed.');$('start').focus({preventScroll:true});});
reset();
})();
