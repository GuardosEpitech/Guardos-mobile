import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Modal, TouchableOpacity } from 'react-native';
import styles from './AboutUs.styles';

import introduction from './text/Introduction';
import foundingStory from './text/FoundingStory';
import teamDescription from './text/TeamDescription';
import { 
  empowerment, 
  transparency, 
  improvement 
} from './text/MissionAndValues';

const AboutUs: React.FC = () => {
  const teamMembers = [
    {
      id: 1,
      photo: require('../../../assets/profile/josi.png'),
      name: 'Josefine Mende',
      description: '4th year Epitech student from Germany',
    },
    {
      id: 2,
      photo: require('../../../assets/profile/gylian.png'),
      name: 'Gylian Karsch',
      description: '4th year Epitech student from Germany',
    },
    {
        id: 3,
        photo: require('../../../assets/profile/marc.png'),
        name: 'Marc Pister',
        description: '4th year Epitech student from Germany',
      },
      {
        id: 4,
        photo: require('../../../assets/profile/ramon.png'),
        name: 'Ramon Werner',
        description: '4th year Epitech student from Germany',
      },
      {
        id: 5,
        photo: require('../../../assets/profile/renan.png'),
        name: 'Renan Dubois',
        description: '4th year Epitech student from France',
      },
      {
        id: 6,
        photo: require('../../../assets/profile/alban.png'),
        name: 'Alban de TourTier',
        description: '4th year Epitech student from France',
      },
  ];

  const [selectedMember, setSelectedMember] = useState<any>(null);

  const openMemberDetails = (member: any) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.heading, styles.centerText]}>Introduction</Text>
        <Text style={[styles.centerText, styles.textSize]}>{introduction}</Text>
        <View style={styles.separator}></View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, styles.centerText]}>Founding Story</Text>
        <Text style={[styles.centerText, styles.textSize]}>{foundingStory}</Text>
        <View style={styles.separator}></View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, styles.centerText]}>
          Mission and Values
        </Text>
        <View style={styles.value}>
          <Text style={[styles.valueHeading, styles.centerText]}>
            Empowerment and Inclusivity
          </Text>
          <Text style={[styles.centerText, styles.textSize]}>
            {empowerment}
          </Text>
        </View>
        <View style={styles.value}>
          <Text style={[styles.valueHeading, styles.centerText]}>
            Transparency and Trust
          </Text>
          <Text style={[styles.centerText, styles.textSize]}>
            {transparency}
          </Text>
        </View>
        <View style={styles.value}>
          <Text style={[styles.valueHeading, styles.centerText]}>
            Continuous Improvement and Innovation
          </Text>
          <Text style={[styles.centerText, styles.textSize]}>
            {improvement}
          </Text>
          <View style={styles.separator}></View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, styles.centerText]}>Team</Text>
        <View style={styles.teamContainer}>
          {teamMembers.map(member => (
            <TouchableOpacity key={member.id} onPress={() => openMemberDetails(member)}>
              <Image source={member.photo} style={styles.photo} />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.centerText, styles.textSize, styles.memberText]}>{teamDescription}</Text>
      </View>

      <Modal
        visible={!!selectedMember}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Close</Text>
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
