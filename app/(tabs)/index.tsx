import CoinCard from "@/components/CoinCard";
import { useCoins } from "@/hooks/useCoins";
import { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

export default function Home() {
  const coins = useCoins();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={coins}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CoinCard coin={item} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#51229cff", // dark, premium background
  },
  list: {
    padding: 16,
    paddingBottom: 24,
  },
  separator: {
    height: 12,
  },
});
