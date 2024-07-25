import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Joke } from './app.component';
import { JokeCardComponent } from './joke-card.component';

describe('JokeCardComponent', () => {
  let component: JokeCardComponent;
  let fixture: ComponentFixture<JokeCardComponent>;
  let mockJoke: Joke;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JokeCardComponent],
      imports: [
        MatCardModule,
        MatButtonModule,
        MatChipsModule,
        NoopAnimationsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JokeCardComponent);
    component = fixture.componentInstance;
    mockJoke = {
      id: 1,
      joke: 'This is a test joke.',
      categories: ['test']
    };
    component.joke = mockJoke;
    component.index = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the joke', () => {
    const jokeElement = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(jokeElement.textContent).toContain(mockJoke.joke);
  });

  it('should display categories if they exist', () => {
    const categoryElements = fixture.debugElement.queryAll(By.css('mat-chip-option'));
    expect(categoryElements.length).toBe(mockJoke.categories.length);
    expect(categoryElements[0].nativeElement.textContent).toContain(mockJoke.categories[0]);
  });

  it('should display "regular" if no categories exist', () => {
    component.joke.categories = [];
    fixture.detectChanges();
    const regularChip = fixture.debugElement.query(By.css('mat-chip')).nativeElement;
    expect(regularChip.textContent).toContain('regular');
  });

  it('should emit jokeLiked event when like button is clicked', () => {
    spyOn(component.jokeLiked, 'emit');
    const likeButton = fixture.debugElement.query(By.css('button[color="primary"]')).nativeElement;
    likeButton.click();
    expect(component.jokeLiked.emit).toHaveBeenCalledWith(mockJoke.id);
  });

  it('should emit jokeDislaked event when dislike button is clicked', () => {
    spyOn(component.jokeDisliked, 'emit');
    const dislikeButton = fixture.debugElement.query(By.css('button[color="warn"]')).nativeElement;
    dislikeButton.click();
    expect(component.jokeDisliked.emit).toHaveBeenCalledWith(mockJoke.id);
  });

  it('should emit showMoreJokes event when showMore is called', () => {
    spyOn(component.showMoreJokes, 'emit');
    component.showMore(true);
    expect(component.showMoreJokes.emit).toHaveBeenCalledWith(true);
  });
});
