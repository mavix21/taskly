import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import * as React from "react";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Duration, intervalToDuration, isBefore } from "date-fns";
import TimeSegment from "../../components/TimeSegment";
import { getFromStorage, saveToStorage } from "../../utils/storage";

type CountdownStatus = {
  isOverdue: boolean;
  distance: Duration;
};

export type PersistedCountdownState = {
  currentNotificationId: string | undefined;
  completedAtTimestamps: number[];
};

export const countdownStorageKey = "taskly-countdown";

// 10 seconds from now
const frequency = 10 * 1000;

export default function CounterScreen() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [countdownState, setCountdownState] =
    React.useState<PersistedCountdownState>();

  const [status, setStatus] = React.useState<CountdownStatus>({
    isOverdue: false,
    distance: {},
  });

  const lastCompletedTimestamp = countdownState?.completedAtTimestamps[0];

  React.useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(countdownStorageKey);
      setCountdownState(value);
      setIsLoading(false);
    };
    init();
  }, []);

  React.useEffect(() => {
    const id = setInterval(() => {
      const timestamp = lastCompletedTimestamp
        ? lastCompletedTimestamp + frequency
        : Date.now();
      const isOverdue = isBefore(timestamp, Date.now());
      const distance = intervalToDuration(
        isOverdue
          ? { start: timestamp, end: Date.now() }
          : { start: Date.now(), end: timestamp },
      );
      setStatus({ isOverdue, distance });
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [lastCompletedTimestamp]);

  const schedulePushNotification = React.useCallback(async () => {
    let pushNotificationId;
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "The thing is due! ⌛",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: frequency / 1000,
          channelId: "default",
        },
      });
    } else {
      if (Device.isDevice) {
        Alert.alert(
          "Unable to schedule notification",
          "Enable the notification permission for Expo Go in settings",
        );
      }
    }

    if (countdownState?.currentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        countdownState?.currentNotificationId,
      );
    }

    const newCountdownState: PersistedCountdownState = {
      currentNotificationId: pushNotificationId,
      completedAtTimestamps: countdownState
        ? [Date.now(), ...countdownState.completedAtTimestamps]
        : [Date.now()],
    };
    setCountdownState(newCountdownState);
    await saveToStorage(countdownStorageKey, newCountdownState);
  }, [countdownState]);

  if (isLoading) {
    return <ActivityIndicator style={styles.activityIndicatorContainer} />;
  }

  return (
    <View
      style={[
        styles.container,
        status.isOverdue ? styles.containerLate : undefined,
      ]}
    >
      {status.isOverdue ? (
        <Text style={[styles.heading, styles.whiteText]}>Thing overdue by</Text>
      ) : (
        <Text style={styles.heading}>Thing due in</Text>
      )}
      <View style={styles.row}>
        <TimeSegment
          textStyle={status.isOverdue ? styles.whiteText : undefined}
          unit="Days"
          number={status.distance.days ?? 0}
        />
        <TimeSegment
          textStyle={status.isOverdue ? styles.whiteText : undefined}
          unit="Hours"
          number={status.distance.hours ?? 0}
        />
        <TimeSegment
          textStyle={status.isOverdue ? styles.whiteText : undefined}
          unit="Minutes"
          number={status.distance.minutes ?? 0}
        />
        <TimeSegment
          textStyle={status.isOverdue ? styles.whiteText : undefined}
          unit="Seconds"
          number={status.distance.seconds ?? 0}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={schedulePushNotification}
      >
        <Text style={styles.buttonText}>I&apos;ve done the thing</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  containerLate: {
    backgroundColor: theme.colorRed,
  },
  activityIndicatorContainer: {
    backgroundColor: theme.colorWhite,
    justifyContent: "center",
    alignContent: "center",
    flex: 1,
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginBottom: 24,
  },
  whiteText: {
    color: theme.colorWhite,
  },
});
