import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SortingService {
  $arrayData: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  $delay: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  $break: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  $mark: BehaviorSubject<number> = new BehaviorSubject<number>(0);
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

  public async bubbleSort() {
    this.$break.next(false);
    let array = this.$arrayData.getValue();
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - 1 - i; j++) {
        if (array[j] > array[j + 1]) {
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
          await this.delay(this.$delay.getValue());
          this.$mark.next(j + 1);
          if (!this.propageArray(array)) {
            return;
          }
        }
      }
    }
    this.$isSorted.next(true);
    this.$mark.next(-1);
  }

  public async selectionSort() {
    this.$break.next(false);

    let array = this.$arrayData.getValue();
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
      this.$mark.next(minIndex);
      await this.delay(this.$delay.getValue());
      if (!this.propageArray(array)) {
        this.$break.next(false);

        return;
      }
    }
    this.$isSorted.next(true);
    this.$mark.next(-1);
  }

  propageArray(array: number[]): boolean {
    if (this.$break.getValue()) {
      return false;
    } else {
      this.$arrayData.next(array);
      return true;
    }
  }
}
