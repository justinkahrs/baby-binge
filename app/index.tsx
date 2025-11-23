import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
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
import Fireworks from "./components/Fireworks";
import Fruit from "./components/Fruit";
import Hearts from "./components/Hearts";
import Smileys from "./components/Smileys";
import Stars from "./components/Stars";
const animations = [Stars, Fruit, Smileys, Hearts, Fireworks];

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
    })
  );
  const ActiveAnimation = animations[index];
  const player = useAudioPlayer(require("../assets/music/no1.mp3"));
  const audioStatus = useAudioPlayerStatus(player);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prev) => (prev + 1) % animations.length);
    }, timeBetweenPages);
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
    });
  }, []);
  useEffect(() => {
    if (audioStatus.isLoaded && !audioStatus.playing) {
      player.loop = true;
      player.play();
    }
  }, [audioStatus.isLoaded, audioStatus.playing, player]);
  useEffect(() => {
    setIsContentVisible(false);
    setTransition(
      getRandomDirectionPair(() => {
        setIsContentVisible(true);
      })
    );
  }, [index]);
  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <Animated.View
        key={index}
        style={styles.animationContainer}
        entering={transition.entering}
        exiting={transition.exiting}
      >
        {isContentVisible ? <ActiveAnimation /> : null}
      </Animated.View>
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
});
