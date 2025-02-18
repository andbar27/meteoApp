import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

// Funzione per ottenere i dati meteo reali
const fetchWeather = async (city) => {
  try {
    const url = `https://wttr.in/${city}?format=j1`;
    const response = await fetch(url);
    const data = await response.json();
  
    return {
      city: data.nearest_area[0].areaName[0].value,
      country: data.nearest_area[0].country[0].value,
      temp: parseInt(data.current_condition[0].temp_C) + "°C", // Temperatura in °C
      humidity: parseInt(data.current_condition[0].humidity) + "%", // Umidità in %
      windSpeed: parseInt(data.current_condition[0].windspeedKmph) + " km/h", // Vento in km/h
      conditions: data.current_condition[0].weatherDesc[0].value // Condizione meteo
    };
  } catch (error) {
    console.error("Errore nel recupero dei dati meteo:", error);
    return null;
  }
};

// Funzione per ottenere l'icona in base alle condizioni meteo
const getIconForWeather = (conditions) => {
  switch (conditions.toLowerCase()) {
    case 'sunny': return 'sun';
    case 'rain': return 'cloud-rain';
    case 'cloudy': return 'cloud';
    case 'snow': return 'snowflake';
    default: return 'cloud';
  }
};

export default function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    if (!city.trim()) {
      window.alert('Errore. Per favore inserisci una città');
      //Alert.alert('Errore', 'Per favore inserisci una città');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeather(city);
      if (data) {
        setWeatherData(data);
      } else {
        setError('Errore nel recupero dei dati.');
      }
    } catch {
      setError('Errore nel recupero dei dati.');
    } finally {
      setLoading(false);
    }
  };

  const WeatherInfo = ({ data }) => (
    <View style={styles.weatherContainer}>
      <Icon name={getIconForWeather(data.conditions)} size={50} color="#f39c12" />
      <Text style={styles.cityName}>{data.city} ({data.country})</Text>
      <Text style={styles.temperature}>{data.temp}</Text>
      <Text style={styles.conditions}>{data.conditions}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.details}>Umidità: {data.humidity}</Text>
        <Text style={styles.details}>Vento: {data.windSpeed}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Previsione Meteo</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Inserisci una città"
          value={city}
          onChangeText={setCity}
        />
        <TouchableOpacity style={styles.button} onPress={fetchWeatherData} disabled={loading}>
          <Text style={styles.buttonText}>Cerca</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {!loading && weatherData && <WeatherInfo data={weatherData} />}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

// Stili CSS per React Native
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  weatherContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  conditions: {
    fontSize: 18,
    marginBottom: 15,
  },
  detailsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  details: {
    fontSize: 16,
    color: '#666',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
