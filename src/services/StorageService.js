const fs = require('fs');

class StorageService {
  constructor(folder) {
    this._folder = folder;
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = `${+new Date()}_${meta.filename}`;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  deleteFile(filename) {
    const path = `${this._folder}/${filename}`;
    return new Promise((resolve, reject) => {
      fs.unlink(path, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = StorageService;
