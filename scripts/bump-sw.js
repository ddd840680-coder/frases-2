const fs = require('fs');
if (!fs.existsSync('sw.js')) { console.log('sw.js не найден — пропускаю'); process.exit(0); }
const src = fs.readFileSync('sw.js', 'utf8');
const m = src.match(/const VER = 'v(\d+)'/);
if (!m) { console.log('В sw.js нет строки const VER = "vN" — пропускаю'); process.exit(0); }
const nv = 'v' + (parseInt(m[1], 10) + 1);
fs.writeFileSync('sw.js', src.replace(/const VER = 'v\d+'/, `const VER = '${nv}'`));
console.log('SW версия поднята до', nv);
