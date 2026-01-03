import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { theme } from "../theme";

interface Props {
  name: string;
}

export function ShoppingListItem({ name }: Props) {
  const handleDelete = () => {
    Alert.alert(
      `Are you sure you want to delete ${name}?`,
      "This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => console.log("Deleted"),
        },
      ],
    );
  };

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{name}</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleDelete}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.colorCerulean,
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 200,
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: "bold",
  },
});
