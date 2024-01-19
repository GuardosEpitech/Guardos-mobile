import React, { useEffect, useCallback, useState } from "react";
import { Text, View, ScrollView, ImageBackground, TouchableOpacity } from "react-native";
import styles from "./AddPage.styles";
import Icon from "react-native-vector-icons/Entypo";
import Trash from "react-native-vector-icons/FontAwesome";
import * as SplashScreen from "expo-splash-screen";
import axios from "axios";
import { API_URL } from '@env';
import IconBack from "react-native-vector-icons/AntDesign";
import IconUser from "react-native-vector-icons/FontAwesome";
import { IIngredients } from "src/models/ingedientsInterfaces";

console.log(API_URL)

SplashScreen.preventAutoHideAsync(); // Keep the splash screen visible while we fetch resources

import {
  useFonts,
  Montserrat_100Thin,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";



const AddPage = ({ navigation }: { navigation: any }) => {
  let [fontsLoaded] = useFonts({
    Montserrat_100Thin,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,

  });
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await fontsLoaded;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);
  const [IngrValue, setIngrValue] = useState<[IIngredients]>();

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  function GoToQRCode() {
    navigation.navigate("QRCodeEngin");
  }

  async function getIngr() {
    try {
      const response = await axios({
        method: "get",
        url: API_URL + "/get",
      });
      setIngrValue(response.data);
    } catch (err) {
      console.log(err);
    }
  }
  async function deleteIngr(body: string) {
    try {
      const response = await axios({
        method: "delete",
        url: API_URL + "/delete",
        data: { name: body },
      });
      if (response.status == 200) console.log("DELETE");
    } catch (err) {
      console.log(err);
    }
  }

  getIngr();

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={require('../../assets/background.png')} resizeMode="cover" style={styles.image}>
        <View onLayout={onLayoutRootView} style={{ alignItems: "center" }}>
          <View style={styles.DivTop}>
            <IconBack
              style={styles.IconBack}
              name="left"
              size={40}
              color="#4D4D4D"
            />
            <Text style={styles.CategorieTitle}>Ingredients</Text>
            <IconUser
              style={styles.IconUser}
              name="user"
              size={40}
              color="#4D4D4D"
            />
          </View>
          <View style={styles.DivTitleIngr}>
            <Text style={styles.TitleIngr}>My Ingredients</Text>
          </View>
          <ScrollView style={styles.ScrollView}>
            {IngrValue?.map((ingr) => (
              <View style={{ alignItems: "center" }} key={ingr.name}>
                <View style={styles.RectIngr} key={ingr.name}>
                  <Text style={styles.TitleIngrList}>{ingr.name}</Text>
                  <Trash
                    style={styles.TrashIcon}
                    name="trash"
                    size={30}
                    color="#6D071A"
                    onPress={() => {
                      deleteIngr(ingr.name);
                    }}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.ViewIcon} onPress={GoToQRCode}>
            <Icon
              name="plus"
              size={30}
              color="#fff"
            />
            <Text style={styles.TitleAddIngr}>Add Ingredients</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default AddPage;
