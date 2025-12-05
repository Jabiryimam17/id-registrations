'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import encrypt_data from "@/utilities/encryptit"

async function encrypt_send(secrets, password, id) {
    // This function should handle the encryption of secrets and sending them to the server
    const data = await encrypt_data(secrets, password);
    data.official_id = id; // Include the official ID in the data to be sent

    try {
        const res = await fetch('http://localhost:5000/save_secrets', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const response_data = await res.json();

        if (!res.ok) alert("Server error while saving secrets: " + response_data.message);

        return response_data;
    } catch (error) {
        throw new Error("Server error while saving secrets: " + error.message);
    }


}
export default function VerifyPage() {
    const router = useRouter();

    const [secrets, set_secrets] = useState({
        R8: '',
        A: '',
        S: '',
        commitment: '',
        nullifier: '',
        sid:''
    });
    const [email, set_email] = useState('');
    const [code, set_code] = useState('');
    const [password, set_password] = useState('');

    const [official_id, set_official_id] = useState('');
    const [status, set_status] = useState('idle');
    const [message, set_message] = useState('');
    const [step, set_step] = useState("verify");

    const [resend_disabled, set_resend_disabled] = useState(false);
    const [countdown, set_countdown] = useState(0);

    useEffect(() => {
        let timer;
        if (resend_disabled && countdown > 0) {
            timer = setInterval(() => {
                set_countdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        set_resend_disabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [resend_disabled, countdown]);

    const handle_submit = async (event) => {
        event.preventDefault();
        set_status('idle');
        try {
            const res = await fetch('http://localhost:5000/verify_email', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code })
            });

            const data = await res.json();
            if (!res.ok) {
                set_status('error');
                set_message(data.message || "Something went wrong");
            } else {
                set_status('success');
                set_message(data.message || "Email verified successfully!");
                setTimeout(()=> {
                    set_step("enter_password");
                }, 2000);
                set_secrets(data.secrets || {});
                set_official_id(data.official_id);

            }
        } catch (error) {
            set_status('error');
            set_message("Failed to connect to server");
        }
    };

    const handle_resend = async () => {
        try {
            const res = await fetch('http://localhost:5000/send_verification_code', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (!res.ok) {
                set_status('error');
                set_message(data.message || "Failed to resend code");
            } else {
                set_status('success');
                set_message(data.message || "Verification code resent!");
                set_resend_disabled(true);
                set_countdown(300); // 5 minutes
            }
        } catch (error) {
            set_status('error');
            set_message("Server error while resending code");
        }
    };

    const handle_password_submit = async (event) => {
        event.preventDefault();
        set_status('success');
        try {
            const string_secrets = JSON.stringify(secrets);
            const res = await encrypt_send(string_secrets, password, official_id);
            set_step("confirmation");
            setTimeout(() => {
                router.push('/register');
            }, 2*60*1000)
        } catch (error) {
            set_status('error');
            set_message("Failed to save secrets: " + error.message);
        }
    }
    return (
        <motion.div
            className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <Card className="w-full max-w-md p-6 rounded-2xl shadow-xl bg-white">
                <CardContent>
                    {step === 'verify' && (
                        <>
                            <h1 className="text-2xl font-bold mb-2 text-center text-indigo-700">Verify Your Email</h1>
                            <p className="text-sm text-gray-600 text-center mb-4">
                                Enter your email and the 6-digit code you received.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => set_email(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label>Verification Code</Label>
                                    <Input
                                        value={code}
                                        onChange={(e) => set_code(e.target.value)}
                                    />
                                </div>

                                <Button onClick={handle_submit} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2">
                                    Verify Email
                                </Button>

                                <Button
                                    onClick={handle_resend}
                                    disabled={resend_disabled || !email}
                                    className={`w-full mt-2 ${resend_disabled ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                                >
                                    {resend_disabled ? `Resend in ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}` : 'Resend Code'}
                                </Button>

                                {status === 'success' && (
                                    <p className="text-green-600 text-sm text-center mt-2">{message}</p>
                                )}
                                {status === 'error' && (
                                    <p className="text-red-500 text-sm text-center mt-2">{message}</p>
                                )}
                            </div>
                        </>
                    )}

                    {step === 'enter_password' && (
                        <>
                            <h1 className="text-xl font-bold mb-4 text-center text-indigo-700">Set a Secure Password</h1>
                            <p className="text-sm text-gray-600 mb-4 text-center">
                                This password will be used to encrypt your data. Please do not forget it.
                            </p>
                            <div className="space-y-4">
                                <Input
                                    type="password"
                                    placeholder="Enter a strong password"
                                    value={password}
                                    onChange={(e) => set_password(e.target.value)}
                                    minLength={8}
                                    maxLength={32}
                                />
                                {password && (password.length < 8 || password.length > 32) && (
                                    <p className="text-red-500 text-sm">
                                        Password must be between 8 and 32 characters.
                                    </p>
                                )}
                                <Button
                                    onClick={handle_password_submit}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                                >
                                    Continue
                                </Button>
                                {message && (
                                    <p className="text-center text-green-600 text-sm mt-2">{message}</p>
                                )}
                            </div>

                        </>
                    )}
                    {step === 'confirmation' && (
                        <>
                            <h1 className="text-2xl font-bold text-center text-indigo-700 mb-4">Success! 🎉</h1>
                            <p className="text-lg text-center text-gray-700 mb-2">Your secrets are saved securely.</p>
                            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center mb-4">
                                <p className="text-lg font-semibold text-indigo-800">Your Official ID:</p>
                                <p className="text-2xl font-bold text-red-600 tracking-widest break-words">{official_id}</p>
                            </div>
                            <p className="text-center text-red-600 font-semibold mb-2">
                                ⚠️ Please save both your password and this ID. You won’t be able to recover them later.
                            </p>
                            <p className="text-center text-gray-500 text-sm">Redirecting to home page in 2 minutes...</p>
                        </>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}



