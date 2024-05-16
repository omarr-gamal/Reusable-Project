import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WeatherApiService } from '../../services/weather-api.service';
import { CurrentWeatherData } from '../../models/weather-data.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  location: string = 'Cairo';
  weatherData: CurrentWeatherData | null = null;
  isDay: boolean = true; // Property to determine if it's day or night
  private weatherSubscription: Subscription | null = null;
  private intervalId: any;

  constructor(private weatherApiService: WeatherApiService) { }

  ngOnInit(): void {
    this.getWeather(this.location);

    // Set up an interval to fetch weather data every 10 minutes
    this.intervalId = setInterval(() => {
      this.getWeather(this.location);
    }, 60000 * 10); // 60000 milliseconds = 1 minute
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Unsubscribe from the weather API if there's an active subscription
    if (this.weatherSubscription) {
      this.weatherSubscription.unsubscribe();
    }
  }

  getWeather(location: string): void {
    this.location = location;
    this.weatherSubscription = this.weatherApiService.getWeather(location).subscribe(data => {
      this.weatherData = data;
      this.checkDayOrNight();
    });
  }

  onSubmit(): void {
    this.getWeather(this.location);
  }

  private checkDayOrNight(): void {
    if (this.weatherData) {
      const isDayTime = this.weatherData.current.is_day;
      this.isDay = isDayTime === 1;
    }
  }
}