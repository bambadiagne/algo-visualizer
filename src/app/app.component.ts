import { Component, OnInit } from '@angular/core';
import { SortingService } from './services/sorting.service';
import { BarComponent } from './components/bar/bar.component';
import { SortingAlgo, SORTING_ALGOS } from './models/sorting-algo';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BarComponent, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  data: number[] = [];
  private $destroy = new Subject<void>();
  algoList = SORTING_ALGOS;
  algoForm: FormGroup;
  selectedAlgo: SortingAlgo = this.algoList[0];
  marker: number[] = [];
  isSorted = false;
  constructor(
    private sortingService: SortingService,
    private fb: FormBuilder,
  ) {
    document.title = 'Sorting Algorithm Visualizer';
    this.sortingService.seedArray(30);
    this.sortingService.$delay.next(200);
    this.algoForm = this.fb.group({
      selectedAlgo: [this.algoList[0].code],
      delay: [200, [Validators.min(0), Validators.max(1000)]],
      arraySize: [30, [Validators.min(10), Validators.max(1000)]],
    });
    this.algoForm
      .get('selectedAlgo')
      ?.valueChanges.pipe(takeUntil(this.$destroy))
      .subscribe((value) => {
        this.selectedAlgo = this.algoList.find((algo) => algo.code === value)!;
        this.reInit();
      });
    this.algoForm
      .get('delay')
      ?.valueChanges.pipe(takeUntil(this.$destroy))
      .subscribe((value: number) => {
        this.sortingService.$delay.next(value);
      });
    this.algoForm
      .get('arraySize')
      ?.valueChanges.pipe(takeUntil(this.$destroy))
      .subscribe((value: number) => {
        if (value >= 10 && value <= 1000) {
          this.reInit();
        }
      });
  }
  ngOnInit(): void {
    this.sortingService.$arrayData
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.data = [...data];
      });
    this.sortingService.$mark
      .pipe(takeUntil(this.$destroy))
      .subscribe((mark) => {
        this.marker = mark;
      });
    this.sortingService.$isSorted
      .pipe(takeUntil(this.$destroy))
      .subscribe((sorted: boolean) => {
        this.isSorted = sorted;
      });
  }
  sort() {
    this.isSorted = true;
    this.sortingService[this.selectedAlgo.code](this.data);
  }
  reInit() {
    this.sortingService.$break.next(true);
    this.sortingService.seedArray(this.algoForm.get('arraySize')?.value);
    this.isSorted = false;
    this.marker = [];
  }

  stop() {
    this.sortingService.$break.next(true);
    this.marker = [];
    this.isSorted = false;
  }
  onSubmit(e: Event) {
    e.preventDefault();
  }
}
