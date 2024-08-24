import { View, Image, ImageSourcePropType } from 'react-native';
import React from 'react';

interface ConditionImageProps {
    code: number;
    heightAndWidth: string;
}

// Map weather condition codes to image filenames
function conditionToImage(conditionCode: number): ImageSourcePropType {
    const images: { [key: number]: ImageSourcePropType } = {
        1000: require('../assets/images/sun.png'),
        1003: require('../assets/images/partlycloudy.png'),
        1006: require('../assets/images/cloud.png'),
        1009: require('../assets/images/cloud.png'),
        1030: require('../assets/images/mist.png'),
        1063: require('../assets/images/moderaterain.png'),
        1066: require('../assets/images/cloud.png'),
        1069: require('../assets/images/cloud.png'),
        1072: require('../assets/images/cloud.png'),
        1087: require('../assets/images/moderaterain.png'),
        1114: require('../assets/images/cloud.png'),
        1117: require('../assets/images/cloud.png'),
        1135: require('../assets/images/mist.png'),
        1147: require('../assets/images/mist.png'),
        1150: require('../assets/images/moderaterain.png'),
        1153: require('../assets/images/moderaterain.png'),
        1168: require('../assets/images/moderaterain.png'),
        1171: require('../assets/images/moderaterain.png'),
        1180: require('../assets/images/moderaterain.png'),
        1183: require('../assets/images/moderaterain.png'),
        1186: require('../assets/images/moderaterain.png'),
        1189: require('../assets/images/moderaterain.png'),
        1192: require('../assets/images/heavyrain.png'),
        1195: require('../assets/images/heavyrain.png'),
        1198: require('../assets/images/moderaterain.png'),
        1201: require('../assets/images/heavyrain.png'),
        1204: require('../assets/images/cloud.png'),
        1207: require('../assets/images/cloud.png'),
        1210: require('../assets/images/cloud.png'),
        1213: require('../assets/images/cloud.png'),
        1216: require('../assets/images/cloud.png'),
        1219: require('../assets/images/cloud.png'),
        1222: require('../assets/images/cloud.png'),
        1225: require('../assets/images/cloud.png'),
        1237: require('../assets/images/cloud.png'),
        1240: require('../assets/images/moderaterain.png'),
        1243: require('../assets/images/heavyrain.png'),
        1246: require('../assets/images/heavyrain.png'),
        1249: require('../assets/images/cloud.png'),
        1252: require('../assets/images/cloud.png'),
        1255: require('../assets/images/cloud.png'),
        1258: require('../assets/images/cloud.png'),
        1261: require('../assets/images/cloud.png'),
        1264: require('../assets/images/cloud.png'),
        1273: require('../assets/images/moderaterain.png'),
        1276: require('../assets/images/heavyrain.png'),
        1279: require('../assets/images/cloud.png'),
        1282: require('../assets/images/cloud.png'),
    };

    return images[conditionCode] || require('../assets/images/sun.png'); // Default image
}

const ConditionImage: React.FC<ConditionImageProps> = ({
    code,
    heightAndWidth,
}) => {
    // Find the image source based on the code
    const source = conditionToImage(code);

    return <Image source={source} className={heightAndWidth} />;
};

export default ConditionImage;
