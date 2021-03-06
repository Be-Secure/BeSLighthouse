/* Placeholder for Copyright */

import { Observable, Subject } from "rxjs"
import {
  filter,
  finalize,
  map,
  mapTo,
  mergeWith,
  tap
} from "rxjs/operators"

import { Component } from "../../_"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Details
 */
export interface Details {}

/* ----------------------------------------------------------------------------
 * Helper types
 * ------------------------------------------------------------------------- */

/**
 * Watch options
 */
interface WatchOptions {
  target$: Observable<HTMLElement>     /* Location target observable */
  print$: Observable<void>             /* Print mode observable */
}

/**
 * Mount options
 */
interface MountOptions {
  target$: Observable<HTMLElement>     /* Location target observable */
  print$: Observable<void>             /* Print mode observable */
}

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Watch details
 *
 * @param el - Details element
 * @param options - Options
 *
 * @returns Details observable
 */
export function watchDetails(
  el: HTMLDetailsElement, { target$, print$ }: WatchOptions
): Observable<Details> {
  return target$
    .pipe(
      map(target => target.closest("details:not([open])")!),
      filter(details => el === details),
      mergeWith(print$),
      mapTo(el)
    )
}

/**
 * Mount details
 *
 * This function ensures that `details` tags are opened on anchor jumps and
 * prior to printing, so the whole content of the page is visible.
 *
 * @param el - Details element
 * @param options - Options
 *
 * @returns Details component observable
 */
export function mountDetails(
  el: HTMLDetailsElement, options: MountOptions
): Observable<Component<Details>> {
  const internal$ = new Subject<Details>()
  internal$.subscribe(() => {
    el.setAttribute("open", "")
    el.scrollIntoView()
  })

  /* Create and return component */
  return watchDetails(el, options)
    .pipe(
      tap(internal$),
      finalize(() => internal$.complete()),
      mapTo({ ref: el })
    )
}
