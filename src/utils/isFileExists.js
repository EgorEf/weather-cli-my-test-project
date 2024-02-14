import fs from "node:fs/promises";

const isFileExists = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch (e) {
    return false;
  }
};

export default isFileExists;
