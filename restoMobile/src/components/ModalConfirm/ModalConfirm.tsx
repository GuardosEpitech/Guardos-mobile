import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import styles from './ModalConfirm.styles';
import {useTranslation} from "react-i18next";

interface ModalConfirmProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({ isVisible, onConfirm, onCancel }) => {
  const {t} = useTranslation();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>{t('components.ModalConfirm.do-you-want-to-delete-product')}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>{t('common.confirm')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.buttonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalConfirm;
