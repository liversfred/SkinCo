import { Injectable } from '@angular/core';
import { Storage, deleteObject, ref, uploadBytes } from '@angular/fire/storage';
import { getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private _storage: Storage) { }

  async uploadFile(path: string, file: File): Promise<string | null> {
    const fileRef = ref(this._storage, path);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return url;
  }

  async deleteFile(path: string): Promise<void> {
    const fileRef = ref(this._storage, path);
    await deleteObject(fileRef)
  }
}
