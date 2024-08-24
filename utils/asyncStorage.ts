import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (value: string): Promise<void> => {
    try {
        await AsyncStorage.setItem('lastestCity', value);
    } catch (e) {
        console.error('Failed to store data:', e);
    }
};

export const getData = async (): Promise<string> => {
    try {
        const result = await AsyncStorage.getItem('lastestCity');
        return result !== null ? result : 'Vinh Long';
    } catch (e) {
        console.error('Failed to retrieve data:', e);
        return 'Vinh Long'; // Trả về giá trị mặc định nếu có lỗi
    }
};
