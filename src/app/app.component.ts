import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  title = 'chuch';
  jokes: Joke[] = [];
  jokesToShow: Joke[];
  filteredJokes: Joke[];
  likedJokes: Joke[] = [];
  categories: string[] = [];
  filterCategories: string[] = [];
  loading = false;
  index;
  get getJokesToShow() {
    return this.jokesToShow;
  }
  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.http
      .get<{ type: string; value: Joke[] }>('http://api.icndb.com/jokes')
      .subscribe((res) => {
        this.jokes = [...res.value];
        this.jokesToShow = this.jokes.slice(0, 10);
        this.filteredJokes = this.jokesToShow;
      });
    this.http
      .get<{ type: string; value: string[] }>(
        'https://api.icndb.com/categories'
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
  filterCategory(category) {
    if (this.filterCategories.includes(category)) {
      const copyOfFilterCategories = [...this.filterCategories];
      const categoryIndex = copyOfFilterCategories.indexOf(category);
      copyOfFilterCategories.splice(categoryIndex, 1);
      this.filterCategories = [...copyOfFilterCategories];
      const newJokestoShow = this.jokesToShow.filter((joke) => {
        if (this.showCategory(joke.categories)) {
          return true;
        } else {
          return false;
        }
      });
      this.filteredJokes = newJokestoShow;
    } else {
      const filterCopy = [...this.filterCategories];
      this.filterCategories = [...filterCopy, category];
      const newJokestoShow = this.jokesToShow.filter((joke) => {
        if (this.showCategory(joke.categories)) {
          return true;
        } else {
          return false;
        }
      });
      this.filteredJokes = newJokestoShow;
    }
  }
  showCategory(categories) {
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
  trackByIndex(index: number): any {
    return index;
  }
}
