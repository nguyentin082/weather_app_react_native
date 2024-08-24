import {
    View,
    Text,
    ImageBackground,
    TextInput,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard,
    Pressable,
    Image,
    ScrollView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { StyleSheet } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

import { theme } from '../theme';
import { searchLocation, searchForecast } from '../api/weather';
import ConditionImage from '../components/ConditionImage';
import Tag from '../components/Tag';
import { storeData, getData } from '../utils/asyncStorage';

interface IntSearchResultItem {
    name: string;
    country: string;
}

interface IntConditionItem {
    text: string;
    code: number;
}

interface ItemType {
    date: string;
    day: {
        avgtemp_c: number;
        condition: { text: string; code: number };
    };
}

interface WeatherData {
    city: string;
    country: string;
    temperature: number | null;
    condition: IntConditionItem;
    windSpeed: number | null;
    humidity: number | null;
    sunriseTime: string;
    next7Days: ItemType[];
}

const { width } = Dimensions.get('window');

const Home = () => {
    const [chosenCity, setChosenCity] = useState<string>('Ho Chi Minh');
    const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
    const [showSearchResult, setShowSearchResult] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchResult, setSearchResult] = useState<IntSearchResultItem[]>([]);
    const [weatherData, setWeatherData] = useState<WeatherData>({
        city: '',
        country: '',
        temperature: null as number | null,
        condition: { text: '', code: 0 } as IntConditionItem,
        windSpeed: null as number | null,
        humidity: null as number | null,
        sunriseTime: '',
        next7Days: [],
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Get lastest city from AsyncStorage
    useEffect(() => {
        const fetchData = async () => {
            const city = await getData();
            setChosenCity(city);
        };

        fetchData();
    }, []);

    // Fetch Location Data
    const fetchLocation = useCallback(async () => {
        try {
            // Store to localStorage
            await storeData(chosenCity);
            setIsLoading(true);
            const locationResults = await searchLocation(chosenCity);
            if (locationResults.length > 0) {
                const { name, country } = locationResults[0];
                setWeatherData((prevData) => ({
                    ...prevData,
                    city: name,
                    country,
                }));
            }
        } catch (e) {
            console.log('Error fetching location data:', e);
        } finally {
            setIsLoading(false);
        }
    }, [chosenCity]);

    // Fetch Weather Data
    const fetchWeather = useCallback(async () => {
        try {
            setIsLoading(true);
            const location = `${weatherData.city},${weatherData.country}`;
            const weatherResults = await searchForecast(location);
            if (weatherResults) {
                const currentDay = weatherResults.current;
                const forecastDays = weatherResults.forecast.forecastday;
                setWeatherData((prevData) => ({
                    ...prevData,
                    temperature: currentDay.temp_c,
                    condition: {
                        text: currentDay.condition.text,
                        code: currentDay.condition.code,
                    },
                    windSpeed: currentDay.wind_kph,
                    humidity: currentDay.humidity,
                    sunriseTime: forecastDays[0].astro.sunrise,
                    next7Days: forecastDays.slice(1, 7),
                }));
            }
        } catch (e) {
            console.log('Error fetching weather data:', e);
        } finally {
            setIsLoading(false);
        }
    }, [weatherData.city, weatherData.country]);

    useEffect(() => {
        fetchLocation().then(() => fetchWeather());
    }, [fetchLocation, fetchWeather]);

    // Search Functionality
    useEffect(() => {
        if (searchValue.trim().length > 2) {
            const fetchSearchResults = async () => {
                try {
                    const results = await searchLocation(searchValue);
                    setSearchResult(results);
                    setShowSearchResult(true);
                } catch (error) {
                    console.log('Error fetching search results:', error);
                }
            };
            fetchSearchResults();
        } else {
            setShowSearchResult(false);
            setSearchResult([]);
        }
    }, [searchValue]);

    if (isLoading) {
        return (
            <View className="flex-1">
                <StatusBar style="light" />
                <ImageBackground
                    source={require('../assets/images/bg.png')}
                    className="flex-1"
                    blurRadius={100}
                >
                    <SafeAreaView className="flex-1">
                        <View
                            className="flex-1"
                            style={styles.loadingContainer}
                        >
                            <ActivityIndicator size="large" color="white" />
                        </View>
                    </SafeAreaView>
                </ImageBackground>
            </View>
        );
    }

    // console.log('re-render');

    return (
        <View className="flex-1">
            <StatusBar style="light" />
            <ImageBackground
                source={require('../assets/images/bg.png')}
                className="flex-1"
                blurRadius={100}
            >
                <SafeAreaView className="flex-1">
                    {/* SEARCH SECTION */}
                    <View className="relative z-30">
                        {/* Search Bar */}
                        <View
                            style={
                                showSearchBar
                                    ? styles.searchContainer
                                    : {
                                          width: width * 0.9,
                                          alignSelf: 'center',
                                      }
                            }
                            className="px-2 py-2 rounded-full flex-row justify-end"
                        >
                            {showSearchBar && (
                                <TextInput
                                    autoFocus
                                    onChangeText={setSearchValue}
                                    placeholder="Search location"
                                    placeholderTextColor="gray"
                                    textAlign="left"
                                    className="px-6 flex-1 text-slate-300 text-xl font-sans"
                                    value={searchValue}
                                />
                            )}
                            <Pressable
                                onPress={() => {
                                    setShowSearchBar(!showSearchBar);
                                    setShowSearchResult(false);
                                    setSearchResult([]);
                                    setSearchValue('');
                                }}
                                style={styles.searchButton}
                                className="p-2 rounded-full"
                            >
                                <Entypo
                                    name="magnifying-glass"
                                    size={30}
                                    color="white"
                                />
                            </Pressable>
                        </View>
                        {/* Search Result */}
                        {showSearchResult && searchResult.length !== 0 && (
                            <View
                                style={styles.searchResultContainer}
                                className="rounded-3xl absolute z-30"
                            >
                                {searchResult.map((item, index) => (
                                    <Pressable
                                        style={
                                            index !== searchResult.length - 1
                                                ? {
                                                      borderBottomWidth: 0.3,
                                                      borderColor: 'slate',
                                                  }
                                                : {}
                                        }
                                        key={index}
                                        onPress={() => {
                                            setShowSearchResult(false);
                                            setShowSearchBar(false);
                                            setSearchResult([]);
                                            setSearchValue('');
                                            setChosenCity(item.name);
                                        }}
                                        className="px-8 h-14 justify-center"
                                    >
                                        <Text className="text-slate-500 text-xl font-sans">
                                            {item.name.length +
                                                item.country.length <
                                            30
                                                ? item.name +
                                                  ', ' +
                                                  item.country
                                                : (
                                                      item.name +
                                                      ', ' +
                                                      item.country
                                                  ).slice(0, 30) + '...'}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* FORECAST SECTION */}
                    <TouchableWithoutFeedback
                        onPress={() => {
                            Keyboard.dismiss();
                            setShowSearchBar(false);
                            setShowSearchResult(false);
                            setSearchResult([]);
                        }}
                    >
                        <View className="flex-1 justify-between my-6 z-0">
                            {/* Location */}
                            <View className="flex-row justify-center">
                                <Text className="text-slate-300 text-4xl font-semibold">
                                    {weatherData.city},
                                    <Text className="text-slate-300 text-lg">
                                        {' ' + weatherData.country}
                                    </Text>
                                </Text>
                            </View>

                            {/* Weather image */}
                            <View className="flex-row justify-center">
                                <ConditionImage
                                    code={weatherData.condition.code}
                                    heightAndWidth="h-60 w-60"
                                />
                            </View>

                            {/* Degree C*/}
                            <View>
                                <Text className="text-slate-300 text-6xl font-bold text-center">
                                    {weatherData.temperature}°C
                                </Text>
                                <Text className="text-slate-300 text-xl font-medium text-center">
                                    {weatherData.condition.text}
                                </Text>
                            </View>

                            {/* Other Stats */}
                            <View
                                style={styles.otherStatsContainer}
                                className="flex-row justify-between mt-8"
                            >
                                <View className="flex-row items-center">
                                    <Image
                                        source={require('../assets/icons/wind.png')}
                                        className="w-6 h-6"
                                    />
                                    <Text className="text-slate-300 text-xl font-medium ml-2">
                                        {weatherData.windSpeed} km/h
                                    </Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Image
                                        source={require('../assets/icons/drop.png')}
                                        className="w-6 h-6"
                                    />
                                    <Text className="text-slate-300 text-xl font-medium ml-2">
                                        {weatherData.humidity}%
                                    </Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Image
                                        source={require('../assets/icons/sun.png')}
                                        className="w-6 h-6"
                                    />
                                    <Text className="text-slate-300 text-xl font-medium ml-2">
                                        {weatherData.sunriseTime}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    {/* Next 7 Days */}
                    <View className="mb-2 space-y-3">
                        <View
                            className="flex-row"
                            style={styles.titleNext7Days}
                        >
                            {/* Calendar expo icon */}
                            <AntDesign
                                name="calendar"
                                size={24}
                                color="white"
                                className="text-white"
                            />
                            <Text className="text-slate-300 text-lg font-extrabold ml-2">
                                Next 6 Days
                            </Text>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 20 }}
                        >
                            {weatherData.next7Days[0] !== undefined &&
                                weatherData.next7Days.map(
                                    (item: ItemType, index: number) => {
                                        if (item.day.avgtemp_c !== undefined) {
                                            return (
                                                <Tag
                                                    key={index}
                                                    date={item.date}
                                                    avgtemp_c={
                                                        item.day.avgtemp_c
                                                    }
                                                    condition={
                                                        item.day.condition
                                                    }
                                                />
                                            );
                                        }
                                    }
                                )}
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
};

export default Home;

const check = {
    borderWidth: 2,
    borderColor: 'red',
};

const styles = StyleSheet.create({
    loadingContainer: {
        // ...check,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        backgroundColor: theme.bgWhite(0.2),
        width: width * 0.9,
        alignSelf: 'center',
    },
    searchButton: {
        backgroundColor: theme.bgWhite(0.3),
    },
    searchResultContainer: {
        // ...check,
        top: 60,
        left: width * 0.05,
        width: width * 0.9,
        backgroundColor: theme.bgWhite(1),
    },
    otherStatsContainer: {
        marginHorizontal: width * 0.05,
    },
    titleNext7Days: {
        ...Platform.select({
            ios: {
                marginTop: 10,
            },
            android: {
                marginTop: 20,
            },
        }),
        marginHorizontal: width * 0.05,
    },
});
