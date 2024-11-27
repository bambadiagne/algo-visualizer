export interface SortingAlgo {
  code: 'bubbleSort' | 'selectionSort' | 'insertionSort' | 'mergeSort';
  name: string;
  description: string;
  complexity?: string;
}
export const SORTING_ALGOS: SortingAlgo[] = [
  {
    code: 'bubbleSort',
    name: 'Bubble Sort',
    description:
      'Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in wrong order. It is known for its simplicity but is not suitable for large datasets.',
    complexity: 'O(n^2) time complexity, O(1) space complexity',
  },
  {
    code: 'selectionSort',
    name: 'Selection Sort',
    description:
      'Selection sort is a simple sorting algorithm. This sorting algorithm is an in-place comparison-based algorithm in which the list is divided into two parts, the sorted part at the left end and the unsorted part at the right end. It is inefficient on large lists and generally performs worse than the similar insertion sort.',
    complexity: 'O(n^2) time complexity, O(1) space complexity',
  },
  {
    code: 'insertionSort',
    name: 'Insertion Sort',
    description:
      'Insertion sort is a simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
    complexity: 'O(n^2) time complexity, O(1) space complexity',
  },
  {
    code: 'mergeSort',
    name: 'Merge Sort',
    description:
      'Merge Sort is a Divide and Conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves. It is stable and has a predictable O(n log n) time complexity.',
    complexity: 'O(n log n) time complexity, O(n) space complexity',
  },
];
