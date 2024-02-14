import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import styles from './RestaurantCard.styles';
import { useNavigation } from '@react-navigation/native';

const RestaurantCard = ({ info}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
      <Image
          style={styles.imageStyle}
          resizeMode="contain"
          source={
            info.pictures[0] === 'empty.jpg'
              ? require('../../assets/logo.png')
              : { uri: info.pictures[0] }
          }
        />
        <View style={styles.infoStyle}>
          <Text style={styles.titleStyle} numberOfLines={1} ellipsizeMode="tail">
            {info.name}
          </Text>
          <Text style={styles.categoryStyle} numberOfLines={2} ellipsizeMode="tail">
            {info.description}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail">
            Rating: {info.rating} ({info.ratingCount} ratings)
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RestaurantCard;