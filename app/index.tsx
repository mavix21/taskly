import { View, StyleSheet } from "react-native";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { Link } from "expo-router";

export default function App() {
  return (
    <View style={styles.container}>
      <Link href="/counter" style={{ textAlign: "center", marginBottom: 10 }}>
        Go to counter
      </Link>
      <ShoppingListItem name="Coffe" />
      <ShoppingListItem name="Rice" isCompleted={true} />
      <ShoppingListItem name="Tea" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
