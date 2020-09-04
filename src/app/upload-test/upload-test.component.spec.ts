import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTestComponent } from './upload-test.component';

describe('UploadTestComponent', () => {
  let component: UploadTestComponent;
  let fixture: ComponentFixture<UploadTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
