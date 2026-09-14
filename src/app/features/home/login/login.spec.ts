import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';

describe('Login (minimal)', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>
  beforeEach(async () => {
    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  })

  it('should contain "Email"', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Email')
  })

  it('should have <form>', () => {
    const element: HTMLElement = fixture.nativeElement;
    const form = element.querySelector('form')!;
    expect(form.textContent)
  })

  it('should create', () => {
    expect(component).toBeDefined();
  });
});


