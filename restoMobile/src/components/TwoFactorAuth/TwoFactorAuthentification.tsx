import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

interface VerificationCodeInputProps {
  onSubmit: (code: string) => void;
  errorMessage: string | null;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({ onSubmit, errorMessage }) => {
  const [code, setCode] = useState<string>('');
  const [localError, setLocalError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleChange = (text: string) => {
    if (text.length <= 8) {
      setCode(text);
      setLocalError(null);
    }
  };

  const handleSubmit = () => {
    if (code.length === 8) {
      onSubmit(code);
    } else {
      setLocalError(t('components.TwoFactor.enter-code-error'));
    }
  };

  return (
      <View style={styles.container}>
        <TextInput
            style={styles.input}
            value={code}
            onChangeText={handleChange}
            placeholder={t('components.TwoFactor.enter-code')}
            maxLength={8}
        />
        {(localError || errorMessage) && (
            <Text style={styles.errorText}>{localError || errorMessage}</Text>
        )}
        <Button onPress={handleSubmit} title={t('common.submit')} disabled={code.length !== 8} />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default VerificationCodeInput;
