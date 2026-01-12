import { StyleSheet, TextInput, View, FlatList, Text } from "react-native";
import * as React from "react";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { theme } from "../theme";

type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp: number;
};

const initialItems: ShoppingListItemType[] = [
  {
    id: "1",
    name: "Coffee",
    completedAtTimestamp: undefined,
    lastUpdatedTimestamp: Date.now(),
  },
  {
    id: "2",
    name: "Rice",
    completedAtTimestamp: undefined,
    lastUpdatedTimestamp: Date.now(),
  },
  {
    id: "3",
    name: "Tea",
    completedAtTimestamp: undefined,
    lastUpdatedTimestamp: Date.now(),
  },
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
        lastUpdatedTimestamp: Date.now(),
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
              lastUpdatedTimestamp: Date.now(),
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
      data={orderShoppingList(shoppingList)}
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

function orderShoppingList(shoppingList: ShoppingListItemType[]) {
  return shoppingList.sort((item1, item2) => {
    if (item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return item2.completedAtTimestamp - item1.completedAtTimestamp;
    }

    if (item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return 1;
    }

    if (!item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return -1;
    }

    if (!item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return item2.lastUpdatedTimestamp - item1.lastUpdatedTimestamp;
    }

    return 0;
  });
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
