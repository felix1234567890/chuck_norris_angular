import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Joke } from './app.component';

@Component({
  selector: 'app-joke-card',
  styles: [],
  template: `
    <mat-card
      style="margin-bottom: 20px;"
      id="{{ 'joke-' + index }}"
      [appIntersectionObserver]="position"
      (appIntersectionObserver)="showMore($event)"
    >
      <mat-card-content style="padding-bottom: 5px;">
        <div *ngIf="joke.categories.length > 0; else noCategories">
          <mat-chip-listbox *ngFor="let category of joke.categories">
            <mat-chip-option>{{ category }}</mat-chip-option>
          </mat-chip-listbox>
        </div>
        <ng-template #noCategories><mat-chip>regular</mat-chip> </ng-template>

        <p class="mat-body-1">{{ joke.joke }}</p>
      </mat-card-content>
      <mat-card-actions style="padding: 16px;">
        <button mat-raised-button color="primary" (click)="likeJoke(joke.id)">
          Like
        </button>
        <button mat-raised-button color="warn" (click)="dislikeJoke(joke.id)">
          Dislike
        </button>
      </mat-card-actions>
    </mat-card>
  `,
})
export class JokeCardComponent {
  @Input() position;
  @Input() joke: Joke;
  @Input() index: number;
  @Output()
  jokeLiked = new EventEmitter();
  @Output()
  jokeDisliked = new EventEmitter();
  @Output()
  showMoreJokes = new EventEmitter<boolean>();

  likeJoke(id) {
    this.jokeLiked.emit(id);
  }
  dislikeJoke(id) {
    this.jokeDisliked.emit(id);
  }
  showMore(val) {
    this.showMoreJokes.emit(val);
  }
}
