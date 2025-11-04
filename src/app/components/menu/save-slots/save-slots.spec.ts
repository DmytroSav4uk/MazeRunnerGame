import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveSlots } from './save-slots';

describe('SaveSlots', () => {
  let component: SaveSlots;
  let fixture: ComponentFixture<SaveSlots>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveSlots]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveSlots);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
