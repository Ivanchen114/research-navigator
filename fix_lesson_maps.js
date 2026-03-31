const fs = require('fs');
let content = fs.readFileSync('src/data/lessonMaps.js', 'utf8');

// 1. Rename IDs
content = content.replace(/id: "W14"/g, 'id: "W15"');
content = content.replace(/id: "W13"/g, 'id: "W14"');
content = content.replace(/id: "W12"/g, 'id: "W13"');
content = content.replace(/id: "W11"/g, 'id: "W12"');
content = content.replace(/id: "W10"/g, 'id: "W11"');
content = content.replace(/id: "W9"/g, 'id: "W10"');
content = content.replace(/id: "W8"/g, 'id: "W9"');
content = content.replace(/id: "W7"/g, 'id: "W8"');
content = content.replace(/id: "W6"/g, 'id: "W7"');
content = content.replace(/id: "W5"/g, 'id: "W6"');
content = content.replace(/id: "W50"/g, 'id: "W5"');

// Modify exported constant names to match their imports in components, wait, components use W6Data for ClinicPage, which is now W7. 
// So W6Data MUST still be named W6Data.
// BUT its title should be updated to "研究診所" (it already is).
// BUT we need to change W6Data's week badge "W6" inside the objects.
// Wait, the id is used for badges usually, or `badge` field. Let's just update the titles.

// Change W50Data title to "文獻搜尋入門"
content = content.replace(/title: "([^"]*文獻搜尋入門[^"]*)"/, 'title: "文獻搜尋入門"'); // if it existed
// If it didn't exist in that exact wording:
const w50DataStart = content.indexOf('export const W50Data');
if (w50DataStart !== -1) {
    const titleRegex = /title:\s*"[^"]+"/;
    const end = content.indexOf('export const W5Data', w50DataStart);
    let chunk = content.slice(w50DataStart, end);
    chunk = chunk.replace(titleRegex, 'title: "文獻搜尋入門"');
    content = content.slice(0, w50DataStart) + chunk + content.slice(end);
}

// Change W5Data title to "文獻偵探社 (Sherlock Edition)"
const w5DataStart = content.indexOf('export const W5Data');
if (w5DataStart !== -1) {
    const titleRegex = /title:\s*"[^"]+"/;
    const end = content.indexOf('export const W6Data', w5DataStart);
    let chunk = content.slice(w5DataStart, end);
    chunk = chunk.replace(titleRegex, 'title: "文獻偵探社"');
    content = content.slice(0, w5DataStart) + chunk + content.slice(end);
}

fs.writeFileSync('src/data/lessonMaps.js', content, 'utf8');
console.log('Update complete.');
