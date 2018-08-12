import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeCookbookVsCodeComponent } from './code-cookbook-vs-code.component';

describe('CodeCookbookVsCodeComponent', () => {
  let component: CodeCookbookVsCodeComponent;
  let fixture: ComponentFixture<CodeCookbookVsCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeCookbookVsCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeCookbookVsCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
