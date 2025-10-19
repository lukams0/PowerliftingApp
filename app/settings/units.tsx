import { router } from 'expo-router';
import { ArrowLeft, Check, Ruler, Scale } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Text, XStack, YStack } from 'tamagui';

export default function UnitsSettings() {
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [distanceUnit, setDistanceUnit] = useState<'imperial' | 'metric'>('imperial');

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    // TODO: Save to backend/database
    console.log('Saving units:', { weightUnit, distanceUnit });
    alert('Units updated successfully!');
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <YStack f={1} backgroundColor="#f5f5f5">
        {/* Header */}
        <XStack
          backgroundColor="#f5f5f5"
          p="$4"
          ai="center"
          gap="$3"
        >
          <Button
            size="$3"
            chromeless
            onPress={handleBack}
            pressStyle={{ opacity: 0.7 }}
          >
            <ArrowLeft size={24} color="#6b7280" />
          </Button>
          <Text fontSize="$7" fontWeight="bold" color="$gray12">
            Units
          </Text>
        </XStack>

        <ScrollView>
          <YStack p="$4" gap="$4">
            {/* Weight Units */}
            <Card elevate size="$4" p="$4" backgroundColor="white">
              <YStack gap="$3">
                <XStack ai="center" gap="$2">
                  <Scale size={20} color="#7c3aed" />
                  <Text fontSize="$4" fontWeight="600" color="$gray12">
                    Weight Units
                  </Text>
                </XStack>
                <Text fontSize="$3" color="$gray10">
                  Choose how weight is displayed throughout the app
                </Text>
                
                <YStack gap="$2" mt="$2">
                  <Button
                    size="$4"
                    backgroundColor={weightUnit === 'lbs' ? '#faf5ff' : 'white'}
                    borderColor={weightUnit === 'lbs' ? '#7c3aed' : '#e5e7eb'}
                    borderWidth={2}
                    onPress={() => setWeightUnit('lbs')}
                    pressStyle={{ opacity: 0.8 }}
                    jc="space-between"
                  >
                    <XStack ai="center" gap="$2">
                      <YStack ai="flex-start">
                        <Text fontSize="$4" fontWeight="600" color="$gray12">
                          Pounds (lbs)
                        </Text>
                        <Text fontSize="$2" color="$gray10">
                          Imperial system
                        </Text>
                      </YStack>
                    </XStack>
                    {weightUnit === 'lbs' && (
                      <Check size={20} color="#7c3aed" />
                    )}
                  </Button>

                  <Button
                    size="$4"
                    backgroundColor={weightUnit === 'kg' ? '#faf5ff' : 'white'}
                    borderColor={weightUnit === 'kg' ? '#7c3aed' : '#e5e7eb'}
                    borderWidth={2}
                    onPress={() => setWeightUnit('kg')}
                    pressStyle={{ opacity: 0.8 }}
                    jc="space-between"
                  >
                    <XStack ai="center" gap="$2">
                      <YStack ai="flex-start">
                        <Text fontSize="$4" fontWeight="600" color="$gray12">
                          Kilograms (kg)
                        </Text>
                        <Text fontSize="$2" color="$gray10">
                          Metric system
                        </Text>
                      </YStack>
                    </XStack>
                    {weightUnit === 'kg' && (
                      <Check size={20} color="#7c3aed" />
                    )}
                  </Button>
                </YStack>
              </YStack>
            </Card>

            {/* Distance/Height Units */}
            <Card elevate size="$4" p="$4" backgroundColor="white">
              <YStack gap="$3">
                <XStack ai="center" gap="$2">
                  <Ruler size={20} color="#7c3aed" />
                  <Text fontSize="$4" fontWeight="600" color="$gray12">
                    Distance Units
                  </Text>
                </XStack>
                <Text fontSize="$3" color="$gray10">
                  Choose how height and distance are displayed
                </Text>
                
                <YStack gap="$2" mt="$2">
                  <Button
                    size="$4"
                    backgroundColor={distanceUnit === 'imperial' ? '#faf5ff' : 'white'}
                    borderColor={distanceUnit === 'imperial' ? '#7c3aed' : '#e5e7eb'}
                    borderWidth={2}
                    onPress={() => setDistanceUnit('imperial')}
                    pressStyle={{ opacity: 0.8 }}
                    jc="space-between"
                  >
                    <XStack ai="center" gap="$2">
                      <YStack ai="flex-start">
                        <Text fontSize="$4" fontWeight="600" color="$gray12">
                          Imperial (ft/in)
                        </Text>
                        <Text fontSize="$2" color="$gray10">
                          Feet and inches
                        </Text>
                      </YStack>
                    </XStack>
                    {distanceUnit === 'imperial' && (
                      <Check size={20} color="#7c3aed" />
                    )}
                  </Button>

                  <Button
                    size="$4"
                    backgroundColor={distanceUnit === 'metric' ? '#faf5ff' : 'white'}
                    borderColor={distanceUnit === 'metric' ? '#7c3aed' : '#e5e7eb'}
                    borderWidth={2}
                    onPress={() => setDistanceUnit('metric')}
                    pressStyle={{ opacity: 0.8 }}
                    jc="space-between"
                  >
                    <XStack ai="center" gap="$2">
                      <YStack ai="flex-start">
                        <Text fontSize="$4" fontWeight="600" color="$gray12">
                          Metric (cm)
                        </Text>
                        <Text fontSize="$2" color="$gray10">
                          Centimeters
                        </Text>
                      </YStack>
                    </XStack>
                    {distanceUnit === 'metric' && (
                      <Check size={20} color="#7c3aed" />
                    )}
                  </Button>
                </YStack>
              </YStack>
            </Card>

            {/* Save Button */}
            <Button
              size="$5"
              backgroundColor="#7c3aed"
              color="white"
              onPress={handleSave}
              pressStyle={{ backgroundColor: '#6d28d9' }}
              mt="$2"
            >
              <Text fontSize="$5" fontWeight="bold" color="white">
                Save Changes
              </Text>
            </Button>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}