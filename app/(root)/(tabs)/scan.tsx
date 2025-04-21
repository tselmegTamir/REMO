import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import Modal from 'react-native-modal';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useRouter} from 'expo-router';
import { db, auth } from '@/FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Product } from '@/types/product';
import { useIsFocused } from '@react-navigation/native';

const ScanScreen = () => {
  const router = useRouter();
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isScanningEnabled, setIsScanningEnabled] = useState(true); // Control scanning
  const [showClaimModal, setShowClaimModal] = useState(false); // Claim Score modal
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Success modal
  const [disposalInfo, setDisposalInfo] = useState({
    plastic: 0,
    glass: 0,
    metal: 0,
    other: 0,
    score: 0
  }); // Store QR data
  let lastScannedTime = 0;

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = async ({ type, data }: BarcodeScanningResult) => {
    const now = Date.now();
    if (scanned || now - lastScannedTime < 1000 || !isFocused || !isScanningEnabled) return;
    lastScannedTime = now;
    setScanned(true);

    const normalizedData = data.trim();
    console.log('Scanned:', { type, data: normalizedData });

    if (type === 'qr' || type.toLowerCase().includes('qr')) {
      try {
        const parsedDisposalInfo = JSON.parse(normalizedData);
        if (!auth.currentUser) {
          console.log('No user signed in:', auth.currentUser);
          alert('Error: No user signed in');
          router.push('/(auth)/sign-in');
          setScanned(false);
          setIsScanningEnabled(true);
          return;
        }
        // Store the disposal info and show Claim Score modal
        setDisposalInfo(parsedDisposalInfo);
        setIsScanningEnabled(false); // Disable scanning immediately
        setShowClaimModal(true);
      } catch (error) {
        alert('Error parsing QR code: ' + (error as Error).message);
        console.error('QR code parse error:', error);
        setScanned(false);
        setIsScanningEnabled(true);
      }
    } else {
      try {
        console.log('Querying Firestore for product:', normalizedData);
        const productDoc = await getDoc(doc(db, 'Products', normalizedData));
        if (productDoc.exists()) {
          const productData = productDoc.data();
          const product: Product = {
            ...productData,
            createdAt:productData.createdAt.toDate().toISOString(),
            updatedAt:productData.updatedAt.toDate().toISOString()
          } as Product;
          console.log('Product found:', product);
          setScanned(false);
          router.push(`../${normalizedData}`);
        } else {
          console.log('No product found for ID:', normalizedData);
          alert(`No product found with barcode: ${normalizedData}`);
          setScanned(false);
        }
      } catch (error) {
        alert('Error fetching product: ' + (error as Error).message);
        console.error('Barcode query error:', error);
        setScanned(false);
      }
    }
  };

  const handleClaimRewards = async () => {
    try {
      if(!auth.currentUser){
        console.log("Please sign-in first!!!");
        return;
      }

      console.log('Updating stats for user:', auth.currentUser.uid);
      const userRef = doc(db, 'users', auth.currentUser.uid);

      // Fetch current user data
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        console.log('User document does not exist for UID:', auth.currentUser.uid);
        alert('Error: User data not found');
        setShowClaimModal(false);
        setScanned(false);
        setIsScanningEnabled(true);
        return;
      }
      const currentData = userDoc.data();

      // Increment the values
      const updatedStats = {
        plastic: (currentData.plastic || 0) + (disposalInfo.plastic || 0),
        glass: (currentData.glass || 0) + (disposalInfo.glass || 0),
        metal: (currentData.metal || 0) + (disposalInfo.metal || 0),
        other: (currentData.other || 0) + (disposalInfo.other || 0),
        score: (currentData.score || 0) + (disposalInfo.score || 0),
        updatedAt: new Date().toISOString(),
      };

      // Update Firestore with incremented values
      await updateDoc(userRef, updatedStats);
      console.log('Stats incremented:', updatedStats);

      // Close Claim Score modal (success modal will show on hide)
      setShowClaimModal(false);
    } catch (error) {
      alert('Error updating stats: ' + (error as Error).message);
      console.error('QR code update error:', error);
      setShowClaimModal(false);
      setScanned(false);
      setIsScanningEnabled(true);
    }
  };

  const handleScanAgain = () => {
    setShowSuccessModal(false);
    setScanned(false);
    setIsScanningEnabled(true); // Re-enable scanning
    setDisposalInfo({
      plastic: 0,
      glass: 0,
      metal: 0,
      other: 0,
      score: 0
    }); // Clear stored QR data
  };

  if (!permission) {
    return <Text className="text-center">Requesting camera permission...</Text>;
  }

  if (!permission.granted) {
    return <Text className="text-center">No access to camera</Text>;
  }

  return (
    <View className="flex-1">
      <CameraView
        className="flex-1"
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'upc_a', 'upc_e', 'ean13', 'ean8', 'code39', 'code93', 'code128'],
        }}
        onBarcodeScanned={(isFocused && isScanningEnabled) ? handleBarCodeScanned : undefined}
      />
      
      {/* Claim Score Modal */}
      <Modal
        isVisible={showClaimModal}
        onModalShow={() => console.log('Claim Score modal shown')}
        onModalHide={() => {
          console.log('Claim Score modal hidden');
          if (!showSuccessModal) setShowSuccessModal(true); // Show success modal after claim modal hides
        }}
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <View className="bg-white p-6 rounded-xl w-4/5" style={{ zIndex: 1000 }}>
          <Text className="text-lg font-bold mb-4 text-center">Claim Your Score</Text>
          <Text className="text-center mb-4">
            You’re about to add:
            {'\n'}Plastic: +{disposalInfo?.plastic || 0}
            {'\n'}Glass: +{disposalInfo?.glass || 0}
            {'\n'}Metal: +{disposalInfo?.metal || 0}
            {'\n'}Other: +{disposalInfo?.other || 0}
            {'\n'}Score: +{disposalInfo?.score || 0}
          </Text>
          <Button title="Claim Rewards" onPress={handleClaimRewards} />
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        isVisible={showSuccessModal}
        onBackdropPress={handleScanAgain}
        onModalShow={() => console.log('Success modal shown')}
        onModalHide={() => console.log('Success modal hidden')}
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <View className="bg-white p-6 rounded-xl w-4/5" style={{ zIndex: 1000 }}>
          <Text className="text-lg font-bold mb-4 text-center">Success!</Text>
          <Text className="text-center mb-4">Your recycling stats have been updated.</Text>
          <Button title="Scan Again" onPress={handleScanAgain} />
        </View>
      </Modal>
    </View>
  );
};

export default ScanScreen;