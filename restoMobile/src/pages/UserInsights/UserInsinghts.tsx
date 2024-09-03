import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Card, Chip, Title, Paragraph } from 'react-native-paper';
import { useTranslation } from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';
import  {styles, pickerSelectStyles} from "./UserInsinghts.styles";
import { getAllRestaurantsByUser, getRestoStatistics } from "../../services/restoCalls";
import RNPickerSelect from "react-native-picker-select";

const UserInsights = () => {
  const { t } = useTranslation();
  const [userStatistics, setUserStatistics] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");

  const getStatistics = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await getRestoStatistics(userToken);
      const restaurants = await getAllRestaurantsByUser({ key: userToken });
      for (let i = 0; i < restaurants.length; i++) {
        response[i].restoId = restaurants[i].name;
      }
      setUserStatistics(response);
      if (response.length > 0) {
        setSelectedRestaurant(response[0].restoId);
      }
    } catch (error) {
      console.error("Error fetching the statistics:", error);
    }
  };

  useEffect(() => {
    getStatistics();
  }, []);

  const handleRestaurantChange = (itemValue: any) => {
    setSelectedRestaurant(itemValue);
  };

  const renderAllergens = (allergens: any) => {
    return allergens.map((allergen: any, index: any) => (
        <Chip
            key={index}
            style={[styles.chip, {backgroundColor: "#e26627"}]}
            mode="outlined"
        >
          {`${allergen.allergen} (${allergen.count})`}
        </Chip>
    ));
  };

  const renderDislikedIngredients = (ingredients: any) => {
    return ingredients.map((ingredient: any, index: any) => (
        <Chip
            key={index}
            style={[styles.chip, { backgroundColor: "#fca41e" }]}
            mode="outlined"
        >
          {`${ingredient.ingredient} (${ingredient.count})`}
        </Chip>
    ));
  };

  const renderStatistics = () => {
    const selectedStats = userStatistics.find(
        (stats) => stats.restoId === selectedRestaurant
    );

    if (!selectedStats) return null;

    return (
        <View>
          <Card style={styles.card}>
            <Card.Content>
              <Title>{t("pages.userInsights.total-clicks")}</Title>
              <Paragraph>{selectedStats.totalClicks}</Paragraph>
            </Card.Content>
          </Card>
          <Card style={styles.card}>
            <Card.Content>
              <Title>{t("pages.userInsights.clicks-this-month")}</Title>
              <Paragraph>{selectedStats.clicksThisMonth}</Paragraph>
            </Card.Content>
          </Card>
          <Card style={styles.card}>
            <Card.Content>
              <Title>{t("pages.userInsights.clicks-this-week")}</Title>
              <Paragraph>{selectedStats.clicksThisWeek}</Paragraph>
            </Card.Content>
          </Card>
          <Card style={styles.card}>
            <Card.Content>
              <Title>{t("pages.userInsights.update-month")}</Title>
              <Paragraph>{selectedStats.updateMonth}</Paragraph>
            </Card.Content>
          </Card>
          <Card style={styles.card}>
            <Card.Content>
              <Title>{t("pages.userInsights.update-week")}</Title>
              <Paragraph>{selectedStats.updateWeek}</Paragraph>
            </Card.Content>
          </Card>
          <Card style={styles.card}>
            <Card.Content>
              <Title>{t("pages.userInsights.user-allergens")}</Title>
              <View style={styles.chipContainer}>
                {renderAllergens(selectedStats.userAllergens)}
              </View>
            </Card.Content>
          </Card>
          <Card style={styles.card}>
            <Card.Content>
              <Title>{t("pages.userInsights.user-disliked-ingredients")}</Title>
              <View style={styles.chipContainer}>
                {renderDislikedIngredients(selectedStats.userDislikedIngredients)}
              </View>
            </Card.Content>
          </Card>
        </View>
    );
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <RNPickerSelect
                onValueChange={handleRestaurantChange}
                items={userStatistics.map((stats) => ({
                  label: stats.restoId,
                  value: stats.restoId,
                }))}
                style={pickerSelectStyles}
                value={selectedRestaurant}
                placeholder={{
                  label: t("pages.userInsights.select-restaurant"),
                  value: null,
                }}
            />
          </Card.Content>
        </Card>
        {renderStatistics()}
      </ScrollView>
  );
};


export default UserInsights;
