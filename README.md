# 🚗 Canadian Road Weather App

A user-friendly web application for Canadian drivers to visualize weather conditions along their journey routes. Unlike traditional 511 apps, this tool provides an intuitive interface with interactive maps and comprehensive weather data.

![Road Weather App](https://img.shields.io/badge/Next.js-15.x-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Leaflet](https://img.shields.io/badge/Leaflet-Maps-green)

## ✨ Features

- **Interactive Route Planning**: Plot multi-point journeys with waypoints
- **Real-time Weather Data**: Get current weather conditions along your entire route
- **Weather Intervals**: Automatic weather checks every ~100km along your journey
- **Visual Map Display**: See your route and weather conditions on an interactive map
- **Weather Markers**: Detailed weather cards displayed directly on the map
- **Travel Advisories**: Automatic warnings for hazardous conditions (storms, snow, fog, etc.)
- **Comprehensive Summary**: Overview of temperature ranges, wind conditions, and visibility
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- OpenWeatherMap API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd entre-x
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your OpenWeatherMap API key:
   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
   ```

   Get your free API key at: [https://openweathermap.org/api](https://openweathermap.org/api)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

1. **Enter Route Points**
   - Start with at least a start and end point
   - Enter coordinates (latitude/longitude) for each point
   - Optionally add a name/city for each point
   - Add waypoints for stops along your route

2. **Quick Start**
   - Click "Load Sample Route" to try Toronto → Ottawa → Montreal

3. **View Weather**
   - Click "Get Weather Along Route" to fetch current conditions
   - Weather is automatically checked every ~100km along the route
   - View weather markers on the map showing temperature, conditions, wind, and visibility

4. **Analyze Conditions**
   - Check the Weather Summary panel for travel advisories
   - Review temperature ranges and average conditions
   - Identify hazardous weather conditions along your route

## 🗺️ Finding Coordinates

You can find coordinates for any location using Google Maps:

1. Right-click on a location in Google Maps
2. Click on the coordinates to copy them
3. The format is: `latitude, longitude`
4. Enter them separately in the app's input fields

## 🛠️ Tech Stack

- **Framework**: Next.js 15.x with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: React Leaflet + Leaflet Routing Machine
- **Weather API**: OpenWeatherMap
- **HTTP Client**: Axios

## 📁 Project Structure

```
entre-x/
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── MapComponent.tsx      # Interactive map with routing
│   ├── RouteInput.tsx        # Route planning form
│   └── WeatherSummary.tsx    # Weather overview panel
├── lib/
│   ├── weather.ts            # Weather API functions
│   └── route.ts              # Route calculation utilities
├── types/
│   └── index.ts              # TypeScript type definitions
└── public/                   # Static assets
```

## 🌐 API Information

### OpenWeatherMap API

This app uses the OpenWeatherMap API for weather data:

- **Free Tier**: 1,000 calls/day (sufficient for personal use)
- **Rate Limit**: 60 calls/minute
- **Data**: Current weather conditions including temperature, humidity, wind speed, visibility, and conditions

### API Key Setup

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Navigate to your API keys section
3. Copy your API key
4. Add it to your `.env.local` file

**Note**: It may take a few hours for new API keys to become active.

## 🚦 Features Explained

### Weather Intervals

The app automatically calculates intermediate points every 100km along your route. This ensures you get comprehensive weather coverage for long journeys.

### Travel Advisories

The app automatically detects and warns you about:
- ⚠️ Thunderstorms
- ❄️ Snow conditions
- 🌧️ Rain
- 🌫️ Fog or reduced visibility
- 💨 High winds (>50 km/h)

### Weather Markers

Interactive markers on the map show:
- Current temperature
- Weather condition and description
- Wind speed
- Visibility
- Clickable popups with detailed information

## 🔧 Development

### Build for Production

```bash
npm run build
npm start
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## 🌟 Future Enhancements

Potential features for future development:

- [ ] Integration with Canada 511 road conditions API
- [ ] Historical weather data and trends
- [ ] Route alternatives based on weather
- [ ] Save favorite routes
- [ ] Multi-day forecast along route
- [ ] Address search/geocoding (instead of manual coordinates)
- [ ] Road condition indicators (construction, closures)
- [ ] Customizable weather check intervals
- [ ] Export route and weather data
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## 📝 License

This project is open source and available for personal and educational use.

## 🙏 Acknowledgments

- **OpenWeatherMap** for weather data
- **OpenStreetMap** for map tiles
- **Leaflet** for mapping library
- **Next.js** team for the excellent framework

## 💡 Tips for Best Experience

1. **Accuracy**: Use precise coordinates for better weather accuracy
2. **Route Planning**: Add waypoints for long journeys to see weather at stops
3. **Refresh**: Weather data updates each time you submit the route
4. **Mobile**: The app is fully responsive and works on mobile devices
5. **Performance**: For very long routes, consider breaking them into segments

## 🆘 Troubleshooting

### Weather Data Not Loading

- Verify your API key is correct in `.env.local`
- Check that your API key is active (new keys take a few hours)
- Ensure you haven't exceeded your API rate limit

### Map Not Displaying

- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the page
- Clear browser cache

### Route Not Showing

- Verify coordinates are valid (latitude: -90 to 90, longitude: -180 to 180)
- Ensure you have at least 2 waypoints (start and end)
- Check that coordinates are within Canada or reasonable driving distance

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built for Canadian drivers who need reliable weather information for safe journeys across provinces.** 🇨🇦
