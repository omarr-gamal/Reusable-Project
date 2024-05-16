import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WeatherApiService } from '../../services/weather-api.service';
import { AuthService } from '../../services/auth.service';
import { CurrentWeatherData } from '../../models/weather-data.model';
import { User } from '../../models/user.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  location: string = 'Cairo';
  weatherData: CurrentWeatherData | null = null;
  isDay: boolean = true;
  private weatherSubscription: Subscription | null = null;
  private intervalId: any;
  private user: User | null = null;

  constructor(
    private weatherApiService: WeatherApiService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getWeather(this.location);

    // Set up an interval to fetch weather data every 10 minutes
    this.intervalId = setInterval(() => {
      this.getWeather(this.location);
    }, 60000 * 10); // 60000 milliseconds = 1 minute

    this.authService.user$.subscribe(user => {
      this.user = user!;
    });
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
      this.checkThresholds(); // Check thresholds whenever new weather data is fetched 
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

  private checkThresholds(): void {
    if (this.weatherData && this.user) {
      const { temperature_thres, humidity_thres, pm25_thres, pm10_thres, co_thres, pressure_mb_thres, visibility_km_thres, wind_kph_thres, uv_thres } = this.user.thresholds;
      const current = this.weatherData.current;

      let exceededConditions: string[] = [];

      if (current.temp_c > temperature_thres) {
        exceededConditions.push(`Temperature: ${current.temp_c}°C (Threshold: ${temperature_thres}°C)`);
      }
      if (current.humidity > humidity_thres) {
        exceededConditions.push(`Humidity: ${current.humidity}% (Threshold: ${humidity_thres}%)`);
      }
      if (current.air_quality.pm2_5 > pm25_thres) {
        exceededConditions.push(`PM2.5: ${current.air_quality.pm2_5} µg/m³ (Threshold: ${pm25_thres} µg/m³)`);
      }
      if (current.air_quality.pm10 > pm10_thres) {
        exceededConditions.push(`PM10: ${current.air_quality.pm10} µg/m³ (Threshold: ${pm10_thres} µg/m³)`);
      }
      if (current.air_quality.co > co_thres) {
        exceededConditions.push(`CO: ${current.air_quality.co} µg/m³ (Threshold: ${co_thres} µg/m³)`);
      }
      if (current.pressure_mb > pressure_mb_thres) {
        exceededConditions.push(`Pressure: ${current.pressure_mb} mb (Threshold: ${pressure_mb_thres} mb)`);
      }
      if (current.vis_km < visibility_km_thres) {
        exceededConditions.push(`Visibility: ${current.vis_km} km (Threshold: ${visibility_km_thres} km)`);
      }
      if (current.wind_kph > wind_kph_thres) {
        exceededConditions.push(`Wind Speed: ${current.wind_kph} kph (Threshold: ${wind_kph_thres} kph)`);
      }
      if (current.uv > uv_thres) {
        exceededConditions.push(`UV Index: ${current.uv} (Threshold: ${uv_thres})`);
      }

      if (exceededConditions.length > 0) {
        alert(`Warning: The following conditions have exceeded the set thresholds:\n\n${exceededConditions.join('\n')}`);
      }
    }
  }
}
