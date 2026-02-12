import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';

@Component({
  selector: 'app-landig-page',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
  ],
  templateUrl: './landig-page.html',
  styleUrl: './landig-page.scss',
})
export class LandigPage {

}
