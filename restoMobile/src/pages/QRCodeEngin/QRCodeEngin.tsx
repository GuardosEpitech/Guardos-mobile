import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Pressable, ImageBackground } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import IconBack from "react-native-vector-icons/AntDesign";
import IconUser from "react-native-vector-icons/FontAwesome";
import styles from "./QRCodeEngin.styles";
import axios from "axios";
import { API_URL } from '@env';
import { Dropdown } from 'react-native-element-dropdown';
import { Restaurant } from "src/models/ingedientsInterfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";

const QRCodeEngin = ({ navigation }: { navigation: any }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState("");
  const [value, setValue] = useState(null);
  const [productName, setProductName] = useState("");
  const [RestoValue, setRestoValue] = useState<{ label: string; value: string }[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);

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
      setProductName(productData.product_name || "Unknown Product");
    } catch (error) {
      console.error("Error fetching product information:", error);
      alert(`Error fetching product information for barcode ${data}`);
    }
  };
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
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
        <Text style={styles.TitleIngr}>Scan Ingredient</Text>
        <Text>Please scan the barcode of the product you wan’t to add</Text>
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
            placeholder="Select a restaurant"
            searchPlaceholder="Search..."
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
            <Button title={"Scan Again"} onPress={() => setScanned(false)} />
            <View style={styles.DivButton}>
            <Text style={styles.TitleScan}>
                  You just scanned {data} (Product Name: {productName}). Do you want to add it to your list of ingredients?
                </Text>
              <View style={styles.DivTop}>
                <Pressable
                  style={styles.ButtonNo}
                  onPress={() => {
                    setScanned(false);
                  }}
                >
                  <Text>NO</Text>
                </Pressable>
                <Pressable
                  style={styles.ButtonYes}
                  onPress={() => {
                    console.log("ONpressYES");
                    AddProduct();
                  }}
                >
                  <Text style={{ color: "white" }}>YES</Text>
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
