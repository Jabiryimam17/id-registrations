'use client';


import {useState} from 'react';
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from '@/components/ui/button';
import {Label} from "@/components/ui/label";
import {motion} from "framer-motion";


export default function AddPartyPage() {
    const [form_data, set_form_data] = useState({
        party_name:"",
        party_short_name:"",
        email:"",
        national_id:""
    });

    const [message, set_message] = useState("");
    const [error, set_error] = useState("");

    const handle_change = (event) => {
        set_form_data({
            ...form_data,
            [event.target.name]: event.target.value
        })
    };

    const handle_submit = async ()=> {
        set_error("");
        set_message("");

        try {
            const res = await fetch('http://localhost:5000/add_party',{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(form_data)
            });

            const data = await res.json();
            if (!res.ok) set_error(data.message || "Something went wrong")
            else set_message(data.message || "Successfully Registered")


        } catch (error) {
            set_error("Failed to connect to server");
        }

    }

    return (
        <motion.div
            className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200"
            initial={{opacity:0}}
            animate={{opacity:1}}
        >
            <Card className="w-full max-w-xl p-6 shadow-xl rounded-2xl bg-white">
                <CardContent>
                <h1 className="text-3xl font-bold mb-4 text-center text-indigo-700">Register Political Party</h1>
                <div className={"space-y-4"}>
                    <div>
                        <Label>Party Name</Label>
                        <Input
                            name="party_name"
                            value={form_data.party_name}
                            onChange={handle_change}
                            required
                        />
                        <div>
                            <Label>Short Name</Label>
                            <Input
                                name="party_short_name"
                                value={form_data.party_short_name}
                                onChange={handle_change}
                                required
                            />
                        </div>
                        <div>
                            <Label>Leader Email</Label>
                            <Input
                                name="email"
                                type="email"
                                value={form_data.email}
                                onChange={handle_change}
                                required
                            />
                        </div>
                        <div>
                            <Label>Leader National ID</Label>
                            <Input
                                name="national_id"
                                value={form_data.national_id}
                                onChange={handle_change}
                                required
                            />
                        </div>
                        <Button onClick={handle_submit} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                            Submit Party
                        </Button>
                        {message && <p className="text-green-600 text-sm text-center">{message}</p>}
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    </div>
                </div>
                </CardContent>
            </Card>

        </motion.div>
    )
}