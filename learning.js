// Local two-player tic-tac-toe.
const grid = document.querySelector('.tic-grid');
const ticStatus = document.querySelector('#tic-status');
let squares, turn, finished;
const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function resetTic() {
  squares = Array(9).fill(''); turn = 'X'; finished = false; grid.replaceChildren();
  ticStatus.textContent = 'X goes first.';
  squares.forEach((_, index) => {
    const button = document.createElement('button'); button.type = 'button';
    button.setAttribute('aria-label', `Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}, empty`);
    button.addEventListener('click', () => {
      if (finished || squares[index]) return;
      squares[index] = turn; button.textContent = turn; button.disabled = true;
      button.setAttribute('aria-label', `Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}, ${turn}`);
      const win = wins.find(line => line.every(i => squares[i] === turn));
      if (win || squares.every(Boolean)) {
        finished = true; ticStatus.textContent = win ? `${turn} wins! Start a new round?` : 'A draw. Try another round.';
        [...grid.children].forEach((cell, i) => { cell.disabled = true; if (win?.includes(i)) cell.classList.add('winner'); });
      } else { turn = turn === 'X' ? 'O' : 'X'; ticStatus.textContent = `${turn}’s turn.`; }
    }); grid.append(button);
  });
}
document.querySelector('#tic-reset').addEventListener('click', resetTic); resetTic();
// Ball bounce starts only on request. Time-based motion is independent of refresh rate.
const canvas = document.querySelector('#bounce');
const context = canvas.getContext('2d');
const start = document.querySelector('#bounce-start');
const pause = document.querySelector('#bounce-pause');
const status = document.querySelector('#bounce-status');
let ball, paddle = 190, score = 0, running = false, inGame = false, frame = 0, last = 0;
const keys = new Set();
function paint() {
  if (!context) return;
  context.clearRect(0,0,480,300);
  context.strokeStyle = '#2b4332'; context.lineWidth = 1;
  for (let x=0;x<=480;x+=30) { context.beginPath(); context.moveTo(x,0); context.lineTo(x,300); context.stroke(); }
  for (let y=0;y<=300;y+=30) { context.beginPath(); context.moveTo(0,y); context.lineTo(480,y); context.stroke(); }
  context.fillStyle='#d0ea8b'; context.fillRect(paddle,275,100,9);
  context.beginPath(); context.arc(ball.x,ball.y,8,0,Math.PI*2); context.fillStyle='#f4b18b'; context.fill();
  context.fillStyle='#e6eddc'; context.font='12px monospace'; context.fillText(`BOUNCES / ${String(score).padStart(2,'0')}`,18,24);
}
function stop() { running = false; cancelAnimationFrame(frame); last=0; keys.clear(); }
function tick(now) {
  if (!running) return;
  const dt = last ? Math.min((now-last)/1000,0.035) : 0; last=now;
  paddle = Math.max(0,Math.min(380,paddle + ((keys.has('ArrowRight')?1:0)-(keys.has('ArrowLeft')?1:0))*340*dt));
  const before = ball.y; ball.x+=ball.vx*dt; ball.y+=ball.vy*dt;
  if (ball.x<8) { ball.x=8; ball.vx=Math.abs(ball.vx); }
  if (ball.x>472) { ball.x=472; ball.vx=-Math.abs(ball.vx); }
  if (ball.y<8) { ball.y=8; ball.vy=Math.abs(ball.vy); }
  if (ball.vy>0 && before+8<=275 && ball.y+8>=275 && ball.x>=paddle-8 && ball.x<=paddle+108) {
    ball.y=267; ball.vy=-Math.min(330,Math.abs(ball.vy)+7); ball.vx=(ball.x-(paddle+50))*4; score++;
  }
  if (ball.y>310) { stop(); inGame=false; pause.hidden=true; status.textContent=`Round over. ${score} ${score===1?'bounce':'bounces'}.`; start.textContent='Try again ↺'; }
  paint(); if(running) frame=requestAnimationFrame(tick);
}
start.addEventListener('click',()=>{
  if (!context) return;
  stop(); paddle=190; score=0; ball={x:240,y:110,vx:115,vy:170}; inGame=true; running=true;
  status.textContent='Keep the ball in play!'; start.textContent='Restart ↺'; pause.textContent='Pause'; pause.hidden=false;
  canvas.focus({preventScroll:true}); frame=requestAnimationFrame(tick);
});
function pauseGame() { if(running) { stop(); pause.textContent='Resume'; status.textContent=`Paused · ${score} bounces`; paint(); } }
pause.addEventListener('click',()=>{ if(running) pauseGame(); else if(inGame) { running=true; last=0; pause.textContent='Pause'; status.textContent='Keep the ball in play!'; frame=requestAnimationFrame(tick); } });
canvas.addEventListener('keydown',event=>{ if(['ArrowLeft','ArrowRight'].includes(event.key)) { event.preventDefault(); keys.add(event.key); } if(event.key==='Escape')pauseGame(); });
canvas.addEventListener('keyup',event=>keys.delete(event.key));
canvas.addEventListener('blur',()=>keys.clear());
canvas.addEventListener('pointermove',event=>{ if(!running)return; const r=canvas.getBoundingClientRect();paddle=Math.max(0,Math.min(380,(event.clientX-r.left)/r.width*480-50)); });
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseGame();});
new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)pauseGame();}).observe(canvas);
ball={x:240,y:110,vx:115,vy:170};paint();
if(!context){start.disabled=true;status.textContent='This browser cannot display the ball game.';}
