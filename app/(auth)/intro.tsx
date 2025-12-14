import { View, Text, Button, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Intro() {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require('../../assets/images/cryptoman.png')}
          style={styles.topimage}
          resizeMode="contain"
        />
      </View>
      <LinearGradient
        colors={['#0B0F1A', '#111827', '#1E1B4B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bottomSection}
      >
        <Text style={styles.text}>Welcome to Crypto Tracker 🚀</Text>

        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={() => router.push("/login")} />
          <Button title="Sign Up" onPress={() => router.push("/signup")} />
        </View>
      </LinearGradient>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
  },

  topSection: {
    height: 500,
    backgroundColor: '#1F2937',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 2,
  },

  topimage: {
    width: '110%',
    height: 400,
  },

  bottomSection: {
    flex: 1,
    marginTop: -80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  text: {
    color: '#F9FAFB',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  buttonContainer: {
    width: '100%',
    gap: 12,
  },
});
