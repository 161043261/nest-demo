import { filter, interval, map, Observable, take, of } from 'rxjs';

describe('rxjs', () => {
  // pnpm test src/rxjs.spec.ts -t test1
  it('test1', (done) => {
    const results: number[] = [];

    const observable = new Observable((subscribe) => {
      subscribe.next(1);
      subscribe.next(2);
      subscribe.next(3);

      setTimeout(() => {
        subscribe.next(4);
        subscribe.complete();
      }, 3000);
    });

    observable.subscribe({
      next: (val: number) => results.push(val),
      complete: () => {
        expect(results).toEqual([1, 2, 3, 4]);
        done();
      },
    });
  });

  // pnpm test src/rxjs.spec.ts -t test2
  it('test2', (done) => {
    const results: number[] = [];

    interval(500)
      .pipe(take(5))
      .subscribe({
        next: (val) => results.push(val),
        complete: () => {
          expect(results).toEqual([0, 1, 2, 3, 4]);
          done();
        },
      });
  });

  // pnpm test src/rxjs.spec.ts -t test3
  it('test3', (done) => {
    const results: { score: number }[] = [];

    const observable = interval(500)
      .pipe(
        map((item) => ({ score: item })),
        filter((item) => item.score % 2 == 0),
      )
      .subscribe({
        next: (val) => {
          results.push(val);
          if (val.score === 4) {
            observable.unsubscribe();
            expect(results).toEqual([{ score: 0 }, { score: 2 }, { score: 4 }]);
            done();
          }
        },
      });
  });

  // pnpm test src/rxjs.spec.ts -t test4
  it('test4', (done) => {
    const results: { score: number }[] = [];

    of(0, 1, 2, 3, 4)
      .pipe(
        map((item) => ({ score: item })),
        filter((item) => item.score % 2 == 1),
      )
      .subscribe({
        next: (val) => {
          results.push(val);
        },
        complete: () => {
          expect(results).toEqual([{ score: 1 }, { score: 3 }]);
          done();
        },
      });
  });
});
