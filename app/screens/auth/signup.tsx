import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import styles from './styles';
import colors from '@/app/constants/colors';
import { useRouter } from 'expo-router';
import AuthService from '@/app/services/auth';


export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isFocused, setIsFocused] = useState({
        field: '',
        focus: false,
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');

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

    const EmptyFields = () => {
        setEmail('');
        setName('');
        setPassword('');
        setConfirmPassword('');
    }

    const validate = () => {
        let valid = true;
        let nameError = '';
        let emailError = '';
        let passwordError = '';
        let confirmPasswordError = '';

        if (!name) {
            nameError = 'Full name is required.';
            valid = false;
        }

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

        if (password !== confirmPassword) {
            confirmPasswordError = 'Passwords do not match.';
            valid = false;
        }

        setErrors({
            name: nameError,
            email: emailError,
            password: passwordError,
            confirmPassword: confirmPasswordError,
        });

        return valid;
    };

    const handleSignup = async () => {
        setError('');
        setLoading(true);
        if (validate()) {
            console.log('Signing up with', name, email, password);
            try {
                const result = await AuthService.signupUser(name, email, password);
                if (result.success) {
                    console.log('User registered successfully', result);
                    EmptyFields();
                    router.navigate({
                        pathname: '/screens/auth/login',
                        params: { message: 'Account Created Successfully!' },
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
            setLoading(false);
            setError('Please fix the errors above.');
        }
    };

    return (
        <ImageBackground source={require('../../assets/images/background.jpg')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.title}>Create Your Account</Text>
                <Text style={styles.subtitle}>Please create an account to continue</Text>

                {/* Name Field */}
                <TextInput
                    style={[styles.input, { outlineColor: isFocused.field === 'name' ? colors.primary : colors.primaryText, marginBottom: errors.name ? 2 : 15 }]}
                    placeholder="Full Name"
                    placeholderTextColor={colors.lightgrey}
                    value={name}
                    onChangeText={setName}
                    onFocus={() => handleFocus('name')}
                    onBlur={() => handleBlur('name')}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                {/* Email Field */}
                <TextInput
                    style={[styles.input, { outlineColor: isFocused.field === 'email' ? colors.primary : colors.primaryText, marginBottom: errors.email ? 2 : 15 }]}
                    placeholder="Email"
                    placeholderTextColor={colors.lightgrey}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                    keyboardType="email-address"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                <View style={styles.passwordContainer}>
                    {/* Password Field */}
                    <TextInput
                        style={[styles.input, { outlineColor: isFocused.field === 'password' ? colors.primary : colors.primaryText, marginBottom: errors.password ? 2 : 15 }]}
                        placeholder="Password"
                        placeholderTextColor={colors.lightgrey}
                        value={password}
                        onFocus={() => handleFocus('password')}
                        onBlur={() => handleBlur('password')}
                        onChangeText={setPassword}
                        secureTextEntry={!passwordVisible}
                    />
                    {/* Eye Icon for Password Visibility */}
                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
                        <Image
                            source={passwordVisible ? require('../../assets/icons/eye.png') : require('../../assets/icons/hidden.png')}
                            style={{ width: 24, height: 24 }}
                        />
                    </TouchableOpacity>
                </View>

                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                <View style={styles.passwordContainer}>
                    {/* Password Field */}
                    <TextInput
                        style={[styles.input, { outlineColor: isFocused.field === 'confirmPassword' ? colors.primary : colors.primaryText, marginBottom: errors.confirmPassword ? 2 : 15 }]}
                        placeholder="Confirm Password"
                        placeholderTextColor={colors.lightgrey}
                        value={confirmPassword}
                        onFocus={() => handleFocus('confirmPassword')}
                        onBlur={() => handleBlur('confirmPassword')}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!confirmPasswordVisible}
                    />
                    {/* Eye Icon for Password Visibility */}
                    <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={styles.eyeIcon}>
                        <Image
                            source={confirmPasswordVisible ? require('../../assets/icons/eye.png') : require('../../assets/icons/hidden.png')}
                            style={{ width: 24, height: 24 }}
                        />
                    </TouchableOpacity>
                </View>

                {/* Confirm Password Field */}

                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

                {error && <Text style={[styles.errorText, { textAlign: 'center' }]}>{error}</Text>}
                {/* Sign Up Button */}
                {
                    loading ? <View>
                        <ActivityIndicator size={'large'} color={colors.primary} />
                    </View> : <TouchableOpacity style={styles.button} onPress={handleSignup}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                }


                {/* Footer with Login link */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => { router.navigate('/screens/auth/login'); }}>
                        <Text style={styles.linkText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}
