import Bot from './Bot';
import fs from 'fs';
export default new Bot(fs.readFileSync('token.txt').toString().trim());
