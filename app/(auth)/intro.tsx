import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Intro() {
  return (
    <View style={styles.container}>
      
      {/* TOP SECTION */}
      <View style={styles.topSection}>
        <Image
          source={require('../../assets/images/cryptoman.png')}
          style={styles.topimage}
          resizeMode="contain"
        />
      </View>

      {/* BOTTOM SECTION */}
      <LinearGradient
        colors={['#0B0F1A', '#111827', '#1E1B4B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bottomSection}
      >
        <Text style={styles.text}>Welcome to Crypto Tracker! 📈</Text>

        <View style={styles.buttonContainer}>

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/login")}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Login</Text>
          </TouchableOpacity>

          {/* SIGNUP BUTTON */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/signup")}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.belowText}>Let's get started!</Text>
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
    height: 450,
    backgroundColor: '#51229cff',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: 'center',
    justifyContent: "flex-end",
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
    marginBottom: 24,
  },

  buttonContainer: {
    width: '100%',
    gap: 14,
  },

  /* 🔮 PRIMARY PURPLE BUTTON */
  primaryButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 30, // CURVED LOOK
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  /* 🌌 SECONDARY OUTLINE BUTTON */
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#A78BFA',
    fontSize: 16,
    fontWeight: '600',
  },
  belowText: {
    fontSize:20,
    color: "#ffff",
    alignItems:"center",
    justifyContent: "center",
    marginTop:20,
  }
});
