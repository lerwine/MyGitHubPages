import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeCookbookComponent } from './code-cookbook.component';

describe('CodeCookbookComponent', () => {
  let component: CodeCookbookComponent;
  let fixture: ComponentFixture<CodeCookbookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeCookbookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeCookbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
