import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChestDialog } from './chest-dialog';

describe('ChestDialog', () => {
  let component: ChestDialog;
  let fixture: ComponentFixture<ChestDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChestDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChestDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
