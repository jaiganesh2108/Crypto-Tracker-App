import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Signup() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>

          {/* TOP SECTION */}
          <View style={styles.topSection}>
            <LottieView
              source={require("../../assets/Login Leady.json")}
              autoPlay
              loop
              resizeMode="cover"
              style={styles.lottie}
            />
            <View pointerEvents="none" style={styles.overlay} />
          </View>

          {/* BOTTOM SECTION */}
          <LinearGradient
            colors={["#0B0F1A", "#111827", "#1E1B4B"]}
            style={styles.bottomSection}
          >
            <View style={styles.formContainer}>

              <Text style={styles.heading}>Sign Up</Text>
              <Text style={styles.subHeading}>Let’s get you started</Text>

              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                style={styles.input}
              />

              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                placeholder="Re-enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                style={styles.input}
              />

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.replace("/")}
              >
                <Text style={styles.loginText}>Create Account</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.divider} />
              </View>

              {/* Social Login */}
              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <AntDesign name="google" size={22} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                  <FontAwesome name="instagram" size={22} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                  <FontAwesome name="facebook" size={22} color="white" />
                </TouchableOpacity>
              </View>

            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#51229cff",
  },

  topSection: {
    height: 250,
    width: "100%",
    justifyContent: "center",
    alignItems: "center", 
    overflow: "hidden",
  },

  lottie: {
    width: 180,  
    height: 100, 
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  bottomSection: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    overflow: "hidden",
  },

  formContainer: {
    paddingTop: 40,
    paddingHorizontal: 30,
  },

  heading: {
    color: "white",
    fontSize: 30,
    fontWeight: "600",
  },

  subHeading: {
    color: "#E5E7EB",
    fontSize: 16,
    marginBottom: 25,
  },

  label: {
    color: "#E5E7EB",
    marginBottom: 6,
    fontSize: 14,
  },

  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 10,
    paddingHorizontal: 12,
    color: "white",
    marginBottom: 18,
  },

  loginButton: {
    backgroundColor: "#51229cff",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  loginText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#374151",
  },

  orText: {
    color: "#9CA3AF",
    marginHorizontal: 10,
    fontSize: 12,
  },

  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },

  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
    marginHorizontal: 9,
  },
});
