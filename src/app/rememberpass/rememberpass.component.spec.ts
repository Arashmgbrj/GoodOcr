import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RememberpassComponent } from './rememberpass.component';

describe('RememberpassComponent', () => {
  let component: RememberpassComponent;
  let fixture: ComponentFixture<RememberpassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RememberpassComponent]
    });
    fixture = TestBed.createComponent(RememberpassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
