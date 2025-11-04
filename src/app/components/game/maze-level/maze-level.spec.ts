import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeLevel } from './maze-level';

describe('MazeLevel', () => {
  let component: MazeLevel;
  let fixture: ComponentFixture<MazeLevel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MazeLevel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MazeLevel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
