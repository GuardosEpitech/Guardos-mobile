import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Pressable } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import styles from "./QRCodeEngin.styles";
import axios from "axios";
import { API_URL } from '@env';
import { Dropdown } from 'react-native-element-dropdown';
import { Restaurant } from "src/models/ingedientsInterfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useTranslation} from "react-i18next";

const QRCodeEngin = ({ navigation }: { navigation: any }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState("");
  const [value, setValue] = useState(null);
  const [productName, setProductName] = useState("");
  const [RestoValue, setRestoValue] = useState<{ label: string; value: string }[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const {t} = useTranslation();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    fetchDarkMode();
    getResto();
  }, []);

  const fetchDarkMode = async () => {
    try {
      const darkModeValue = await AsyncStorage.getItem('DarkMode');
      if (darkModeValue !== null) {
        const isDarkMode = darkModeValue === 'true';
        setDarkMode(isDarkMode);
      }
    } catch (error) {
      console.error('Error fetching dark mode value:', error);
    }
  };

  const handleBarCodeScanned = async ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);

    try {
      const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
      const productData = response.data.product;
      setProductName(productData.product_name || t('pages.QRCodeEngin.unknown-product'));
    } catch (error) {
      console.error("Error fetching product information:", error);
      alert(String(t('pages.QRCodeEngin.get-product-info-failed')));
    }
  };
  if (hasPermission === null || hasPermission === false) {
    return <Text>{t('common.need-cam-permissions')}</Text>;
  }

  function GoToAddPage() {
    navigation.navigate("AddPage");
  }

  async function getResto() {
    try {
      const response = await axios({
        method: "get",
        url: API_URL + "restaurants",
      });
  
      // Assuming response.data is an array of objects with a 'name' property
      const newData = response.data.map((item: Restaurant) => ({
        label: item.name,
        value: item.id, // Replace 'id' with the actual property name for the value
      }));
  
      setRestoValue(newData);
    } catch (err) {
      console.log(err);
    }
  }

  async function AddProduct() {
    try {
      const response = await axios({
        url: `http://195.90.210.111:8081/api/products/${value}`,
        method: "POST",
        data: JSON.stringify({
          name: productName,
          resto: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status == 200) GoToAddPage();
    } catch (err) {
      console.log(err);
    }
  }
  return (
  <View style={[{ flex: 1 }, darkMode ? styles.containerDarkTheme : styles.containerLightTheme]}>
    <View style={{marginTop: 5, alignItems: "center"}}>
      <View style={styles.DivTop}>
        <Text style={styles.TitleIngr}>{t('pages.QRCodeEngin.scan-ingredients')}</Text>
        <Text>{t('pages.QRCodeEngin.scan-prompt')}</Text>
        <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={RestoValue}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={t('pages.QRCodeEngin.select-resto') as string}
            searchPlaceholder={t('pages.QRCodeEngin.search') as string}
            value={value}
            onChange={(item) => {
              setValue(item.label);
            }}
          />
          <View style={styles.DivTitleIngr}>
            <Text style={styles.TitleIngr}>{value}</Text>
          </View>
        <View style={styles.container}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
        {scanned && (
          <View>
            <Button title={t('pages.QRCodeEngin.scan-again')} onPress={() => setScanned(false)} />
            <View style={styles.DivButton}>
            <Text style={styles.TitleScan}>
              {t('pages.QRCodeEngin.scan-result-ask-if-want-to-add', {data: data, productName: productName})}
            </Text>
              <View style={styles.DivTop}>
                <Pressable
                  style={styles.ButtonNo}
                  onPress={() => {
                    setScanned(false);
                  }}
                >
                  <Text>{t('common.no')}</Text>
                </Pressable>
                <Pressable
                  style={styles.ButtonYes}
                  onPress={() => {
                    console.log("ONpressYES");
                    AddProduct();
                  }}
                >
                  <Text style={{ color: "white" }}>{t('common.yes')}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
    </View>
  );
};

export default QRCodeEngin;
