import { Component, OnInit } from '@angular/core';
import { UploadChangeParam, UploadFile, ZipButtonOptions } from 'ng-zorro-antd';
import { UploadServiceService } from './upload-service.service';

@Component({
  selector: 'app-upload-test',
  templateUrl: './upload-test.component.html',
  styleUrls: ['./upload-test.component.scss'],
})
export class UploadTestComponent implements OnInit {
  fileList: File[] = [];

  constructor(private service: UploadServiceService) {}

  ngOnInit(): void {}
  private listenInputLoad() {
    document.getElementById('upload').addEventListener('change', () => {
      const start = new Date().getTime();
      const allFiles = Array.from(
        // @ts-ignore
        document.getElementById('upload').files
      ).filter((file) => {
        // @ts-ignore
        const name = (file.webkitRelativePath || file.name).toLowerCase();

        return (
          name.endsWith('.png') ||
          name.endsWith('.jpg') ||
          name.endsWith('.jpeg')
        );
      });
      console.log(allFiles);
      const len = allFiles.length;
      let index = 0;
      function loopLoad() {
        const file = allFiles[index];
        const img = document.createElement('img');
        //   var fr = new FileReader();
        //   fr.onload = function () {
        //     img.src = this.result;
        //     document.body.appendChild(img);
        //   };
        //   fr.readAsDataURL(file);

        img.src = window.URL.createObjectURL(file);
        // document.body.appendChild(img);
        img.onerror = () => {
          console.log('error', file);
          console.log('end', new Date().getTime() - start);
        };
        img.onload = () => {
          // console.log(img.naturalWidth, img.naturalHeight);
          console.log('end', new Date().getTime() - start);
        };
        index++;
        if (index >= len) {
          // @ts-ignore
          console.timeEnd('use');
        } else {
          loopLoad();
        }
      }

      loopLoad();
    });
  }

  // public beforeUpload = (file: File) => {
  //   console.log(file);
  //   if (
  //     file.name.endsWith('.png') ||
  //     file.name.endsWith('.jpg') ||
  //     file.name.endsWith('.jpeg')
  //   ) {
  //     if (!this.fileList) {
  //       this.fileList = [file];
  //     } else {
  //       this.fileList.push(file);
  //     }
  //     return true;
  //   }
  //   return false;
  // };
  options: ZipButtonOptions = {
    directory: true,
  };

  clickButton() {
    console.log(this.fileList);
    const fr = new FileReader();
    const fd = new FormData();
    // @ts-ignore
    fr.readAsDataURL(this.fileList[0] as any);
    // fd.append('file', this.fileList[0]);
    fr.onload = (data) => {
      // @ts-ignore
      this.service.upload(fr.result).subscribe(
        (a) => {
          console.log(a);
        },
        (error) => {
          console.error(error);
        }
      );
    };
  }

  uploadChange(e: UploadChangeParam) {
    console.log(e);
  }
}
