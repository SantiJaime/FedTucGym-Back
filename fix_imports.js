import fs from 'fs';
import path from 'path';

const directory = './dist';
const addJsExtension = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      addJsExtension(fullPath);
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');

      content = content.replace(/(from\s+['"])(\..*?)(['"])/g, '$1$2.js$3');
      fs.writeFileSync(fullPath, content);
    }
  });
};

addJsExtension(directory);
