import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { share, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private cache: Map<string, CacheObject<any>> = new Map();

  constructor() { }

  public invalidateCache(key: string): boolean {
    if (!this.cache.has(key)) return false;

    return this.cache.delete(key);
  }

  public getOrAdd<T>(key: string, reqObs: Observable<T>, refresh?: boolean): Observable<T> {

    if (this.cache.has(key) && !refresh)
      return of(this.cache.get(key).data);

    let replay = new Subject<T>();

    reqObs.pipe(share()).subscribe(
      req => {

        this.cache.set(key, { data: req, observer: reqObs });

        replay.next(req);
      },
      err => {
        replay.error(err);

        this.cache.delete(key);
      });

    return replay;

  }
}

interface CacheObject<T> {
  data: T;
  observer: Observable<T>;
}
