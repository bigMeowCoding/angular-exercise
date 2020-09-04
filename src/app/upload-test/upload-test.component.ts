import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-test',
  templateUrl: './upload-test.component.html',
  styleUrls: ['./upload-test.component.scss'],
})
export class UploadTestComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    document.getElementById('upload').addEventListener('change', () => {
      console.time('use');

      const start = new Date().getTime();
      console.log('start', start);

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

      const all = allFiles.length;
      let index = 0;
      console.log('all', all);

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
        document.body.appendChild(img);
        img.onerror = () => {
          console.log('error', file);
          console.log('end', new Date().getTime() - start);
        };
        img.onload = () => {
          // console.log(img.naturalWidth, img.naturalHeight);
          console.log('end', new Date().getTime() - start);
        };
        index++;
        if (index >= all) {
          // @ts-ignore
          console.timeEnd('use');
        } else {
          loopLoad();
        }
      }

      loopLoad();
      //   .forEach((file) => {
      //     const img = document.createElement("img");
      //     var fr = new FileReader();
      //     fr.onload = function () {
      //       img.src = this.result;
      //       div.appendChild(img);
      //       document.body.appendChild(div);
      //     };
      //     fr.readAsDataURL(value);
      //     div.textContent = file.webkitRelativePath || file.name;
      //     document.getElementById("preview").appendChild(img);
      //   });
    });
  }
}
