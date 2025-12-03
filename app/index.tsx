import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import React, { useEffect, useState } from "react";
import {
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutDown,
  SlideOutLeft,
  SlideOutRight,
  SlideOutUp,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import Airplane from "./components/Airplane";
import Birds from "./components/Birds";
import Fireworks from "./components/Fireworks";
import Fruit from "./components/Fruit";
import Hearts from "./components/Hearts";
import Smileys from "./components/Smileys";
import Squares from "./components/Squares";
import Stairs from "./components/Stairs";
import Stars from "./components/Stars";
import Truck from "./components/Truck";
const animations = [Stars, Fireworks, Squares, Fruit, Truck, Stairs, Hearts, Birds, Airplane, Smileys];
const baseDirectionPairs = [
  { entering: SlideInLeft, exiting: SlideOutRight },
  { entering: SlideInRight, exiting: SlideOutLeft },
  { entering: SlideInUp, exiting: SlideOutDown },
  { entering: SlideInDown, exiting: SlideOutUp },
];
function getRandomDirectionPair(onEntered?: () => void) {
  const pair =
    baseDirectionPairs[Math.floor(Math.random() * baseDirectionPairs.length)];
  const enteringBase = pair.entering.duration(300);
  const entering = onEntered
    ? enteringBase.withCallback((finished) => {
      "worklet";
      if (finished && onEntered) {
        scheduleOnRN(onEntered);
      }
    })
    : enteringBase;
  return {
    entering,
    exiting: pair.exiting.duration(300),
  };
}
const timeBetweenPages = 10000;
export default function Home() {
  const [index, setIndex] = useState(0);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [transition, setTransition] = useState(() =>
    getRandomDirectionPair(() => {
      setIsContentVisible(true);
    }),
  );
  const [pageChanges, setPageChanges] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasShownPaywall, setHasShownPaywall] = useState(true);
  const ActiveAnimation = animations[index];
  const player = useAudioPlayer(require("../assets/music/no1.mp3"));
  const audioStatus = useAudioPlayerStatus(player);
  useEffect(() => {
    if (showPaywall) {
      return;
    }
    const intervalId = setInterval(() => {
      setIndex((prev) => (prev + 1) % animations.length);
    }, timeBetweenPages);
    return () => clearInterval(intervalId);
  }, [showPaywall]);
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
    });
  }, []);
  useEffect(() => {
    if (!audioStatus.isLoaded) {
      return;
    }
    if (showPaywall) {
      if (audioStatus.playing) {
        player.pause();
      }
      return;
    }
    if (!audioStatus.playing) {
      player.loop = true;
      player.play();
    }
  }, [audioStatus.isLoaded, audioStatus.playing, player, showPaywall]);
  useEffect(() => {
    setIsContentVisible(false);
    setTransition(
      getRandomDirectionPair(() => {
        setIsContentVisible(true);
      }),
    );
    setPageChanges((prev) => prev + 1);
  }, [index]);
  useEffect(() => {
    if (!hasShownPaywall && pageChanges >= animations.length + 1) {
      setShowPaywall(true);
      setHasShownPaywall(true);
    }
  }, [pageChanges, hasShownPaywall]);
  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <Animated.View
        key={index}
        style={styles.animationContainer}
        entering={transition.entering}
        exiting={transition.exiting}
      >
        {!showPaywall && isContentVisible ? <ActiveAnimation /> : null}
      </Animated.View>
      <Modal visible={showPaywall} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Support Baby Binge</Text>
            <Text style={styles.modalText}>
              Help keep the animations going by contributing.
            </Text>
            <TouchableOpacity
              style={styles.modalButtonPrimary}
              onPress={() => setShowPaywall(false)}
            >
              <Text style={styles.modalButtonPrimaryText}>Pay now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonSecondary}
              onPress={() => setShowPaywall(false)}
            >
              <Text style={styles.modalButtonSecondaryText}>Maybe later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
  },
  animationContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#111",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
    color: "#fff",
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#ddd",
    textAlign: "center",
    marginBottom: 16,
  },
  modalButtonPrimary: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#ffcc00",
  },
  modalButtonPrimaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  modalButtonSecondary: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#555",
  },
  modalButtonSecondaryText: {
    fontSize: 16,
    color: "#fff",
  },
});
