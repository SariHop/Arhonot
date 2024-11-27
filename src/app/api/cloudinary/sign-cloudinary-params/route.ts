import { v2 as cloudinary } from 'cloudinary';

export async function POST(request: Request) {
    const body = (await request.json()) as { paramsToSign: Record<string, string> }
    const { paramsToSign } = body

    const signature = cloudinary.utils.api_sign_request(paramsToSign,
        process.env.CLOUDINARY_API_SECRET as string);

    return Response.json({ signature })
}

// https://www.youtube.com/watch?v=ULp6-UjQA3o
// https://www.youtube.com/watch?v=6vAPN4R592U

