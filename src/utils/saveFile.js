import { ENV_VARS } from '../constants/index.js';
import { env } from './env.js';
import saveFileToCloudinary from './saveFileToCloudinary.js';
import saveFileToUploadDir from './saveFileToUploadDir.js';

export default async function saveFile(photo) {
  if (!photo) return;

  let photoUrl;

  if (photo) {
    if (env(ENV_VARS.ENABLE_CLOUDINARY) === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  return photoUrl;
}
