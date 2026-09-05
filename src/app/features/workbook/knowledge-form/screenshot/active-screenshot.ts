import { Service, signal } from '@angular/core';

@Service()
export class ActiveScreenshot {

    activeScreenshot = signal<number|null>(null)


}
