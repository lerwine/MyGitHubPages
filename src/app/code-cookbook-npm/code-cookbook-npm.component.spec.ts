import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeCookbookNpmComponent } from './code-cookbook-npm.component';

describe('CodeCookbookNpmComponent', () => {
  let component: CodeCookbookNpmComponent;
  let fixture: ComponentFixture<CodeCookbookNpmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeCookbookNpmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeCookbookNpmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
