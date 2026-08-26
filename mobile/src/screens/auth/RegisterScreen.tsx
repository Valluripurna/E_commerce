import React, {useState} from 'react';
import {
  Box,
  Button,
  FormControl,
  Input,
  Link,
  Text,
  VStack,
  WarningOutlineIcon,
  KeyboardAvoidingView,
  ScrollView,
} from 'native-base';
import {Platform} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useAuth} from '../../context/AuthProvider';
import {AuthStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({navigation}: Props) {
  const {register} = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    setError('');
    setSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });
    } catch (err: unknown) {
      const data = (err as {response?: {data?: {message?: string; errors?: Record<string, string[]>}}})
        ?.response?.data;
      const firstError = data?.errors
        ? Object.values(data.errors).flat()[0]
        : undefined;
      setError(firstError || data?.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      flex={1}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Box flex={1} px={6} py={12} justifyContent="center" bg="white">
          <Text fontSize="3xl" fontWeight="bold" color="primary.700">
            Create Account
          </Text>
          <Text mt={2} mb={8} color="gray.500">
            Join us and start shopping
          </Text>

          <VStack space={3}>
            <FormControl isInvalid={!!error}>
              <FormControl.Label>Full Name</FormControl.Label>
              <Input value={name} onChangeText={setName} placeholder="Jane Doe" />

              <FormControl.Label mt={2}>Email</FormControl.Label>
              <Input
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="you@example.com"
              />

              <FormControl.Label mt={2}>Password</FormControl.Label>
              <Input
                value={password}
                onChangeText={setPassword}
                type="password"
                placeholder="Min 8 chars, mixed case + number"
              />

              <FormControl.Label mt={2}>Confirm Password</FormControl.Label>
              <Input
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                type="password"
                placeholder="Repeat password"
              />

              {!!error && (
                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                  {error}
                </FormControl.ErrorMessage>
              )}
            </FormControl>

            <Button
              mt={4}
              size="lg"
              bg="primary.600"
              isLoading={submitting}
              onPress={handleRegister}>
              Register
            </Button>

            <Text textAlign="center">
              Already have an account?{' '}
              <Link
                _text={{color: 'primary.600', fontWeight: 'bold'}}
                onPress={() => navigation.navigate('Login')}>
                Sign in
              </Link>
            </Text>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
