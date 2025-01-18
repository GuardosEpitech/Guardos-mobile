import React, { useState, useCallback} from "react";
import {Text, View, StyleSheet, Button, Pressable, ScrollView, Alert} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useFocusEffect } from "@react-navigation/native";
import styles from "./QRCodeEngin.styles";
import axios from "axios";
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useTranslation} from "react-i18next";
import {getAllRestaurantsByUserAndFilter} from "../../services/restoCalls";
import {IRestaurantFrontEnd} from "../../models/restaurantsInterfaces";
import {IProduct} from "../../../../shared/models/restaurantInterfaces";
import {addNewProduct, editProduct} from "../../services/productCalls";
import {IProductFE} from "../../../../shared/models/productInterfaces";

const QRCodeEngin = ({ navigation }: { navigation: any }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState("");
  const [value, setValue] = useState(null);
  const [productName, setProductName] = useState("");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [fieldRequire, setFieldRequire] = useState<boolean>();
  const {t} = useTranslation();
  const [filter, setFilter] = useState('');
  const [restoData, setRestoData] = useState<IRestaurantFrontEnd[]>([]);

  useFocusEffect(
      useCallback(() => {
        const fetchPageData = async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === "granted");

          await fetchDarkMode();

          await getRestoData(filter);
        };

        fetchPageData();

        return () => {
          setScanned(false);
          setValue(null);
          setFieldRequire(undefined);
        };
      }, [filter]) // Only re-run when `filter` changes
  );


  const getRestoData = async (filter: string) => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) return;

    try {
      const res = await getAllRestaurantsByUserAndFilter(userToken, filter);
      const newData = res.map((item: any) => ({
        label: item.name,
        value: item.name,
      }));
      setRestoData(newData);
    } catch (error) {
      console.error('Error updating restaurant data:', error);
    }
  };

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

  const handleAddProduct = async () => {
    if (value === null) {
      setFieldRequire(false);
    } else {
      try {
        const product: IProduct = {
          name: productName,
          allergens: [],
          ingredients: [],
        };
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken === null) {
          return;
        }
        await addNewProduct(product, value, userToken);
        setValue(null)
        setScanned(false)
        setFieldRequire(null);
        navigation.navigate('MyProductsScreen');
      } catch (error) {
        console.error('Error adding product:', error);
      }
    }
  };

  return (
  <View style={[{ flex: 1 }, darkMode ? styles.containerDarkTheme : styles.containerLightTheme]}>
    <View style={{marginTop: 5, alignItems: "center" }}>
    <ScrollView >
      <View style={styles.DivTop}>
        <Text style={styles.TitleIngr}>{t('pages.QRCodeEngin.scan-ingredients')}</Text>
        <Text>{t('pages.QRCodeEngin.scan-prompt')}</Text>
        <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={restoData}
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
        {!scanned && (
            <View style={styles.container}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
              />
            </View>
        )}
        { !fieldRequire && scanned && !value ?
          <Text style={{color: "red", marginTop: 10}}>{t('pages.QRCodeEngin.required-field')}</Text>
            :
          <Text></Text>
        }
        {scanned && (
          <View>
            <View style={styles.DivButton}>
            <Text style={styles.TitleScan}>
              {t('pages.QRCodeEngin.scan-result-ask-if-want-to-add', {data: data, productName: productName})}
            </Text>
              <View style={styles.DivBtn}>
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
                    handleAddProduct();
                  }}
                >
                  <Text style={{ color: "white" }}>{t('common.yes')}</Text>
                </Pressable>
              </View>
            </View>
            <Button title={t('pages.QRCodeEngin.scan-again')} onPress={() => setScanned(false)} />
          </View>
        )}
      </View>
      </ ScrollView>
    </View>
    </View>
  );
};

export default QRCodeEngin;
