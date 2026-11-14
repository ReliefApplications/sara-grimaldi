import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import organisations from '../../../.generated/content/collections/organisations.json';
import { Logo } from './logo';

describe('Logo', () => {
  async function render(name: string, decorative = false): Promise<HTMLElement> {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(Logo);
    fixture.componentRef.setInput('name', name);
    fixture.componentRef.setInput('size', 'grid');
    fixture.componentRef.setInput('decorative', decorative);
    await fixture.whenStable();
    TestBed.inject(HttpTestingController)
      .expectOne('content/collections/organisations.json')
      .flush(organisations);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the logo of an organisation found by name or alias, named by its name', async () => {
    const mark = await render('Universal');
    const image = mark.querySelector('img');
    expect(image?.getAttribute('src')).toBe('content/images/logos/universal-music.webp');
    expect(image?.getAttribute('alt')).toBe('Universal Music');
    expect(mark.querySelector('.name')).toBeNull();
  });

  it('falls back to the name in text when there is no logo', async () => {
    const mark = await render('Barilla');
    expect(mark.querySelector('img')).toBeNull();
    expect(mark.textContent?.trim()).toBe('Barilla');
  });

  it('has an empty description when it only repeats another logo', async () => {
    const mark = await render('ELLE', true);
    expect(mark.querySelector('img')?.getAttribute('alt')).toBe('');
  });
});
