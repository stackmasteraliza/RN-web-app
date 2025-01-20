import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import styles from './styles';
import colors from '@/app/constants/colors';
import { useRouter } from 'expo-router';
import AuthService from '@/app/services/auth';
import { useLocalSearchParams } from 'expo-router/build/hooks';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  let message = useLocalSearchParams();

  const [success, setSuccess] = useState(message.message || '');
  const [loading, setLoading] = useState(false);
  const [IsFocused, setIsFocused] = useState({
    field: '',
    focus: false,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleFocus = (field: string) => {
    setIsFocused({
      field: field,
      focus: true,
    });
  };

  const handleBlur = (field: string) => {
    setIsFocused({
      field: field,
      focus: false,
    });
  };

  const validate = () => {
    let valid = true;
    let emailError = '';
    let passwordError = '';

    if (!email) {
      emailError = 'Email is required.';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      emailError = 'Please enter a valid email address.';
      valid = false;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) {
      passwordError = 'Password is required.';
      valid = false;
    } else if (!passwordPattern.test(password)) {
      passwordError = 'Password must be at least 8 characters, include an uppercase letter, a number, and a special character.';
      valid = false;
    }

    setErrors({
      email: emailError,
      password: passwordError,
    });

    return valid;
  };

  const handleLogin = async () => {
    setErrors({
      email: '',
      password: '',
    });
    setSuccess('');

    setLoading(true);
    if (validate()) {
      console.log('Logging in with', email, password);
      try {
        const result = await AuthService.loginUser(email, password);
        if (result.success) {
          console.log('User registered successfully', result);
          router.navigate({
            pathname: '/screens/home/users',
            params: { message: 'Login Successfully!' },
          });

        } else {
          console.log('Error signing up:', result.error);
          setError(result.error || '');
        }
      } catch (error: any) {
        setError(error.message);
        console.log('Error signing up:', error.message);
      }
      setLoading(false);

    } else {
      setError('Please fix the errors above.');
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/background.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Please login to continue</Text>

        <TextInput
          style={[styles.input, { outlineColor: IsFocused.field == 'email' ? colors.primary : colors.primaryText, marginBottom: errors.email ? 2 : 15 }]}
          placeholder="Email"
          placeholderTextColor={colors.lightgrey}
          value={email}
          onChangeText={setEmail}
          onFocus={() => { handleFocus('email'); }}
          onBlur={() => { handleBlur('email'); }}
          keyboardType="email-address"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { outlineColor: IsFocused.field == 'password' ? colors.primary : colors.primaryText, marginBottom: errors.password ? 2 : 15 }]}
            placeholder="Password"
            placeholderTextColor={colors.lightgrey}
            value={password}
            onFocus={() => { handleFocus('password'); }}
            onBlur={() => { handleBlur('password'); }}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
            <Image
              source={passwordVisible ? require('../../assets/icons/eye.png') : require('../../assets/icons/hidden.png')}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        <TouchableOpacity style={styles.forgetContainer}>
          <Text style={[styles.subtitle, { marginBottom: 2 }]}>Forget Password?</Text>
        </TouchableOpacity>
        {error && <Text style={[styles.errorText, { textAlign: 'center' }]}>{error}</Text>}
        {success && <Text style={[styles.errorText, { textAlign: 'center', color: colors.primary }]}>{success}</Text>}

        {loading ? <View>
          <ActivityIndicator size={'large'} color={colors.primary} />
        </View> : <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => { router.navigate('/screens/auth/signup'); }}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};