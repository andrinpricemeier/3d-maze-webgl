import { MaskImage } from "./MaskImage.js";

export class MaskRepository {
  constructor() {
    this.maskFiles = [];
    this.masks = new Map();
  }

  get(name) {
    return this.masks.get(name);
  }

  add(name, filepath) {
    this.maskFiles.push({ name: name, filepath: filepath });
  }

  loadAll(callWhenDone) {
    let imagesLoaded = 0;
    for (const maskFile of this.maskFiles) {
      const image = new Image();
      const that = this;
      image.onload = function () {
        imagesLoaded++;
        const mask = new MaskImage(
          maskFile.name,
          image
        );
        that.masks.set(maskFile.name, mask);
        if (that.maskFiles.length === imagesLoaded) {
          callWhenDone();
        }
      };
      image.src = maskFile.filepath;
    }
  }
}
