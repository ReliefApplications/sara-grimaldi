import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import organisations from '../../../.generated/content/collections/organisations.json';
import { OrganisationMark } from './organisation-mark';

describe('OrganisationMark', () => {
  async function render(name: string): Promise<HTMLElement> {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(OrganisationMark);
    fixture.componentRef.setInput('name', name);
    await fixture.whenStable();
    TestBed.inject(HttpTestingController)
      .expectOne('content/collections/organisations.json')
      .flush(organisations);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the logo of an organisation found by name or alias', async () => {
    const mark = await render('Universal');
    const image = mark.querySelector('img');
    expect(image?.getAttribute('src')).toBe('content/images/logos/universal-music.webp');
    expect(image?.getAttribute('alt')).toBe('Logo Universal Music');
    expect(mark.querySelector('.name')).toBeNull();
  });

  it('falls back to the name in text when there is no logo', async () => {
    const mark = await render('Barilla');
    expect(mark.querySelector('img')).toBeNull();
    expect(mark.textContent?.trim()).toBe('Barilla');
  });
});
