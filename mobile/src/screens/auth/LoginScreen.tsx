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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({navigation}: Props) {
  const {login} = useAuth();
  const [email, setEmail] = useState('customer@ecommerce.test');
  const [password, setPassword] = useState('Password1');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    setError('');
    setSubmitting(true);
    try {
      await login({email: email.trim(), password});
    } catch (err: unknown) {
      const message =
        (err as {response?: {data?: {message?: string; errors?: {email?: string[]}}}})
          ?.response?.data?.errors?.email?.[0] ||
        (err as {response?: {data?: {message?: string}}})?.response?.data?.message ||
        'Login failed. Please try again.';
      setError(message);
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
            Welcome Back
          </Text>
          <Text mt={2} mb={8} color="gray.500">
            Sign in to continue shopping
          </Text>

          <VStack space={4}>
            <FormControl isInvalid={!!error}>
              <FormControl.Label>Email</FormControl.Label>
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
                placeholder="Enter password"
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
              _pressed={{bg: 'primary.700'}}
              isLoading={submitting}
              onPress={handleLogin}>
              Sign In
            </Button>

            <Text textAlign="center" color="gray.500">
              Demo: customer@ecommerce.test / Password1
            </Text>

            <Text textAlign="center">
              New here?{' '}
              <Link
                _text={{color: 'primary.600', fontWeight: 'bold'}}
                onPress={() => navigation.navigate('Register')}>
                Create account
              </Link>
            </Text>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
