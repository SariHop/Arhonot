
import connect from '@/app/lib/db/mongoDB';
import { NextResponse } from 'next/server';

export async function GET() {
    connect();
    return NextResponse.json({ message: 'Hello, this is your response!' });
}


