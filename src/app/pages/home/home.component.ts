import { Component } from '@angular/core';

import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { CurrentWeatherData } from '../../models/weather-data.model';
import { WeatherApiService } from '../../services/weather-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  location: string = 'Cairo'; // Default location
  weatherData: CurrentWeatherData | null = null;

  constructor(private weatherApiService: WeatherApiService) {
    this.weatherApiService.getWeather(this.location).subscribe(data => {
      this.weatherData = data;
    });
  }

  getWeather(location: string): void {
    this.weatherApiService.getWeather(location).subscribe(data => {
      this.weatherData = data;
    });
  }

  onSubmit(): void {
    this.getWeather(this.location);
  }
}
