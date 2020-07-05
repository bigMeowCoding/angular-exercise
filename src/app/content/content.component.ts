import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less']
})
export class ContentComponent implements OnInit, AfterViewInit {
  @ViewChild('footer')
  footerEl: ElementRef;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const footerElement = this.footerEl.nativeElement;
    const observer = new IntersectionObserver(([entry]) => {
      console.log(entry);
      // this.observe$.next();
    }, {});

    observer.observe(footerElement);
  }

}
