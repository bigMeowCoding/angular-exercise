import { Component, OnInit } from '@angular/core';
import {makeArr} from '../utils';

@Component({
  selector: 'app-recommend',
  templateUrl: './recommend.component.html',
  styleUrls: ['./recommend.component.scss']
})
export class RecommendComponent implements OnInit {
  public arr: number[];

  constructor() { }

  ngOnInit(): void {
    this.arr = makeArr(100);

  }

}
