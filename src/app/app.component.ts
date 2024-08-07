import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

export interface Joke {
  id: number;
  categories: string[];
  joke: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'chuck';
  jokes: Joke[] = [];
  jokesToShow: Joke[];
  filteredJokes: Joke[];
  likedJokes: Joke[] = [];
  categories: string[] = [];
  filterCategories: string[] = [];
  loading = false;
  index: number
  get getJokesToShow() {
    return this.jokesToShow;
  }
  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.http
      .get<{ type: string; value: Joke[] }>('https://api.chucknorris.io/jokes/random')
      .subscribe((res) => {
        this.jokes = [...res.value];
        this.jokesToShow = this.jokes.slice(0, 10);
        this.filteredJokes = this.jokesToShow;
      });
    this.http
      .get<{ type: string; value: string[] }>(
        'https://api.chucknorris.io/jokes/categories'
      )
      .subscribe((res) => {
        this.categories = [...res.value];
        this.filterCategories = [...res.value];
      });
  }
  likeJoke(id: number): void {
    if (this.likedJokes.find((joke) => joke.id === id)) {
      return;
    }
    const likedJoke = this.jokes.find((joke) => joke.id === id);

    this.likedJokes = this.likedJokes.concat(likedJoke);
  }
  dislikeJoke(id: number): void {
    const updatedLikedJokes = this.likedJokes.filter((joke) => joke.id !== id);
    this.likedJokes = updatedLikedJokes;
  }
  renderMoreJokes(val: boolean) {
    if (val === true) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.jokesToShow = this.jokes.slice(0, this.jokesToShow.length + 10);
        this.categories.forEach((category) => {
          this.filterCategory(category);
        });
      }, 500);
    }
  }
  filterCategory(category:string) {
    if (this.filterCategories.includes(category)) {
      const copyOfFilterCategories = [...this.filterCategories];
      const categoryIndex = copyOfFilterCategories.indexOf(category);
      copyOfFilterCategories.splice(categoryIndex, 1);
      this.filterCategories = [...copyOfFilterCategories];
      const newJokesToShow = this.jokesToShow.filter((joke) => {
        if (this.showCategory(joke.categories)) {
          return true;
        } else {
          return false;
        }
      });
      this.filteredJokes = newJokesToShow;
    } else {
      const filterCopy = [...this.filterCategories];
      this.filterCategories = [...filterCopy, category];
      const newJokesToShow = this.jokesToShow.filter((joke) => {
        if (this.showCategory(joke.categories)) {
          return true;
        } else {
          return false;
        }
      });
      this.filteredJokes = newJokesToShow;
    }
  }
  showCategory(categories:string[]) {
    if (categories.length === 0) {
      return true;
    }
    for (let i = 0; i < categories.length; i++) {
      if (this.filterCategories.includes(categories[i])) {
        return true;
      } else {
        return false;
      }
    }
  }
  trackByIndex(index: number): number {
    return index;
  }
}
