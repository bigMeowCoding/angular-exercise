import { Component, OnInit } from '@angular/core';
import {makeArr} from '../utils';

@Component({
  selector: 'app-singer',
  templateUrl: './singer.component.html',
  styleUrls: ['./singer.component.scss']
})
export class SingerComponent implements OnInit {
  arr = []
  constructor() { }

  ngOnInit(): void {
    this.arr = makeArr(10000);
  }

}
