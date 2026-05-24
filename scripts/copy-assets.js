import fs from 'fs';
import path from 'path';

const srcSwagger = path.resolve('src/swagger');
const distSwagger = path.resolve('dist/swagger');

try {
  if (!fs.existsSync(distSwagger)) {
    fs.mkdirSync(distSwagger, { recursive: true });
  }

  fs.copyFileSync(
    path.join(srcSwagger, 'swagger.json'),
    path.join(distSwagger, 'swagger.json')
  );
  console.log('Successfully copied swagger assets to build folder!');
} catch (error) {
  console.error('Failed to copy swagger assets:', error);
  process.exit(1);
}
