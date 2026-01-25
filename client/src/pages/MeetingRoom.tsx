import { useParams, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function MeetingRoom() {
  const { projectId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const myMeeting = (element: HTMLDivElement | null) => {
    if (!element) return;

    const startCall = async () => {
      const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
      const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        projectId!,
        user?._id || Date.now().toString(),
        user?.name || "Team Member"
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      
      zp.joinRoom({
        container: element,
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        // 🚩 FORCE BUTTONS TO SHOW
        showScreenSharingButton: true,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showLayoutButton: true,
        showPreJoinView: false, // Skips the hardware check screen for faster entry
        layout: "Grid", // Forces a professional grid layout
      });
    };

    startCall();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/60 backdrop-blur-md h-16">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-zinc-400 hover:text-white transition-colors"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Board
          </Button>
          <h1 className="text-white font-black uppercase tracking-widest text-xs border-l border-white/10 pl-4">
            Nexus Huddle • Project Sync
          </h1>
        </div>
      </div>

      <div 
        ref={myMeeting} 
        className="w-full bg-zinc-900" 
        style={{ height: 'calc(100vh - 64px)' }} 
      />
    </div>
  );
}