import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleLevel } from './battle-level';

describe('BattleLevel', () => {
  let component: BattleLevel;
  let fixture: ComponentFixture<BattleLevel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattleLevel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BattleLevel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
