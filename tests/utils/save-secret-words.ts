import fs from 'fs';

export function saveSecretWords(words: string) {
  fs.writeFile('secret-words.txt', words, function (err) {
    if (err) throw err;

    console.log("File was saved.");
  });
}
