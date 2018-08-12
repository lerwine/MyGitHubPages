import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeCookbookGitComponent } from './code-cookbook-git.component';

describe('CodeCookbookGitComponent', () => {
  let component: CodeCookbookGitComponent;
  let fixture: ComponentFixture<CodeCookbookGitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeCookbookGitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeCookbookGitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
