import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import styles from './RestaurantCard.styles';
import { useNavigation } from '@react-navigation/native';

const RestaurantCard = ({ info, onDelete }) => {
  const navigation = useNavigation();

  const handleDelete = () => {
    onDelete(info.name);
  };

  const handleEdit = () => {
    navigation.navigate('EditRestaurant', { restaurantId: info.name });
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
      <Image
          style={styles.imageStyle}
          resizeMode="contain"
          source={
            info.pictures[0] === 'empty.jpg'
              ? require('/Users/duboisrenan/Guardos-dev/packages/restoMobile/src/assets/logo.png')
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
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
            {<FontAwesomeIcon icon={ faTrash } size={15} color="gray" />}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
            {<FontAwesomeIcon icon={ faPen } size={15} color="gray" />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RestaurantCard;