import { View, Text } from "react-native";

export default function PriceChart({ coinId }: any) {
  return (
    <View>
      <Text>📈 1D Chart for {coinId}</Text>
      {/* Later: react-native-svg or victory-native */}
    </View>
  );
}
