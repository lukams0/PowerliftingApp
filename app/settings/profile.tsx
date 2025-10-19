import { router } from 'expo-router';
import { ArrowLeft, Calendar, Mail, Save, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input, Text, XStack, YStack } from 'tamagui';

export default function ProfileInformationSettings() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [age, setAge] = useState('28');
  const [gender, setGender] = useState('male');
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Save to backend/database
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saving profile:', { name, email, age, gender });
    setIsSaving(false);
    alert('Profile updated successfully!');
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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
              Profile Information
            </Text>
          </XStack>

          <ScrollView>
            <YStack p="$4" gap="$4">
              {/* Profile Picture */}
              <YStack ai="center" gap="$3">
                <YStack
                  w={100}
                  h={100}
                  borderRadius="$12"
                  backgroundColor="#7c3aed"
                  ai="center"
                  jc="center"
                >
                  <User size={50} color="white" />
                </YStack>
                <Button
                  size="$3"
                  chromeless
                  color="#7c3aed"
                  fontWeight="600"
                  onPress={() => console.log('Change photo')}
                >
                  Change Photo
                </Button>
              </YStack>

              {/* Name */}
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$3">
                  <XStack ai="center" gap="$2">
                    <User size={20} color="#7c3aed" />
                    <Text fontSize="$4" fontWeight="600" color="$gray12">
                      Full Name
                    </Text>
                  </XStack>
                  <Input
                    size="$4"
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    borderColor="#e9d5ff"
                    focusStyle={{ borderColor: '#7c3aed' }}
                  />
                </YStack>
              </Card>

              {/* Email */}
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$3">
                  <XStack ai="center" gap="$2">
                    <Mail size={20} color="#7c3aed" />
                    <Text fontSize="$4" fontWeight="600" color="$gray12">
                      Email Address
                    </Text>
                  </XStack>
                  <Input
                    size="$4"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    borderColor="#e9d5ff"
                    focusStyle={{ borderColor: '#7c3aed' }}
                  />
                </YStack>
              </Card>

              {/* Age */}
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$3">
                  <XStack ai="center" gap="$2">
                    <Calendar size={20} color="#7c3aed" />
                    <Text fontSize="$4" fontWeight="600" color="$gray12">
                      Age
                    </Text>
                  </XStack>
                  <Input
                    size="$4"
                    value={age}
                    onChangeText={setAge}
                    placeholder="Enter your age"
                    keyboardType="number-pad"
                    borderColor="#e9d5ff"
                    focusStyle={{ borderColor: '#7c3aed' }}
                  />
                </YStack>
              </Card>

              {/* Gender */}
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$3">
                  <Text fontSize="$4" fontWeight="600" color="$gray12">
                    Gender
                  </Text>
                  <XStack gap="$3">
                    <Button
                      f={1}
                      size="$4"
                      backgroundColor={gender === 'male' ? '#7c3aed' : 'white'}
                      color={gender === 'male' ? 'white' : '$gray11'}
                      borderColor="#e9d5ff"
                      borderWidth={2}
                      onPress={() => setGender('male')}
                      pressStyle={{ opacity: 0.8 }}
                    >
                      Male
                    </Button>
                    <Button
                      f={1}
                      size="$4"
                      backgroundColor={gender === 'female' ? '#7c3aed' : 'white'}
                      color={gender === 'female' ? 'white' : '$gray11'}
                      borderColor="#e9d5ff"
                      borderWidth={2}
                      onPress={() => setGender('female')}
                      pressStyle={{ opacity: 0.8 }}
                    >
                      Female
                    </Button>
                    <Button
                      f={1}
                      size="$4"
                      backgroundColor={gender === 'other' ? '#7c3aed' : 'white'}
                      color={gender === 'other' ? 'white' : '$gray11'}
                      borderColor="#e9d5ff"
                      borderWidth={2}
                      onPress={() => setGender('other')}
                      pressStyle={{ opacity: 0.8 }}
                    >
                      Other
                    </Button>
                  </XStack>
                </YStack>
              </Card>

              {/* Save Button */}
              <Button
                size="$5"
                backgroundColor="#7c3aed"
                color="white"
                onPress={handleSave}
                disabled={isSaving}
                opacity={isSaving ? 0.5 : 1}
                pressStyle={{ backgroundColor: '#6d28d9' }}
                mt="$2"
              >
                <XStack ai="center" gap="$2">
                  <Save size={20} color="white" />
                  <Text fontSize="$5" fontWeight="bold" color="white">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Text>
                </XStack>
              </Button>
            </YStack>
          </ScrollView>
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}