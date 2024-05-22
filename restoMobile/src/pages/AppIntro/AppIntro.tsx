import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar, Text, View, Dimensions, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import styles from './AppIntro.styles';

const AppIntro = ({ onFinish }) => {
  const [sliderState, setSliderState] = useState({ currentPage: 0 });
  const { width, height } = Dimensions.get('window');
  const { t } = useTranslation();

  const setSliderPage = (event) => {
    const { x } = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.round(x / width);
    setSliderState({ currentPage: indexOfNextScreen });
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
          horizontal
          scrollEventThrottle={16}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={setSliderPage}
        >
          <View style={{ width, height }}>
            <Image source={require('../../assets/ScanIntro.png')} style={styles.imageStyle} />
            <View style={styles.wrapper}>
              <Text style={styles.header}>{t('pages.Intro.ScanIntro')}</Text>
              <Text style={styles.paragraph}>{t('pages.Intro.ScanInfo')}</Text>
            </View>
          </View>
          <View style={{ width, height }}>
            <Image
              source={require('../../assets/MyRestoIntro.png')}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>{t('pages.Intro.RestoIntro')}</Text>
              <Text style={styles.paragraph}>{t('pages.Intro.RestoInfo')}</Text>
            </View>
          </View>
          <View style={{ width, height }}>
            <Image
              source={require('../../assets/MyCategoriesIntro.png')}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>{t('pages.Intro.CategoriesIntro')}</Text>
              <Text style={styles.paragraph}>{t('pages.Intro.CategoriesInfo')}</Text>
            </View>
          </View>
          <View style={{ width, height }}>
            <Image
              source={require('../../assets/MyDishesIntro.png')}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>{t('pages.Intro.DishesIntro')}</Text>
              <Text style={styles.paragraph}>{t('pages.Intro.DishesInfo')}</Text>
            </View>
          </View>
          <View style={{ width, height }}>
            <Image
              source={require('../../assets/MyProductIntro.png')}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>{t('pages.Intro.ProductsIntro')}</Text>
              <Text style={styles.paragraph}>{t('pages.Intro.ProductsInfo')}</Text>
            </View>
          </View>
          <View style={{ width, height }}>
            <Image
              source={require('../../assets/MyProfileIntro.png')}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>{t('pages.Intro.ProfileIntro')}</Text>
              <Text style={styles.paragraph}>{t('pages.Intro.ProfileInfo')}</Text>
            </View>
          </View>
        </ScrollView>
        <View>
          {pageIndex >= 5 && (
            <Button title="Finish" onPress={handleIntroFinish} />
          )}
        </View>
        <View style={styles.paginationWrapper}>
          {Array.from(Array(6).keys()).map((key, index) => (
            <View
              style={[
                styles.paginationDots,
                { opacity: pageIndex === index ? 1 : 0.2 },
              ]}
              key={index}
            />
          ))}
        </View>
      </SafeAreaView>
    </>
  );
};

export default AppIntro;
