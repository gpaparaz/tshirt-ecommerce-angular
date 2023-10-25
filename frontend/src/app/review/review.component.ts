import { Component, Input } from '@angular/core';
import { Review } from '../classes/review';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {

  @Input() name: string = '';
  @Input() numberOfStars: number = 0;
  @Input() title: string = '';
  @Input() content:string = '';


}
