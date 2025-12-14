import { FlatList } from "react-native";
import CoinCard from "@/components/CoinCard";
import { useCoins } from "@/hooks/useCoins";

export default function Home() {
  const coins = useCoins();

  return (
    <FlatList
      data={coins}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CoinCard coin={item} />}
    />
  );
}
