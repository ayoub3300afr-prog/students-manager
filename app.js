/* ══════════════════════════════════════════════
   DATA & CONSTANTS
══════════════════════════════════════════════ */
const COLORS  = ['#E8522A','#3B82F6','#8B5CF6','#10B981','#F59E0B','#EF4444','#06B6D4','#EC4899','#6366F1','#14B8A6'];
const MAJORS  = ['Computer Science','Mathematics','Physics','Biology','Chemistry','Economics','Psychology','Literature','Engineering','Business'];
const FIRST   = ['Youssef','Ayoub','Omar','Hamza','Mehdi','Zakaria','Anas','Saad','Rachid','Karim','Hassan','Amine','Imane','Salma','Khadija','Fatima','Amina','Nadia','Siham','Houda','Meryem','Soukaina','Hajar','Ikram','Chaimae','Othmane','Yassine','Bilal','Taha','Adil'];
const LAST    = ['Alaoui','El Amrani','Benali','El Idrissi','Bennani','Tazi','Lahlou','Chraibi','Berrada','Fassi','El Mansouri','Skalli','El Haddad','El Khatib','Ait Ali','Ait Benhaddou','Ouazzani','Zniber','El Glaoui','Boukili','Amrani','Boussaid','El Fakir','El Yousfi','El Malki','Talbi','Bennouna','Kabbaj','El Fihri','Ait Lahcen'];
const COURSES = ['Algorithms','Calculus II','Quantum Physics','Cell Biology','Organic Chemistry','Microeconomics','Cognitive Psychology','Modern Literature','Structural Engineering','Business Strategy'];
const PROFS   = ['Dr. Smith','Prof. Lee','Dr. Patel','Prof. Garcia','Dr. Kim','Prof. Chen','Dr. Müller','Prof. Dubois','Dr. Rossi','Prof. Nakamura'];

const pick = a => a[Math.floor(Math.random() * a.length)];
const ri   = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const inits = n => n.split(' ').map(x => x[0]).join('');
const $     = id => document.getElementById(id);

/* ══════════════════════════════════════════════
   LOCALSTORAGE — KEYS & HELPERS
══════════════════════════════════════════════ */
const LS_STUDENTS = 'swm_students';
const LS_COURSES  = 'swm_courses';
const LS_EVENTS   = 'swm_events';
const LS_THEME    = 'swm-theme';

function lsGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch (e) { console.warn('localStorage write failed:', e); }
}

function saveStudents()  { lsSet(LS_STUDENTS, students); }
function saveCoursesData() { lsSet(LS_COURSES, coursesData); }
function saveEvents()    { lsSet(LS_EVENTS, globalEvts); }

/* ══════════════════════════════════════════════
   GENERATE OR RESTORE STUDENTS
══════════════════════════════════════════════ */
function generateStudents() {
  return Array.from({ length: 1184 }, (_, i) => {
    const fn = pick(FIRST), ln = pick(LAST);
    return {
      id:         `STU-${String(10000 + i).slice(1)}`,
      name:       `${fn} ${ln}`,
      major:      pick(MAJORS),
      status:     pick(['Active','Active','Active','Active','On Leave','Inactive']),
      color:      COLORS[i % COLORS.length],
      grade:      parseFloat((Math.random() * 18 + 2).toFixed(2)),
      attendance: ri(0, 40),
      year:       ri(1, 4)
    };
  });
}

let students = lsGet(LS_STUDENTS) || (() => {
  const s = generateStudents();
  lsSet(LS_STUDENTS, s);
  return s;
})();

/* ══════════════════════════════════════════════
   GENERATE OR RESTORE COURSES
══════════════════════════════════════════════ */
function generateCourses() {
  return COURSES.map((name, i) => ({
    id:         `CRS-${String(100 + i).slice(1)}`,
    name,
    instructor: PROFS[i],
    major:      MAJORS[i],
    enrolled:   ri(20, 80),
    capacity:   80,
    credits:    ri(2, 4),
    status:     pick(['Active','Active','Active','Upcoming','Closed'])
  }));
}

let coursesData = lsGet(LS_COURSES) || (() => {
  const c = generateCourses();
  lsSet(LS_COURSES, c);
  return c;
})();

/* ══════════════════════════════════════════════
   GLOBAL CALENDAR EVENTS (lifted from renderCalendar)
══════════════════════════════════════════════ */
const TC = { exam:'#ef4444', deadline:'#f59e0b', meeting:'#8b5cf6', event:'#22c55e', reminder:'#3b82f6' };

function defaultEvents() {
  const today = new Date();
  const vy = today.getFullYear(), vm = today.getMonth();
  const pad = n => String(n).padStart(2,'0');
  const todayStr = `${vy}-${pad(vm+1)}-${pad(today.getDate())}`;
  return [
    { date: todayStr,                                        title:'Today',              color:'#3b82f6', type:'reminder' },
    { date:`${vy}-${pad(vm+1)}-10`,                          title:'Midterm Exams',      color:'#ef4444', type:'exam'     },
    { date:`${vy}-${pad(vm+1)}-15`,                          title:'Assignment Deadline', color:'#f59e0b', type:'deadline' },
    { date:`${vy}-${pad(vm+1)}-20`,                          title:'Faculty Meeting',    color:'#8b5cf6', type:'meeting'  },
    { date:`${vy}-${pad(vm+1)}-25`,                          title:'Final Project Due',  color:'#ef4444', type:'deadline' },
  ];
}

let globalEvts = lsGet(LS_EVENTS) || (() => {
  const e = defaultEvents();
  lsSet(LS_EVENTS, e);
  return e;
})();

/* ══════════════════════════════════════════════
   RESET ALL DATA (optional utility — clear & regenerate)
══════════════════════════════════════════════ */
function resetAllData() {
  if (!confirm('Reset ALL data? This will regenerate students, courses and events.')) return;
  localStorage.removeItem(LS_STUDENTS);
  localStorage.removeItem(LS_COURSES);
  localStorage.removeItem(LS_EVENTS);
  students    = generateStudents();  saveStudents();
  coursesData = generateCourses();   saveCoursesData();
  globalEvts  = defaultEvents();     saveEvents();
  navigate(currentPage);
}

/* ══════════════════════════════════════════════
   GRADE HELPERS — /20 scale
══════════════════════════════════════════════ */
const gradeBadge = g => g >= 16 ? 'b-green' : g >= 12 ? 'b-gold' : 'b-red';
const gradeLabel = g => {
  if (g >= 18) return 'Très Bien';
  if (g >= 16) return 'Bien';
  if (g >= 14) return 'Assez Bien';
  if (g >= 12) return 'Passable';
  return 'Insuffisant';
};
const gradeColor = g => g >= 16 ? '#22c55e' : g >= 12 ? '#f59e0b' : '#ef4444';
const gradeDisp  = g => `${g.toFixed(2)}/20`;
const avgGrade20 = arr => parseFloat((arr.reduce((a, s) => a + s.grade, 0) / arr.length).toFixed(2));

/* ══════════════════════════════════════════════
   ATTENDANCE HELPERS
══════════════════════════════════════════════ */
const attBadge = h => h > 30 ? 'b-green' : h > 15 ? 'b-gold' : 'b-red';
const attLabel = h => h > 30 ? 'Good' : h > 15 ? 'Average' : 'At Risk';
const attColor = h => h > 30 ? '#22c55e' : h > 15 ? '#f59e0b' : '#ef4444';
const badgeCls = s => s === 'Active' ? 'b-green' : s === 'On Leave' ? 'b-gold' : 'b-red';

/* ══════════════════════════════════════════════
   PAGER UTILITY
══════════════════════════════════════════════ */
function makePager(ctxId, getData, perPage, renderFn) {
  let page = 1;
  const pager = {
    draw() {
      const data  = getData();
      const total = Math.max(1, Math.ceil(data.length / perPage));
      if (page > total) page = total;
      renderFn(data.slice((page - 1) * perPage, page * perPage), page, data.length);
      const c = $(ctxId); if (!c) return;
      let pages = [];
      if (total <= 7) pages = Array.from({ length: total }, (_, i) => i + 1);
      else if (page <= 4) pages = [1,2,3,4,5,'…',total];
      else if (page >= total - 3) pages = [1,'…',total-4,total-3,total-2,total-1,total];
      else pages = [1,'…',page-1,page,page+1,'…',total];
      c.innerHTML = `
        <button class="pg-btn" id="pp-${ctxId}" ${page===1?'disabled':''}><i class="fa-solid fa-chevron-left"></i></button>
        <div class="pg-nums">${pages.map(p => p === '…'
          ? `<span class="pg-dots">···</span>`
          : `<button class="pg-num${p===page?' active':''}" data-p="${p}">${p}</button>`
        ).join('')}</div>
        <button class="pg-btn" id="pn-${ctxId}" ${page===total?'disabled':''}><i class="fa-solid fa-chevron-right"></i></button>`;
      $(`pp-${ctxId}`)?.addEventListener('click', () => { page--; pager.draw(); });
      $(`pn-${ctxId}`)?.addEventListener('click', () => { page++; pager.draw(); });
      c.querySelectorAll('.pg-num').forEach(b => b.addEventListener('click', () => { page = +b.dataset.p; pager.draw(); }));
    },
    reset() { page = 1; pager.draw(); }
  };
  return pager;
}

function exportCSV(headers, rows, filename) {
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = filename;
  a.click();
}

/* ══════════════════════════════════════════════
   THEME TOGGLE — LIGHT / DARK
══════════════════════════════════════════════ */
let isDark = true;

function applyTheme() {
  document.body.classList.toggle('light', !isDark);
  const icon = $('themeIcon');
  if (icon) icon.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  localStorage.setItem(LS_THEME, isDark ? 'dark' : 'light');
}

if (localStorage.getItem(LS_THEME) === 'light') { isDark = false; }

document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  const btn = $('themeToggle');
  if (btn) btn.addEventListener('click', () => { isDark = !isDark; applyTheme(); });
});

/* ══════════════════════════════════════════════
   MODALS — ADD / EDIT STUDENT
══════════════════════════════════════════════ */
const mStudent = $('modalStudent');

function openAddModal() {
  mStudent.dataset.mode = 'add';
  $('modalStudentTitle').textContent  = 'Add New Student';
  $('modalStudentSubmit').textContent = 'Add Student';
  $('fName').value = $('fName2').value = $('fMajor').value = '';
  $('fStatus').value = 'Active';
  delete mStudent.dataset.editId;
  mStudent.classList.add('open');
}

function openEditModal(s) {
  mStudent.dataset.mode   = 'edit';
  mStudent.dataset.editId = s.id;
  $('modalStudentTitle').textContent  = 'Edit Student';
  $('modalStudentSubmit').textContent = 'Save Changes';
  const parts = s.name.split(' ');
  $('fName').value   = parts[0];
  $('fName2').value  = parts.slice(1).join(' ');
  $('fMajor').value  = s.major;
  $('fStatus').value = s.status;
  mStudent.classList.add('open');
}

function closeStudentModal() { mStudent.classList.remove('open'); }

$('btnAddStudent').addEventListener('click', openAddModal);
$('modalStudentClose').addEventListener('click', closeStudentModal);
$('modalStudentCancel').addEventListener('click', closeStudentModal);
mStudent.addEventListener('click', e => { if (e.target === mStudent) closeStudentModal(); });

$('modalStudentSubmit').addEventListener('click', () => {
  const fn     = ($('fName').value  || '').trim();
  const ln     = ($('fName2').value || '').trim();
  const major  = $('fMajor').value;
  const status = $('fStatus').value;
  if (!fn || !ln || !major) { alert('Please fill all fields.'); return; }
  if (mStudent.dataset.mode === 'edit' && mStudent.dataset.editId) {
    const i = students.findIndex(x => x.id === mStudent.dataset.editId);
    if (i !== -1) {
      students[i].name   = `${fn} ${ln}`;
      students[i].major  = major;
      students[i].status = status;
    }
  } else {
    students.unshift({
      id:         `STU-${String(10000 + students.length).slice(1)}`,
      name:       `${fn} ${ln}`,
      major, status,
      color:      COLORS[students.length % COLORS.length],
      grade:      parseFloat((Math.random() * 18 + 2).toFixed(2)),
      attendance: ri(0, 40),
      year:       1
    });
  }
  saveStudents(); // ← persist
  closeStudentModal();
  navigate(currentPage, true);
});

/* ══════════════════════════════════════════════
   MODAL — VIEW STUDENT
══════════════════════════════════════════════ */
const mView = $('modalView');

function openViewModal(s) {
  $('viewAvatar').textContent      = inits(s.name);
  $('viewAvatar').style.background = s.color;
  $('viewName').textContent        = s.name;
  $('viewId').textContent          = s.id;
  $('viewMajor').textContent       = s.major;
  $('viewAtt').textContent         = `${s.attendance}h — ${attLabel(s.attendance)}`;
  $('viewAtt').className           = `badge ${attBadge(s.attendance)}`;
  $('viewStatus').textContent      = s.status;
  $('viewStatus').className        = `badge ${badgeCls(s.status)}`;
  mView.classList.add('open');
}

function closeViewModal() { mView.classList.remove('open'); }
$('modalViewClose').addEventListener('click', closeViewModal);
mView.addEventListener('click', e => { if (e.target === mView) closeViewModal(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeStudentModal(); closeViewModal(); }
});

/* ══════════════════════════════════════════════
   SIDEBAR — mobile toggle
══════════════════════════════════════════════ */
const sidebar        = document.querySelector('.sidebar');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
const hamburgerBtn   = $('hamburgerBtn');

function openSidebar()  { sidebar.classList.add('open'); sidebarOverlay.classList.add('open'); }
function closeSidebar() { sidebar.classList.remove('open'); sidebarOverlay.classList.remove('open'); }

hamburgerBtn.addEventListener('click', openSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

/* ══════════════════════════════════════════════
   ROUTER
══════════════════════════════════════════════ */
let currentPage = 'Dashboard';

function navigate(page, silent = false) {
  currentPage = page;
  $('bcCurrent').textContent = page === 'Dashboard' ? 'Overview' : page;
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });
  closeSidebar();
  const main = $('pageMain');
  if      (page === 'Dashboard')  renderDashboard(main);
  else if (page === 'Students')   renderStudents(main);
  else if (page === 'Notes')      renderNotes(main);
  else if (page === 'Attendance') renderAttendance(main);
  else if (page === 'Courses')    renderCourses(main);
  else if (page === 'Calendar')   renderCalendar(main);
}

document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
  btn.addEventListener('click', () => navigate(btn.dataset.page));
});

$('searchInput').addEventListener('input', () => {
  if (currentPage !== 'Dashboard') navigate(currentPage, true);
});

/* ══════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════ */
function renderDashboard(main) {
  const active   = students.filter(s => s.status === 'Active').length;
  const onLeave  = students.filter(s => s.status === 'On Leave').length;
  const inactive = students.filter(s => s.status === 'Inactive').length;
  const avg20  = avgGrade20(students);
  const avgAtt = Math.round(students.reduce((a, s) => a + s.attendance, 0) / students.length);
  const aGood  = students.filter(s => s.attendance > 30).length;
  const aAvg   = students.filter(s => s.attendance > 15 && s.attendance <= 30).length;
  const aRisk  = students.filter(s => s.attendance <= 15).length;

  const majorCounts = {};
  students.forEach(s => { majorCounts[s.major] = (majorCounts[s.major] || 0) + 1; });
  const topMajors = Object.entries(majorCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxM = topMajors[0]?.[1] || 1;
  const MC = ['#4f7cff','#7c5cff','#22c55e','#f59e0b','#06b6d4'];

  main.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-sub">Overview of your institution's key metrics and activity.</p>
    </div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:1px;padding:0px 14px;background:var(--panel);border:1px solid var(--border);border-radius:10px;font-size:12px;color:var(--sub)">
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-icon si-blue"><i class="fa-solid fa-users"></i></div>
        <div class="stat-label">Total Students</div>
        <div class="stat-value">${students.length.toLocaleString()}</div>
        <div class="stat-sub up"><i class="fa-solid fa-arrow-trend-up"></i> +12% from last term</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon si-green"><i class="fa-solid fa-user-check"></i></div>
        <div class="stat-label">Active Students</div>
        <div class="stat-value">${active.toLocaleString()}</div>
        <div class="stat-sub">${((active / students.length) * 100).toFixed(1)}% of total</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon si-gold"><i class="fa-solid fa-star-half-stroke"></i></div>
        <div class="stat-label">Avg. Grade</div>
        <div class="stat-value">${avg20.toFixed(2)}<span style="font-size:1rem;font-weight:500;color:var(--sub)">/20</span></div>
        <div class="stat-sub ${avg20 >= 12 ? 'up' : 'warn'}">${gradeLabel(avg20)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon si-purple"><i class="fa-solid fa-clock"></i></div>
        <div class="stat-label">Avg. Attendance</div>
        <div class="stat-value">${avgAtt}h</div>
        <div class="stat-sub">out of 40h</div>
      </div>
    </div>

    <div class="dash-row">
      <div class="panel dash-panel">
        <div class="panel-head">
          <i class="panel-icon fa-solid fa-chart-bar"></i>
          <span class="panel-title">Students by Major</span>
          <span class="panel-meta">Top 5</span>
        </div>
        <div class="major-area">
          ${topMajors.map(([major, count], i) => {
            const pct = (count / maxM * 100).toFixed(1), col = MC[i];
            return `<div>
              <div class="major-row-header">
                <div class="major-row-left">
                  <div class="major-dot" style="background:${col}"></div>
                  <span class="major-name">${major}</span>
                </div>
                <div class="major-row-right">
                  <span class="major-pct">${((count / students.length) * 100).toFixed(1)}%</span>
                  <span class="major-cnt" style="color:${col}">${count}</span>
                </div>
              </div>
              <div class="major-bar-track">
                <div class="major-bar-fill" style="background:${col};width:${pct}%"></div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <div class="panel dash-panel">
        <div class="panel-head">
          <i class="panel-icon fa-solid fa-clock"></i>
          <span class="panel-title">Attendance Overview</span>
          <span class="panel-meta">out of 40h</span>
        </div>
        <div class="att-body">
          <div class="att-mini-grid">
            <div class="att-mini"><div class="att-mini-val att-green">${aGood}</div><div class="att-mini-label att-green">Good</div><div class="att-mini-range">&gt; 30h</div></div>
            <div class="att-mini"><div class="att-mini-val att-gold">${aAvg}</div><div class="att-mini-label att-gold">Average</div><div class="att-mini-range">16–30h</div></div>
            <div class="att-mini"><div class="att-mini-val att-red">${aRisk}</div><div class="att-mini-label att-red">At Risk</div><div class="att-mini-range">≤ 15h</div></div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--sub);margin-bottom:6px;">
              <span>Distribution</span><span>${students.length.toLocaleString()} students</span>
            </div>
            <div class="att-bar-track">
              <div class="att-seg-green" style="flex:${aGood}"></div>
              <div class="att-seg-gold"  style="flex:${aAvg}"></div>
              <div class="att-seg-red"   style="flex:${aRisk}"></div>
            </div>
            <div class="att-legend" style="margin-top:8px;">
              ${[['att-seg-green','Good',aGood],['att-seg-gold','Average',aAvg],['att-seg-red','At Risk',aRisk]].map(([cls,lbl,n]) =>
                `<div class="att-leg-item"><div class="att-leg-dot ${cls}"></div><span>${lbl}</span><span class="att-leg-pct">${((n/students.length)*100).toFixed(0)}%</span></div>`
              ).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="panel dash-panel">
        <div class="panel-head">
          <i class="panel-icon fa-solid fa-users"></i>
          <span class="panel-title">Enrollment Status</span>
        </div>
        <div class="enroll-area">
          <div class="enroll-card">
            <div class="enroll-icon ei-green"><i class="fa-solid fa-user-check"></i></div>
            <div class="enroll-info"><div class="enroll-val">${active.toLocaleString()}</div><div class="enroll-label">Active</div></div>
            <div class="enroll-pct ep-green">${((active/students.length)*100).toFixed(1)}%</div>
          </div>
          <div class="enroll-card">
            <div class="enroll-icon ei-gold"><i class="fa-solid fa-user-clock"></i></div>
            <div class="enroll-info"><div class="enroll-val">${onLeave.toLocaleString()}</div><div class="enroll-label">On Leave</div></div>
            <div class="enroll-pct ep-gold">${((onLeave/students.length)*100).toFixed(1)}%</div>
          </div>
          <div class="enroll-card">
            <div class="enroll-icon ei-red"><i class="fa-solid fa-user-xmark"></i></div>
            <div class="enroll-info"><div class="enroll-val">${inactive.toLocaleString()}</div><div class="enroll-label">Inactive</div></div>
            <div class="enroll-pct ep-red">${((inactive/students.length)*100).toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head">
        <span class="panel-title">Recent Students</span>
        <button class="tb-btn" style="margin-left:auto" onclick="navigate('Students')">View All →</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Major</th><th>Grade</th><th>Attendance</th><th>Status</th></tr></thead>
          <tbody>${students.slice(0, 5).map(s => `
            <tr>
              <td><span class="stu-id">${s.id}</span></td>
              <td><div class="name-cell"><div class="avatar" style="background:${s.color}">${inits(s.name)}</div>${s.name}</div></td>
              <td>${s.major}</td>
              <td><span class="badge ${gradeBadge(s.grade)}">${gradeDisp(s.grade)} — ${gradeLabel(s.grade)}</span></td>
              <td><span class="badge ${attBadge(s.attendance)}">${s.attendance}h — ${attLabel(s.attendance)}</span></td>
              <td><span class="badge ${badgeCls(s.status)}">${s.status}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
      <div style="display: flex;margin-left: 40px;margin-right: 40px;">
      <span>All data is automatically saved in your browser (localStorage).</span>
      <button onclick="resetAllData()" style="margin-left:auto;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:transparent;color:var(--sub);cursor:pointer;font-size:13px;color:red">
        <i class="fa-solid fa-rotate-left"></i> Reset Data
      </button>
      </div>`;
}

/* ══════════════════════════════════════════════
   STUDENTS
══════════════════════════════════════════════ */
function renderStudents(main) {
  let filt = [...students], fStatus = 'All', fMajor = 'All';

  main.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Student Directory</h1>
      <p class="page-sub">View and manage all enrolled students.</p>
    </div>
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-icon si-blue"><i class="fa-solid fa-users"></i></div><div class="stat-label">Total</div><div class="stat-value">${students.length.toLocaleString()}</div><div class="stat-sub up">+12% this term</div></div>
      <div class="stat-card"><div class="stat-icon si-green"><i class="fa-solid fa-user-check"></i></div><div class="stat-label">Active</div><div class="stat-value">${students.filter(s=>s.status==='Active').length.toLocaleString()}</div><div class="stat-sub">92.4% occupancy</div></div>
      <div class="stat-card"><div class="stat-icon si-red"><i class="fa-solid fa-graduation-cap"></i></div><div class="stat-label">Graduation Rate</div><div class="stat-value">88%</div><div class="stat-sub warn">Target: 90%</div></div>
      <div class="stat-card"><div class="stat-icon si-purple"><i class="fa-solid fa-clock"></i></div><div class="stat-label">Avg. Attendance</div><div class="stat-value">${Math.round(students.reduce((a,s)=>a+s.attendance,0)/students.length)}h</div><div class="stat-sub">out of 40h</div></div>
    </div>
    <div class="panel">
      <div class="toolbar">
        <button class="tb-btn" id="btnShowFilters"><i class="fa-solid fa-sliders"></i> Filters <span class="filter-badge hidden" id="fbadge"></span></button>
        <button class="tb-btn" id="btnExport"><i class="fa-solid fa-download"></i> Export CSV</button>
        <span class="tb-count" id="stuCount"></span>
      </div>
      <div id="filterBar" class="toolbar hidden" style="border-top:none;padding-top:0">
        <div class="filter-group"><label class="filter-label">Status</label>
          <select class="f-select" id="fltStatus"><option value="All">All Statuses</option><option>Active</option><option>On Leave</option><option>Inactive</option></select>
        </div>
        <div class="filter-group"><label class="filter-label">Major</label>
          <select class="f-select" id="fltMajor"><option value="All">All Majors</option>${MAJORS.map(m=>`<option>${m}</option>`).join('')}</select>
        </div>
        <button class="tb-btn" id="btnReset">Reset</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Student ID</th><th>Full Name</th><th>Major</th><th>Attendance</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="stuBody"></tbody>
        </table>
      </div>
      <div class="pagination" id="stuPager"></div>
    </div>`;

  function apply() {
    const q = ($('searchInput')?.value || '').toLowerCase();
    filt = students.filter(s =>
      (s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.major.toLowerCase().includes(q)) &&
      (fStatus === 'All' || s.status === fStatus) &&
      (fMajor  === 'All' || s.major  === fMajor)
    );
    pager.reset();
  }

  function renderRows(slice, pg, total) {
    const tb = $('stuBody'); if (!tb) return;
    tb.innerHTML = filt.length === 0
      ? `<tr><td colspan="6" class="table-empty">No students found.</td></tr>`
      : slice.map(s => `
          <tr>
            <td><span class="stu-id">${s.id}</span></td>
            <td><div class="name-cell"><div class="avatar" style="background:${s.color}">${inits(s.name)}</div>${s.name}</div></td>
            <td>${s.major}</td>
            <td><div class="bar-cell"><div class="bar-track"><div class="bar-fill" style="background:${attColor(s.attendance)};width:${(s.attendance/40*100).toFixed(0)}%"></div></div><span class="bar-val">${s.attendance}h</span><span class="badge ${attBadge(s.attendance)}">${attLabel(s.attendance)}</span></div></td>
            <td><span class="badge ${badgeCls(s.status)}">${s.status}</span></td>
            <td><div class="actions">
              <button class="act act-view" data-id="${s.id}">View</button>
              <button class="act act-edit" data-id="${s.id}">Edit</button>
              <button class="act act-del"  data-id="${s.id}">Delete</button>
            </div></td>
          </tr>`).join('');
    tb.querySelectorAll('.act-view').forEach(b => b.addEventListener('click', () => { const s = students.find(x=>x.id===b.dataset.id); if(s) openViewModal(s); }));
    tb.querySelectorAll('.act-edit').forEach(b => b.addEventListener('click', () => { const s = students.find(x=>x.id===b.dataset.id); if(s) openEditModal(s); }));
    tb.querySelectorAll('.act-del').forEach(b => b.addEventListener('click', () => {
      if (!confirm(`Delete ${b.dataset.id}?`)) return;
      students = students.filter(x => x.id !== b.dataset.id);
      saveStudents(); // ← persist
      apply();
    }));
    const lbl = $('stuCount');
    const st = (pg-1)*10+1, en = Math.min(pg*10, total);
    if (lbl) lbl.textContent = total === 0 ? 'No results' : `Showing ${st}–${en} of ${total.toLocaleString()} students`;
  }

  const pager = makePager('stuPager', () => filt, 10, renderRows);
  pager.draw();

  $('btnShowFilters').addEventListener('click', () => $('filterBar').classList.toggle('hidden'));
  $('fltStatus').addEventListener('change', e => { fStatus = e.target.value; apply(); updateBadge(); });
  $('fltMajor').addEventListener('change',  e => { fMajor  = e.target.value; apply(); updateBadge(); });
  $('btnReset').addEventListener('click', () => {
    fStatus = 'All'; fMajor = 'All';
    $('fltStatus').value = 'All'; $('fltMajor').value = 'All';
    apply(); updateBadge();
  });
  $('btnExport').addEventListener('click', () => exportCSV(
    ['ID','Name','Major','Attendance','Status'],
    filt.map(s => [s.id, s.name, s.major, s.attendance, s.status]),
    'students.csv'
  ));
  $('searchInput').oninput = apply;

  function updateBadge() {
    const n = (fStatus !== 'All' ? 1 : 0) + (fMajor !== 'All' ? 1 : 0);
    const b = $('fbadge');
    if (n > 0) { b.textContent = n; b.classList.remove('hidden'); }
    else b.classList.add('hidden');
  }
  apply();
}

/* ══════════════════════════════════════════════
   NOTES  — grades sur /20
══════════════════════════════════════════════ */
function renderNotes(main) {
  let filt = [...students], gf = 'All', mf = 'All', sortDir = 1, sorted = false;
  const pass  = students.filter(s => s.grade >= 10).length;
  const avg20 = avgGrade20(students);

  main.innerHTML = `
    <div class="page-header"><h1 class="page-title">Grades & Notes</h1><p class="page-sub">Review student academic performance (notes sur 20).</p></div>
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-icon si-blue"><i class="fa-solid fa-chart-line"></i></div><div class="stat-label">Class Average</div><div class="stat-value">${avg20.toFixed(2)}<span style="font-size:1rem;color:var(--sub)">/20</span></div><div class="stat-sub ${avg20>=12?'up':'warn'}">${gradeLabel(avg20)}</div></div>
      <div class="stat-card"><div class="stat-icon si-green"><i class="fa-solid fa-check-circle"></i></div><div class="stat-label">Passing (≥10/20)</div><div class="stat-value">${pass.toLocaleString()}</div><div class="stat-sub up">${((pass/students.length)*100).toFixed(1)}% pass rate</div></div>
      <div class="stat-card"><div class="stat-icon si-gold"><i class="fa-solid fa-star"></i></div><div class="stat-label">Très Bien (≥18/20)</div><div class="stat-value">${students.filter(s=>s.grade>=18).length}</div><div class="stat-sub up">Mention TB</div></div>
      <div class="stat-card"><div class="stat-icon si-red"><i class="fa-solid fa-triangle-exclamation"></i></div><div class="stat-label">At Risk (&lt;10/20)</div><div class="stat-value">${students.filter(s=>s.grade<10).length}</div><div class="stat-sub warn">Need attention</div></div>
    </div>
    <div class="panel">
      <div class="toolbar">
        <div class="filter-group"><label class="filter-label">Mention</label>
          <select class="f-select" id="gflt">
            <option value="All">All</option>
            <option value="TB">Très Bien (18+)</option>
            <option value="B">Bien (16–17)</option>
            <option value="AB">Assez Bien (14–15)</option>
            <option value="P">Passable (10–13)</option>
            <option value="I">Insuffisant (&lt;10)</option>
          </select>
        </div>
        <div class="filter-group"><label class="filter-label">Major</label>
          <select class="f-select" id="mflt"><option value="All">All Majors</option>${MAJORS.map(m=>`<option>${m}</option>`).join('')}</select>
        </div>
        <button class="tb-btn" id="exportG"><i class="fa-solid fa-download"></i> Export CSV</button>
        <span class="tb-count" id="notesCount"></span>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Student ID</th><th>Full Name</th><th>Major</th><th class="th-sort" id="thSort">Note /20 <i class="fa-solid fa-sort" id="sortIcon"></i></th><th>Mention</th><th>Actions</th></tr></thead>
          <tbody id="notesBody"></tbody>
        </table>
      </div>
      <div class="pagination" id="notesPager"></div>
    </div>
    <div class="modal-backdrop" id="gradeModal">
      <div class="modal">
        <div class="modal-header"><span class="modal-title">Edit Grade</span><button class="modal-close" id="closeGM"><i class="fa-solid fa-xmark"></i></button></div>
        <div class="grade-modal-info" id="gmInfo"></div>
        <div class="modal-body">
          <div class="form-row">
            <label class="form-label">Note (0 – 20)</label>
            <input class="form-input" id="gradeInput" type="number" min="0" max="20" step="0.25" placeholder="e.g. 14.50">
          </div>
        </div>
        <div class="modal-footer"><button class="btn-cancel" id="cancelGM">Cancel</button><button class="btn-submit" id="saveGM">Save Grade</button></div>
      </div>
    </div>`;

  function apply() {
    const q = ($('searchInput')?.value || '').toLowerCase();
    filt = students.filter(s => {
      const mq = s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
      const mm = mf === 'All' || s.major === mf;
      const mg = gf === 'All' ||
        (gf === 'TB' && s.grade >= 18) ||
        (gf === 'B'  && s.grade >= 16 && s.grade < 18) ||
        (gf === 'AB' && s.grade >= 14 && s.grade < 16) ||
        (gf === 'P'  && s.grade >= 10 && s.grade < 14) ||
        (gf === 'I'  && s.grade < 10);
      return mq && mm && mg;
    });
    if (sorted) filt.sort((a, b) => (a.grade - b.grade) * sortDir);
    pager.reset();
  }

  function renderRows(slice, pg, total) {
    const tb = $('notesBody'); if (!tb) return;
    tb.innerHTML = filt.length === 0 ? `<tr><td colspan="6" class="table-empty">No results.</td></tr>` :
      slice.map(s => `
        <tr>
          <td><span class="stu-id">${s.id}</span></td>
          <td><div class="name-cell"><div class="avatar" style="background:${s.color}">${inits(s.name)}</div>${s.name}</div></td>
          <td>${s.major}</td>
          <td><div class="grade-cell">
            <div class="grade-track"><div class="grade-fill" style="background:${gradeColor(s.grade)};width:${(s.grade/20*100).toFixed(1)}%"></div></div>
            <span class="grade-val">${gradeDisp(s.grade)}</span>
          </div></td>
          <td><span class="badge ${gradeBadge(s.grade)}">${gradeLabel(s.grade)}</span></td>
          <td><button class="act act-edit" data-id="${s.id}">Edit</button></td>
        </tr>`).join('');
    tb.querySelectorAll('.act-edit').forEach(b => b.addEventListener('click', () => {
      const s = students.find(x => x.id === b.dataset.id); if (s) openGM(s);
    }));
    const lbl = $('notesCount');
    const st = (pg-1)*10+1, en = Math.min(pg*10, total);
    if (lbl) lbl.textContent = total === 0 ? 'No results' : `Showing ${st}–${en} of ${total.toLocaleString()} students`;
  }

  const pager = makePager('notesPager', () => filt, 10, renderRows);
  pager.draw();

  $('thSort').addEventListener('click', () => {
    sorted = true; sortDir *= -1;
    $('sortIcon').className = `fa-solid fa-sort-${sortDir === 1 ? 'up' : 'down'}`;
    apply();
  });
  $('gflt').addEventListener('change', e => { gf = e.target.value; apply(); });
  $('mflt').addEventListener('change', e => { mf = e.target.value; apply(); });
  $('searchInput').oninput = apply;
  $('exportG').addEventListener('click', () => exportCSV(
    ['ID','Name','Major','Grade /20','Mention'],
    filt.map(s => [s.id, s.name, s.major, s.grade.toFixed(2), gradeLabel(s.grade)]),
    'grades.csv'
  ));

  const gm = $('gradeModal'); let editS = null;
  function openGM(s) {
    editS = s;
    $('gmInfo').innerHTML = `<div class="avatar" style="background:${s.color};width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:white">${inits(s.name)}</div><div><div class="grade-modal-name">${s.name}</div><div class="grade-modal-meta">${s.id} · ${s.major} · Actuel : ${gradeDisp(s.grade)}</div></div>`;
    $('gradeInput').value = s.grade.toFixed(2);
    gm.classList.add('open');
  }
  const closeGM = () => { gm.classList.remove('open'); editS = null; };
  $('closeGM').addEventListener('click', closeGM);
  $('cancelGM').addEventListener('click', closeGM);
  gm.addEventListener('click', e => { if (e.target === gm) closeGM(); });
  $('saveGM').addEventListener('click', () => {
    const v = parseFloat($('gradeInput').value);
    if (isNaN(v) || v < 0 || v > 20) { alert('Entrez une note entre 0 et 20.'); return; }
    if (editS) {
      const i = students.findIndex(x => x.id === editS.id);
      if (i !== -1) students[i].grade = parseFloat(v.toFixed(2));
    }
    saveStudents(); // ← persist
    closeGM(); apply();
  });
  apply();
}

/* ══════════════════════════════════════════════
   ATTENDANCE
══════════════════════════════════════════════ */
function renderAttendance(main) {
  let filt = [...students], sf = 'All', mf = 'All';
  const aGood = students.filter(s => s.attendance > 30).length;
  const aAvg  = students.filter(s => s.attendance > 15 && s.attendance <= 30).length;
  const aRisk = students.filter(s => s.attendance <= 15).length;

  main.innerHTML = `
    <div class="page-header"><h1 class="page-title">Attendance</h1><p class="page-sub">Monitor student attendance hours across all programs.</p></div>
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-icon si-green"><i class="fa-solid fa-circle-check"></i></div><div class="stat-label">Good (&gt;30h)</div><div class="stat-value">${aGood.toLocaleString()}</div><div class="stat-sub up">On track</div></div>
      <div class="stat-card"><div class="stat-icon si-gold"><i class="fa-solid fa-clock"></i></div><div class="stat-label">Average (16–30h)</div><div class="stat-value">${aAvg.toLocaleString()}</div><div class="stat-sub warn">Monitor closely</div></div>
      <div class="stat-card"><div class="stat-icon si-red"><i class="fa-solid fa-triangle-exclamation"></i></div><div class="stat-label">At Risk (≤15h)</div><div class="stat-value">${aRisk.toLocaleString()}</div><div class="stat-sub warn">Needs attention</div></div>
      <div class="stat-card"><div class="stat-icon si-purple"><i class="fa-solid fa-hourglass-half"></i></div><div class="stat-label">Avg. Hours</div><div class="stat-value">${Math.round(students.reduce((a,s)=>a+s.attendance,0)/students.length)}h</div><div class="stat-sub">out of 40h</div></div>
    </div>
    <div class="panel">
      <div class="toolbar">
        <div class="filter-group"><label class="filter-label">Status</label>
          <select class="f-select" id="asflt"><option value="All">All</option><option value="Good">Good (&gt;30h)</option><option value="Average">Average</option><option value="At Risk">At Risk</option></select>
        </div>
        <div class="filter-group"><label class="filter-label">Major</label>
          <select class="f-select" id="amflt"><option value="All">All Majors</option>${MAJORS.map(m=>`<option>${m}</option>`).join('')}</select>
        </div>
        <button class="tb-btn" id="exportAtt"><i class="fa-solid fa-download"></i> Export CSV</button>
        <span class="tb-count" id="attCount"></span>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Student ID</th><th>Full Name</th><th>Major</th><th>Hours</th><th>Status</th></tr></thead>
          <tbody id="attBody"></tbody>
        </table>
      </div>
      <div class="pagination" id="attPager"></div>
    </div>`;

  function apply() {
    const q = ($('searchInput')?.value || '').toLowerCase();
    filt = students.filter(s =>
      (s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)) &&
      (mf === 'All' || s.major === mf) &&
      (sf === 'All' || attLabel(s.attendance) === sf)
    );
    pager.reset();
  }

  function renderRows(slice, pg, total) {
    const tb = $('attBody'); if (!tb) return;
    tb.innerHTML = filt.length === 0 ? `<tr><td colspan="5" class="table-empty">No students found.</td></tr>` :
      slice.map(s => `
        <tr>
          <td><span class="stu-id">${s.id}</span></td>
          <td><div class="name-cell"><div class="avatar" style="background:${s.color}">${inits(s.name)}</div>${s.name}</div></td>
          <td>${s.major}</td>
          <td><div class="bar-cell"><div class="bar-track"><div class="bar-fill" style="background:${attColor(s.attendance)};width:${(s.attendance/40*100).toFixed(0)}%"></div></div><span class="bar-val">${s.attendance}h</span></div></td>
          <td><span class="badge ${attBadge(s.attendance)}">${attLabel(s.attendance)}</span></td>
        </tr>`).join('');
    const lbl = $('attCount');
    const st = (pg-1)*10+1, en = Math.min(pg*10, total);
    if (lbl) lbl.textContent = total === 0 ? 'No results' : `Showing ${st}–${en} of ${total.toLocaleString()} students`;
  }

  const pager = makePager('attPager', () => filt, 10, renderRows);
  pager.draw();
  $('asflt').addEventListener('change', e => { sf = e.target.value; apply(); });
  $('amflt').addEventListener('change', e => { mf = e.target.value; apply(); });
  $('searchInput').oninput = apply;
  $('exportAtt').addEventListener('click', () => exportCSV(
    ['ID','Name','Major','Hours','Status'],
    filt.map(s => [s.id, s.name, s.major, s.attendance, attLabel(s.attendance)]),
    'attendance.csv'
  ));
  apply();
}

/* ══════════════════════════════════════════════
   COURSES
══════════════════════════════════════════════ */
function renderCourses(main) {
  let filt = [...coursesData], csf = 'All';
  const csBadge = s => s === 'Active' ? 'b-green' : s === 'Upcoming' ? 'b-gold' : 'b-muted';

  main.innerHTML = `
    <div class="page-header"><h1 class="page-title">Courses</h1><p class="page-sub">Manage all courses and instructor assignments.</p></div>
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-icon si-blue"><i class="fa-solid fa-book"></i></div><div class="stat-label">Total Courses</div><div class="stat-value">${coursesData.length}</div><div class="stat-sub">Current semester</div></div>
      <div class="stat-card"><div class="stat-icon si-green"><i class="fa-solid fa-circle-play"></i></div><div class="stat-label">Active</div><div class="stat-value">${coursesData.filter(c=>c.status==='Active').length}</div><div class="stat-sub up">In progress</div></div>
      <div class="stat-card"><div class="stat-icon si-gold"><i class="fa-solid fa-calendar-plus"></i></div><div class="stat-label">Upcoming</div><div class="stat-value">${coursesData.filter(c=>c.status==='Upcoming').length}</div><div class="stat-sub">Next term</div></div>
      <div class="stat-card"><div class="stat-icon si-purple"><i class="fa-solid fa-user-group"></i></div><div class="stat-label">Total Enrolled</div><div class="stat-value">${coursesData.reduce((a,c)=>a+c.enrolled,0)}</div><div class="stat-sub">Across all courses</div></div>
    </div>
    <div class="panel">
      <div class="toolbar">
        <div class="filter-group"><label class="filter-label">Status</label>
          <select class="f-select" id="csflt"><option value="All">All</option><option>Active</option><option>Upcoming</option><option>Closed</option></select>
        </div>
        <button class="tb-btn primary" id="btnAddCourse"><i class="fa-solid fa-plus"></i> Add Course</button>
        <span class="tb-count" id="courseCount"></span>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Course ID</th><th>Course Name</th><th>Instructor</th><th>Enrollment</th><th>Credits</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="courseBody"></tbody>
        </table>
      </div>
      <div class="pagination" id="coursePager"></div>
    </div>
    <div class="modal-backdrop" id="courseModal">
      <div class="modal">
        <div class="modal-header"><span class="modal-title" id="cmTitle">Add Course</span><button class="modal-close" id="closeCM"><i class="fa-solid fa-xmark"></i></button></div>
        <div class="modal-body">
          <div class="form-row"><label class="form-label">Course Name</label><input class="form-input" id="cName" type="text" placeholder="e.g. Advanced Algorithms"></div>
          <div class="form-row"><label class="form-label">Instructor</label><input class="form-input" id="cInst" type="text" placeholder="e.g. Dr. Smith"></div>
          <div class="form-row-2">
            <div class="form-row"><label class="form-label">Credits</label><input class="form-input" id="cCred" type="number" min="1" max="6"></div>
            <div class="form-row"><label class="form-label">Status</label><select class="form-select" id="cStat"><option>Active</option><option>Upcoming</option><option>Closed</option></select></div>
          </div>
        </div>
        <div class="modal-footer"><button class="btn-cancel" id="cancelCM">Cancel</button><button class="btn-submit" id="saveCM">Add Course</button></div>
      </div>
    </div>`;

  function apply() {
    const q = ($('searchInput')?.value || '').toLowerCase();
    filt = coursesData.filter(c =>
      (c.name.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)) &&
      (csf === 'All' || c.status === csf)
    );
    pager.reset();
  }

  function renderRows(slice, pg, total) {
    const tb = $('courseBody'); if (!tb) return;
    tb.innerHTML = filt.length === 0 ? `<tr><td colspan="7" class="table-empty">No courses found.</td></tr>` :
      slice.map(c => `
        <tr>
          <td><span class="stu-id">${c.id}</span></td>
          <td style="font-weight:600;color:var(--text)">${c.name}</td>
          <td>${c.instructor}</td>
          <td><div class="enroll-bar-cell"><div class="enroll-bar-track"><div class="enroll-bar-fill" style="width:${(c.enrolled/c.capacity*100).toFixed(0)}%"></div></div><span class="enroll-bar-val">${c.enrolled}/${c.capacity}</span></div></td>
          <td style="text-align:center">${c.credits}</td>
          <td><span class="badge ${csBadge(c.status)}">${c.status}</span></td>
          <td><div class="actions"><button class="act act-edit" data-id="${c.id}">Edit</button><button class="act act-del" data-id="${c.id}">Delete</button></div></td>
        </tr>`).join('');
    tb.querySelectorAll('.act-edit').forEach(b => b.addEventListener('click', () => {
      const c = coursesData.find(x => x.id === b.dataset.id); if (c) openCM(c);
    }));
    tb.querySelectorAll('.act-del').forEach(b => b.addEventListener('click', () => {
      if (!confirm(`Delete ${b.dataset.id}?`)) return;
      const i = coursesData.findIndex(x => x.id === b.dataset.id);
      if (i !== -1) coursesData.splice(i, 1);
      saveCoursesData(); // ← persist
      apply();
    }));
    const lbl = $('courseCount');
    const st = (pg-1)*10+1, en = Math.min(pg*10, total);
    if (lbl) lbl.textContent = total === 0 ? 'No results' : `Showing ${st}–${en} of ${total} courses`;
  }

  const pager = makePager('coursePager', () => filt, 10, renderRows);
  pager.draw();
  $('csflt').addEventListener('change', e => { csf = e.target.value; apply(); });
  $('searchInput').oninput = apply;

  const cm = $('courseModal'); let editC = null;
  function openCM(c = null) {
    editC = c;
    $('cmTitle').textContent = c ? 'Edit Course' : 'Add Course';
    $('saveCM').textContent  = c ? 'Save Changes' : 'Add Course';
    $('cName').value  = c ? c.name : '';
    $('cInst').value  = c ? c.instructor : '';
    $('cCred').value  = c ? c.credits : '';
    $('cStat').value  = c ? c.status : 'Active';
    cm.classList.add('open');
  }
  const closeCM = () => { cm.classList.remove('open'); editC = null; };
  $('btnAddCourse').addEventListener('click', () => openCM());
  $('closeCM').addEventListener('click', closeCM);
  $('cancelCM').addEventListener('click', closeCM);
  cm.addEventListener('click', e => { if (e.target === cm) closeCM(); });
  $('saveCM').addEventListener('click', () => {
    const name = ($('cName').value || '').trim();
    const inst = ($('cInst').value || '').trim();
    const cred = parseInt($('cCred').value);
    const stat = $('cStat').value;
    if (!name || !inst || isNaN(cred)) { alert('Please fill all fields.'); return; }
    if (editC) {
      const i = coursesData.findIndex(x => x.id === editC.id);
      if (i !== -1) {
        coursesData[i].name = name; coursesData[i].instructor = inst;
        coursesData[i].credits = cred; coursesData[i].status = stat;
      }
    } else {
      coursesData.push({ id:`CRS-${String(100+coursesData.length)}`, name, instructor:inst, major:pick(MAJORS), enrolled:0, capacity:80, credits:cred, status:stat });
    }
    saveCoursesData(); // ← persist
    closeCM(); apply();
  });
  apply();
}

/* ══════════════════════════════════════════════
   CALENDAR  — uses global globalEvts
══════════════════════════════════════════════ */
function renderCalendar(main) {
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const today  = new Date();
  let vy = today.getFullYear(), vm = today.getMonth(), sel = null;
  const todayStr = `${vy}-${String(vm+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  main.innerHTML = `
    <div class="page-header"><h1 class="page-title">Academic Calendar</h1><p class="page-sub">View and manage academic events, deadlines and schedules.</p></div>
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-icon si-blue"><i class="fa-solid fa-calendar"></i></div><div class="stat-label">Total Events</div><div class="stat-value" id="calTotal">${globalEvts.length}</div><div class="stat-sub">This semester</div></div>
      <div class="stat-card"><div class="stat-icon si-red"><i class="fa-solid fa-file-pen"></i></div><div class="stat-label">Exams</div><div class="stat-value" id="calExams">${globalEvts.filter(e=>e.type==='exam').length}</div><div class="stat-sub warn">Scheduled</div></div>
      <div class="stat-card"><div class="stat-icon si-gold"><i class="fa-solid fa-hourglass-half"></i></div><div class="stat-label">Deadlines</div><div class="stat-value" id="calDeadlines">${globalEvts.filter(e=>e.type==='deadline').length}</div><div class="stat-sub warn">Upcoming</div></div>
      <div class="stat-card"><div class="stat-icon si-purple"><i class="fa-solid fa-people-group"></i></div><div class="stat-label">Meetings</div><div class="stat-value" id="calMeetings">${globalEvts.filter(e=>e.type==='meeting').length}</div><div class="stat-sub">Scheduled</div></div>
    </div>
    <div class="cal-layout">
      <div class="panel">
        <div class="panel-head cal-nav">
          <button class="tb-btn" id="prevM"><i class="fa-solid fa-chevron-left"></i></button>
          <span class="cal-month-title" id="calTitle"></span>
          <button class="tb-btn" id="nextM"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
        <div class="cal-grid" id="calGrid"></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;min-width:0">
        <div class="panel">
          <div class="panel-head"><span class="panel-title">Add Event</span></div>
          <div class="cal-form">
            <div class="form-row"><label class="form-label">Date</label><input class="form-input" id="evDate" type="date"></div>
            <div class="form-row"><label class="form-label">Title</label><input class="form-input" id="evTitle" type="text" placeholder="Event title…"></div>
            <div class="form-row"><label class="form-label">Type</label>
              <select class="form-select" id="evType"><option value="event">Event</option><option value="exam">Exam</option><option value="deadline">Deadline</option><option value="meeting">Meeting</option><option value="reminder">Reminder</option></select>
            </div>
            <button class="btn-submit btn-full" id="addEvt">Add Event</button>
          </div>
        </div>
        <div class="panel" style="flex:1">
          <div class="panel-head"><span class="panel-title">Upcoming Events</span></div>
          <div class="cal-event-list" id="evList"></div>
        </div>
      </div>
    </div>`;

  function refreshStats() {
    [['calTotal', globalEvts.length],
     ['calExams', globalEvts.filter(e=>e.type==='exam').length],
     ['calDeadlines', globalEvts.filter(e=>e.type==='deadline').length],
     ['calMeetings', globalEvts.filter(e=>e.type==='meeting').length]]
      .forEach(([id, v]) => { const el = $(id); if (el) el.textContent = v; });
  }

  function drawCal() {
    const t = $('calTitle'), g = $('calGrid'); if (!t || !g) return;
    t.textContent = `${MONTHS[vm]} ${vy}`;
    const fd = new Date(vy, vm, 1).getDay(), dim = new Date(vy, vm+1, 0).getDate();
    let html = `<div class="cal-days-header">${DAYS.map(d=>`<div class="cal-day-name">${d}</div>`).join('')}</div><div class="cal-days-grid">`;
    for (let i = 0; i < fd; i++) html += `<div></div>`;
    for (let d = 1; d <= dim; d++) {
      const ds = `${vy}-${String(vm+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const de = globalEvts.filter(e => e.date === ds), iT = ds === todayStr, iS = ds === sel;
      html += `<div class="cal-day${iS?' cal-day--selected':iT?' cal-day--today':''}" data-date="${ds}">
        <div class="cal-day-num${iS?' cal-day-num--selected':iT?' cal-day-num--today':''}">${d}</div>
        ${de.slice(0,2).map(e=>`<div class="cal-chip" style="background:${e.color}">${e.title}</div>`).join('')}
        ${de.length > 2 ? `<div class="cal-more">+${de.length-2}</div>` : ''}
      </div>`;
    }
    html += `</div>`;
    g.innerHTML = html;
    g.querySelectorAll('.cal-day').forEach(cell => cell.addEventListener('click', () => {
      sel = cell.dataset.date; $('evDate').value = sel; drawCal(); drawList();
    }));
  }

  function drawList() {
    const l = $('evList'); if (!l) return;
    const sorted = [...globalEvts].sort((a, b) => a.date.localeCompare(b.date));
    l.innerHTML = sorted.length === 0 ? `<div class="cal-no-events">No events yet.</div>` :
      sorted.map(e => `
        <div class="cal-ev-row">
          <div class="cal-ev-dot" style="background:${TC[e.type]||'#6b7280'}"></div>
          <div class="cal-ev-info">
            <div class="cal-ev-title">${e.title}</div>
            <div class="cal-ev-meta">${e.date} · ${e.type}</div>
          </div>
          <button class="act act-del" data-date="${e.date}" data-title="${e.title}" style="padding:4px 8px;font-size:11px">✕</button>
        </div>`).join('');
    l.querySelectorAll('.act-del').forEach(b => b.addEventListener('click', () => {
      globalEvts = globalEvts.filter(ev => !(ev.date === b.dataset.date && ev.title === b.dataset.title));
      saveEvents(); // ← persist
      drawCal(); drawList(); refreshStats();
    }));
  }

  $('prevM').addEventListener('click', () => { vm--; if (vm < 0) { vm = 11; vy--; } drawCal(); });
  $('nextM').addEventListener('click', () => { vm++; if (vm > 11) { vm = 0; vy++; } drawCal(); });
  $('addEvt').addEventListener('click', () => {
    const date  = $('evDate').value;
    const title = ($('evTitle').value || '').trim();
    const type  = $('evType').value;
    if (!date || !title) { alert('Fill in date and title.'); return; }
    globalEvts.push({ date, title, color: TC[type], type });
    saveEvents(); // ← persist
    $('evTitle').value = '';
    drawCal(); drawList(); refreshStats();
  });

  drawCal(); drawList();
}

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
document.querySelectorAll('#fMajor').forEach(s => {
  s.innerHTML = `<option value="">Select major…</option>` + MAJORS.map(m => `<option>${m}</option>`).join('');
});

navigate('Dashboard');