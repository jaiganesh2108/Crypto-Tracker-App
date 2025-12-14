import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import PriceChart from "@/components/PriceChart";

export default function CryptoDetail() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>{id} Price (1D)</Text>
      <PriceChart coinId={id} />
    </View>
  );
}
