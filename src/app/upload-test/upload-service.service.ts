import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UploadServiceService {
  constructor(private http: HttpClient) {}
  public upload(file: File) {
    return this.http.post('/sc/zyjcs', file);
  }
}
