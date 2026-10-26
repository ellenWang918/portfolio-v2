/** Deterministic composition for the Heritage Schedule film; times are seconds. */
export const heritageFilm = { width: 1920, height: 1080, fps: 30, duration: 17, fileName: 'heritage-schedule-flow-v2.mp4' };

export function heritageScene(workspace: string, cursor: string, calendar: string, gear: string): string {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const tasks = [
    { name: 'Annual programme', owner: 'Heritage Planning', start: 0.25, end: 11.5, tone: 'summary', label: 'Annual baseline · 2027' },
    { name: 'Traditional Owner consultation', owner: 'Consultation team', start: 0.35, end: 2.9, tone: 'cyan', label: 'Consultation' },
    { name: 'Survey preparation', owner: 'Heritage Planner', start: 1.85, end: 4.15, tone: 'blue', label: 'Preparation' },
    { name: 'Field survey · North', owner: 'Survey team A', start: 3.45, end: 6.25, tone: 'blue', label: 'North survey' },
    { name: 'Field survey · South', owner: 'Survey team B', start: 4.65, end: 7.5, tone: 'cyan', label: 'South survey' },
    { name: 'Findings & assessment', owner: 'Heritage specialists', start: 6.15, end: 8.85, tone: 'purple', label: 'Assessment' },
    { name: 'Heritage review', owner: 'Review team', start: 8.25, end: 10.2, tone: 'purple', label: 'Review' },
    { name: 'Approval & sign off', owner: 'Heritage Planning', start: 9.65, end: 11.2, tone: 'green', label: 'Approval' },
    { name: 'Schedule handover', owner: 'Planning team', start: 10.75, end: 11.8, tone: 'green', label: 'Handover' },
  ];
  const entities = [
    ['HP_CONSULT', 'Traditional Owner consultation', 'Activity'],
    ['HP_PREP', 'Survey preparation', 'Activity'],
    ['HP_SURVEY_N', 'North field survey', 'Survey'],
    ['HP_SURVEY_S', 'South field survey', 'Survey'],
    ['HP_ASSESS', 'Findings & assessment', 'Assessment'],
    ['HP_REVIEW', 'Heritage review', 'Review'],
    ['HP_APPROVE', 'Approval & sign off', 'Milestone'],
  ];
  const relationships = [
    ['HP_CONSULT', 'precedes', 'Survey preparation'],
    ['HP_PREP', 'precedes', 'North field survey'],
    ['HP_PREP', 'precedes', 'South field survey'],
    ['HP_SURVEY_N', 'feeds_into', 'Findings & assessment'],
    ['HP_SURVEY_S', 'feeds_into', 'Findings & assessment'],
    ['HP_ASSESS', 'precedes', 'Heritage review'],
    ['HP_REVIEW', 'precedes', 'Approval & sign off'],
  ];
  const configTable = (title: string, headers: string[], rows: string[][]) => `<section class="config-table"><header class="config-table-toolbar"><h2>${title}</h2><div class="config-search">Search</div><span class="config-add">+</span></header><table><thead><tr>${headers.map(header => `<th>${header}</th>`).join('')}<th></th></tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}<td class="row-menu">⋮</td></tr>`).join('')}</tbody></table></section>`;
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>Heritage Schedule — motion composition</title>
<style>
*{box-sizing:border-box}html,body{margin:0;width:1920px;height:1080px;overflow:hidden;font-family:'Segoe UI',Arial,sans-serif}
body{background:#e3e5e8}.stage{width:1920px;height:1080px;overflow:hidden;position:relative;background:radial-gradient(ellipse at 22% 6%,#c8cdd2 0%,transparent 62%),radial-gradient(ellipse at 85% 28%,#dce0e4 0%,transparent 65%),linear-gradient(175deg,#d4d8dd 0%,#e5e7ea 49%,#f5f6f7 100%)}
.login{position:absolute;left:960px;top:540px;width:720px;height:224px;display:flex;align-items:center;justify-content:center;gap:28px;border-radius:14px;background:linear-gradient(180deg,#147fbd,#096ba8);box-shadow:0 18px 42px #35495824,0 3px 8px #25476318,inset 0 1px 0 #ffffff32;color:white;font-size:84px;font-weight:400;letter-spacing:.1px;transform:translate(-50%,-50%)}
.spinner{display:none;width:60px;height:60px;flex:none;border:5px solid #ffffff4d;border-top-color:white;border-right-color:white;border-radius:50%}
.screen{position:absolute;left:960px;top:540px;width:1696px;height:932px;transform:translate(-50%,-50%) scale(1.06);opacity:0}
.workspace{display:block;width:1696px;height:932px;border-radius:14px;box-shadow:0 36px 65px #29343f24,0 5px 14px #26334120;backface-visibility:hidden}
.row-focus{position:absolute;left:283px;top:521px;width:1372px;height:74px;border:1.5px solid #46b9f0;background:#2ba5e513;opacity:0;border-radius:2px}
.schedule{position:absolute;left:242px;top:68px;width:1454px;height:864px;background:#10151c;color:#e5edf7;opacity:0;border-radius:0 0 14px 0}
.schedule-header{padding:29px 40px 0}.breadcrumb{color:#8e9eb2;font-size:14px;display:flex;gap:12px;align-items:center}.crumb-arrow{color:#72859a}
.title-row{display:flex;align-items:center;justify-content:space-between;margin-top:17px}.title-group{display:flex;align-items:center;gap:20px}h1{margin:0;font-size:34px;line-height:1.25;letter-spacing:-.45px;font-weight:600}.published{padding:6px 15px;background:#163d35;color:#8de1c3;border-radius:18px;font-size:13px}.description{font-size:18px;color:#93a3b7;margin:16px 0 0}.export{border:1px solid #465466;border-radius:6px;padding:13px 20px;background:#171e27;color:#dce5ef;font-size:16px}
.schedule-tools{display:flex;justify-content:space-between;align-items:center;margin:29px 40px 0;padding-bottom:16px;border-bottom:1px solid #2b3644;height:62px}.tabs{display:flex;gap:32px;font-size:17px;height:46px;align-items:center}.selected{color:#65c9ff;position:relative}.selected:after{content:'';position:absolute;height:3px;left:0;right:0;bottom:-15px;background:#32b2ed}.tools-right{display:flex;align-items:center;gap:18px;color:#99adc4;font-size:14px}.year{padding:9px 16px;border:1px solid #354152;border-radius:5px;background:#171e27;color:#dbe6f2;font-size:16px}
.chart-board{position:absolute;left:40px;top:263px;width:1374px;height:548px;background:#161d26;border:1px solid #344150;border-radius:7px}
.chart-head,.task-row{display:grid;grid-template-columns:314px 1fr}.chart-head{height:69px;background:#242e3b;border-radius:7px 7px 0 0}.task-heading{font-size:12px;letter-spacing:.9px;color:#a9b8ca;padding:18px 23px;border-right:1px solid #364454}.task-heading small{display:block;font-size:13px;letter-spacing:0;color:#7f93ab;margin-top:5px;font-weight:400}.month-head{display:grid;grid-template-columns:repeat(12,1fr);align-items:center;color:#b6c7da;font-size:12px;letter-spacing:.5px}.month-head span{text-align:center;border-right:1px solid #344150;padding-top:27px;height:69px}
.task-row{height:53px;border-top:1px solid #2b3644}.task-row.summary{background:#19232e}.task-name{display:flex;align-items:center;gap:12px;padding:0 20px;border-right:1px solid #364454}.task-name .status{height:7px;width:7px;flex:none;border-radius:50%;background:#7791a9}.task-name strong{display:block;font-size:15px;font-weight:500;color:#e0e9f4}.task-name small{display:block;font-size:11px;color:#7f93aa;margin-top:4px}.summary .task-name strong{font-weight:600}.summary .status{background:#65c9ff}.track{position:relative;background:repeating-linear-gradient(to right,transparent 0,transparent calc(8.333333% - 1px),#283440 calc(8.333333% - 1px),#283440 8.333333%)}
.bar{position:absolute;top:13px;height:27px;border-radius:4px;color:#e9f6ff;font-size:12px;line-height:27px;padding-left:11px;white-space:nowrap;overflow:hidden;transform-origin:left center;backface-visibility:hidden;border:1px solid #ffffff19;background:linear-gradient(100deg,#256eaa,#347fb9)}.bar.cyan{background:linear-gradient(100deg,#246d83,#318da0)}.bar.purple{background:linear-gradient(100deg,#69579b,#8272b1)}.bar.green{background:linear-gradient(100deg,#286e63,#358c7b)}.bar.summary{height:10px;top:22px;background:#60b9ef;border:0;border-radius:2px;font-size:0;overflow:visible}.bar.summary:before,.bar.summary:after{content:'';position:absolute;top:5px;width:6px;height:12px;background:#60b9ef}.bar.summary:before{left:0}.bar.summary:after{right:0}
.board-footer{position:absolute;top:827px;left:40px;right:40px;display:flex;justify-content:space-between;align-items:center;color:#8297ae;font-size:13px}.legend{display:flex;gap:23px}.legend span{display:flex;align-items:center;gap:7px}.legend i{width:7px;height:7px;border-radius:50%;background:#347fb9}.legend span:nth-child(2) i{background:#8272b1}.legend span:nth-child(3) i{background:#358c7b}
.configuration-view{position:absolute;inset:0;opacity:0}.configuration{position:absolute;left:242px;top:68px;width:1454px;height:864px;background:#10151c;color:#e5edf7;border-radius:0 0 14px 0;padding:29px 40px 40px}.configuration h1{margin:22px 0 0;font-size:34px;white-space:nowrap}.config-metadata{display:grid;grid-template-columns:1fr 1.35fr .7fr;gap:23px 36px;padding:23px 25px;margin-top:27px;background:#19232e;border-top:1px solid #2b3644;border-bottom:1px solid #2b3644}.config-field span{display:block;color:#8599b1;font-size:11px;letter-spacing:.7px;margin-bottom:8px}.config-field strong{font-size:16px;font-weight:400;line-height:1.4;color:#d7e2ef}.config-tables{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:32px}.config-table{min-width:0;border:1px solid #2d3948;border-radius:5px;overflow:hidden;background:#161d26}.config-table-toolbar{display:flex;align-items:center;gap:15px;height:76px;padding:14px 16px}.config-table h2{font-size:20px;font-weight:500;margin:0}.config-search{height:40px;flex:1;max-width:245px;display:flex;align-items:center;padding-left:15px;color:#869ab2;border:1px solid #354152;background:#141b24;border-radius:5px;font-size:14px}.config-add{margin-left:auto;display:grid;place-items:center;width:36px;height:36px;flex:none;border-radius:4px;background:#129be3;color:#fff;font-size:28px;font-weight:300;line-height:1}.config-table table{width:100%;border-collapse:collapse;table-layout:fixed}.config-table th{height:40px;background:#242e3b;color:#a5b7cc;font-size:10px;letter-spacing:.6px;text-align:left;font-weight:600;padding:0 14px}.config-table th:nth-child(1){width:25%}.config-table th:nth-child(2){width:41%}.config-table th:nth-child(3){width:29%}.config-table th:last-child{width:5%;padding:0}.config-table:nth-child(2) th:nth-child(1){width:27%}.config-table:nth-child(2) th:nth-child(2){width:23%}.config-table:nth-child(2) th:nth-child(3){width:45%}.config-table td{height:55px;border-top:1px solid #2b3644;padding:0 14px;color:#bacbdd;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.config-table td:first-child{font-size:12px;color:#9eb4cb}.config-table .row-menu{padding:0;color:#7f94ac;font-size:20px}.scenario-reset,.configuration-active{position:absolute;left:14px;width:213px;height:47px;display:flex;align-items:center;gap:14px;padding-left:11px;font-size:18px;background:#161c24;color:#aebdd0}.scenario-reset{top:317px}.configuration-active{top:421px;background:#173c55;border-left:3px solid #21aaf5;border-radius:6px;color:#e1f1ff;padding-left:8px}.scenario-reset svg,.configuration-active svg{width:22px;height:22px;flex:none}.config-focus{position:absolute;left:14px;top:421px;width:213px;height:47px;background:#2ba5e51a;border:1px solid #46b9f0;border-radius:6px;opacity:0}
.cursor{position:absolute;left:0;top:0;width:39px;height:39px;opacity:0;transform-origin:4px 3px;filter:drop-shadow(0 2px 2px #19232e24);pointer-events:none}.cursor svg{width:39px;height:39px;stroke:white;stroke-width:12px;paint-order:stroke fill}
.click-ring{position:absolute;left:0;top:0;width:56px;height:56px;border:2px solid #4da4d1;border-radius:50%;opacity:0;transform:translate(-50%,-50%);pointer-events:none}
</style></head><body><main class="stage" aria-label="Heritage Schedule login, dashboard, annual Gantt chart and configuration animation">
<div class="login"><span class="spinner"></span><span class="login-label">Log in</span></div>
<div class="screen"><img class="workspace" src="${workspace}" alt="Supplied planning workspace dashboard"><div class="row-focus"></div>
<section class="schedule"><header class="schedule-header"><div class="breadcrumb">Annual planning <span class="crumb-arrow">/</span> Scenarios <span class="crumb-arrow">/</span> Annual baseline</div><div class="title-row"><div class="title-group"><h1>Annual baseline</h1><span class="published">Published</span></div><div class="export">Export plan</div></div><p class="description">One connected schedule for consultation, surveys and heritage planning.</p></header>
<div class="schedule-tools"><div class="tabs"><span class="selected">Schedule</span><span>Resources</span><span>Dependencies</span></div><div class="tools-right"><span>Today</span><span class="year">2027 &nbsp;⌄</span><span>Months</span></div></div>
<div class="chart-board"><div class="chart-head"><div class="task-heading">HERITAGE ACTIVITIES<small>8 connected activities</small></div><div class="month-head">${months.map(month => `<span>${month}</span>`).join('')}</div></div>
${tasks.map(task => `<div class="task-row ${task.tone === 'summary' ? 'summary' : ''}"><div class="task-name"><span class="status"></span><div><strong>${task.name}</strong><small>${task.owner}</small></div></div><div class="track"><div class="bar ${task.tone}" style="left:${task.start / 12 * 100}%;width:${(task.end - task.start) / 12 * 100}%">${task.label}</div></div></div>`).join('')}</div>
<div class="board-footer"><span>All changes saved · Annual baseline</span><div class="legend"><span><i></i>Planning & surveys</span><span><i></i>Assessment & review</span><span><i></i>Approval</span></div></div></section>
<div class="config-focus"></div><div class="configuration-view"><div class="scenario-reset">${calendar}<span>Scenarios</span></div><div class="configuration-active">${gear}<span>Configuration</span></div><section class="configuration"><div class="breadcrumb">Configuration <span class="crumb-arrow">/</span> Entities and relationships</div><h1>2027 Heritage entities and relationships config</h1><div class="config-metadata"><div class="config-field"><span>NAME</span><strong>2027 Entities and relationships config</strong></div><div class="config-field"><span>DESCRIPTION</span><strong>Entities and relationships that feed the model</strong></div><div class="config-field"><span>TAGS</span><strong>Heritage · Annual planning</strong></div><div class="config-field"><span>CREATED BY</span><strong>Alex Chen</strong></div><div class="config-field"><span>UPDATED AT</span><strong>12 Oct 2026, 13:45</strong></div><div class="config-field"><span>UPDATED BY</span><strong>Alex Chen</strong></div></div><div class="config-tables">${configTable('Entities', ['ENTITY ID', 'ENTITY NAME', 'ENTITY TYPE'], entities)}${configTable('Relationships', ['SOURCE', 'RELATION', 'TARGET'], relationships)}</div></section></div></div>
<div class="click-ring"></div><div class="cursor">${cursor}</div></main></body></html>`;
}

/** Every property is sampled, rather than wall-clock animated, for clean exports. */
export function setHeritageFrame(time: number): void {
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  const progress = (a: number, b: number) => clamp((time - a) / (b - a));
  const smooth = (a: number, b: number) => { const p = progress(a, b); return p * p * (3 - 2 * p); };
  const ease = (a: number, b: number) => { const p = progress(a, b); return 1 - (1 - p) ** 4; };
  const el = (selector: string) => document.querySelector<HTMLElement>(selector)!;
  const exit = smooth(14.7, 16.45);
  const enter = ease(3.85, 5.15);
  const loading = time >= 2.1 && time < 3.65;
  const press = 1 - .045 * Math.sin(progress(1.9, 2.18) * Math.PI);
  const grow = .74 + .26 * ease(0, .75);
  el('.login').style.opacity = String(smooth(0, .22) * (1 - smooth(4.15, 4.65)));
  el('.login').style.transform = `translate(-50%,-50%) translateY(${-980 * smooth(3.65, 4.65)}px) scale(${press * grow})`;
  el('.spinner').style.display = loading ? 'block' : 'none';
  el('.spinner').style.transform = `rotate(${(time - 2.1) * 480}deg)`;
  el('.login-label').textContent = loading ? 'Logging in' : time >= 3.65 ? 'Logged in' : 'Log in';
  el('.screen').style.opacity = String(smooth(3.85, 4.1) * (1 - smooth(15.5, 16.55)));
  el('.screen').style.transform = `translate(-50%,-50%) translateY(${(1 - enter) * 1200 + exit * 20}px) scale(${1.06 * (1 - .88 * exit)})`;
  const chartEnter = ease(6.95, 7.6);
  el('.schedule').style.opacity = String(smooth(6.95, 7.4));
  el('.schedule').style.transform = `translateY(${(1 - chartEnter) * 18}px)`;
  el('.configuration-view').style.opacity = String(smooth(11.15, 11.65));
  el('.configuration').style.transform = `translateY(${(1 - ease(11.15, 11.85)) * 18}px)`;
  document.querySelectorAll<HTMLElement>('.bar').forEach((bar, i) => {
    const reveal = ease(7.1 + i * .055, 7.8 + i * .055);
    bar.style.transform = `scaleX(${.03 + reveal * .97})`;
    bar.style.opacity = String(smooth(7.1 + i * .055, 7.45 + i * .055));
  });
  el('.row-focus').style.opacity = String(smooth(6.2, 6.5) * (1 - smooth(6.85, 7.15)) * .7);
  el('.config-focus').style.opacity = String(smooth(10.5, 10.8) * (1 - smooth(11.2, 11.5)) * .7);
  let x = 1330, y = 840, cursorOpacity = 0, cursorScale = 1;
  if (time < 4.5) {
    const move = smooth(.95, 1.75);
    x = 1330 + (1050 - 1330) * move; y = 840 + (548 - 840) * move;
    cursorOpacity = smooth(.8, 1.1) * (1 - smooth(2.3, 2.7));
    cursorScale = 1 - .18 * Math.sin(progress(1.9, 2.18) * Math.PI);
  } else if (time < 8.8) {
    const move = smooth(5.25, 6.4);
    x = 1460 + (515 - 1460) * move; y = 790 + (637 - 790) * move - Math.sin(move * Math.PI) * 65;
    cursorOpacity = smooth(5.1, 5.35) * (1 - smooth(7.0, 7.35));
    cursorScale = 1 - .18 * Math.sin(progress(6.6, 6.88) * Math.PI);
  } else {
    const move = smooth(9.65, 10.75);
    x = 515 + (175 - 515) * move; y = 637 + (518 - 637) * move - Math.sin(move * Math.PI) * 35;
    cursorOpacity = smooth(9.5, 9.8) * (1 - smooth(11.4, 11.8));
    cursorScale = 1 - .18 * Math.sin(progress(10.92, 11.2) * Math.PI);
  }
  el('.cursor').style.opacity = String(cursorOpacity);
  el('.cursor').style.transform = `translate(${x}px,${y}px) scale(${cursorScale})`;
  const click = time < 4.5 ? progress(1.93, 2.43) : time < 8.8 ? progress(6.63, 7.13) : progress(10.95, 11.45);
  el('.click-ring').style.left = `${time < 4.5 ? 1056 : time < 8.8 ? 521 : 181}px`;
  el('.click-ring').style.top = `${time < 4.5 ? 554 : time < 8.8 ? 643 : 524}px`;
  el('.click-ring').style.opacity = String(click > 0 && click < 1 ? .55 * (1 - click) : 0);
  el('.click-ring').style.transform = `translate(-50%,-50%) scale(${.3 + click * 1.05})`;
}
