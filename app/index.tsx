import { StyleSheet, TextInput, View, FlatList, Text } from "react-native";
import * as React from "react";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { theme } from "../theme";

type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
};

const initialItems: ShoppingListItemType[] = [
  { id: "1", name: "Coffee", completedAtTimestamp: undefined },
  { id: "2", name: "Rice", completedAtTimestamp: undefined },
  { id: "3", name: "Tea", completedAtTimestamp: undefined },
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
      {
        id: Date.now().toString(),
        name: value,
        completedAtTimestamp: undefined,
      },
      ...prev,
    ]);
    setValue("");
  }, [value]);

  const handleDelete = React.useCallback((id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleOnToggle = React.useCallback((id: string) => {
    setShoppingList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              completedAtTimestamp: item.completedAtTimestamp
                ? undefined
                : Date.now(),
            }
          : item,
      ),
    );
  }, []);

  return (
    <FlatList
      data={shoppingList}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}
      renderItem={({ item }) => (
        <ShoppingListItem
          onDelete={() => handleDelete(item.id)}
          onToggleComplete={() => handleOnToggle(item.id)}
          name={item.name}
          isCompleted={Boolean(item.completedAtTimestamp)}
        />
      )}
      ListEmptyComponent={
        <View>
          <Text>Your shopping list is empty</Text>
        </View>
      }
      ListHeaderComponent={
        <TextInput
          style={styles.textInput}
          placeholder="E.g. Coffe"
          value={value}
          onChangeText={setValue}
          returnKeyType="send"
          onSubmitEditing={handleSubmit}
        />
      }
    />
    // <ScrollView
    //   style={styles.container}
    //   contentContainerStyle={styles.contentContainer}
    //   stickyHeaderIndices={[0]}
    // >
    //   <TextInput
    //     style={styles.textInput}
    //     placeholder="E.g. Coffe"
    //     value={value}
    //     onChangeText={setValue}
    //     returnKeyType="send"
    //     onSubmitEditing={handleSubmit}
    //   />
    //   {shoppingList.map((item) => (
    //     <ShoppingListItem key={item.id} {...item} />
    //   ))}
    // </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 12,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  textInput: {
    borderColor: theme.colorLightGray,
    borderWidth: 1,
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 9999999,
    backgroundColor: theme.colorWhite,
  },
});
