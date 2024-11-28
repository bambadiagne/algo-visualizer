import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SortingService {
  $arrayData: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  $delay: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  $break: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  $mark: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  $isSorted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() {}
  public seedArray(size: number) {
    let array = [];
    for (let i = 0; i < size; i++) {
      array.push(Math.floor(Math.random() * 500) + 1);
    }
    this.$arrayData.next(array);
  }
  delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  public async bubbleSort(array: number[]) {
    this.$break.next(false);
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - 1 - i; j++) {
        if (array[j] > array[j + 1]) {
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
          await this.delay(this.$delay.getValue());
          this.$mark.next([j + 1]);
          if (!this.propageArray(array)) {
            return;
          }
        }
      }
    }
    this.$isSorted.next(true);
    this.$mark.next([]);
  }
  public async insertionSort(array: number[]) {
    this.$break.next(false);
    for (let i = 1; i < array.length; i++) {
      const element = array[i];
      let j = i;
      while (j > 0 && array[j - 1] > element) {
        array[j] = array[j - 1];
        this.$mark.next([j]);
        await this.delay(this.$delay.getValue());
        if (!this.propageArray(array)) {
          this.$break.next(false);
          return;
        }
        j--;
      }
      array[j] = element;
      this.$mark.next([j]);
      await this.delay(this.$delay.getValue());
      if (!this.propageArray(array)) {
        this.$break.next(false);
        return;
      }
    }
    this.$isSorted.next(true);
    this.$mark.next([]);
  }
  public async selectionSort(array: number[]) {
    console.time('selectionSort');
    this.$break.next(false);

    for (let i = 0; i < array.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < array.length; j++) {
        if (array[j] < array[minIndex]) {
          minIndex = j;
        }
      }
      let temp = array[i];
      array[i] = array[minIndex];
      array[minIndex] = temp;
      this.$mark.next([minIndex]);
      await this.delay(this.$delay.getValue());
      if (!this.propageArray(array)) {
        this.$break.next(false);

        return;
      }
    }
    this.$isSorted.next(true);
    this.$mark.next([]);
    console.timeEnd('selectionSort');
  }

  propageArray(array: number[]): boolean {
    if (this.$break.getValue()) {
      return false;
    } else {
      this.$arrayData.next(array);
      return true;
    }
  }

  public async mergeSortWithList(array: number[]) {
    let left: number[] = [];
    let right: number[] = [];
    if (array.length === 1) {
      return array;
    }
    const mid = Math.floor(array.length / 2);

    left = (await this.mergeSortWithList(array.slice(0, mid))) as number[];
    right = (await this.mergeSortWithList(array.slice(mid))) as number[];

    let result = (await this.mergeWithList(left, right)) as number[];
    // this.$arrayData.next(result);
    this.$isSorted.next(true);

    this.$mark.next([]);
    return result;
  }
  public async mergeWithList(
    left: number[],
    right: number[],
  ): Promise<number[] | void> {
    let result: number[] = [];
    if (!left) {
      left = [];
    }
    if (!right) {
      right = [];
    }

    while (left.length > 0 && right.length > 0) {
      if (left[0] < right[0]) {
        result.push(left.shift()!);
      } else {
        result.push(right.shift()!);
      }
      if (!this.propageArray(result)) {
        this.$break.next(false);
        return;
      }
    }
    while (left.length > 0) {
      result.push(left.shift()!);
    }
    while (right.length > 0) {
      result.push(right.shift()!);
    }
    await this.delay(this.$delay.getValue());
    if (!this.propageArray(result)) {
      this.$break.next(false);
      return;
    }
    return result;
  }
  public async mergeSort(array: number[]) {
    this.$break.next(false);

    console.time('mergeSort');
    await this.mergeSortWrapperTopDown(array, 0, array.length, array.slice());
    console.timeEnd('mergeSort');
  }
  public async mergeSortWrapperTopDown(
    B: number[],
    start: number,
    end: number,
    A: number[],
  ) {
    if (end - start <= 1) {
      return;
    }

    const mid = Math.floor((start + end) / 2);
    await this.mergeSortWrapperTopDown(A, start, mid, B);
    await this.mergeSortWrapperTopDown(A, mid, end, B);

    await this.merge(B, start, mid, end, A);
    this.$isSorted.next(true);
    this.$mark.next([]);
  }

  public async merge(
    B: number[],
    start: number,
    mid: number,
    end: number,
    A: number[],
  ) {
    let i = start;
    let j = mid;
    this.markerRange(start, end);

    for (let k = start; k < end; k++) {
      // this.markerRange(i,j);

      if (i < mid && (j >= end || A[i] <= A[j])) {
        B[k] = A[i];
        i++;
      } else {
        B[k] = A[j];
        j++;
      }
      await this.delay(this.$delay.getValue());
      if (!this.propageArray(B)) {
        this.$break.next(false);
        return;
      }
    }
  }
  markerRange(start: number, end: number) {
    let mark = [];
    for (let i = start; i < end; i++) {
      mark.push(i);
    }
    this.$mark.next(mark);
  }
}
