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
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutDown,
  SlideOutLeft,
  SlideOutRight,
  SlideOutUp
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import Airplane from "./components/Airplane";
import Birds from "./components/Birds";
import Fireworks from "./components/Fireworks";
import Fruit from "./components/Fruit";
import Hearts from "./components/Hearts";
import Pinwheels from "./components/Pinwheels";
import SettingsMenu from "./components/SettingsMenu";
import Smileys from "./components/Smileys";
import Squares from "./components/Squares";
import Stairs from "./components/Stairs";
import Stars from "./components/Stars";
import Truck from "./components/Truck";
const animationItems = [
  { name: "Stars", component: Stars },
  { name: "Fireworks", component: Fireworks },
  { name: "Squares", component: Squares },
  { name: "Fruit", component: Fruit },
  { name: "Truck", component: Truck },
  { name: "Stairs", component: Stairs },
  { name: "Hearts", component: Hearts },
  { name: "Birds", component: Birds },
  { name: "Airplane", component: Airplane },
  { name: "Smileys", component: Smileys },
  { name: "Pinwheels", component: Pinwheels },
];

const musicTracks = [require("../assets/music/no1.mp3")];
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

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [intervalDuration, setIntervalDuration] = useState(10000);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [animationStates, setAnimationStates] = useState<Record<string, boolean>>(
    () => {
      const initialStates: Record<string, boolean> = {};
      animationItems.forEach((item) => {
        initialStates[item.name] = true;
      });
      return initialStates;
    }
  );

  const activeAnimations = animationItems.filter(
    (item) => animationStates[item.name]
  );

  // Ensure we don't crash if all animations are disabled
  const ActiveAnimation = activeAnimations.length > 0
    ? activeAnimations[index % activeAnimations.length].component
    : null;

  const player = useAudioPlayer(musicTracks[currentTrackIndex]);
  const audioStatus = useAudioPlayerStatus(player);

  const twoFingerLongPress = Gesture.LongPress()
    .minDuration(800)
    .numberOfPointers(3)
    .onStart(() => {
      scheduleOnRN(setShowSettings, true);
    });

  useEffect(() => {
    if (showPaywall || !animationsEnabled || activeAnimations.length === 0) {
      return;
    }
    const intervalId = setInterval(() => {
      setIndex((prev) => (prev + 1) % activeAnimations.length);
    }, intervalDuration);
    return () => clearInterval(intervalId);
  }, [showPaywall, animationsEnabled, intervalDuration, activeAnimations.length]);

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
    if (showPaywall || !isMusicPlaying) {
      if (audioStatus.playing) {
        player.pause();
      }
      return;
    }
    if (!audioStatus.playing) {
      player.loop = true;
      player.play();
    }
  }, [
    audioStatus.isLoaded,
    audioStatus.playing,
    player,
    showPaywall,
    isMusicPlaying,
  ]);

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
    if (!hasShownPaywall && pageChanges >= animationItems.length + 1) {
      setShowPaywall(true);
      setHasShownPaywall(true);
    }
  }, [pageChanges, hasShownPaywall]);

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % musicTracks.length);
  };

  const handleToggleAnimation = (name: string, value: boolean) => {
    setAnimationStates((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={twoFingerLongPress}>
        <View style={styles.screen}>
          <StatusBar hidden />
          <Animated.View
            key={index}
            style={styles.animationContainer}
            entering={transition.entering}
            exiting={transition.exiting}
          >
            {!showPaywall && isContentVisible && ActiveAnimation ? (
              <ActiveAnimation />
            ) : null}
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
          <SettingsMenu
            visible={showSettings}
            onClose={() => setShowSettings(false)}
            animationsEnabled={animationsEnabled}
            onToggleAnimations={setAnimationsEnabled}
            animationStates={animationStates}
            onToggleAnimation={handleToggleAnimation}
            intervalDuration={intervalDuration}
            onIntervalChange={setIntervalDuration}
            isMusicPlaying={isMusicPlaying}
            onToggleMusic={() => setIsMusicPlaying((prev) => !prev)}
            onNextTrack={handleNextTrack}
          />
        </View>
      </GestureDetector></GestureHandlerRootView>
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
