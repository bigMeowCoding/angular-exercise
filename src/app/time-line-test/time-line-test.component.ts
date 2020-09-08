import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-time-line-test',
  templateUrl: './time-line-test.component.html',
  styleUrls: ['./time-line-test.component.scss'],
})
export class TimeLineTestComponent implements OnInit, AfterViewInit {
  @ViewChild('box', { read: ElementRef }) boxEl: ElementRef<any>;
  data: any;
  constructor() {}
  private makeData() {
    const arr = [];
    for (let i = 0; i < 100; i++) {
      arr.push(i);
    }
    return arr;
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.data = this.makeData();
      setTimeout(() => {
        this.boxEl.nativeElement.scrollTo(0, 420);
      });
    }, 3000);
  }

  ngAfterViewInit(): void {
    // console.log(this.boxEl);
    this.boxEl.nativeElement.scrollTo(0, 420);

    // this.boxEl.nativeElement.scollTop = 420;
  }

  scoll() {
    this.boxEl.nativeElement.scrollTop = 420;
    // console.log(this.boxEl.nativeElement);
  }
}
