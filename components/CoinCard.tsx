import { Coin } from "@/hooks/useCoins";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CoinCard({ coin }: { coin: Coin }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/crypto/[id]",
          params: { id: coin.id, name: coin.name },
        })
      }
    >
      <Image source={{ uri: coin.image }} style={styles.image} />
      <View>
        <Text style={styles.name}>{coin.name}</Text>
        <Text>${coin.current_price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#b7b2ddff",
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  name: {
    fontWeight: "bold",
  },
});
