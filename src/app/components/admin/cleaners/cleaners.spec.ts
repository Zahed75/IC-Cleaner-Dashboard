import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cleaners } from './cleaners';

describe('Cleaners', () => {
  let component: Cleaners;
  let fixture: ComponentFixture<Cleaners>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cleaners]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cleaners);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
