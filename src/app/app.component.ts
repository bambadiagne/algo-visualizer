import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SortingService } from './services/sorting.service';
import { BarComponent } from './components/bar/bar.component';
import { SortingAlgo, SORTING_ALGOS } from './models/sorting-algo';
import {
  FormBuilder,
  FormControl,
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

  constructor(
    private sortingService: SortingService,
    private fb: FormBuilder,
  ) {
    document.title = 'Sorting Algorithm Visualizer';
    this.sortingService.seedArray(30);
    this.sortingService.$delay.next(300);
    this.algoForm = this.fb.group({
      selectedAlgo: [this.algoList[0].code],
      delay: [300, [Validators.min(0), Validators.max(1000)]],
      arraySize: [30, [Validators.min(2), Validators.max(100)]],
    });
    this.algoForm
      .get('selectedAlgo')
      ?.valueChanges.pipe(takeUntil(this.$destroy))
      .subscribe((value) => {
        console.log('selected algo', value);

        this.selectedAlgo = this.algoList.find((algo) => algo.code === value)!;
      });
    // this.algoForm.get('delay')?.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((value:number)=>{
    //   this.sortingService.$delay.next(value);
    // });
  }
  ngOnInit(): void {
    this.sortingService.$arrayData
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.data = [...data];
      });
  }
  sort() {
    this.sortingService[this.selectedAlgo.code]();
  }
  reInit() {
    this.sortingService.$break.next(true);
    this.sortingService.seedArray(30);
  }

  stop() {
    this.sortingService.$break.next(true);
  }
}
