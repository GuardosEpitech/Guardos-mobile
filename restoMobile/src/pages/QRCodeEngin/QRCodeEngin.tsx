import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Pressable, ScrollView } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "axios";
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import styles from "./QRCodeEngin.styles";
import { getAllRestaurantsByUserAndFilter } from "../../services/restoCalls";
import { addNewProduct } from "../../services/productCalls";
import { IRestaurantFrontEnd } from "../../models/restaurantsInterfaces";
import { IProduct } from "../../../../shared/models/restaurantInterfaces";

interface QRCodeEnginProps {
  navigation: any;
}

const QRCodeEngin: React.FC<QRCodeEnginProps> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanned, setIsScanned] = useState<boolean>(false);
  const [scannedData, setScannedData] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [productIngredients, setProductIngredients] = useState<string[]>([]);
  const [productAllergens, setProductAllergens] = useState<string[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [restaurantData, setRestaurantData] = useState<IRestaurantFrontEnd[]>([]);
  const [fieldRequired, setFieldRequired] = useState<boolean | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    requestCameraPermission();
    fetchDarkModeSetting();
    fetchRestaurantData(filter);
  }, [filter]);

  const fetchRestaurantData = async (filterValue: string) => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (!userToken) return;

      const response = await getAllRestaurantsByUserAndFilter(userToken, filterValue);
      const newData = response.map((item: any) => ({
        label: item.name,
        value: item.name,
      }));
      setRestaurantData(newData);
    } catch (error) {
      console.error("Error updating restaurant data:", error);
    }
  };

  // we could use this function to get the allergens from the product but this requires backend logic chanhges !!!
  function getAllergenInfoFromProduct(response: any) {
    const product = response.data.product;

    const allergensList = product.allergens_tags;
    const allergensRaw = product.allergens_from_ingredients;

    console.log("Allergens (Array):", allergensList);
    console.log("Allergens (Raw):", allergensRaw);
    return allergensList;
  }


  function getIngredientsFromProduct(response: any) {
    const product = response.data.product;

    if (!product.ingredients || !Array.isArray(product.ingredients)) {
      return [];
    }

    const ingredientsIds = product.ingredients.map((ing: any) => ing.id);
    for (let i = 0; i < ingredientsIds.length; i++) {
      console.log("Ingredient ID:", ingredientsIds[i]);
      if (ingredientsIds[i].includes("en:"))
        ingredientsIds[i] = ingredientsIds[i].replace("en:", "");

      if (ingredientsIds[i].includes(":")) {
        ingredientsIds.splice(i, 1);
        i--;
      }
    }
    return ingredientsIds;
  }


  const fetchDarkModeSetting = async () => {
    try {
      const darkModeValue = await AsyncStorage.getItem("DarkMode");
      if (darkModeValue !== null) {
        setDarkMode(darkModeValue === "true");
      }
    } catch (error) {
      console.error("Error fetching dark mode value:", error);
    }
  };

  const handleBarCodeScanned = async ({ type, data: scannedData }: { type: string; data: string }) => {
    setIsScanned(true);
    setScannedData(scannedData);

    try {
      const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${scannedData}.json`);
      const productData = response.data.product;
      const ingredients = getIngredientsFromProduct(response);
      const allergens = getAllergenInfoFromProduct(response);
      const name = productData?.product_name ?? t("pages.QRCodeEngin.unknown-product");
      setProductName(name);
      setProductIngredients(ingredients);
      setProductAllergens(allergens);
    } catch (error) {
      console.error("Error fetching product information:", error);
      alert(String(t("pages.QRCodeEngin.get-product-info-failed")));
    }
  };


  const handleAddProduct = async () => {
    if (!selectedRestaurant) {
      setFieldRequired(false);
      return;
    }

    try {
      const newProduct: IProduct = {
        name: productName,
        allergens: [],
        ingredients: productIngredients,
      };

      const userToken = await AsyncStorage.getItem("userToken");
      if (!userToken) return;
      console.log("Adding product:", newProduct);
      await addNewProduct(newProduct, selectedRestaurant, userToken);
      setSelectedRestaurant(null);
      setIsScanned(false);
      setFieldRequired(null);
      navigation.navigate("MyProductsScreen");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  if (hasPermission === null || hasPermission === false) {
    return <Text>{t("common.need-cam-permissions")}</Text>;
  }

  return (
      <View style={[{ flex: 1 }, darkMode ? styles.containerDarkTheme : styles.containerLightTheme]}>
        <View style={{ marginTop: 5, alignItems: "center" }}>
          <ScrollView>
            {/* Top Section */}
            <View style={styles.DivTop}>
              <Text style={styles.TitleIngr}>{t("pages.QRCodeEngin.scan-ingredients")}</Text>
              <Text>{t("pages.QRCodeEngin.scan-prompt")}</Text>

              {/* Dropdown for restaurants */}
              <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={restaurantData}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={t("pages.QRCodeEngin.select-resto") as string}
                  searchPlaceholder={t("pages.QRCodeEngin.search") as string}
                  value={selectedRestaurant}
                  onChange={(item) => {
                    setSelectedRestaurant(item.label);
                  }}
              />

              {/* Display of selected restaurant */}
              <View style={styles.DivTitleIngr}>
                <Text style={styles.TitleIngr}>{selectedRestaurant}</Text>
              </View>

              {/* Barcode Scanner */}
              <View style={styles.container}>
                {!isScanned && (
                    <BarCodeScanner
                        onBarCodeScanned={isScanned ? undefined : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    />
                )}
              </View>

              {/* Validation error if restaurant not selected */}
              {!fieldRequired && isScanned && !selectedRestaurant && (
                  <Text style={{ color: "red", marginTop: 10 }}>
                    {t("pages.QRCodeEngin.required-field")}
                  </Text>
              )}

              {/* If scanned, show product confirmation buttons */}
              {isScanned && (
                  <View>
                    <Button
                        title={t("pages.QRCodeEngin.scan-again")}
                        onPress={() => setIsScanned(false)}
                    />
                    <View style={styles.DivButton}>
                      <Text style={styles.TitleScan}>
                        {t("pages.QRCodeEngin.scan-result-ask-if-want-to-add", {
                          data: scannedData,
                          productName: productName,
                        })}
                      </Text>
                      <View style={styles.DivBtn}>
                        <Pressable
                            style={styles.ButtonNo}
                            onPress={() => {
                              setIsScanned(false);
                            }}
                        >
                          <Text>{t("common.no")}</Text>
                        </Pressable>
                        <Pressable
                            style={styles.ButtonYes}
                            onPress={handleAddProduct}
                        >
                          <Text style={{ color: "white" }}>{t("common.yes")}</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
  );
};

export default QRCodeEngin;
