import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDialog } from './inventory-dialog';

describe('InventoryDialog', () => {
  let component: InventoryDialog;
  let fixture: ComponentFixture<InventoryDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
