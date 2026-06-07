import { Image, ImageStyle } from 'expo-image';
import { StyleProp } from 'react-native';

const logoSource = require('../../../assets/logo.png');

interface ToolverseLogoProps {
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export function ToolverseLogo({ size = 40, style }: ToolverseLogoProps) {
  return (
    <Image
      source={logoSource}
      style={[{ width: size, height: size }, style]}
      contentFit="contain"
      transition={0}
    />
  );
}
