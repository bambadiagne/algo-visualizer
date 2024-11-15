import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [],
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.css',
})
export class BarComponent implements OnChanges {
  @Input() data: number[] = [];
  @Input() algoTitle: string = 'Bubble Sort';
  lastValue: number = 0;
  index: number = 0;
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      const newData = changes['data'].currentValue;
      this.lastValue = newData[this.index];
      this.updateData(newData);
    }
  }

  ngOnInit(): void {
    this.draw(this.data);
  }
  draw(data: number[]): void {
    const dataLength = data.length;
    const svg = d3
      .select('.my-svg-container')
      .append('svg')
      .attr('width', window.innerWidth)
      .attr('height', 550); // Increased height for labels

    // Add bars
    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * (window.innerWidth / dataLength))
      .attr('y', (d) => 500 - d)
      .attr('width', window.innerWidth / dataLength)
      .attr('height', (d) => d)
      .attr('fill', 'blue')
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    // Add value labels
    svg
      .selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr(
        'x',
        (d, i) =>
          i * (window.innerWidth / dataLength) +
          window.innerWidth / dataLength / 2,
      )
      .attr('y', 515)
      .attr('text-anchor', 'start')
      .attr('font-size', '12px')
      .attr(
        'transform',
        (d, i) =>
          `rotate(90, ${i * (window.innerWidth / dataLength) + window.innerWidth / dataLength / 2}, 515)`,
      )
      .text((d) => d);

    // Title
    const svgWidth = window.innerWidth;
    svg
      .append('text')
      .attr('x', svgWidth / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .attr('font-size', '20px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'sans-serif');
  }

  updateData(newData: number[]): void {
    this.index++;
    this.index = this.index % newData.length;
    const svg = d3.select('.my-svg-container').select('svg');

    // Update bars
    const rects = svg.selectAll('rect').data(newData);

    rects.exit().remove();

    // Update existing bars
    rects
      .attr('x', (d, i) => i * (window.innerWidth / newData.length))
      .attr('y', (d) => 500 - d)
      .attr('width', window.innerWidth / newData.length)
      .attr('height', (d) => d)
      .attr('fill', (d, i) => this.getBarColor(d, i, newData))
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    // Add new bars
    rects
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * (window.innerWidth / newData.length))
      .attr('y', (d) => 500 - d)
      .attr('width', window.innerWidth / newData.length)
      .attr('height', (d) => d)
      .attr('fill', (d, i) => this.getBarColor(d, i, newData))
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    // Update text labels
    const texts = svg.selectAll('.bar-label').data(newData);

    // Remove old labels
    texts.exit().remove();

    // Update existing labels
    texts
      .attr(
        'x',
        (d, i) =>
          i * (window.innerWidth / newData.length) +
          window.innerWidth / newData.length / 2,
      )
      .attr('y', 515)
      .attr(
        'transform',
        (d, i) =>
          `rotate(90, ${i * (window.innerWidth / newData.length) + window.innerWidth / newData.length / 2}, 515)`,
      )
      .text((d) => d);

    // Add new labels
    texts
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr(
        'x',
        (d, i) =>
          i * (window.innerWidth / newData.length) +
          window.innerWidth / newData.length / 2,
      )
      .attr('y', 515)
      .attr('text-anchor', 'start')
      .attr('font-size', '12px')
      .attr(
        'transform',
        (d, i) =>
          `rotate(90, ${i * (window.innerWidth / newData.length) + window.innerWidth / newData.length / 2}, 515)`,
      )
      .text((d) => d);
  }
  getBarColor(value: number, index: number, data: number[]): string {
    if (data[index + 1] === this.lastValue) {
      return 'red';
    } else {
      return 'blue';
    }
  }
}
