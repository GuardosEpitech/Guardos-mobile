import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import styles from './ModalConfirmPayment.styles';
import {useTranslation} from "react-i18next";

interface ModalConfirmProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ModalConfirmPayment: React.FC<ModalConfirmProps> = ({ isVisible, onConfirm, onCancel }) => {
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
          <Text>{t('components.CreditCard.msg')}</Text>
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

export default ModalConfirmPayment;
