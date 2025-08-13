import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/api/client";

const getSessionId = () => {
  const key = 'reddit_session_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
};

export const RedditConnector = () => {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    setLoading(true);
    try {
      const session_id = getSessionId();
      const res = await api.redditAuthStatus(session_id);
      setConnected(!!res.connected);
    } catch (e) {
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { check(); }, []);

  const connect = async () => {
    try {
      const session_id = getSessionId();
      const res = await api.redditAuthStart(session_id);
      const url = res.url as string;
      window.open(url, '_blank', 'width=600,height=800');
      // Give time to authenticate then re-check
      setTimeout(check, 3000);
    } catch (e) {}
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm">Status:</span>
        {connected === null ? (
          <Badge variant="outline">Checking...</Badge>
        ) : connected ? (
          <Badge variant="secondary" className="bg-success/10 text-success">Connected</Badge>
        ) : (
          <Badge variant="outline" className="text-warning">Not connected</Badge>
        )}
      </div>
      <div className="flex gap-2">
        <Button onClick={connect} disabled={loading}>
          {connected ? 'Reconnect Reddit' : 'Connect Reddit'}
        </Button>
        <Button variant="outline" onClick={check} disabled={loading}>Refresh Status</Button>
      </div>
      <p className="text-xs text-muted-foreground">
        We use Reddit OAuth. Your tokens are stored securely and used only to post on your behalf when you opt-in.
      </p>
    </div>
  );
};
