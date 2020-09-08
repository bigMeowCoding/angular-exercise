import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UploadFile, UploadXHRArgs, ZipButtonOptions } from 'ng-zorro-antd';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

@Component({
  selector: '[app-upload-button]',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss'],
})
export class UploadButtonComponent implements OnInit, OnChanges, OnDestroy {
  reqs: { [key: string]: Subscription } = {};
  private inited = false;
  private destroy = false;
  // region: styles
  private prefixCls = 'ant-upload';
  @ViewChild('file') file: ElementRef;
  @ViewChild('box') box: ElementRef;

  // region: fields
  @Input() classes: {} = {};
  @Input() options: ZipButtonOptions = {};
  @Output()
  uploadChange = new EventEmitter<FileList>();
  // endregion
  private start: number;
  @HostListener('click')
  onClick(): void {
    console.log('click');
    // if (this.options.disabled) {
    //   return;
    // }
    (this.file.nativeElement as HTMLInputElement).click();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (this.options.disabled) {
      return;
    }
    if (e.key === 'Enter') {
      this.onClick();
    }
  }

  @HostListener('drop', ['$event'])
  @HostListener('dragover', ['$event'])
  onFileDrop(e: DragEvent): void {
    if (this.options.disabled || e.type === 'dragover') {
      e.preventDefault();
      return;
    }
    if (this.options.directory) {
      this.traverseFileTree(e.dataTransfer.items);
    } else {
      const files: File[] = Array.prototype.slice
        .call(e.dataTransfer.files)
        .filter((file: File) => this.attrAccept(file, this.options.accept));
      if (files.length) {
        this.uploadFiles(files);
      }
    }

    e.preventDefault();
  }

  onChange(e: Event): void {
    if (this.options.disabled) {
      return;
    }
    this.start = new Date().getTime();
    const hie = e.target as HTMLInputElement;
    const files = Array.from(hie.files).filter((file) => {
      // @ts-ignore
      const name = (file.webkitRelativePath || file.name).toLowerCase();

      return (
        name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg')
      );
    });
    console.log(files.length);
    this.loopLoad(files).then(
      (data) => {
        console.log(data);
        console.log((new Date().getTime() - this.start) / 1000);
      },
      (error) => {
        console.error(error);
      }
    );
    // this.uploadChange.emit(JSON.parse(JSON.stringify(hie.files)));
    // this.uploadFiles(hie.files);
    hie.value = '';
  }
  public async loopLoad(files: File[], count = 1000): Promise<boolean[]> {
    if (files.length <= count) {
      return this.batchLoadImages(files).catch((error) => {
        throw error;
      });
    } else {
      const data = await this.batchLoadImages(
        files.slice(0, count)
      ).catch((error) => {
        throw error;
      });
      return this.loopLoad(files.slice(count)).then(
        (result) => {
          return data.concat(result);
        },
        (error) => {
          throw error;
        }
      );
    }
  }

  public batchLoadImages(files: File[]): Promise<boolean[]> {
    const promises: Promise<boolean>[] = [];
    for (let i = 0; i < files.length; i++) {
      promises.push(this.loadImg(files[i]));
    }
    return new Promise((resolve, reject) => {
      Promise.all(promises).then(
        (data) => {
          resolve(data);
        },
        (error) => {
          console.error(error);
          reject(error);
        }
      );
    });
  }
  private loadImg(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');

      img.src = window.URL.createObjectURL(file);
      // document.body.appendChild(img);
      img.onerror = (e) => {
        reject(e);
      };
      img.onload = () => {
        // console.log(img.naturalWidth, img.naturalHeight);
        resolve(img.naturalWidth >= 200);
      };
    });
  }
  // tslint:disable-next-line:no-any
  private traverseFileTree(files: any): void {
    // tslint:disable-next-line:no-any variable-name
    const _traverseFileTree = (item: any, path: string) => {
      if (item.isFile) {
        item.file((file) => {
          if (this.attrAccept(file, this.options.accept)) {
            this.uploadFiles([file]);
          }
        });
      } else if (item.isDirectory) {
        const dirReader = item.createReader();

        dirReader.readEntries((entries) => {
          for (const entrieItem of entries) {
            _traverseFileTree(entrieItem, `${path}${item.name}/`);
          }
        });
      }
    };
    for (const file of files) {
      _traverseFileTree(file.webkitGetAsEntry(), '');
    }
  }

  private attrAccept(file: File, acceptedFiles: string | string[]): boolean {
    if (file && acceptedFiles) {
      const acceptedFilesArray = Array.isArray(acceptedFiles)
        ? acceptedFiles
        : acceptedFiles.split(',');
      const fileName = '' + file.name;
      const mimeType = '' + file.type;
      const baseMimeType = mimeType.replace(/\/.*$/, '');

      return acceptedFilesArray.some((type) => {
        const validType = type.trim();
        if (validType.charAt(0) === '.') {
          return (
            fileName
              .toLowerCase()
              .indexOf(
                validType.toLowerCase(),
                fileName.toLowerCase().length - validType.toLowerCase().length
              ) !== -1
          );
        } else if (/\/\*$/.test(validType)) {
          // This is something like a image/* mime type
          return baseMimeType === validType.replace(/\/.*$/, '');
        }
        return mimeType === validType;
      });
    }
    return true;
  }

  private attachUid(file: UploadFile): UploadFile {
    if (!file.uid) {
      file.uid = Math.random().toString(36).substring(2);
    }
    return file;
  }

  uploadFiles(fileList: FileList | File[]): void {
    console.log(fileList);
    // let postFiles: UploadFile[] = Array.prototype.slice.call(fileList);
    // this.options.filters.forEach((f) => (postFiles = f.fn(postFiles)));
    // postFiles.forEach((file: UploadFile) => {
    //   this.attachUid(file);
    //   this.upload(file, postFiles);
    // });
  }

  private upload(file: UploadFile, fileList: UploadFile[]): void {
    if (!this.options.beforeUpload) {
      return this.post(file);
    }
    const before = this.options.beforeUpload(file, fileList);
    if (before instanceof Observable) {
      before.subscribe((processedFile: UploadFile) => {
        const processedFileType = Object.prototype.toString.call(processedFile);
        if (
          processedFileType === '[object File]' ||
          processedFileType === '[object Blob]'
        ) {
          this.attachUid(processedFile);
          this.post(processedFile);
        } else if (
          typeof processedFile === 'boolean' &&
          processedFile !== false
        ) {
          this.post(file);
        }
      });
    } else if (before !== false) {
      return this.post(file);
    }
  }

  private post(file: UploadFile): void {
    // if (this.destroy) {
    //   return;
    // }
    // const opt = this.options;
    // const { uid } = file;
    // let { data, headers } = opt;
    // if (typeof data === 'function') {
    //   data = data(file);
    // }
    // if (typeof headers === 'function') {
    //   headers = headers(file);
    // }
    // const args: UploadXHRArgs = {
    //   action: opt.action,
    //   name: opt.name,
    //   headers,
    //   file,
    //   data,
    //   withCredentials: opt.withCredentials,
    //   onProgress: opt.onProgress
    //     ? (e) => {
    //         opt.onProgress(e, file);
    //       }
    //     : null,
    //   onSuccess: (ret, xhr) => {
    //     delete this.reqs[uid];
    //     opt.onSuccess(ret, file, xhr);
    //   },
    //   onError: (xhr) => {
    //     delete this.reqs[uid];
    //     opt.onError(xhr, file);
    //   },
    // };
    // this.reqs[uid] = (opt.customRequest || this.xhr).call(this, args);
    // opt.onStart(file);
  }

  private xhr(args: UploadXHRArgs): Subscription {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    formData.append(args.name, args.file as any);
    if (args.data) {
      Object.keys(args.data).map((key) => {
        formData.append(key, args.data[key]);
      });
    }
    if (!args.headers) {
      args.headers = {};
    }
    if (args.headers['X-Requested-With'] !== null) {
      args.headers['X-Requested-With'] = `XMLHttpRequest`;
    } else {
      delete args.headers['X-Requested-With'];
    }
    const req = new HttpRequest('POST', args.action, formData, {
      reportProgress: true,
      withCredentials: args.withCredentials,
      headers: new HttpHeaders(args.headers),
    });
    return this.http.request(req).subscribe(
      (event: HttpEvent<{}>) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total > 0) {
            // tslint:disable-next-line:no-any
            (event as any).percent = (event.loaded / event.total) * 100;
          }
          args.onProgress(event, args.file);
        } else if (event instanceof HttpResponse) {
          args.onSuccess(event.body, args.file, event);
        }
      },
      (err) => {
        this.abort(args.file);
        args.onError(err, args.file);
      }
    );
  }

  abort(file?: UploadFile): void {
    if (file) {
      const uid = file && file.uid;
      if (this.reqs[uid]) {
        this.reqs[uid].unsubscribe();
        delete this.reqs[uid];
      }
    } else {
      Object.keys(this.reqs).forEach((uid) => {
        this.reqs[uid].unsubscribe();
        delete this.reqs[uid];
      });
    }
  }

  setClassMap(): void {
    const classMap = {
      [this.prefixCls]: true,
      [`${this.prefixCls}-disabled`]: this.options.disabled,
      ...this.classes,
    };
    // this.updateHostClassService.updateHostClass(
    //   this.el.nativeElement,
    //   classMap
    // );
    this.cd.detectChanges();
  }

  // endregion
  constructor(
    @Optional() private http: HttpClient,
    private el: ElementRef,
    private cd: ChangeDetectorRef
  ) {
    if (!http) {
      throw new Error(
        `Not found 'HttpClient', You can import 'HttpClientModule' in your root module.`
      );
    }
  }

  ngOnInit(): void {
    this.inited = true;
    // this.setClassMap();
  }

  ngOnChanges(
    changes: { [P in keyof this]?: SimpleChange } & SimpleChanges
  ): void {
    if (this.inited) {
      this.setClassMap();
    }
  }

  ngOnDestroy(): void {
    this.destroy = true;
    this.abort();
  }
}
