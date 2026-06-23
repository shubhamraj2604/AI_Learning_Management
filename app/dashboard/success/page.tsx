import react from "react";
import Link from "next/link";

export default function SuccessPage() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
                <p className="text-lg text-gray-600 mb-6">Thank you for your purchase. Your subscription is now active.</p>
                <Link href="/dashboard" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">Go to Dashboard</Link>
            </div>
        </div>
    );
}