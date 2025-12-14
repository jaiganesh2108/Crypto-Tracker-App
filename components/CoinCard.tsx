import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function CoinCard({ coin }: any) {
  return (
    <TouchableOpacity onPress={() => router.push(`/crypto/${coin.id}`)}>
      <View>
        <Text>{coin.name}</Text>
        <Text>${coin.price}</Text>
      </View>
    </TouchableOpacity>
  );
}
