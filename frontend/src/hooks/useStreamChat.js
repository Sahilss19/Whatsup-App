import { useState , useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
import * as Sentry from '@sentry/react';


const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

//this hook is used to manage the Stream Chat client connection
//so the user can see each other msg , send msg , in realtime
//it handles the connection and disconnection of the user

export const useStreamChat = () => {
  const { user } = useUser();
  const [chatClient, setChatClient] = useState(null);
  
  // Fetch Stream token using React Query
  const {
    data: tokenData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!user?.id // only run if user is available
    //this will take the  obbj and convertt it into a boolean value
  });

  // Initialize Stream Chat client when user and token are available
  useEffect(() => {

    if (!tokenData?.token || !user?.id || !STREAM_API_KEY) return;  // FIXED (your semicolon was breaking logic)

    let cancelled = false; // FIXED: this must exist

    const client = StreamChat.getInstance(STREAM_API_KEY); // FIXED: client must exist

    const initChat = async () => {
      try {
        await client.connectUser(
          {
            id: user.id,
            name:
              user.fullName ??
              user.primaryEmailAddress?.emailAddress ??
              user.id,
            image: user.imageUrl ?? undefined
          },
          tokenData.token
        );

        if (!cancelled) {
          setChatClient(client);
        }

      } catch (error) {
        console.log("Error connecting to the stream ", error)

        Sentry.captureException(error, {
          tags: {
            components: "useStreamChat"
          },
          extra: {
            context: "Stream_chat-connection",
            userId: user?.id,
            streamkey: STREAM_API_KEY ? "present" : "missing"
          }
        });
      }
    };

    initChat(); 

    // Cleanup function to disconnect user on unmount
    return () => {
      cancelled = true;
      client.disconnectUser(); //  client must exist here
    };

  }, [tokenData?.token, user?.id]);

  return { chatClient, isLoading, error };
};
