import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { CurrentWeatherData, HistoricalWeatherData } from '../models/weather-data.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherApiService {
  private apiUrl = '/api/v1/';
  private apiKey = environment.weatherApiKey;

  constructor(private http: HttpClient) { }

  getWeather(location: string): Observable<CurrentWeatherData> {
    return this.http.get<CurrentWeatherData>(`${this.apiUrl}current.json?key=${this.apiKey}&q=${location}&aqi=yes`);
  }
  getHistoricalData(location: string, date: string): Observable<HistoricalWeatherData> {
    const formattedDate = this.formatDate(date);
    return this.http.get<HistoricalWeatherData>(`${this.apiUrl}history.json?key=${this.apiKey}&q=${location}&dt=${formattedDate}`);
  }

  getHistoricalDataRange(location: string, startDate: string, endDate: string): Observable<HistoricalWeatherData[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateArray: string[] = [];

    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      dateArray.push(dt.toISOString().split('T')[0]);
    }

    const observables: Observable<HistoricalWeatherData>[] = dateArray.map(date =>
      this.getHistoricalData(location, date)
    );

    return forkJoin(observables);
  }


  private formatDate(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
