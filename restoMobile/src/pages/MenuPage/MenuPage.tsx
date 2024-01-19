import React from 'react';
import { View, Text, StyleSheet, StatusBar, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import Header from 'src/components/Header';

const MenuPage = ({ route }) => {
  const { restaurantId, restaurantName } = route.params;

  const dishes = [
    {
      "_id": 3,
      "dishes": [
        {
          "category": {
          },
          "name": "Homemade Pizza",
          "description": "This is the best homemade pizza you'll ever eat. Enjoy this masterpiece of tomato and cheese",
          "products": ["cheese", "morzerella"],
          "price": 8.7,
          "allergens": ["milk", "soybean"]
        },
      ]
    }
  ];


  const renderDishCard = ({ item }) => {
    console.log("item", item);
    console.log("item.dishes", item.dishes);
    console.log("item.dishes[0]", item.dishes[0]);
  
    return (
      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardTitle}>{item.dishes[0].name}</Text>
        <Text style={styles.cardDescription}>{item.dishes[0].description}</Text>
        <Text style={styles.cardPrice}>${item.dishes[0].price}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: '/Users/duboisrenan/Guardos-dev/packages/restoMobile/src/assets/foodbg.png' }}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <Text style={styles.title}>{restaurantName}</Text>
      </ImageBackground>

      <FlatList
      data={dishes[0].dishes}
      renderItem={renderDishCard}
      keyExtractor={(item) => item[0]._id.toString()}
      style={styles.flatList}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    position: 'relative',
  },
  imageBackground: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    resizeMode: 'cover',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  flatList: {
    marginTop: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  cardPrice: {
    fontSize: 14,
    color: '#666',
  },
});

export default MenuPage;
