import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcrpageComponent } from './ocrpage.component';

describe('OcrpageComponent', () => {
  let component: OcrpageComponent;
  let fixture: ComponentFixture<OcrpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OcrpageComponent]
    });
    fixture = TestBed.createComponent(OcrpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
