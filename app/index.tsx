import { Stack } from "expo-router";
import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const theme = useColorScheme();
  const isDark = theme === "dark";
  const insets = useSafeAreaInsets();
  const [billAmount, setBillAmount] = useState("");
  const [numPeople, setNumPeople] = useState("");
  const [tipPercentage, setTipPercentage] = useState("15");
  const [roundingMode, setRoundingMode] = useState("none"); // none, up, down
  const [savedSplits, setSavedSplits] = useState<any[]>([]);

  const calculateSplit = () => {
    if (!billAmount || !numPeople) return 0;

    const bill = parseFloat(billAmount);
    const people = parseInt(numPeople);
    const tipMultiplier = 1 + parseFloat(tipPercentage) / 100;
    let amountPerPerson = (bill * tipMultiplier) / people;

    if (roundingMode === "up") {
      amountPerPerson = Math.ceil(amountPerPerson);
    } else if (roundingMode === "down") {
      amountPerPerson = Math.floor(amountPerPerson);
    }

    return amountPerPerson;
  };

  const saveSplit = () => {
    const newSplit = {
      id: Date.now(),
      bill: billAmount,
      people: numPeople,
      tip: tipPercentage,
      perPerson: calculateSplit(),
    };
    setSavedSplits([newSplit, ...savedSplits]);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top,
        }}
        style={[styles.container, isDark && styles.containerDark]}
      >
        <Text style={[styles.amount, isDark && styles.amountDark]}>
          ${calculateSplit().toFixed(2)} test
        </Text>
        <View style={styles.content}>
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              keyboardType="decimal-pad"
              value={billAmount}
              onChangeText={setBillAmount}
              placeholder="Bill Amount"
              placeholderTextColor={isDark ? "#666" : "#999"}
            />

            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              keyboardType="number-pad"
              value={numPeople}
              onChangeText={setNumPeople}
              placeholder="Number of People"
              placeholderTextColor={isDark ? "#666" : "#999"}
            />

            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              keyboardType="number-pad"
              value={tipPercentage}
              onChangeText={setTipPercentage}
              placeholder="Tip %"
              placeholderTextColor={isDark ? "#666" : "#999"}
            />
          </View>

          <View style={styles.roundingGroup}>
            <TouchableOpacity
              style={[
                styles.pill,
                isDark && styles.pillDark,
                roundingMode === "none" &&
                  (isDark ? styles.pillActiveDark : styles.pillActive),
              ]}
              onPress={() => setRoundingMode("none")}
            >
              <Text style={[styles.pillText, isDark && styles.pillTextDark]}>
                None
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pill,
                isDark && styles.pillDark,
                roundingMode === "up" &&
                  (isDark ? styles.pillActiveDark : styles.pillActive),
              ]}
              onPress={() => setRoundingMode("up")}
            >
              <Text style={[styles.pillText, isDark && styles.pillTextDark]}>
                ↑
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pill,
                isDark && styles.pillDark,
                roundingMode === "down" &&
                  (isDark ? styles.pillActiveDark : styles.pillActive),
              ]}
              onPress={() => setRoundingMode("down")}
            >
              <Text style={[styles.pillText, isDark && styles.pillTextDark]}>
                ↓
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isDark && styles.saveButtonDark]}
            onPress={saveSplit}
          >
            <Text
              style={[
                styles.saveButtonText,
                isDark && styles.saveButtonTextDark,
              ]}
            >
              Save
            </Text>
          </TouchableOpacity>

          {savedSplits.length > 0 && (
            <View style={styles.history}>
              {savedSplits.map((split) => (
                <View
                  key={split.id}
                  style={[styles.historyItem, isDark && styles.historyItemDark]}
                >
                  <Text
                    style={[
                      styles.historyText,
                      isDark && styles.historyTextDark,
                    ]}
                  >
                    ${split.perPerson.toFixed(2)} × {split.people}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerDark: {
    backgroundColor: "#000",
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    gap: 12,
  },
  input: {
    fontSize: 16,
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    color: "#000",
  },
  inputDark: {
    backgroundColor: "#222",
    color: "#fff",
  },
  roundingGroup: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  pillDark: {
    backgroundColor: "#333",
  },
  pillActive: {
    backgroundColor: "#000",
  },
  pillActiveDark: {
    backgroundColor: "#fff",
  },
  pillText: {
    color: "#666",
    fontSize: 14,
  },
  pillTextDark: {
    color: "#999",
  },
  amount: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 40,
    color: "#000",
  },
  amountDark: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonDark: {
    backgroundColor: "#fff",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  saveButtonTextDark: {
    color: "#000",
  },
  history: {
    marginTop: 30,
    gap: 8,
  },
  historyItem: {
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  historyItemDark: {
    backgroundColor: "#222",
  },
  historyText: {
    fontSize: 14,
    color: "#666",
  },
  historyTextDark: {
    color: "#999",
  },
});
