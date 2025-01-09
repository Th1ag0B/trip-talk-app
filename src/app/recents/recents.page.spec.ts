import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecentsPage } from './recents.page';

describe('RecentsPage', () => {
  let component: RecentsPage;
  let fixture: ComponentFixture<RecentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
