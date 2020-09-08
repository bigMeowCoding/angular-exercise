import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLineTestComponent } from './time-line-test.component';

describe('TimeLineTestComponent', () => {
  let component: TimeLineTestComponent;
  let fixture: ComponentFixture<TimeLineTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeLineTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLineTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
