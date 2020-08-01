import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  title = 'angular-exercise';

  navigate(singer: string) {
    this.router.navigate(['./' + singer], {
      relativeTo: this.route,
    });
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService
  ) {}

  ngOnInit(): void {
    this.appService.getData().subscribe((data)=> {
      console.log(data);
    })
  }

}
