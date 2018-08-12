import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeCookbookHomeComponent } from './code-cookbook-home.component';

describe('CodeCookbookHomeComponent', () => {
  let component: CodeCookbookHomeComponent;
  let fixture: ComponentFixture<CodeCookbookHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeCookbookHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeCookbookHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
