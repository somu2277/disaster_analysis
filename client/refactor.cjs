const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.jsx')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace text-white with text-text-main globally
  content = content.replace(/text-white/g, 'text-text-main');
  
  // Fix the buttons/badges that explicitly need text-white (or just true white)
  // Revert for primary buttons which use 'bg-brand'
  // Actually, I can just change the primary buttons manually or use regex
  // Let's replace 'text-text-main' with 'text-white' when it's next to bg-brand
  content = content.replace(/bg-brand(.*?)text-text-main/g, 'bg-brand$1text-white');
  
  fs.writeFileSync(file, content);
});

console.log('Replaced text-white with text-text-main');
