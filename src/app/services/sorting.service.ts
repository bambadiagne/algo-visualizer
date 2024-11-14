import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SortingService {
  $arrayData: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  $delay: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  $break: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
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
    let array = this.$arrayData.getValue();
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - 1 - i; j++) {
        if (array[j] > array[j + 1]) {
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
          await this.delay(this.$delay.getValue());
          this.$arrayData.next(array);
        }
        if (this.$break.getValue()) {
          this.$break.next(false);
          return;
        }
      }
    }
  }

  public async selectionSort() {
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
      await this.delay(this.$delay.getValue());
      this.$arrayData.next(array);
      if (this.$break.getValue()) {
        this.$break.next(false);
        return;
      }
    }
  }
}
