'use client';

import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {Input} from "@/components/ui/input";
import {Button} from '@/components/ui/button';
import {Card, CardContent} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {motion} from "framer-motion";

export default function RegisterPage() {
    const [form_data, set_form_data] = useState({
        name:'',
        phone_number:'',
        email:'',
        birth_place:'',
        age:'',
        sex:''
    });

    const [message, set_message] = useState('');
    const [error, set_error] = useState('');
    const router = useRouter();
    const handle_change = (event) => {
        set_form_data({
            ...form_data,
            [event.target.name]: event.target.value
            }
        )
    };

    const handle_submit = async (event) => {
        event.preventDefault();
        set_message('');
        set_error('');
        try {
            const res = await fetch('http://localhost:5000/register',{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(form_data)
            });

            const data = await res.json();

            if (!res.ok) set_error(data.message || "Something went wrong")
            else {
                set_message(data.message);
                setTimeout(() => {
                    router.push('/verify');
                }, 2000);
            }


        } catch (error) {
            set_error("Failed to connect to server");
        }
    }


    return (
        <motion.div
            className={"flex justify-center items-center min-h-screen bg-gray-100"}
        >

            <Card className={"w-full max-w-md p-6 shadow-2xl rounded-2xl"}>
                <CardContent>
                    <h1 className={"text-center text-2xl font-bold mb-4"}>
                        Register to Vote
                    </h1>
                    <div className={"space-y-4"}>
                        {["name","phone_number","email","birth_place","age","sex"].map((field)=>(
                            <div key={field}>
                                <Label className={"capitalize"}>{field.replace("_", " ")}</Label>
                                <Input
                                    type={field === "age" ? "number" : "text"}
                                    name={field}
                                    value={form_data[field]}
                                    onChange={handle_change}
                                    required
                                />
                            </div>
                        ))}
                        <Button onClick={handle_submit} className={"w-full mt-4"}>Register</Button>
                        {message && <p className={"text-green-600 text-sm text-center"}>{message}</p>}
                        {error && <p className={"text-red-500 text-sm text-center"}>{error}</p>}
                    </div>
                </CardContent>
            </Card>

        </motion.div>
    )


}
