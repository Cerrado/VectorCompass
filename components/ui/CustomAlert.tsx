import React from 'react';
import { Modal } from 'react-native';
import { Overlay, Card, Title, Button, ButtonText, Row } from '../../styles/components';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }[];
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, title, message, buttons, onClose }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <Overlay>
        <Card style={{ minWidth: 300, maxWidth: 400, margin: 20 }}>
          <Title>{title}</Title>
          <Title size="lg" style={{ fontWeight: 'normal', marginBottom: 20, lineHeight: 22 }}>
            {message}
          </Title>
          
          <Row gap="lg" style={{ justifyContent: 'space-around' }}>
            {buttons?.map((button, index) => (
              <Button
                key={index}
                variant={
                  button.style === 'destructive' ? 'destructive' :
                  button.style === 'cancel' ? 'secondary' : 'primary'
                }
                onPress={() => {
                  button.onPress?.();
                  onClose();
                }}
              >
                <ButtonText 
                  variant={
                    button.style === 'destructive' ? 'destructive' :
                    button.style === 'cancel' ? 'secondary' : 'primary'
                  }
                >
                  {button.text}
                </ButtonText>
              </Button>
            )) || (
              <Button onPress={onClose}>
                <ButtonText>OK</ButtonText>
              </Button>
            )}
          </Row>
        </Card>
      </Overlay>
    </Modal>
  );
};

export default CustomAlert;