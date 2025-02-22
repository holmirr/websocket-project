import { NextResponse } from 'next/server'
import { getPusherInstance } from '@/libs/pusher/server';
const pusherServer = getPusherInstance();

export async function POST(req: Request, res: Response) {
    const { channelName } = await req.json();
    try {
        await new Promise<void>((resolve) => {
            let count = 0;
            const intervalId = setInterval(async () => {
                const res = await pusherServer.trigger(
                    channelName,
                    "evt::test",
                    {
                        message: count,
                        date: new Date(),
                    },
                    {
                        info: "subscription_count,user_count"
                    }
                );
                const userCount = (await res.json()).channels[channelName].subscription_count;
                if (count === 10 || userCount === 0) {
                    clearInterval(intervalId);
                    resolve();
                }
                count++;
                console.log(count)
            }, 2000);
        });

        return NextResponse.json({ message: "Sockets tested" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to test sockets", error: error }, { status: 500 });
    }
}