import fs from 'fs/promises';
import path from 'path';

export async function readSecretWords(): Promise<string | void> {
  const secretWordsPath = path.join(__dirname, '../../secret-words.txt');

  try {
    const data = await fs.readFile(secretWordsPath, { encoding: 'utf8' });
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return;
  }
}
