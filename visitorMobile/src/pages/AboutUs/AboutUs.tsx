import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Modal, TouchableOpacity } from 'react-native';
import styles from './AboutUs.styles';
import AsyncStorage from "@react-native-async-storage/async-storage";

import introduction from './text/Introduction';
import foundingStory from './text/FoundingStory';
import teamDescription from './text/TeamDescription';
import { 
  empowerment, 
  transparency, 
  improvement 
} from './text/MissionAndValues';
import {useTranslation} from "react-i18next";

const AboutUs: React.FC = () => {
  const {t} = useTranslation();
  const teamMembers = [
    {
      id: 1,
      photo: require('../../../assets/profile/josi.png'),
      name: 'Josefine Mende',
      description: t('pages.AboutUs.member-description-german'),
    },
    {
      id: 2,
      photo: require('../../../assets/profile/gylian.png'),
      name: 'Gylian Karsch',
      description: t('pages.AboutUs.member-description-german'),
    },
    {
        id: 3,
        photo: require('../../../assets/profile/marc.png'),
        name: 'Marc Pister',
        description: t('pages.AboutUs.member-description-german'),
      },
      {
        id: 4,
        photo: require('../../../assets/profile/ramon.png'),
        name: 'Ramon Werner',
        description: t('pages.AboutUs.member-description-german'),
      },
      {
        id: 5,
        photo: require('../../../assets/profile/renan.png'),
        name: 'Renan Dubois',
        description: t('pages.AboutUs.member-description-french'),
      },
      {
        id: 6,
        photo: require('../../../assets/profile/alban.png'),
        name: 'Alban de TourTier',
        description: t('pages.AboutUs.member-description-french'),
      },
  ];

  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

useEffect(() => {
  fetchDarkMode();  
})

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

  const openMemberDetails = (member: any) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  return (
    <ScrollView style={[styles.container, darkMode && styles.containerDarkTheme]}>
      <View style={styles.section}>
        <Text style={[styles.heading, (styles.centerText, darkMode && styles.centerTextDarkTheme)]}>{t('pages.AboutUs.introduction')}</Text>
        <Text style={[(styles.centerText, darkMode && styles.centerTextDarkTheme), styles.textSize]}>{t('pages.AboutUs.introduction-text')}</Text>
        <View style={styles.separator}></View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, (styles.centerText, darkMode && styles.centerTextDarkTheme)]}>{t('pages.AboutUs.founding-story')}</Text>
        <Text style={[(styles.centerText, darkMode && styles.centerTextDarkTheme), styles.textSize]}>{t('pages.AboutUs.founding-story-text')}</Text>
        <View style={styles.separator}></View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, (styles.centerText, darkMode && styles.centerTextDarkTheme)]}>
          {t('pages.AboutUs.mission-and-values')}
        </Text>
        <View style={styles.value}>
          <Text style={[styles.valueHeading, (styles.centerText, darkMode && styles.centerTextDarkTheme)]}>
            {t('pages.AboutUs.empowerment')}
          </Text>
          <Text style={[(styles.centerText, darkMode && styles.centerTextDarkTheme), styles.textSize]}>
            {t('pages.AboutUs.empowerment-text')}
          </Text>
        </View>
        <View style={styles.value}>
          <Text style={[styles.valueHeading, (styles.centerText, darkMode && styles.centerTextDarkTheme)]}>
            {t('pages.AboutUs.transparency')}
          </Text>
          <Text style={[(styles.centerText, darkMode && styles.centerTextDarkTheme), styles.textSize]}>
            {t('pages.AboutUs.transparency-text')}
          </Text>
        </View>
        <View style={styles.value}>
          <Text style={[styles.valueHeading, (styles.centerText, darkMode && styles.centerTextDarkTheme)]}>
            {t('pages.AboutUs.continuous-improvement')}
          </Text>
          <Text style={[(styles.centerText, darkMode && styles.centerTextDarkTheme), styles.textSize]}>
            {t('pages.AboutUs.improvement-text')}
          </Text>
          <View style={styles.separator}></View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, (styles.centerText, darkMode && styles.centerTextDarkTheme)]}>{t('pages.AboutUs.team')}</Text>
        <View style={styles.teamContainer}>
          {teamMembers.map(member => (
            <TouchableOpacity key={member.id} onPress={() => openMemberDetails(member)}>
              <Image source={member.photo} style={styles.photo} />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[(styles.centerText, darkMode && styles.centerTextDarkTheme)]}>{t('pages.AboutUs.team-description')}</Text>
      </View>

      <Modal
        visible={!!selectedMember}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>{t('common.close')}</Text>
          </TouchableOpacity>
          <View style={styles.memberDetails}>
            <Image source={selectedMember?.photo} style={styles.modalPhoto} />
            <Text style={[styles.centerText, styles.textSize, { fontWeight: 'bold' }]}>{selectedMember?.name}</Text>
            <Text style={[styles.centerText, styles.textSize]}>{selectedMember?.description}</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AboutUs;
