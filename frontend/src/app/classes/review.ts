export class Review {
  name: string;
  title: string;
  stars: number;
  content: string;

  constructor(name: string, title: string, stars: number, content: string) {
    this.name = name;
    this.title = title;
    this.stars = stars;
    this.content = content;
  }
}
