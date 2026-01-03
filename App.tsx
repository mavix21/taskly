import { View, StyleSheet } from "react-native";
import { ShoppingListItem } from "./components/ShoppingListItem";

export default function App() {
  return (
    <View style={styles.container}>
      <ShoppingListItem name="Coffe" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
}
