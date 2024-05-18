import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar, Text, View, Dimensions, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from "react-i18next";
import styles from './AppIntro.styles';

const AppIntro = ({ onFinish }) => {
  const [sliderState, setSliderState] = useState({ currentPage: 0 });
  const { width, height } = Dimensions.get('window');
  const {t} = useTranslation();

  const setSliderPage = (event) => {
    const { currentPage } = sliderState;
    const { x } = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.floor(x / width);
    if (indexOfNextScreen !== currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: indexOfNextScreen,
      });
    }
  };

  const handleIntroFinish = async () => {
    try {
      await AsyncStorage.setItem('introShown', 'true');
      onFinish();
    } catch (error) {
      console.error('Error marking intro as shown:', error);
    }
  };

  const { currentPage: pageIndex } = sliderState;

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          horizontal={true}
          scrollEventThrottle={16}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            setSliderPage(event);
          }}
        >
          <View style={{ width, height }}>
            <Image source={require('../../../assets/RestoIntro.png')} style={styles.imageStyle} />
            <View style={styles.wrapper}>
              <Text style={styles.header}>{t('pages.Intro.RestoIntro')}</Text>
              <Text style={styles.paragraph}>{t('pages.Intro.RestoInfo')}</Text>
            </View>
          </View>
          <View style={{ width, height }}>
            <Image
              source={require('../../../assets/MapIntro.png')}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>{t('pages.Intro.MapIntro')}</Text>
              <Text style={styles.paragraph}>{t('pages.Intro.MapInfo')}</Text>
            </View>
          </View>
          <View style={{ width, height }}>
            <Image
              source={require('../../../assets/ProfileIntro.png')}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>{t('pages.Intro.ProfileIntro')}</Text>
              <Text style={styles.paragraph}>{t('pages.Intro.ProfileInfo')}</Text>
            </View>
          </View>
        </ScrollView>
        <View>
          {pageIndex === 2 && (
            <Button title="Finish" onPress={handleIntroFinish} />
          )}
        </View>
        <View style={styles.paginationWrapper}>
          {Array.from(Array(3).keys()).map((key, index) => (
            <View style={[styles.paginationDots, { opacity: pageIndex === index ? 1 : 0.2 }]} key={index} />
          ))}
        </View>
      </SafeAreaView>
    </>
  );
};

export default AppIntro;
