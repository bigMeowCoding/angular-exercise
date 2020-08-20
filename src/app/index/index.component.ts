import {Component, OnInit} from '@angular/core';
import {ScrollDataItem} from '../common/interface';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  // 配置
  public COUNT = 10000000;

  // 交互
  public data: ScrollDataItem[] = [];

  constructor() {
  }

  ngOnInit(): void {
    for (let i = 0; i < this.COUNT; i++) {
      this.data.push({
        content: 'item' + i
      });
    }
    this.data = this.data.slice(0);
  }

}
