const fs = require('fs');
const path = require('path');

const DIR = 'patches/pending';
if (!fs.existsSync(DIR)) { console.log('Нет папки patches/pending'); process.exit(0); }

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort();
let ok = 0, bad = 0;

for (const f of files) {
  const p = path.join(DIR, f);
  let job;
  try { job = JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { console.log('Некорректный JSON:', f, e.message); bad++; continue; }

  const backups = {};
  let success = true;

  for (const edit of job.edits || []) {
    const fp = edit.file;
    if (!backups[fp]) backups[fp] = fs.readFileSync(fp, 'utf8');
    const src = fs.readFileSync(fp, 'utf8');
    const count = src.split(edit.find).length - 1;
    if (count === 0) { console.log('Не найден фрагмент в', fp, ':', edit.find.slice(0, 80)); success = false; break; }
    if (count > 1)  { console.log('Фрагмент найден', count, 'раз в', fp, '- неоднозначно:', edit.find.slice(0, 80)); success = false; break; }
    fs.writeFileSync(fp, src.replace(edit.find, edit.replace));
  }

  if (success) {
    fs.unlinkSync(p);
    fs.writeFileSync(p.replace('.json', '.applied.txt'), new Date().toISOString() + ' — ' + (job.name || f));
    console.log('Применён:', f, '—', job.name || '');
    ok++;
  } else {
    for (const fp in backups) fs.writeFileSync(fp, backups[fp]);
    fs.writeFileSync(p.replace('.json', '.failed.txt'), new Date().toISOString() + ' — не удалось: ' + (job.name || f));
    bad++;
  }
}
console.log(`\nИтог: применено ${ok}, ошибок ${bad}`);
if (bad > 0) process.exit(1);
