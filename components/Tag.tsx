import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { theme } from '../theme';
import ConditionImage from './ConditionImage';

interface IntData {
    date: string;
    avgtemp_c: number;
    condition: { text: string; code: number };
}

const Weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

function Tag(data: IntData) {
    return (
        <View
            style={styles.tagContainer}
            className="rounded-3xl justify-center mr-4"
        >
            {/* Weather icon */}
            <View className="flex-row justify-center">
                <ConditionImage
                    code={data.condition.code}
                    heightAndWidth="h-16 w-16"
                />
            </View>
            {/* Day */}
            <Text className="text-slate-300 text-base font-light text-center">
                {Weekdays[new Date(data.date).getDay()]}
            </Text>
            {/* Degree */}
            <Text className="text-slate-300 text-lg font-medium text-center">
                {data.avgtemp_c}°C
            </Text>
        </View>
    );
}

export default Tag;

// style={styles.check}
const check = {
    borderWidth: 1,
    borderColor: 'red',
};

const styles = StyleSheet.create({
    tagContainer: {
        height: 150,
        width: 100,
        backgroundColor: theme.bgWhite(0.1),
    },
});
