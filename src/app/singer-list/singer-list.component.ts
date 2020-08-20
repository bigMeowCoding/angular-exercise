import { Component, OnDestroy, OnInit } from '@angular/core';
import { makeArr } from '../utils';

@Component({
  selector: 'app-singer-list',
  templateUrl: './singer-list.component.html',
  styleUrls: ['./singer-list.component.scss'],
})
export class SingerListComponent implements OnInit, OnDestroy {
  constructor() {}
  arr = [];
  ngOnInit(): void {
    this.arr = makeArr(100000);
  }

  ngOnDestroy(): void {
    this.arr = null;
  }
}
