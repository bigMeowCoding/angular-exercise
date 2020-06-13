import {AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ScrollDataItem} from '../common/interface';
import {fromEvent} from 'rxjs';
import {parseSizeAttr} from '../common/utils';
import {debounceTime, filter, map, tap} from 'rxjs/operators';

@Component({
  selector: 'app-virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.scss']
})
export class VirtualScrollComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('box')
  boxEl: ElementRef;
  @Input()
  data: ScrollDataItem[];
  @Input()
  itemHeight = '34px';
  @Input()
  boxHeight = parseSizeAttr(this.itemHeight) * 10 + 'px';
  @Input()
  visibleCount = 10;
  @Input()
  previewRenderCount = 50;
  // 交互
  public contentHeight = null;
  public visibleData: ScrollDataItem[] = [];
  transform = null;
  private oldScrollTop: number = null;

  constructor() {
  }

  ngOnInit(): void {
    this.visibleData = this.makeVisibleData(0);
  }

  ngAfterViewInit(): void {
    fromEvent(this.boxEl.nativeElement, 'scroll').pipe(
      filter((e: Event) => {
        const boxElement: any = e.target;
        const scrollTop = boxElement.scrollTop;
        return scrollTop !== this.oldScrollTop;
      }),
      tap((e) => {
        const boxElement: any = e.target;
        this.oldScrollTop = boxElement.scrollTop;
      })
    )
      .subscribe((e: Event) => {
        this.renderVisible(e.target);
      });

  }

  private renderVisible(boxElement) {
    if (!boxElement) {
      return;
    }
    const scrollTop = boxElement.scrollTop;
    this.visibleData = this.makeVisibleData(scrollTop);
  }

  private makeVisibleData(scrollTop: number) {
    let startIndex = (scrollTop / parseSizeAttr(this.itemHeight)) - this.previewRenderCount;
    startIndex = Math.max(startIndex, 0);
    let renderCount = this.visibleCount + 2 * this.previewRenderCount;
    renderCount = Math.min(renderCount, this.data.length);
    this.transform = `translateY(${(startIndex * parseSizeAttr(this.itemHeight)) + 'px'})`;
    return this.data.slice(startIndex, startIndex + renderCount);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {data} = changes;
    if (data) {
      const dataValue = data.currentValue;
      if (!Array.isArray(dataValue)) {
        return;
      }
      this.contentHeight = dataValue.length * parseSizeAttr(this.itemHeight) + 'px';
    }
  }
}
