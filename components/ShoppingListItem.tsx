import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
  View,
} from "react-native";
import { theme } from "../theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

interface Props {
  name: string;
  isCompleted?: boolean;
  onDelete: () => void;
  onToggleComplete: () => void;
}

export function ShoppingListItem({
  name,
  isCompleted = false,
  onDelete,
  onToggleComplete,
}: Props) {
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
          onPress: onDelete,
        },
      ],
    );
  };

  return (
    <Pressable
      style={[
        styles.itemContainer,
        isCompleted ? styles.completedContainer : undefined,
      ]}
      onPress={onToggleComplete}
    >
      <View style={styles.row}>
        <Entypo
          name={isCompleted ? "check" : "circle"}
          size={24}
          color={isCompleted ? theme.colorGray : theme.colorCerulean}
        />
        <Text
          style={[
            styles.itemText,
            isCompleted ? styles.completedText : undefined,
          ]}
          numberOfLines={1}
        >
          {name}
        </Text>
      </View>
      <TouchableOpacity activeOpacity={0.8} onPress={handleDelete}>
        <AntDesign
          name="close-circle"
          size={24}
          color={isCompleted ? theme.colorGray : theme.colorRed}
        />
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: theme.colorWhite,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.colorCerulean,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  completedContainer: {
    backgroundColor: theme.colorLightGray,
    borderBottomColor: theme.colorLightGray,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 200,
    flex: 1,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: theme.colorGray,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
});
