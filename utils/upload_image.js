const path = require('path');
const { uuid } = require('uuidv4');
const sharp = require('sharp');
class UploadImage {

    constructor(folder) {
        this.folder = folder;
      }

      async save(buffer) {
        const filename = UploadImage.filename();
        const filepath = this.filepath(filename);
    
        await sharp(buffer).toFile(filepath);
        
        return filename;
      }
      static filename() {
         // random file name
        return `${uuid()}.png`;
      }
      filepath(filename) {
        return path.resolve(`${this.folder}/${filename}`)
      }
}

module.exports = UploadImage