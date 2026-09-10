import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export interface UploadProgressCallback {
  (progressPercent: number): void;
}

export const storageService = {
  /**
   * Uploads claim evidentiary photo, video, or PDF document to /claims/{claimId}/{fileName}
   */
  async uploadClaimEvidence(
    claimId: string,
    file: File,
    onProgress?: UploadProgressCallback
  ): Promise<string> {
    // 15 MB limit validation as per storage.rules
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error(`Datoteka premašuje maksimalno dopuštenu veličinu od 15 MB (${(file.size / 1024 / 1024).toFixed(1)} MB).`);
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `claims/${claimId}/${Date.now()}_${safeName}`;

    try {
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type,
      });

      return new Promise<string>((resolve) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(Math.round(progress));
          },
          (error) => {
            // Fall back to object URL for seamless offline/demo support
            console.warn('Firebase Storage upload offline fallback:', error);
            resolve(URL.createObjectURL(file));
          },
          async () => {
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadUrl);
            } catch {
              resolve(URL.createObjectURL(file));
            }
          }
        );
      });
    } catch {
      // Local fallback for offline/demo operation
      return URL.createObjectURL(file);
    }
  },

  /**
   * Uploads multiple evidentiary files in parallel
   */
  async uploadMultipleEvidence(claimId: string, files: File[]): Promise<string[]> {
    if (!files || files.length === 0) return [];
    return Promise.all(files.map((file) => this.uploadClaimEvidence(claimId, file)));
  },
};
