import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import styles from './RestaurantCard.styles';
import { useNavigation } from '@react-navigation/native';
import { IimageInterface } from "../models/imageInterface";
import { getImages } from "../services/imageCalls";
import { defaultRestoImage } from "../../assets/placeholderImagesBase64";

const RestaurantCard = ({ info}) => {
  const navigation = useNavigation();
  const [pictures, setPictures] = useState<IimageInterface[]>([]);

  let picturesId = info.picturesId;
  useEffect(() => {
    async function fetchImages() {
      if (picturesId.length > 0) {
        const fetchedImages = await getImages(picturesId);
        setPictures(fetchedImages);
      } else {
        setPictures([{
          base64: defaultRestoImage,
          contentType: "image/png",
          filename: "placeholderResto.png",
          size: 0,
          uploadDate: "0",
          id: 0,
        }]);
      }
    }

    fetchImages();
  }, [picturesId]);


  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Image
          style={styles.imageStyle}
          resizeMode="contain"
          source={
            pictures.length > 0 && pictures[0].base64
              ? { uri: pictures[0].base64 }
              : { uri: defaultRestoImage }
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