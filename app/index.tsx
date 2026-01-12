import { View, StyleSheet, TextInput } from "react-native";
import * as React from "react";
import { ShoppingListItem } from "../components/ShoppingListItem";

type ShoppingListItemType = {
  id: string;
  name: string;
  isCompleted: boolean;
};

const initialItems: ShoppingListItemType[] = [
  { id: "1", name: "Coffee", isCompleted: false },
  { id: "2", name: "Rice", isCompleted: false },
  { id: "3", name: "Tea", isCompleted: true },
];

export default function App() {
  const [shoppingList, setShoppingList] =
    React.useState<ShoppingListItemType[]>(initialItems);
  const [value, setValue] = React.useState("");

  const handleSubmit = React.useCallback(() => {
    if (!value || value.trim() === "") {
      return;
    }

    setShoppingList((prev) => [
      { id: Date.now().toString(), name: value, isCompleted: false },
      ...prev,
    ]);
    setValue("");
  }, [value]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="E.g. Coffe"
        value={value}
        onChangeText={setValue}
        returnKeyType="send"
        onSubmitEditing={handleSubmit}
      />
      {shoppingList.map((item) => (
        <ShoppingListItem key={item.id} {...item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    flex: 1,
    backgroundColor: "#fff",
  },
  textInput: {
    borderColor: "#eee",
    borderWidth: 1,
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 9999999,
  },
});
