export interface SortingAlgo {
  code: 'bubbleSort' | 'selectionSort' | 'insertionSort' | 'mergeSort';
  name: string;
  description: string;
}
export const SORTING_ALGOS: SortingAlgo[] = [
  {
    code: 'bubbleSort',
    name: 'Bubble Sort',
    description:
      'Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in wrong order.',
  },
  {
    code: 'selectionSort',
    name: 'Selection Sort',
    description:
      'Selection sort is a simple sorting algorithm. This sorting algorithm is an in-place comparison-based algorithm in which the list is divided into two parts, the sorted part at the left end and the unsorted part at the right end.',
  },
  {
    code: 'insertionSort',
    name: 'Insertion Sort',
    description:
      'Insertion sort is a simple sorting algorithm that builds the final sorted array one item at a time.',
  },
  {
    code: 'mergeSort',
    name: 'Merge Sort',
    description: '',
  },
];
