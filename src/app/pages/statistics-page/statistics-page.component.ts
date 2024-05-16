import { Component, OnInit } from '@angular/core';
import { HistoricalWeatherData, Hour } from '../../models/weather-data.model';
import { WeatherApiService } from '../../services/weather-api.service';

type HourSubset = 'temp_c' | 'temp_f' | 'precip_mm' | 'precip_in' | 'humidity' | 'wind_kph' | 'wind_mph' | 'vis_km' | 'vis_miles' | 'uv';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.css']
})
export class StatisticsPageComponent implements OnInit {
  location: string = 'Cairo';
  dateRange: Date[] | null = null;
  minDate: Date;
  maxDate: Date;
  errorMessage: string = '';
  graphOptions = [
    { label: 'Temperature Over Time', value: 'temperature' },
    { label: 'Humidity Over Time', value: 'humidity' },
    { label: 'Wind Speed and Direction', value: 'wind' },
    { label: 'UV Index Over Time', value: 'uv' },
    { label: 'Visibility Over Time', value: 'visibility' },
    { label: 'Condition Frequency', value: 'condition' }
  ];

  selectedGraph: string = 'temperature';
  weatherData: HistoricalWeatherData[] = [];
  chartData: any;
  chartOptions: any;

  constructor(private weatherApiService: WeatherApiService) {
    const today = new Date();
    this.minDate = new Date(today.setDate(today.getDate() - 7));
    this.maxDate = new Date();
  }

  ngOnInit(): void { }

  onDateRangeChange() {
    if (this.dateRange && this.dateRange[0] && this.dateRange[1] && this.location) {
      this.errorMessage = '';
      const startDate = this.dateRange[0].toISOString().split('T')[0];
      const endDate = this.dateRange[1].toISOString().split('T')[0];

      this.weatherApiService.getHistoricalDataRange(this.location, startDate, endDate).subscribe(
        (data: HistoricalWeatherData[]) => {
          this.weatherData = data;
          this.updateChart();
        },
        (error) => {
          console.error('Error fetching historical weather data range', error);
          this.errorMessage = 'Failed to fetch data. Please try again later.';
        }
      );
    } else {
      this.errorMessage = 'Both location and date range are required.';
    }
  }

  updateChart(): void {
    switch (this.selectedGraph) {
      case 'temperature':
        this.prepareChart('Temperature Over Time', 'Temperature (°C)', this.extractHourlyData('temp_c'));
        break;
      case 'humidity':
        this.prepareChart('Humidity Over Time', 'Humidity (%)', this.extractHourlyData('humidity'));
        break;
      case 'wind':
        this.prepareChart('Wind Speed Over Time', 'Wind Speed (kph)', this.extractHourlyData('wind_kph'));
        break;
      case 'uv':
        this.prepareChart('UV Index Over Time', 'UV Index', this.extractHourlyData('uv'));
        break;
      case 'visibility':
        this.prepareChart('Visibility Over Time', 'Visibility (km)', this.extractHourlyData('vis_km'));
        break;
      case 'condition':
        this.prepareConditionChart();
        break;
    }
  }

  extractHourlyData(field: HourSubset): any[] {
    return this.weatherData.flatMap(data =>
      data.forecast.forecastday.flatMap(day =>
        day.hour.filter((_, index) => index % 4 === 0).map(hour => ({
          date: hour.time,
          value: hour[field],
          label: field,
          borderColor: this.getBorderColor(field),
          backgroundColor: this.getBackgroundColor(field)
        }))
      )
    );
  }

  getBorderColor(field: HourSubset): string {
    const colors: Record<HourSubset, string> = {
      temp_c: '#FF6384',
      temp_f: '#FF6384',
      precip_mm: '#42A5F5',
      precip_in: '#42A5F5',
      humidity: '#FFCE56',
      wind_kph: '#4BC0C0',
      wind_mph: '#4BC0C0',
      vis_km: '#9966FF',
      vis_miles: '#9966FF',
      uv: '#FF9F40'
    };
    return colors[field] || '#000000';
  }

  getBackgroundColor(field: HourSubset): string {
    const colors: Record<HourSubset, string> = {
      precip_mm: '#42A5F5',
      precip_in: '#42A5F5',
      temp_c: '',
      temp_f: '',
      humidity: '',
      wind_kph: '',
      wind_mph: '',
      vis_km: '',
      vis_miles: '',
      uv: ''
    };
    return colors[field] || '#FFFFFF';
  }

  prepareChart(title: string, yAxisLabel: string, data: any[]): void {
    const labels = data.map(d => d.date);
    const dataset: any = {
      label: data[0].label,
      data: data.map(d => d.value),
      borderColor: data[0].borderColor,
      backgroundColor: data[0].backgroundColor,
      fill: false,
      tension: 0.4 // Make the line curved
    };

    this.chartData = {
      labels: labels,
      datasets: [dataset]
    };

    this.chartOptions = {
      title: {
        display: true,
        text: title
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'hour',
            displayFormats: {
              hour: 'MMM D, HH:mm'
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Time'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: yAxisLabel
          }
        }]
      }
    };
  }

  prepareConditionChart(): void {
    const conditionData = this.weatherData.flatMap(data =>
      data.forecast.forecastday.flatMap(day =>
        day.hour.filter((_, index) => index % 4 === 0).map(hour => hour.condition.text)
      )
    );
    const conditionCounts = conditionData.reduce<Record<string, number>>((acc, condition) => {
      acc[condition] = (acc[condition] || 0) + 1;
      return acc;
    }, {});

    this.chartData = {
      labels: Object.keys(conditionCounts),
      datasets: [
        {
          label: 'Condition Frequency',
          data: Object.values(conditionCounts),
          backgroundColor: '#FF6384'
        }
      ]
    };

    this.chartOptions = {
      title: {
        display: true,
        text: 'Condition Frequency'
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Condition'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Frequency'
          }
        }]
      }
    };
  }
}
