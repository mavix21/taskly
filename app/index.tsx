import {
  StyleSheet,
  TextInput,
  View,
  FlatList,
  Text,
  LayoutAnimation,
} from "react-native";
import * as React from "react";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { theme } from "../theme";
import { getFromStorage, saveToStorage } from "../utils/storage";

const storageKey = "shopping-list";

type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp: number;
};

export default function App() {
  const [shoppingList, setShoppingList] = React.useState<
    ShoppingListItemType[]
  >([]);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    const fetchInitial = async () => {
      const data = await getFromStorage(storageKey);
      if (data) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShoppingList(data);
      }
    };
    fetchInitial();
  }, []);

  const handleSubmit = React.useCallback(() => {
    if (!value || value.trim() === "") {
      return;
    }

    const newShoppingList = [
      {
        id: Date.now().toString(),
        name: value,
        completedAtTimestamp: undefined,
        lastUpdatedTimestamp: Date.now(),
      },
      ...shoppingList,
    ];
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShoppingList(newShoppingList);
    setValue("");

    saveToStorage(storageKey, newShoppingList);
  }, [shoppingList, value]);

  const handleDelete = React.useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleOnToggle = React.useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
