import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurrentWeatherData } from '../models/weather-data.model';
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
}
