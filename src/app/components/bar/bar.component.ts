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
  indexes: number[] = [];
  @Input() set mark(value: number[]) {
    this.indexes = value;
  }
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].firstChange === false) {
      const newData = changes['data'].currentValue;
      this.updateData(newData);
    }
  }

  ngOnInit(): void {
    this.draw(this.data);
  }

  draw(data: number[]): void {
    const dataLength = data.length;
    const barWidth = window.innerWidth / dataLength;
    const fontSize = Math.max(10, barWidth / 3.5);
    const svgHeight = 600;
    const maxValue = d3.max(data) || 0;
    const maxBarHeight = 500;

    const svg = d3
      .select('.my-svg-container')
      .append('svg')
      .attr('width', window.innerWidth)
      .attr('height', svgHeight);

    // Add bars
    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * barWidth)
      .attr('y', (d) => svgHeight - (d / maxValue) * maxBarHeight - 10) // Scale bar height proportionally
      .attr('width', barWidth)
      .attr('height', (d) => (d / maxValue) * maxBarHeight) // Scale bar height proportionally
      .attr('fill', 'blue')
      .attr('stroke', 'black')
      .attr('stroke-width', 2);
    const showLabel = this.showLabel();

    // Add value labels on top of bars
    svg
      .selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', (d, i) => i * barWidth + barWidth / 2)
      .attr('y', (d) => svgHeight - (d / maxValue) * maxBarHeight - 20) // Adjusted position above the bar
      .attr('text-anchor', 'middle')
      .attr('font-size', `${fontSize}px`)
      .attr('transform', (d, i) =>
        this.rotate(d, i, barWidth, svgHeight, maxValue, maxBarHeight),
      )
      .text((d) => (showLabel ? d : null));
  }

  updateData(newData: number[]): void {
    const barWidth = window.innerWidth / newData.length;

    const fontSize = Math.max(10, barWidth / 3);
    const svgHeight = 600;
    const maxValue = d3.max(newData) || 0;
    const maxBarHeight = 500;

    const svg = d3.select('.my-svg-container').select('svg');

    // Update bars
    const rects = svg.selectAll('rect').data(newData);

    rects.exit().remove();

    // Update existing bars
    rects
      .attr('x', (d, i) => i * barWidth)
      .attr('y', (d) => svgHeight - (d / maxValue) * maxBarHeight - 10) // Scale bar height proportionally
      .attr('width', barWidth)
      .attr('height', (d) => (d / maxValue) * maxBarHeight) // Scale bar height proportionally
      .attr('fill', (d, i) => this.getBarColor(i))
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    // Add new bars
    rects
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * barWidth)
      .attr('y', (d) => svgHeight - (d / maxValue) * maxBarHeight - 10)
      .attr('width', barWidth)
      .attr('height', (d) => (d / maxValue) * maxBarHeight)
      .attr('fill', (d, i) => this.getBarColor(i))
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    const texts = svg.selectAll('.bar-label').data(newData);

    texts.exit().remove();
    const showLabel = this.showLabel();

    texts
      .attr('x', (d, i) => i * barWidth + barWidth / 2)
      .attr('y', (d) => svgHeight - (d / maxValue) * maxBarHeight - 20) // Adjusted position above the bar
      .attr('text-anchor', 'middle')
      .attr('font-size', `${fontSize}px`)
      .attr('transform', (d, i) =>
        this.rotate(d, i, barWidth, svgHeight, maxValue, maxBarHeight),
      )
      .text((d) => (showLabel ? d : null));

    texts
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', (d, i) => i * barWidth + barWidth / 2)
      .attr('y', (d) => svgHeight - (d / maxValue) * maxBarHeight - 20) // Adjusted position above the bar
      .attr('text-anchor', 'middle')
      .attr('font-size', `${fontSize}px`)
      .attr('transform', (d, i) =>
        this.rotate(d, i, barWidth, svgHeight, maxValue, maxBarHeight),
      )
      .text((d) => (showLabel ? d : null));
  }
  getBarColor(index: number): string {
    return this.indexes.includes(index) ? 'red' : 'blue';
  }
  showLabel(): boolean {
    return this.data.length <= 100;
  }
  rotate(
    d: number,
    i: number,
    barWidth: number,
    svgHeight: number,
    maxValue: number,
    maxBarHeight: number,
  ) {
    return `rotate(-90, ${i * barWidth + barWidth / 2}, ${svgHeight - (d / maxValue) * maxBarHeight - 20})`;
  }
}
