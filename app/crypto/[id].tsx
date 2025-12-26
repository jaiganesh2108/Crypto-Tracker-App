import { AntDesign } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

// ──────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────

type TimeRange = "1D" | "1W" | "1M" | "1Y";

interface CoinData {
  image?: { large?: string };
  market_data?: {
    market_cap?: { usd?: number };
    total_volume?: { usd?: number };
    high_24h?: { usd?: number };
    low_24h?: { usd?: number };
  };
}

interface AnimationRefs {
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  scaleAnim: Animated.Value;
  priceAnim: Animated.Value;
  chartAnim: Animated.Value;
}

// ──────────────────────────────────────────────
// CONSTANTS
// ──────────────────────────────────────────────

const RANGE_TO_DAYS: Record<TimeRange, number> = {
  "1D": 1,
  "1W": 7,
  "1M": 30,
  "1Y": 365,
};

const TIME_RANGES: TimeRange[] = ["1D", "1W", "1M", "1Y"];

const SCREEN_WIDTH = Dimensions.get("window").width;

// ──────────────────────────────────────────────
// CUSTOM HOOKS
// ──────────────────────────────────────────────

const useAnimations = (): AnimationRefs => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const priceAnim = useRef(new Animated.Value(0)).current;
  const chartAnim = useRef(new Animated.Value(0)).current;

  return { fadeAnim, slideAnim, scaleAnim, priceAnim, chartAnim };
};

const useCoinData = (coinId: string, selectedRange: TimeRange) => {
  const [prices, setPrices] = useState<number[]>([]);
  const [coinImage, setCoinImage] = useState<string | null>(null);
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [chartRes, coinRes] = await Promise.all([
        fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${RANGE_TO_DAYS[selectedRange]}`
        ),
        fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`),
      ]);

      if (!chartRes.ok || !coinRes.ok) {
        throw new Error("Failed to fetch coin data");
      }

      const chartData = await chartRes.json();
      const coinDataRes = await coinRes.json();

      // Validate the response structure
      if (!chartData?.prices || !Array.isArray(chartData.prices)) {
        throw new Error("Invalid chart data received");
      }

      const newPrices = chartData.prices.map(([, p]: [number, number]) => p);
      setPrices(newPrices);
      setCoinImage(coinDataRes?.image?.large ?? null);
      setCoinData(coinDataRes);
    } catch (e) {
      console.error("Error fetching coin data:", e);
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coinId) {
      fetchData();
    }
  }, [coinId, selectedRange]);

  return { prices, coinImage, coinData, loading, error, refetch: fetchData };
};

// ──────────────────────────────────────────────
// UTILITY FUNCTIONS
// ──────────────────────────────────────────────

const calculatePercentChange = (current: number, first: number): number => {
  return ((current - first) / first) * 100;
};

const formatCurrency = (value: number, decimals: number = 2): string => {
  return `$${value.toFixed(decimals)}`;
};

const formatBillions = (value: number): string => {
  return `$${(value / 1e9).toFixed(2)}B`;
};

const getSentimentText = (percentChange: number): string => {
  if (percentChange > 5) return "🚀 Strong Bullish";
  if (percentChange < -5) return "📉 Bearish Trend";
  return "⚖️ Stable Market";
};

// ──────────────────────────────────────────────
// ANIMATION FUNCTIONS
// ──────────────────────────────────────────────

const resetAndAnimateEntrance = (animations: AnimationRefs) => {
  const { fadeAnim, slideAnim, scaleAnim } = animations;

  fadeAnim.setValue(0);
  slideAnim.setValue(50);
  scaleAnim.setValue(0.9);

  Animated.parallel([
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }),
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }),
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }),
  ]).start();
};

const animateContent = (priceAnim: Animated.Value, chartAnim: Animated.Value) => {
  Animated.sequence([
    Animated.timing(priceAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }),
    Animated.timing(chartAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }),
  ]).start();
};

// ──────────────────────────────────────────────
// COMPONENTS
// ──────────────────────────────────────────────

const LoadingScreen = ({ coinName }: { coinName: string }) => (
  <LinearGradient colors={["#1a0b2e", "#2d1b4e", "#51229c"]} style={styles.loader}>
    <View style={styles.loaderContent}>
      <ActivityIndicator size="large" color="#a78bfa" />
      <Text style={styles.loadingText}>Loading {coinName}...</Text>
      <View style={styles.loadingBar} />
    </View>
  </LinearGradient>
);

const ErrorScreen = ({ 
  coinName, 
  error, 
  onRetry 
}: { 
  coinName: string; 
  error: string;
  onRetry: () => void;
}) => (
  <LinearGradient colors={["#1a0b2e", "#2d1b4e", "#51229c"]} style={styles.loader}>
    <View style={styles.loaderContent}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTitle}>Failed to load {coinName}</Text>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  </LinearGradient>
);

const Header = ({ coinName, fadeAnim }: { coinName: string; fadeAnim: Animated.Value }) => (
  <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.back();
      }}
      style={styles.backButton}
    >
      <AntDesign name="left" size={24} color="#e0e7ff" />
    </TouchableOpacity>
    <Text style={styles.title} numberOfLines={1}>
      {coinName}
    </Text>
    <View style={{ width: 40 }} />
  </Animated.View>
);

const PriceCard = ({
  coinImage,
  currentPrice,
  percentChange,
  isPositive,
  priceAnim,
  slideAnim,
  scaleAnim,
}: {
  coinImage: string | null;
  currentPrice: number;
  percentChange: number;
  isPositive: boolean;
  priceAnim: Animated.Value;
  slideAnim: Animated.Value;
  scaleAnim: Animated.Value;
}) => (
  <Animated.View
    style={[
      styles.card,
      {
        opacity: priceAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      },
    ]}
  >
    <LinearGradient
      colors={[
        isPositive ? "rgba(167,139,250,0.2)" : "rgba(239,68,68,0.1)",
        "rgba(81,34,156,0.8)",
      ]}
      style={styles.cardGradient}
    >
      {coinImage && (
        <View style={styles.iconWrap}>
          <View
            style={[
              styles.iconGlow,
              {
                backgroundColor: isPositive
                  ? "rgba(167,139,250,0.4)"
                  : "rgba(239,68,68,0.3)",
              },
            ]}
          />
          <Image source={{ uri: coinImage }} style={styles.icon} />
        </View>
      )}

      <Text style={styles.priceLabel}>Current Price</Text>
      <Text style={styles.price}>{formatCurrency(currentPrice)}</Text>

      <View style={styles.changeRow}>
        <View
          style={[
            styles.changeBadge,
            {
              backgroundColor: isPositive
                ? "rgba(167,139,250,0.3)"
                : "rgba(239,68,68,0.2)",
            },
          ]}
        >
          <AntDesign
            name={isPositive ? "up" : "down"}
            size={16}
            color={isPositive ? "#a78bfa" : "#ef4444"}
          />
          <Text
            style={[
              styles.changeText,
              { color: isPositive ? "#a78bfa" : "#ef4444" },
            ]}
          >
            {Math.abs(percentChange).toFixed(2)}%
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.sentimentBadge,
          { borderColor: isPositive ? "#a78bfa" : "#ef4444" },
        ]}
      >
        <Text
          style={[
            styles.sentimentText,
            { color: isPositive ? "#a78bfa" : "#ef4444" },
          ]}
        >
          {getSentimentText(percentChange)}
        </Text>
      </View>
    </LinearGradient>
  </Animated.View>
);

const StatsGrid = ({
  coinData,
  priceAnim,
  slideAnim,
}: {
  coinData: CoinData | null;
  priceAnim: Animated.Value;
  slideAnim: Animated.Value;
}) => {
  const marketCap = coinData?.market_data?.market_cap?.usd;
  const volume24h = coinData?.market_data?.total_volume?.usd;
  const high24h = coinData?.market_data?.high_24h?.usd;
  const low24h = coinData?.market_data?.low_24h?.usd;

  if (!marketCap && !volume24h && !high24h && !low24h) return null;

  return (
    <Animated.View
      style={[
        styles.statsGrid,
        {
          opacity: priceAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {marketCap && (
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Market Cap</Text>
          <Text style={styles.statValue}>{formatBillions(marketCap)}</Text>
        </View>
      )}
      {volume24h && (
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>24h Volume</Text>
          <Text style={styles.statValue}>{formatBillions(volume24h)}</Text>
        </View>
      )}
      {high24h && (
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>24h High</Text>
          <Text style={styles.statValue}>{formatCurrency(high24h)}</Text>
        </View>
      )}
      {low24h && (
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>24h Low</Text>
          <Text style={styles.statValue}>{formatCurrency(low24h)}</Text>
        </View>
      )}
    </Animated.View>
  );
};

const RangeSelector = ({
  selectedRange,
  onRangeChange,
}: {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}) => (
  <View style={styles.range}>
    {TIME_RANGES.map((r) => (
      <TouchableOpacity
        key={r}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onRangeChange(r);
        }}
        style={[styles.rangeBtn, selectedRange === r && styles.rangeActive]}
      >
        <Text
          style={[
            styles.rangeText,
            { color: selectedRange === r ? "#fff" : "#64748b" },
          ]}
        >
          {r}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const ChartCard = ({
  prices,
  currentPrice,
  isPositive,
  chartAnim,
}: {
  prices: number[];
  currentPrice: number;
  isPositive: boolean;
  chartAnim: Animated.Value;
}) => (
  <Animated.View
    style={[
      styles.chartCard,
      {
        opacity: chartAnim,
        transform: [
          {
            translateY: chartAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          },
        ],
      },
    ]}
  >
    <LinearGradient
      colors={["rgba(81,34,156,0.7)", "rgba(45,27,78,0.5)"]}
      style={styles.chartGradient}
    >
      <Text style={styles.chartTitle}>Price Chart</Text>

      <LineChart
        data={{ labels: [], datasets: [{ data: prices }] }}
        width={SCREEN_WIDTH - 64}
        height={280}
        withDots={false}
        withInnerLines={false}
        withOuterLines={false}
        withShadow
        bezier
        chartConfig={{
          backgroundGradientFrom: "transparent",
          backgroundGradientTo: "transparent",
          color: () => (isPositive ? "#a78bfa" : "#ef4444"),
          fillShadowGradient: isPositive ? "#a78bfa" : "#ef4444",
          fillShadowGradientOpacity: 0.3,
          decimalPlaces: 2,
          strokeWidth: 3,
        }}
        style={styles.chart}
      />

      <View
        style={[
          styles.currentPriceBadge,
          { backgroundColor: isPositive ? "#7c3aed" : "#ef4444" },
        ]}
      >
        <Text style={styles.currentPriceText}>{formatCurrency(currentPrice)}</Text>
      </View>
    </LinearGradient>
  </Animated.View>
);

const PriceRangeIndicator = ({
  currentPrice,
  high24h,
  low24h,
  isPositive,
  chartAnim,
}: {
  currentPrice: number;
  high24h: number;
  low24h: number;
  isPositive: boolean;
  chartAnim: Animated.Value;
}) => {
  const rangePosition = ((currentPrice - low24h) / (high24h - low24h)) * 100;

  return (
    <Animated.View style={[styles.priceRange, { opacity: chartAnim }]}>
      <Text style={styles.priceRangeTitle}>24h Price Range</Text>
      <View style={styles.priceRangeBar}>
        <View style={styles.priceRangeTrack} />
        <View
          style={[
            styles.priceRangeIndicator,
            {
              left: `${rangePosition}%`,
              backgroundColor: isPositive ? "#a78bfa" : "#ef4444",
            },
          ]}
        />
      </View>
      <View style={styles.priceRangeLabels}>
        <Text style={styles.priceRangeLabel}>{formatCurrency(low24h)}</Text>
        <Text style={styles.priceRangeLabel}>{formatCurrency(high24h)}</Text>
      </View>
    </Animated.View>
  );
};

// ──────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────

export default function CoinDetailScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const coinId = Array.isArray(id) ? id[0] : id;
  const coinName = Array.isArray(name) ? name[0] : name;

  const [selectedRange, setSelectedRange] = useState<TimeRange>("1M");
  const animations = useAnimations();
  const { prices, coinImage, coinData, loading, error, refetch } = useCoinData(coinId, selectedRange);

  useEffect(() => {
    if (!loading && prices.length > 0) {
      resetAndAnimateEntrance(animations);
      animateContent(animations.priceAnim, animations.chartAnim);
    }
  }, [loading, prices]);

  if (loading) {
    return <LoadingScreen coinName={coinName} />;
  }

  if (error || prices.length === 0) {
    return <ErrorScreen coinName={coinName} error={error || "No data available"} onRetry={refetch} />;
  }

  const currentPrice = prices[prices.length - 1];
  const firstPrice = prices[0];
  const percentChange = calculatePercentChange(currentPrice, firstPrice);
  const isPositive = percentChange >= 0;

  const high24h = coinData?.market_data?.high_24h?.usd;
  const low24h = coinData?.market_data?.low_24h?.usd;

  return (
    <LinearGradient colors={["#1a0b2e", "#2d1b4e", "#51229c"]} style={styles.container}>
      <Animated.View
        style={[
          styles.bgGlow,
          {
            opacity: animations.fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.3],
            }),
            backgroundColor: isPositive ? "#a78bfa" : "#ef4444",
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Header coinName={coinName} fadeAnim={animations.fadeAnim} />

        <PriceCard
          coinImage={coinImage}
          currentPrice={currentPrice}
          percentChange={percentChange}
          isPositive={isPositive}
          priceAnim={animations.priceAnim}
          slideAnim={animations.slideAnim}
          scaleAnim={animations.scaleAnim}
        />

        <StatsGrid
          coinData={coinData}
          priceAnim={animations.priceAnim}
          slideAnim={animations.slideAnim}
        />

        <RangeSelector selectedRange={selectedRange} onRangeChange={setSelectedRange} />

        <ChartCard
          prices={prices}
          currentPrice={currentPrice}
          isPositive={isPositive}
          chartAnim={animations.chartAnim}
        />

        {high24h && low24h && (
          <PriceRangeIndicator
            currentPrice={currentPrice}
            high24h={high24h}
            low24h={low24h}
            isPositive={isPositive}
            chartAnim={animations.chartAnim}
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
}

// ──────────────────────────────────────────────
// STYLES
// ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingTop: 60, paddingBottom: 40 },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContent: {
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#c4b5fd",
    fontWeight: "700",
    fontSize: 16,
  },
  loadingBar: {
    width: 120,
    height: 4,
    backgroundColor: "rgba(167,139,250,0.3)",
    borderRadius: 2,
    marginTop: 12,
    overflow: "hidden",
  },

  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  errorText: {
    color: "#94a3b8",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  bgGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 400,
    borderRadius: 200,
    transform: [{ scale: 2 }],
    opacity: 0.2,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(81,34,156,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    flex: 1,
    textAlign: "center",
  },

  card: {
    borderRadius: 32,
    marginBottom: 20,
    overflow: "hidden",
  },
  cardGradient: {
    padding: 32,
    alignItems: "center",
  },

  iconWrap: {
    marginBottom: 20,
    position: "relative",
  },
  iconGlow: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    top: -12,
    left: -12,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.1)",
  },

  priceLabel: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  price: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: -1,
  },

  changeRow: {
    marginTop: 16,
    marginBottom: 16,
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeText: {
    fontWeight: "800",
    fontSize: 16,
  },

  sentimentBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
  },
  sentimentText: {
    fontWeight: "700",
    fontSize: 14,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "rgba(81,34,156,0.5)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.2)",
  },
  statLabel: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },

  range: {
    flexDirection: "row",
    backgroundColor: "rgba(81,34,156,0.4)",
    borderRadius: 20,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.2)",
  },
  rangeBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 16,
  },
  rangeActive: {
    backgroundColor: "#7c3aed",
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  rangeText: {
    fontWeight: "700",
    fontSize: 14,
  },

  chartCard: {
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 20,
  },
  chartGradient: {
    padding: 20,
  },
  chartTitle: {
    color: "#e0e7ff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  currentPriceBadge: {
    position: "absolute",
    top: 24,
    right: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  currentPriceText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },

  priceRange: {
    backgroundColor: "rgba(81,34,156,0.5)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.2)",
  },
  priceRangeTitle: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  priceRangeBar: {
    height: 8,
    position: "relative",
    marginBottom: 8,
  },
  priceRangeTrack: {
    position: "absolute",
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
  },
  priceRangeIndicator: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    top: -4,
    marginLeft: -8,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  priceRangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceRangeLabel: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
  },
});