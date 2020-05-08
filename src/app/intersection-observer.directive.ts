import {
  OnInit,
  OnDestroy,
  Directive,
  Output,
  EventEmitter,
  ElementRef,
  Input,
} from '@angular/core';

@Directive({
  selector: '[appIntersectionObserver]',
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {
  @Input('appIntersectionObserver') position;
  @Output('appIntersectionObserver') public showMore: EventEmitter<
    any
  > = new EventEmitter();
  private intersectionObserver: IntersectionObserver;
  constructor(private element: ElementRef) {}
  ngOnDestroy(): void {
    this.intersectionObserver.disconnect();
  }
  ngOnInit(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === `joke-${this.position}`) {
            if (entry.isIntersecting === true) {
              this.showMore.emit(true);
              this.intersectionObserver.unobserve(this.element.nativeElement);
            }
          }
        });
      },
      {
        threshold: 1,
      }
    );
    this.intersectionObserver.observe(this.element.nativeElement);
  }
}
