/* Arcade do Código — núcleo compartilhado: telas, HUD, sons, desenhos, placar. */
(function(){
  'use strict';
  var $ = function(id){ return document.getElementById(id); };
  var PLACAR = 'https://ntfy.sh/arcade-codigo-es-7b3e19c4a2'; // a sala (4 letras) entra no fim do canal
  var INK = '#2f2a4a';
  var A = window.Arcade = { games:{}, order:[], INK:INK, COLORS:['#ff5f8f','#8c73ff','#4fd6a6','#ff8a3d','#3fb4ff'] };

  function wait(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }
  A.wait = wait;

  var MODES = {
    facil:{ label:'Fácil', icon:'broto', hint:'Mais devagar e com 5 vidas. Pontos ×0,6', speed:0.75, lives:2, mult:0.6 },
    normal:{ label:'Normal', icon:'raio', hint:'O jogo como ele é. Pontos ×1', speed:1, lives:0, mult:1 },
    dificil:{ label:'Desafio', icon:'fogo', hint:'Rápido, 2 vidas e pontos ×1,5. Para quem manda bem!', speed:1.35, lives:-1, mult:1.5 }
  };
  var mode = 'normal';
  try{ if(MODES[localStorage.getItem('arcade-mode')]) mode = localStorage.getItem('arcade-mode'); }catch(e){}

  // ---------- som ----------
  var ac = null, muted = false;
  function tone(f, d, type, vol, delay, slide){
    if(muted) return;
    try{
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var t = ac.currentTime + (delay || 0);
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(f, t);
      if(slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
      g.gain.setValueAtTime(vol || 0.08, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(ac.destination);
      o.start(t); o.stop(t + d + 0.03);
    }catch(e){}
  }
  A.sfx = {
    click: function(){ tone(660, 0.06, 'triangle', 0.06); },
    pop: function(){ tone(500, 0.12, 'sine', 0.12, 0, 1200); },
    slice: function(){ tone(1500, 0.08, 'sawtooth', 0.025, 0, 400); tone(700, 0.12, 'triangle', 0.07, 0, 1700); },
    good: function(){ tone(880, 0.1, 'triangle', 0.08); tone(1320, 0.12, 'triangle', 0.07, 0.07); },
    bad: function(){ tone(320, 0.35, 'sawtooth', 0.06, 0, 90); },
    gold: function(){ [880, 1175, 1568].forEach(function(f, i){ tone(f, 0.12, 'triangle', 0.08, i * 0.06); }); },
    power: function(){ [523, 784, 1047, 1568].forEach(function(f, i){ tone(f, 0.1, 'square', 0.04, i * 0.05); }); },
    whoosh: function(){ tone(260, 0.16, 'sine', 0.025, 0, 700); },
    tick: function(){ tone(1000, 0.05, 'square', 0.03); },
    beep: function(){ tone(520, 0.12, 'triangle', 0.08); },
    go: function(){ tone(660, 0.15, 'triangle', 0.1); tone(990, 0.25, 'triangle', 0.1, 0.12); },
    win: function(){ [523, 659, 784, 1047, 1319].forEach(function(f, i){ tone(f, 0.2, 'triangle', 0.08, i * 0.11); }); }
  };
  A.vibrate = function(p){ try{ navigator.vibrate && navigator.vibrate(p); }catch(e){} };
  function setMuted(m){
    muted = m;
    $('mute').innerHTML = A.iconHtml(m ? 'mudo' : 'som');
    A.iconText($('mute-menu'), m ? 'mudo' : 'som', m ? 'Som desligado' : 'Som ligado');
  }

  // ---------- desenhos ----------
  function rr(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function circle(ctx, x, y, r){ ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); }
  A.rr = rr;
  A.circle = circle;

  // Ícones desenhados do identidade-visual (js/icones.js) no lugar dos emojis: no canvas, no HTML e com texto ao lado
  A.icon = function(ctx, name, x, y, size){ if(window.Icones) Icones.desenhar(ctx, name, x, y, size); };
  A.iconHtml = function(name){ return window.Icones ? Icones.svg(name) : ''; };
  A.iconText = function(el, name, text){
    el.innerHTML = A.iconHtml(name);
    el.appendChild(document.createTextNode(' ' + text));
  };

  A.drawMonster = function(ctx, x, y, r, color, t, o){
    o = o || {};
    ctx.save();
    ctx.translate(x + (o.calm ? 0 : Math.sin(t * 0.05) * r * 0.04), y);
    if(o.rot) ctx.rotate(o.rot);
    var lw = Math.max(1.5, r * 0.11);
    if(!o.calm){
      ctx.fillStyle = color; ctx.strokeStyle = INK; ctx.lineWidth = Math.max(1, r * 0.05);
      for(var i = 0; i < 3; i++){
        var a = t * 0.003 + i * 2.1, s = r * 0.24;
        var px = Math.cos(a) * r * 1.28, py = Math.sin(a) * r * 1.28;
        ctx.fillRect(px - s / 2, py - s / 2, s, s); ctx.strokeRect(px - s / 2, py - s / 2, s, s);
      }
    }
    var n = 12, pts = [];
    for(var k = 0; k < n; k++){
      var ang = k / n * Math.PI * 2, f = 1 + 0.06 * Math.sin(ang * 3 + t * 0.008);
      pts.push([Math.cos(ang) * r * f, Math.sin(ang) * r * f * 0.95]);
    }
    ctx.beginPath();
    ctx.moveTo((pts[n - 1][0] + pts[0][0]) / 2, (pts[n - 1][1] + pts[0][1]) / 2);
    for(var j = 0; j < n; j++){
      var p = pts[j], q = pts[(j + 1) % n];
      ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
    }
    ctx.closePath();
    ctx.fillStyle = color; ctx.fill();
    ctx.save(); ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,0.32)';
    ctx.fillRect(-r * 1.3, ((t * 0.0012) % 1 * 2.4 - 1.2) * r, r * 2.6, r * 0.2);
    ctx.beginPath(); ctx.ellipse(-r * 0.4, -r * 0.55, r * 0.28, r * 0.15, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.stroke();

    if(o.gold){
      ctx.fillStyle = '#fff';
      for(var g = 0; g < 3; g++){
        var ga = t * 0.004 + g * 2.1, gx = Math.cos(ga) * r * 1.5, gy = Math.sin(ga) * r * 1.5, gs = r * 0.16;
        ctx.beginPath(); ctx.moveTo(gx, gy - gs); ctx.lineTo(gx + gs * 0.3, gy); ctx.lineTo(gx, gy + gs); ctx.lineTo(gx - gs * 0.3, gy); ctx.closePath(); ctx.fill();
      }
    }
    if(o.dizzy){
      ctx.strokeStyle = INK; ctx.lineWidth = lw * 0.9; ctx.lineCap = 'round';
      [[-r * 0.33, -r * 0.14], [r * 0.32, -r * 0.18]].forEach(function(e){
        var s2 = r * 0.15;
        ctx.beginPath(); ctx.moveTo(e[0] - s2, e[1] - s2); ctx.lineTo(e[0] + s2, e[1] + s2);
        ctx.moveTo(e[0] + s2, e[1] - s2); ctx.lineTo(e[0] - s2, e[1] + s2); ctx.stroke();
      });
    } else {
      var look = Math.sin(t * 0.002 + x * 0.01) * r * 0.06;
      ctx.fillStyle = '#fff';
      circle(ctx, -r * 0.33, -r * 0.12, r * 0.27); ctx.fill();
      circle(ctx, r * 0.32, -r * 0.18, r * 0.22); ctx.fill();
      ctx.fillStyle = INK;
      circle(ctx, -r * 0.3 + look, -r * 0.08, r * 0.13); ctx.fill();
      circle(ctx, r * 0.34 + look, -r * 0.14, r * 0.11); ctx.fill();
      if(o.angry){
        ctx.strokeStyle = INK; ctx.lineWidth = lw; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-r * 0.55, -r * 0.48); ctx.lineTo(-r * 0.15, -r * 0.36);
        ctx.moveTo(r * 0.55, -r * 0.5); ctx.lineTo(r * 0.15, -r * 0.4); ctx.stroke();
      }
    }
    ctx.strokeStyle = INK; ctx.lineWidth = lw * 0.8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(-r * 0.36, r * 0.36); ctx.lineTo(-r * 0.18, r * 0.24); ctx.lineTo(0, r * 0.38);
    ctx.lineTo(r * 0.18, r * 0.24); ctx.lineTo(r * 0.36, r * 0.36);
    ctx.stroke();
    ctx.restore();
  };

  // O Bit oficial do GamificaPampa (identidade-visual/mascote), desenhado no canvas na mesma medida do robô antigo.
  // mood 'happy' comemora de braços para cima, 'sad' faz a cara de ops e o normal pisca e olha para o dedo (look)
  A.drawRobot = function(ctx, x, y, s, mood, t, lean, look){
    var k = s / 60;
    ctx.save();
    ctx.translate(x, y + Math.sin(t * 0.006) * s * 0.03);
    if(lean) ctx.rotate(lean);
    ctx.scale(k, k);
    ctx.translate(-50, -47);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = INK; ctx.lineWidth = 4;
    if(mood === 'happy'){
      ctx.beginPath(); ctx.moveTo(31, 80); ctx.lineTo(18, 70); ctx.lineTo(14, 59); ctx.moveTo(69, 80); ctx.lineTo(82, 70); ctx.lineTo(86, 59); ctx.stroke();
      ctx.fillStyle = '#8cc4ff'; ctx.lineWidth = 3;
      circle(ctx, 14, 56, 5); ctx.fill(); ctx.stroke();
      circle(ctx, 86, 56, 5); ctx.fill(); ctx.stroke();
      ctx.lineWidth = 4;
    }
    ctx.beginPath(); ctx.moveTo(50, 8); ctx.lineTo(50, 22); ctx.stroke();
    ctx.fillStyle = '#ff4d4d'; ctx.lineWidth = 2;
    circle(ctx, 50, 8, 6); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 4;
    rr(ctx, 30, 72, 40, 20, 6); ctx.fillStyle = '#8cc4ff'; ctx.fill(); ctx.stroke();
    rr(ctx, 18, 22, 64, 48, 14); ctx.fillStyle = '#4da3ff'; ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff8fb0';
    circle(ctx, 27, 57, 4); ctx.fill();
    circle(ctx, 73, 57, 4); ctx.fill();
    if(mood === 'happy'){
      ctx.beginPath(); ctx.moveTo(31, 46); ctx.quadraticCurveTo(38, 38, 45, 46); ctx.moveTo(55, 46); ctx.quadraticCurveTo(62, 38, 69, 46); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(38, 57); ctx.lineTo(62, 57); ctx.quadraticCurveTo(61, 70, 50, 70); ctx.quadraticCurveTo(39, 70, 38, 57); ctx.closePath();
      ctx.fillStyle = INK; ctx.fill();
    } else {
      if(mood !== 'sad' && (t % 3200) < 140){
        ctx.beginPath(); ctx.moveTo(30, 44); ctx.lineTo(46, 44); ctx.moveTo(54, 44); ctx.lineTo(70, 44); ctx.stroke();
      } else {
        ctx.fillStyle = '#fff';
        circle(ctx, 38, 44, 9); ctx.fill();
        circle(ctx, 62, 44, 9); ctx.fill();
        var lx = mood === 'sad' ? -1 : look ? look.x * 3 : 2, ly = mood === 'sad' ? 3 : look ? look.y * 3 : 1;
        ctx.fillStyle = INK;
        circle(ctx, 38 + lx, 44 + ly, 4); ctx.fill();
        circle(ctx, 62 + lx, 44 + ly, 4); ctx.fill();
      }
      ctx.beginPath();
      if(mood === 'sad'){
        ctx.lineWidth = 3.5;
        ctx.moveTo(30, 33); ctx.lineTo(43, 30); ctx.moveTo(70, 33); ctx.lineTo(57, 30); ctx.stroke();
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(40, 63); ctx.quadraticCurveTo(45, 58, 50, 63); ctx.quadraticCurveTo(55, 68, 60, 63);
      } else {
        ctx.moveTo(40, 60); ctx.quadraticCurveTo(50, 67, 60, 60);
      }
      ctx.stroke();
    }
    ctx.restore();
  };

  A.drawPiece = function(ctx, x, y, s, color, rot){
    ctx.save();
    ctx.translate(x, y);
    if(rot) ctx.rotate(rot);
    ctx.lineWidth = Math.max(2, s * 0.07); ctx.strokeStyle = INK; ctx.fillStyle = color;
    circle(ctx, 0, -s * 0.46, s * 0.15); ctx.fill(); ctx.stroke();
    rr(ctx, -s * 0.45, -s * 0.42, s * 0.9, s * 0.88, s * 0.18); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = '700 ' + Math.round(s * 0.36) + 'px Fredoka, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('</>', 0, s * 0.04);
    ctx.restore();
  };

  A.monsterSVG = function(c){
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' +
      '<rect x="4" y="18" width="13" height="13" fill="' + c + '" stroke="#2f2a4a" stroke-width="3"/>' +
      '<rect x="83" y="64" width="11" height="11" fill="' + c + '" stroke="#2f2a4a" stroke-width="3"/>' +
      '<path d="M50 12c22 0 38 14 38 36S74 88 50 88 12 72 12 48 28 12 50 12z" fill="' + c + '" stroke="#2f2a4a" stroke-width="6"/>' +
      '<circle cx="37" cy="44" r="11" fill="#fff"/><circle cx="64" cy="41" r="9" fill="#fff"/>' +
      '<circle cx="39" cy="46" r="5" fill="#2f2a4a"/><circle cx="66" cy="43" r="4.5" fill="#2f2a4a"/>' +
      '<path d="M33 66l8-6 9 7 9-7 8 6" stroke="#2f2a4a" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  };

  A.canvas = function(stage){
    var cv = document.createElement('canvas');
    cv.className = 'stage-canvas';
    stage.appendChild(cv);
    var ctx = cv.getContext('2d');
    var o = { cv:cv, ctx:ctx, W:0, H:0 };
    o.resize = function(){
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      o.W = stage.clientWidth; o.H = stage.clientHeight;
      cv.width = Math.round(o.W * dpr); cv.height = Math.round(o.H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    o.resize();
    return o;
  };

  A.pos = function(stage, e){
    var r = stage.getBoundingClientRect();
    return { x:e.clientX - r.left, y:e.clientY - r.top };
  };

  // ---------- fluxo do jogo ----------
  A.register = function(g){ A.games[g.id] = g; A.order.push(g.id); };

  var current = null, run = null;

  function show(id){
    ['scr-menu', 'scr-game', 'scr-end'].forEach(function(s){ $(s).hidden = s !== id; });
    var el = $(id);
    el.classList.remove('enter'); void el.offsetWidth; el.classList.add('enter');
    if(id === 'scr-menu'){ sizeArts(); updateActive(); renderProgress(); startMenuLoop(); }
  }

  function countUp(el, to, ms, suffix){
    var from = parseInt(el.textContent, 10) || 0, t0 = performance.now();
    if(el._raf) cancelAnimationFrame(el._raf);
    if(to <= from || !ms){ el.textContent = to + (suffix || ''); return; }
    (function step(now){
      var k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(from + (to - from) * e) + (suffix || '');
      if(k < 1) el._raf = requestAnimationFrame(step);
    })(t0);
  }

  function renderScore(){
    var s = run ? run.score : 0;
    if(!s){ $('score').textContent = '0'; return; }
    countUp($('score'), s, 260);
  }
  function renderHearts(){
    var h = '';
    for(var i = 0; i < run.maxLives; i++) h += '<span class="' + (i < run.lives ? '' : 'lost') + '">' + A.iconHtml('coracao') + '</span>';
    $('hearts').innerHTML = h;
  }

  function floatText(label, x, y){
    var e = document.createElement('div');
    e.className = 'float'; e.textContent = label;
    e.style.left = x + 'px'; e.style.top = y + 'px';
    $('stage').appendChild(e);
    setTimeout(function(){ e.remove(); }, 800);
  }
  var toastT = 0;
  function toast(text, kind){
    var stage = $('stage');
    stage.querySelectorAll('.toast').forEach(function(e){ e.remove(); });
    var e = document.createElement('div');
    e.className = 'toast' + (kind ? ' ' + kind : ''); e.textContent = text;
    stage.appendChild(e);
    clearTimeout(toastT);
    toastT = setTimeout(function(){ e.remove(); }, 1700);
  }
  function banner(text){
    var stage = $('stage');
    stage.querySelectorAll('.banner').forEach(function(e){ e.remove(); });
    var e = document.createElement('div');
    e.className = 'banner'; e.textContent = text;
    stage.appendChild(e);
    setTimeout(function(){ e.remove(); }, 1150);
  }

  // Bit, in the corner of the screen, turns the first mistake of each round into a short lesson
  var BIT_LESSONS = {
    ninja: 'Ai! Esse arquivo funcionava. Quem debuga tira o erro sem apagar o que está certo.',
    robo: 'Um bug entrou no app! Cada versão nova precisa ser testada para os bugs ficarem de fora.'
  };
  function bitExplains(msg){
    if(!window.Bit) return;
    if(current.id === 'esteira' && msg) return Bit.diz('ops', msg, 4500);
    if(run.lives === run.maxLives - 1 && BIT_LESSONS[current.id]) Bit.diz('ops', BIT_LESSONS[current.id], 4500);
  }

  var api = {
    get running(){ return !!(run && run.running); },
    progress: function(){ return api.running ? Math.min(1, (performance.now() - run.t0) / current.duration) : 0; },
    speed: function(){ return MODES[mode].speed; },
    add: function(n, x, y, label){
      if(!api.running) return;
      var pts = Math.max(1, Math.round(n * MODES[mode].mult));
      run.score += pts; renderScore();
      if(x != null) floatText(label ? label.replace('+' + n, '+' + pts) : ('+' + pts), x, y);
      var s = $('score'); s.classList.remove('bump'); void s.offsetWidth; s.classList.add('bump');
    },
    loseLife: function(msg){
      if(!api.running) return;
      run.lives--; renderHearts();
      if(msg) toast(msg, 'bad');
      bitExplains(msg);
      var st = $('stage'); st.classList.remove('hurt'); void st.offsetWidth; st.classList.add('hurt');
      A.sfx.bad(); A.vibrate([40, 40, 40]);
      if(run.lives <= 0) finish('lives');
    },
    toast: toast,
    banner: banner,
    float: floatText
  };

  function openHowto(id){
    current = A.games[id];
    var card = $('ht-card');
    card.style.setProperty('--c', current.color);
    card.style.setProperty('--cd', current.colorDark);
    A.iconText($('ht-title'), current.icon, current.title);
    $('ht-concept').textContent = current.concept;
    $('ht-steps').innerHTML = '';
    current.howto.forEach(function(s){
      var li = document.createElement('li');
      var a = document.createElement('span'); a.innerHTML = A.iconHtml(s[0]);
      var b = document.createElement('span'); b.textContent = s[1];
      li.appendChild(a); li.appendChild(b);
      $('ht-steps').appendChild(li);
    });
    $('ht-demo').className = 'ht-demo hint-' + current.hint;
    $('ht-target').innerHTML = A.iconHtml(current.demoTarget);
    setupPractice(current.hint);
    renderModes();
    $('howto').hidden = false;
    A.sfx.click();
  }

  function renderModes(){
    var box = $('modes');
    box.innerHTML = '';
    Object.keys(MODES).forEach(function(k){
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'mode' + (k === mode ? ' on' : '') + ' mode-' + k;
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', k === mode ? 'true' : 'false');
      A.iconText(b, MODES[k].icon, MODES[k].label);
      b.addEventListener('click', function(){
        mode = k;
        try{ localStorage.setItem('arcade-mode', k); }catch(e){}
        A.sfx.click();
        renderModes();
      });
      box.appendChild(b);
    });
    $('mode-hint').textContent = MODES[mode].hint;
  }

  // ---------- treino no "como jogar" ----------
  var pr = { kind:'', down:false, x0:0, last:null, moved:0, done:false };
  var PRACTICE_OK = { swipe:'Cortou! Você é rápido(a)!', drag:'Isso! O robô segue seu dedo!' };

  function setupPractice(kind){
    pr = { kind:kind, down:false, x0:0, last:null, moved:0, done:false };
    var tgt = $('ht-target');
    tgt.className = 'ht-target';
    tgt.style.transition = ''; tgt.style.transform = ''; tgt.style.left = '50%';
    $('ht-demo').classList.remove('touched', 'success');
    $('ht-say').textContent = 'Experimente aqui!';
    $('ht-go').classList.remove('ready');
  }

  function practiceSuccess(msg){
    $('ht-say').textContent = msg;
    $('ht-demo').classList.add('success');
    if(!pr.done){ $('ht-go').classList.add('ready'); A.vibrate(20); }
    pr.done = true;
    A.sfx.good();
  }

  function targetCenter(){
    var d = $('ht-demo').getBoundingClientRect(), t = $('ht-target').getBoundingClientRect();
    return { x:t.left - d.left + t.width / 2, y:t.top - d.top + t.height / 2 };
  }

  function bindPractice(){
    var demo = $('ht-demo'), tgt = $('ht-target');
    demo.addEventListener('pointerdown', function(e){
      var p = A.pos(demo, e);
      pr.down = true; pr.x0 = p.x; pr.last = p;
      demo.classList.add('touched');
      try{ demo.setPointerCapture(e.pointerId); }catch(err){}
      if(pr.kind === 'drag') tgt.style.left = Math.max(12, Math.min(88, p.x / demo.clientWidth * 100)) + '%';
    });
    demo.addEventListener('pointermove', function(e){
      if(!pr.down) return;
      var p = A.pos(demo, e);
      if(pr.kind === 'swipe' && !tgt.classList.contains('gone')){
        var c = targetCenter(), a = pr.last;
        var dx = p.x - a.x, dy = p.y - a.y, l2 = dx * dx + dy * dy;
        var k = l2 ? Math.max(0, Math.min(1, ((c.x - a.x) * dx + (c.y - a.y) * dy) / l2)) : 0;
        var ex = a.x + k * dx - c.x, ey = a.y + k * dy - c.y;
        if(l2 > 4 && ex * ex + ey * ey < 900){
          tgt.classList.add('gone');
          A.sfx.slice();
          practiceSuccess(PRACTICE_OK.swipe);
          setTimeout(function(){ tgt.classList.remove('gone'); tgt.style.left = (25 + Math.random() * 50) + '%'; }, 650);
        }
      } else if(pr.kind === 'lr'){
        var d = p.x - pr.x0;
        tgt.style.transform = 'translate(calc(-50% + ' + d + 'px), -50%) rotate(' + (d * 0.12) + 'deg)';
        tgt.classList.toggle('to-ok', d > 30); tgt.classList.toggle('to-fix', d < -30);
      } else if(pr.kind === 'drag'){
        pr.moved += Math.abs(p.x - pr.last.x);
        tgt.style.left = Math.max(12, Math.min(88, p.x / demo.clientWidth * 100)) + '%';
        if(pr.moved > 140 && !pr.done) practiceSuccess(PRACTICE_OK.drag);
      }
      pr.last = p;
    });
    var up = function(e){
      if(!pr.down) return;
      pr.down = false;
      if(pr.kind !== 'lr') return;
      var d = A.pos(demo, e).x - pr.x0;
      tgt.classList.remove('to-ok', 'to-fix');
      if(Math.abs(d) > 55){
        var dir = d > 0 ? 1 : -1;
        tgt.style.transition = 'transform .3s ease-in';
        tgt.style.transform = 'translate(calc(-50% + ' + (dir * 220) + 'px), -50%) rotate(' + (dir * 25) + 'deg)';
        practiceSuccess(dir > 0 ? 'Aprovado! Assim mesmo!' : 'Mandou consertar! Isso!');
        setTimeout(function(){ tgt.style.transition = 'none'; tgt.style.transform = ''; void tgt.offsetWidth; tgt.style.transition = ''; }, 420);
      } else {
        tgt.style.transform = '';
      }
    };
    demo.addEventListener('pointerup', up);
    demo.addEventListener('pointercancel', up);
  }

  function destroyCurrent(){
    if(current && current.destroy) current.destroy();
  }

  async function startGame(){
    $('howto').hidden = true;
    destroyCurrent();
    show('scr-game');
    stopMenuLoop();
    document.body.style.setProperty('--theme', current.color);
    document.body.style.setProperty('--theme-d', current.colorDark);
    A.iconText($('hud-title'), current.icon, current.title);
    var stage = $('stage');
    stage.innerHTML = '';
    stage.className = 'stage stage-' + current.id;
    var token = {};
    var lives = Math.max(1, current.lives + MODES[mode].lives);
    run = { token:token, running:false, score:0, lives:lives, maxLives:lives, t0:0, raf:0, lastTick:-1, mode:mode };
    renderScore(); renderHearts();
    $('timefill').style.transform = 'scaleX(1)';
    $('time').classList.remove('low');
    current.setup(api, stage);

    var cd = document.createElement('div');
    cd.className = 'countdown';
    var n = document.createElement('span');
    cd.appendChild(n);
    stage.appendChild(cd);
    var seq = ['3', '2', '1', 'Já!'];
    for(var i = 0; i < seq.length; i++){
      if(!run || run.token !== token) return;
      n.textContent = seq[i];
      n.style.animation = 'none'; void n.offsetWidth; n.style.animation = '';
      if(i < 3) A.sfx.beep(); else A.sfx.go();
      await wait(i < 3 ? 600 : 420);
    }
    if(!run || run.token !== token) return;
    cd.remove();
    run.running = true;
    run.t0 = performance.now();
    current.start();
    run.raf = requestAnimationFrame(clock);
  }

  function clock(){
    if(!api.running) return;
    var p = api.progress();
    $('timefill').style.transform = 'scaleX(' + (1 - p) + ')';
    var left = Math.ceil((1 - p) * current.duration / 1000);
    if(left <= 5){
      $('time').classList.add('low');
      if(left !== run.lastTick && left > 0){ run.lastTick = left; A.sfx.tick(); }
    }
    if(p >= 1){ finish('time'); return; }
    run.raf = requestAnimationFrame(clock);
  }

  async function finish(reason){
    if(!api.running) return;
    run.running = false;
    cancelAnimationFrame(run.raf);
    current.stop();
    banner(reason === 'lives' ? current.failText : 'Tempo!');
    var mine = run;
    await wait(1300);
    if(run !== mine) return;
    showEnd(reason);
  }
  api.finish = finish;

  function goMenu(){
    if(run){ run.running = false; cancelAnimationFrame(run.raf); }
    if(current && current.stop) current.stop();
    destroyCurrent();
    run = null;
    $('stage').innerHTML = '';
    $('howto').hidden = true;
    show('scr-menu');
  }

  // ---------- tela final ----------
  var lastRound = null, sentKey = null;

  function readNum(k){ try{ return parseInt(localStorage.getItem(k) || '0', 10) || 0; }catch(e){ return 0; } }
  function saveNum(k, v){ try{ localStorage.setItem(k, String(v)); }catch(e){} }
  function readBest(id){ return readNum('arcade-best-' + id); }
  function saveBest(id, v){ saveNum('arcade-best-' + id, v); }
  function readStars(id){ return readNum('arcade-stars-' + id); }
  function starsFor(g, score){
    var r = g.ranks;
    return score >= r[0][0] ? 3 : score >= r[1][0] ? 2 : score >= r[2][0] ? 1 : 0;
  }
  function totalStars(){ return A.order.reduce(function(sum, id){ return sum + readStars(id); }, 0); }
  function devTitle(n){ return n >= 9 ? ['trofeu', 'Dev Lendário(a)'] : n >= 6 ? ['foguete', 'Dev Sênior'] : n >= 3 ? ['computador', 'Dev Júnior'] : ['broto', 'Dev Iniciante']; }

  function showEnd(reason){
    destroyCurrent();
    var g = current, score = run.score;
    var best = readBest(g.id), isRecord = score > best;
    if(isRecord) saveBest(g.id, score);
    var rank = g.ranks.filter(function(r){ return score >= r[0]; })[0];
    var stars = starsFor(g, score), prevStars = readStars(g.id);
    if(stars > prevStars) saveNum('arcade-stars-' + g.id, stars);
    document.body.style.setProperty('--theme', g.color);
    document.body.style.setProperty('--theme-d', g.colorDark);
    $('end-card').style.setProperty('--c', g.color);
    $('end-head').textContent = reason === 'lives' ? g.failText : 'Tempo esgotado!';
    A.iconText($('end-game'), g.icon, g.title + ' · ' + MODES[run.mode].label);
    $('medal').innerHTML = A.iconHtml(rank[1]);
    $('final').textContent = '0 pts';
    setTimeout(function(){ countUp($('final'), score, 1100, ' pts'); }, 350);
    $('rank').textContent = rank[2];
    var starEls = $('end-stars').children;
    for(var i = 0; i < 3; i++){
      starEls[i].className = '';
      (function(el, on, delay){
        setTimeout(function(){ if(on){ el.className = 'on'; A.sfx.pop(); } }, delay);
      })(starEls[i], i < stars, 600 + i * 380);
    }
    $('new-star').hidden = !(stars > prevStars);
    A.iconText($('new-star'), 'estrela', 'Nova conquista! ' + stars + (stars === 1 ? ' estrela' : ' estrelas') + ' neste jogo');
    $('stats').innerHTML = '';
    g.stats().forEach(function(s){
      var sp = document.createElement('span'); A.iconText(sp, s[0], s[1]); $('stats').appendChild(sp);
    });
    if(isRecord) A.iconText($('record'), 'festa', 'Novo recorde neste celular!');
    else $('record').textContent = 'Recorde neste celular: ' + best + ' pts';
    $('learn-title').textContent = 'Você praticou: ' + g.concept;
    $('learn').textContent = g.learn;
    $('real').textContent = g.real || '';
    $('real-wrap').hidden = !g.real;
    lastRound = { g:g.id, score:score, m:run.mode };
    resetSendCard();
    $('send-card').hidden = score <= 0;
    show('scr-end');
    A.sfx.win();
    A.confetti();
  }

  // ---------- placar ----------
  // O apelido é sorteado (bicho + adjetivo + número) e a sala é um código de 4 letras que o telão mostra:
  // assim não entra nome de criança e cada turma só vê as próprias jogadas.
  var BICHOS = [['Gato','m','gato'], ['Sapo','m','sapo'], ['Panda','m','panda'], ['Raposa','f','raposa'], ['Polvo','m','polvo'],
    ['Tatu','m',''], ['Quero-quero','m',''], ['Capivara','f',''], ['Ema','f',''], ['Graxaim','m','']];
  var ADJETIVOS = [['Veloz','Veloz'], ['Esperto','Esperta'], ['Corajoso','Corajosa'], ['Atento','Atenta'], ['Curioso','Curiosa'],
    ['Ligeiro','Ligeira'], ['Valente','Valente'], ['Sagaz','Sagaz'], ['Animado','Animada'], ['Brilhante','Brilhante']];
  var K_APELIDO = 'gp-apelido', K_SALA = 'arcade-sala';
  function sorteio(n){ return Math.floor(Math.random() * n); }
  function novoApelido(){
    var b = BICHOS[sorteio(BICHOS.length)], a = ADJETIVOS[sorteio(ADJETIVOS.length)];
    return b[0] + ' ' + a[b[1] === 'f' ? 1 : 0] + ' ' + (1 + sorteio(99));
  }
  function bichoDe(apelido){
    var nome = String(apelido).split(' ')[0];
    for(var i = 0; i < BICHOS.length; i++) if(BICHOS[i][0] === nome) return BICHOS[i];
    return null;
  }
  function apelidoValido(v){
    var p = String(v).split(' '), b = p.length === 3 ? bichoDe(v) : null;
    if(!b || !/^[1-9][0-9]?$/.test(p[2])) return false;
    return ADJETIVOS.some(function(a){ return a[b[1] === 'f' ? 1 : 0] === p[1]; });
  }
  function apelido(){
    var v = null;
    try{ v = localStorage.getItem(K_APELIDO); }catch(e){}
    if(!v || !apelidoValido(v)){ v = novoApelido(); try{ localStorage.setItem(K_APELIDO, v); }catch(e){} }
    return v;
  }
  function trocarApelido(){
    var antigo = apelido(), v = novoApelido();
    while(v === antigo) v = novoApelido();
    try{ localStorage.setItem(K_APELIDO, v); }catch(e){}
    mostrarApelido();
    A.sfx.click();
  }
  function mostrarApelido(){
    var v = apelido(), b = bichoDe(v);
    $('apelido-icone').innerHTML = b && b[2] ? A.iconHtml(b[2]) : '';
    $('apelido-icone').hidden = !(b && b[2]);
    $('apelido-texto').textContent = v;
  }

  function limparSala(v){ return String(v || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4); }
  function lerSala(){ try{ return limparSala(localStorage.getItem(K_SALA)); }catch(e){ return ''; } }
  function guardarSala(v){ try{ if(v.length === 4) localStorage.setItem(K_SALA, v); else localStorage.removeItem(K_SALA); }catch(e){} }
  function canal(sala){ return PLACAR + '-' + sala; }
  // O QR do telão leva o código no endereço (?sala=ABCD) para já vir preenchido
  function salaDoEndereco(){
    try{
      var v = limparSala(new URLSearchParams(location.search).get('sala'));
      if(v.length === 4) guardarSala(v);
    }catch(e){}
  }

  // Pedido ao placar com limite de 8 s, para a criança não ficar esperando à toa
  async function buscar(url, opcoes){
    var ctl = new AbortController(), t = setTimeout(function(){ ctl.abort(); }, 8000);
    try{
      opcoes = opcoes || {}; opcoes.signal = ctl.signal;
      var res = await fetch(url, opcoes), texto = await res.text();
      return { ok:res.ok, status:res.status, texto:texto };
    }finally{ clearTimeout(t); }
  }

  function resetSendCard(){
    var card = $('send-card');
    card.classList.remove('done');
    A.iconText($('send-title'), 'trofeu', 'Entre no placar da sala!');
    $('send-form').hidden = false;
    $('send-btn').disabled = false;
    $('send-btn').textContent = 'Enviar';
    mostrarApelido();
    $('sala').value = lerSala();
    $('send-note').textContent = 'Digite o código que aparece no telão da sala. Sem código, a jogada não vai para o placar.';
    sentKey = null;
  }

  async function myPosition(key, game, sala){
    var res = await buscar(canal(sala) + '/json?poll=1&since=all', { cache:'no-store' });
    var list = [];
    res.texto.split('\n').forEach(function(line){
      if(!line) return;
      try{
        var m = JSON.parse(line);
        if(m.event !== 'message') return;
        var d = JSON.parse(m.message);
        if(d.g === game && typeof d.s === 'number' && d.k) list.push(d);
      }catch(e){}
    });
    list.sort(function(a, b){ return b.s - a.s; });
    for(var i = 0; i < list.length; i++) if(list[i].k === key) return { pos:i + 1, total:list.length };
    return null;
  }

  async function sendScore(e){
    e.preventDefault();
    if(!lastRound || sentKey) return;
    var nick = apelido(), note = $('send-note'), sala = limparSala($('sala').value);
    $('sala').value = sala;
    if(sala.length < 4){
      guardarSala('');
      note.textContent = 'Falta o código da sala: são 4 letras, e elas aparecem no telão. Sem ele, a jogada não vai para o placar.';
      $('sala').focus(); return;
    }
    guardarSala(sala);
    var btn = $('send-btn');
    btn.disabled = true; btn.textContent = '...';
    var key = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    try{
      var res = await buscar(canal(sala), { method:'POST', body:JSON.stringify({ g:lastRound.g, m:lastRound.m, n:nick, s:lastRound.score, k:key }) });
      if(!res.ok) throw new Error('status ' + res.status);
      sentKey = key;
      $('send-card').classList.add('done');
      $('send-form').hidden = true;
      A.iconText($('send-title'), 'certo', nick + ', você está no placar!');
      note.textContent = 'Olhe o telão da sala.';
      A.sfx.gold();
      var p = null;
      for(var tries = 0; tries < 5 && !p; tries++){
        await wait(900);
        try{ p = await myPosition(key, lastRound.g, sala); }catch(e3){}
      }
      if(p){
        A.iconText($('send-title'), p.pos <= 3 ? ['ouro', 'prata', 'bronze'][p.pos - 1] : 'certo', nick + ', você ficou em ' + p.pos + 'º lugar!');
        note.textContent = p.total + (p.total === 1 ? ' jogada' : ' jogadas') + ' neste jogo na sala. Olhe o telão.';
      }
    }catch(err){
      btn.disabled = false; btn.textContent = 'Enviar';
      note.textContent = 'Não deu para enviar. Confira a internet e o código da sala, e toque em Enviar de novo.';
    }
  }

  // ---------- menu ----------
  var menuRaf = 0, menuArts = [], activeCard = 0;
  var pointer = { x:-1, y:-1 }, mascotJump = -9999, lineI = 0, bubbleT = 0;
  var LINES = [
    'Oi! Eu sou o Bit. Escolha um jogo!',
    'Deslize os cartões para ver os 3 jogos.',
    'Sabia? O primeiro bug famoso foi uma mariposa de verdade, em 1947!',
    'Engenheiros de software criam apps, jogos e sites!',
    'Cada jogo dá até 3 estrelas. Dá para juntar 9!',
    'Testar é tão importante quanto programar!',
    'Acha fácil? Tente o modo Desafio: os pontos valem ×1,5!',
    'O Git guarda todo o histórico do código, como um "desfazer" infinito.',
    'Versão 2.1.3? O 1º número muda nas mudanças grandes, o último nas correções de bug.',
    'WhatsApp, jogos, apps de banco: tudo isso é feito por times de engenharia de software.',
    'Bons programadores escrevem testes que rodam sozinhos a cada mudança no código.',
    'Psiu... toque em mim de novo!'
  ];

  function buildMenu(){
    var wrap = $('cards'), dots = $('dots');
    wrap.innerHTML = ''; dots.innerHTML = '';
    menuArts = [];
    A.order.forEach(function(id, idx){
      var g = A.games[id];
      var card = document.createElement('article');
      card.className = 'gcard';
      card.style.setProperty('--c', g.color);
      card.style.setProperty('--cd', g.colorDark);
      card.innerHTML =
        '<div class="g-art"><canvas></canvas><span class="g-badge">' + A.iconHtml(g.icon) + '</span><span class="g-stars" data-id="' + id + '"></span></div>' +
        '<div class="g-body">' +
          '<h3></h3><p></p>' +
          '<div class="g-meta"><span class="chip"></span><span class="chip best" data-id="' + id + '"></span></div>' +
          '<button type="button" class="g-play">' + A.iconHtml('play') + ' Jogar</button>' +
        '</div>';
      card.querySelector('h3').textContent = g.title;
      card.querySelector('p').textContent = g.tagline;
      A.iconText(card.querySelector('.chip'), g.gestureIcon, g.gesture);
      card.addEventListener('click', function(){
        if(idx !== activeCard && wrap.scrollWidth > wrap.clientWidth + 4){ scrollToCard(idx); return; }
        openHowto(id);
      });
      wrap.appendChild(card);
      var dot = document.createElement('button');
      dot.type = 'button'; dot.className = 'dot'; dot.setAttribute('aria-label', g.title);
      dot.addEventListener('click', function(){ scrollToCard(idx); A.sfx.click(); });
      dots.appendChild(dot);
      menuArts.push({ cv:card.querySelector('canvas'), g:g, w:0, h:0 });
    });
    wrap.addEventListener('scroll', function(){ requestAnimationFrame(updateActive); }, { passive:true });
    sizeArts();
    updateActive();
    renderProgress();
  }

  function scrollToCard(i){
    var c = $('cards').children[i];
    if(c) c.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' });
  }

  function updateActive(){
    var wrap = $('cards'), mid = wrap.scrollLeft + wrap.clientWidth / 2, best = 0, bestD = Infinity;
    Array.prototype.forEach.call(wrap.children, function(c, i){
      var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if(d < bestD){ bestD = d; best = i; }
    });
    if(best !== activeCard && !$('scr-menu').hidden) A.sfx.click();
    activeCard = best;
    Array.prototype.forEach.call(wrap.children, function(c, i){ c.classList.toggle('active', i === best); });
    Array.prototype.forEach.call($('dots').children, function(d, i){ d.classList.toggle('on', i === best); });
  }

  function sizeArts(){
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    menuArts.forEach(function(m){
      m.w = m.cv.clientWidth; m.h = m.cv.clientHeight;
      m.cv.width = Math.max(1, Math.round(m.w * dpr)); m.cv.height = Math.max(1, Math.round(m.h * dpr));
      m.cv.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    var mc = $('mascot');
    mc.width = Math.round(mc.clientWidth * dpr); mc.height = Math.round(mc.clientHeight * dpr);
    mc.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function renderProgress(){
    var n = totalStars();
    A.iconText($('p-stars'), 'estrela', n + '/9');
    $('p-fill').style.width = (n / 9 * 100) + '%';
    A.iconText($('p-title'), devTitle(n)[0], devTitle(n)[1]);
    document.querySelectorAll('.chip.best').forEach(function(c){
      var b = readBest(c.dataset.id);
      A.iconText(c, b ? 'trofeu' : 'estrela', b ? b + ' pts' : 'Novo!');
    });
    document.querySelectorAll('.g-stars').forEach(function(s){
      var n = readStars(s.dataset.id);
      s.innerHTML = [0, 1, 2].map(function(i){ return A.iconHtml('estrela').replace('class="icone"', 'class="icone' + (i < n ? '' : ' off') + '"'); }).join('');
      s.setAttribute('role', 'img');
      s.setAttribute('aria-label', n + ' de 3 estrelas');
    });
  }

  function say(text){
    var b = $('bubble');
    b.textContent = text;
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  }
  function nextLine(){
    lineI = (lineI + 1) % LINES.length;
    say(LINES[lineI]);
  }
  function pokeMascot(){
    mascotJump = performance.now();
    nextLine();
    [523, 784, 659].forEach(function(f, i){ tone(f, 0.09, 'triangle', 0.07, i * 0.07); });
    A.vibrate(15);
    clearInterval(bubbleT);
    bubbleT = setInterval(function(){ if(!$('scr-menu').hidden && $('howto').hidden) nextLine(); }, 7000);
  }

  function menuFrame(t){
    if($('scr-menu').hidden){ menuRaf = 0; return; }
    menuArts.forEach(function(m){
      var ctx = m.cv.getContext('2d');
      ctx.clearRect(0, 0, m.w, m.h);
      (m.g.drawPreview || m.g.drawIcon)(ctx, m.w, m.h, t);
    });
    var mcv = $('mascot'), mc = mcv.getContext('2d'), w = mcv.clientWidth, h = mcv.clientHeight;
    mc.clearRect(0, 0, w, h);
    var r = mcv.getBoundingClientRect(), look = { x:0, y:0 };
    if(pointer.x >= 0){
      var dx = pointer.x - (r.left + w / 2), dy = pointer.y - (r.top + h * 0.45), d = Math.sqrt(dx * dx + dy * dy) || 1;
      look.x = dx / Math.max(d, 60); look.y = dy / Math.max(d, 60);
    }
    var since = t - mascotJump, jump = since < 600 ? -Math.sin(Math.PI * since / 600) * h * 0.14 : 0;
    var spin = since < 600 ? Math.sin(Math.PI * since / 600) * 0.25 : 0;
    A.drawMonster(mc, w * 0.83, h * 0.72 + Math.sin(t * 0.004) * 4, w * 0.11, '#ff5f8f', t);
    A.drawRobot(mc, w * 0.44, h * 0.47 + jump, w * 0.46, since < 900 ? 'happy' : 'normal', t, spin, look);
    menuRaf = requestAnimationFrame(menuFrame);
  }
  function startMenuLoop(){ if(!menuRaf) menuRaf = requestAnimationFrame(menuFrame); }
  function stopMenuLoop(){ cancelAnimationFrame(menuRaf); menuRaf = 0; }

  // ---------- confete ----------
  var cv, cx, parts = [], craf = 0;
  A.confetti = function(){
    if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var dpr = window.devicePixelRatio || 1;
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    var cols = ['#ff5f8f', '#ffd23f', '#4fd6a6', '#8c73ff', '#ff8a3d', '#3fb4ff'];
    for(var i = 0; i < 150; i++){
      parts.push({ x:cv.width * (0.2 + Math.random() * 0.6), y:-20 * dpr - Math.random() * cv.height * 0.3,
        vx:(Math.random() - 0.5) * 4 * dpr, vy:(2 + Math.random() * 4) * dpr, s:(6 + Math.random() * 8) * dpr,
        c:cols[i % cols.length], a:Math.random() * 6, va:(Math.random() - 0.5) * 0.3, round:Math.random() < 0.4 });
    }
    if(!craf) craf = requestAnimationFrame(confTick);
  };
  function confTick(){
    cx.clearRect(0, 0, cv.width, cv.height);
    parts.forEach(function(p){
      p.vy += 0.05; p.x += p.vx + Math.sin(p.a) * 0.8; p.y += p.vy; p.a += p.va;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = p.c;
      if(p.round){ cx.beginPath(); cx.arc(0, 0, p.s / 2.5, 0, 6.3); cx.fill(); }
      else cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      cx.restore();
    });
    parts = parts.filter(function(p){ return p.y < cv.height + 30; });
    craf = parts.length ? requestAnimationFrame(confTick) : 0;
    if(!craf) cx.clearRect(0, 0, cv.width, cv.height);
  }

  // ---------- início ----------
  A.boot = function(){
    cv = $('confetti'); cx = cv.getContext('2d');
    // Os ícones fixos da página (data-icone) entram antes do texto de cada elemento
    document.querySelectorAll('[data-icone]').forEach(function(el){ el.insertAdjacentHTML('afterbegin', A.iconHtml(el.dataset.icone) + (el.textContent.trim() ? ' ' : '')); });
    // Kit de jogo do identidade-visual: o som vale para todos os jogos, e o menu ganha Outros jogos e tela cheia
    if(window.Jogo){
      Jogo.som.aoMudar(function(ligado){ setMuted(!ligado); });
      var topo = document.createElement('div');
      topo.className = 'menu-topo';
      topo.append(Jogo.botao('casa'), Jogo.botao('tela-cheia'));
      $('scr-menu').prepend(topo);
    } else setMuted(muted);
    buildMenu();
    bindPractice();
    $('mascot').addEventListener('click', pokeMascot);
    $('mascot').addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); pokeMascot(); } });
    $('bubble').addEventListener('click', pokeMascot);
    document.addEventListener('pointermove', function(e){ pointer.x = e.clientX; pointer.y = e.clientY; }, { passive:true });
    document.addEventListener('pointerdown', function(e){ pointer.x = e.clientX; pointer.y = e.clientY; }, { passive:true });
    say(LINES[0]);
    bubbleT = setInterval(function(){ if(!$('scr-menu').hidden && $('howto').hidden) nextLine(); }, 7000);
    $('ht-go').addEventListener('click', startGame);
    $('ht-back').addEventListener('click', function(){ $('howto').hidden = true; A.sfx.click(); });
    $('btn-home').addEventListener('click', function(){ A.sfx.click(); goMenu(); });
    $('btn-again').addEventListener('click', function(){ startGame(); });
    $('btn-menu').addEventListener('click', function(){ A.sfx.click(); goMenu(); });
    var trocarSom = function(){ if(window.Jogo) Jogo.som.mudar(); else setMuted(!muted); };
    $('mute').addEventListener('click', trocarSom);
    $('mute-menu').addEventListener('click', trocarSom);
    $('send-form').addEventListener('submit', sendScore);
    $('apelido-trocar').addEventListener('click', trocarApelido);
    $('sala').addEventListener('input', function(){ var v = limparSala(this.value); if(this.value !== v) this.value = v; guardarSala(v); });
    salaDoEndereco();
    document.addEventListener('visibilitychange', function(){ if(document.hidden && api.running) finish('time'); });
    window.addEventListener('resize', function(){
      if(current && current.resize && !$('scr-game').hidden) current.resize();
      if(!$('scr-menu').hidden){ sizeArts(); updateActive(); }
    });
    show('scr-menu');
  };
})();
