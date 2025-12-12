import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './App.css';
import api from './utils/api';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1=email, 2=otp, 3=reset, 4=done
    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);
    const [otp, setOtp] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [newPass, setNewPass] = useState('');
    const [conPass, setConPass] = useState('');
    const [resetting, setResetting] = useState(false);

    const navigate = useNavigate();

    // 1. Send OTP to email
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email address.");
            return;
        }
        setSending(true);
        try {
            const response = await api.post('/api/auth/forgot-password', { email });
            const data = response.data;
            if (!data.ok) {
                throw new Error(data.message || 'Failed to send OTP.');
            }
            toast.success("If this email is registered, you will receive an OTP shortly.");
            setStep(2);
        } catch (err) {
            toast.error(err.message || 'Error sending OTP');
        } finally {
            setSending(false);
        }
    };

    // 2. Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) {
            toast.error("Please enter the OTP sent to your email.");
            return;
        }
        setVerifying(true);
        try {
            const response = await api.post('/api/auth/verify-otp', { email, otp });
            const data = response.data;

            if (!data.ok) {
                throw new Error(data.message || 'Invalid OTP');
            }
            toast.success("OTP verified. Please set your new password.");
            setOtpVerified(true);
            setStep(3);
        } catch (err) {
            toast.error(err.message || 'Invalid OTP');
        } finally {
            setVerifying(false);
        }
    };

    // 3. Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newPass || !conPass) {
            toast.error("Please fill both password fields.");
            return;
        }
        if (newPass !== conPass) {
            toast.error("Passwords do not match.");
            return;
        }
        setResetting(true);
        try {
            const response = await api.post('/api/auth/reset-password', { email, otp, newPassword: newPass });
            const data = response.data;

            if (!data.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }
            toast.success("Password reset successful! Please login with your new password.");
            setStep(4);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            toast.error(err.message || 'Error resetting password');
        } finally {
            setResetting(false);
        }
    };

    return (
        <div className="auth-shell">
            <div className="auth-card">
                <h2 style={{ marginBottom: 8 }}>Forgot Password</h2>
                <p className="page-subtitle" style={{ marginBottom: 24 }}>
                    {
                        step === 1
                            ? "Enter your email address and we'll send you an OTP to reset your password."
                            : step === 2
                                ? "Enter the OTP sent to your email."
                                : step === 3
                                    ? "Set your new password."
                                    : "Password reset successful!"
                    }
                </p>

                {step === 1 && (
                    <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            className="primary-btn"
                            style={{ width: '100%' }}
                            disabled={sending}
                        >
                            {sending ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="form-group">
                            <label>Enter OTP</label>
                            <input
                                type="text"
                                name="otp"
                                required
                                placeholder="Enter OTP"
                                maxLength={6}
                                value={otp}
                                onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                                autoFocus
                                autoComplete="one-time-code"
                                inputMode="numeric"
                                pattern="\d*"
                            />
                        </div>
                        <button
                            type="submit"
                            className="primary-btn"
                            style={{ width: '100%' }}
                            disabled={verifying}
                        >
                            {verifying ? "Verifying..." : "Verify OTP"}
                        </button>
                        <button
                            type="button"
                            style={{
                                marginTop: 4,
                                background: 'none',
                                color: 'var(--primary)',
                                border: 'none',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                fontSize: 14,
                            }}
                            onClick={handleSendOtp}
                            disabled={sending}
                        >
                            {sending ? "Resending..." : "Resend OTP"}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                name="new-password"
                                required
                                minLength={6}
                                placeholder="Enter new password"
                                value={newPass}
                                onChange={e => setNewPass(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirm-password"
                                required
                                minLength={6}
                                placeholder="Confirm new password"
                                value={conPass}
                                onChange={e => setConPass(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="primary-btn"
                            style={{ width: '100%' }}
                            disabled={resetting}
                        >
                            {resetting ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                {step === 4 && (
                    <div style={{
                        textAlign: 'center',
                        marginBottom: 20,
                        color: 'var(--primary)',
                        fontWeight: 500,
                        minHeight: 32
                    }}>
                        Password reset successful!
                        <br />
                        Redirecting to login...
                    </div>
                )}

                <div style={{ marginTop: 16, textAlign: 'center' }}>
                    <Link to="/login" style={{ color: "var(--primary)" }}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
