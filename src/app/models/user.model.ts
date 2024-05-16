export interface User {
    uid: string;
    email: string;
    name: string;
    age: number;
    gender: string;
    photoURL: string;
    joinedAt: string;
    thresholds: {
        temperature_thres: number,
        humidity_thres: number,
        pm25_thres: number,
        pm10_thres: number,
        co_thres: number,
        pressure_mb_thres: number,
        visibility_km_thres: number,
        wind_kph_thres: number,
        uv_thres: number,
    };
}

export const defaultUser: User = {
    uid: '',
    email: '',
    name: '',
    photoURL: 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg', 
    age: 1,
    gender: '',
    joinedAt: (new Date()).toLocaleString(),
    thresholds: {
        temperature_thres: 0.0,
        humidity_thres: 0.0,
        pm25_thres: 0.0,
        pm10_thres: 0.0,
        co_thres: 0.0,
        pressure_mb_thres: 0.0,
        visibility_km_thres: 0.0,
        wind_kph_thres: 0.0,
        uv_thres: 0
    }
};
